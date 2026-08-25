<?php
/**
 * Technical inquiry endpoint.
 *
 * The exported site has no server to run, so this file is the whole back end:
 * components/forms/InquiryForm.tsx posts JSON here and this mails it to
 * Profimann. It deliberately mirrors server/api/inquiry-route.ts, the Node
 * route it replaces — same validation, same fields, same answers — so that
 * moving back to a Node host later is a change of address and nothing else.
 *
 * Field labels, the document list and the application list are NOT repeated
 * here. They are read from inquiry-data.json, which the build generates from
 * content/. Editing this file to add a field is a mistake; edit content/.
 */

// --------------------------------------------------------------------- CONFIG
// Where inquiries land, and who they are sent as. An empty $INQUIRY_TO means
// the mailbox does not exist yet: the endpoint then answers 503 and the form
// sends the visitor to the phone number rather than claiming it was sent.
//
// Both can be overridden by an inquiry-config.php placed next to this file on
// the server. That file is not part of the build, so re-uploading the site
// does not overwrite it.
$INQUIRY_TO = '';                // e.g. 'info@liquilob.com'
$INQUIRY_FROM = '';              // e.g. 'site@liquilob.com', on this domain
$INQUIRY_SUBJECT_PREFIX = '';    // optional, e.g. '[web] '

if (is_file(__DIR__ . '/inquiry-config.php')) {
    require __DIR__ . '/inquiry-config.php';
}

// ---------------------------------------------------------------------- SETUP
$LF = chr(10);
$CRLF = chr(13) . chr(10);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function answer($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Anything that reaches a mail header must not be able to add one. */
function oneline($value)
{
    return trim(str_replace([chr(13), chr(10)], '', $value));
}

function clean($value, $max)
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    answer(405, ['error' => 'method_not_allowed']);
}

// Reject a cross-site post, but only when the browser said where it came from:
// a missing Origin is normal and must not cost a real visitor their inquiry.
if (!empty($_SERVER['HTTP_ORIGIN'])) {
    $origin_host = parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
    if ($origin_host !== null && strcasecmp($origin_host, $_SERVER['HTTP_HOST']) !== 0) {
        answer(403, ['error' => 'cross_origin']);
    }
}

$data_path = __DIR__ . '/inquiry-data.json';
$data = is_file($data_path) ? json_decode(file_get_contents($data_path), true) : null;
if (!is_array($data) || empty($data['fields'])) {
    error_log('[inquiry] inquiry-data.json is missing or unreadable');
    answer(503, ['error' => 'not_configured']);
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    answer(400, ['error' => 'invalid_json']);
}

// ------------------------------------------------------------------- VALIDATE
$max = isset($data['maxField']) ? (int) $data['maxField'] : 4000;

$fields = [];
foreach ($data['fields'] as $field) {
    $key = $field['key'];
    $fields[$key] = clean(isset($body[$key]) ? $body[$key] : '', $max);
}

foreach ($data['required'] as $key) {
    if (!isset($fields[$key]) || $fields[$key] === '') {
        answer(422, ['error' => 'missing_required_fields']);
    }
}

if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    answer(422, ['error' => 'invalid_email']);
}

// Honeypot: a real visitor never fills a field the form does not render.
if (clean(isset($body['website']) ? $body['website'] : '', $max) !== '') {
    answer(202, ['ok' => true]);
}

$locale = (isset($body['locale']) && $body['locale'] === 'en') ? 'en' : 'tr';

// The document is a known id or nothing. This endpoint is public, so a posted
// value must never reach the mailbox unchecked.
if ($fields['doc'] !== '' && !isset($data['documents'][$fields['doc']])) {
    $fields['doc'] = '';
}

// ---------------------------------------------------------------------- RENDER
/** Two fields store an id rather than the words the visitor saw. */
function read_value($key, $value, $locale, $data)
{
    if ($key === 'application' && isset($data['applications'][$value][$locale])) {
        return $data['applications'][$value][$locale];
    }
    if ($key === 'doc' && isset($data['documents'][$value][$locale])) {
        return $data['documents'][$value][$locale];
    }
    return $value;
}

$rows = [];
foreach ($data['fields'] as $field) {
    $key = $field['key'];
    if ($fields[$key] === '') {
        continue;
    }
    $rows[] = [
        'label' => $field['label'][$locale],
        'value' => read_value($key, $fields[$key], $locale, $data),
    ];
}

$kind = $fields['doc'] !== '' ? 'document' : 'inquiry';
$who = $fields['company'] !== '' ? $fields['company'] : $fields['name'];
$subject = $INQUIRY_SUBJECT_PREFIX . $data['subject'][$kind][$locale] . ': ' . $who;

$text_lines = [];
foreach ($rows as $row) {
    $text_lines[] = $row['label'] . ': ' . $row['value'];
}
$text = implode($LF, $text_lines);

$html = '<table style="border-collapse:collapse;font:14px/1.5 Helvetica,Arial,sans-serif;color:#111">';
foreach ($rows as $row) {
    $label = htmlspecialchars($row['label'], ENT_QUOTES, 'UTF-8');
    $value = nl2br(htmlspecialchars($row['value'], ENT_QUOTES, 'UTF-8'));
    $html .= '<tr><th align="left" style="padding:6px 16px 6px 0;vertical-align:top;'
        . 'color:#5c5c5c;font-weight:600;white-space:nowrap">' . $label . '</th>'
        . '<td style="padding:6px 0;vertical-align:top">' . $value . '</td></tr>';
}
$html .= '</table>';

// ------------------------------------------------------------------------ SEND
if ($INQUIRY_TO === '' || $INQUIRY_FROM === '') {
    error_log('[inquiry] no mailbox configured; inquiry from ' . $fields['email'] . ' not delivered');
    answer(503, ['error' => 'delivery_not_configured']);
}

$boundary = 'liquilob-' . bin2hex(random_bytes(8));

$headers = [];
$headers[] = 'From: ' . oneline($INQUIRY_FROM);
$headers[] = 'Reply-To: ' . oneline($fields['email']);
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

$message = '--' . $boundary . $CRLF
    . 'Content-Type: text/plain; charset=UTF-8' . $CRLF
    . 'Content-Transfer-Encoding: 8bit' . $CRLF . $CRLF
    . $text . $CRLF . $CRLF
    . '--' . $boundary . $CRLF
    . 'Content-Type: text/html; charset=UTF-8' . $CRLF
    . 'Content-Transfer-Encoding: 8bit' . $CRLF . $CRLF
    . $html . $CRLF . $CRLF
    . '--' . $boundary . '--';

// A non-ASCII subject must be encoded, or "Doküman talebi" arrives as mojibake.
$encoded_subject = '=?UTF-8?B?' . base64_encode(oneline($subject)) . '?=';

$sent = mail(
    oneline($INQUIRY_TO),
    $encoded_subject,
    $message,
    implode($CRLF, $headers),
    '-f' . oneline($INQUIRY_FROM)
);

if (!$sent) {
    error_log('[inquiry] mail() refused the message from ' . $fields['email']);
    answer(503, ['error' => 'delivery_failed']);
}

answer(200, ['ok' => true, 'delivery' => 'mail']);
