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

// Where every genuine enquiry is written before mail() is asked to send it.
// One level above the document root, so it is unreachable over HTTP and the
// FTP deploy, which only touches public_html, can never delete it. On this
// host that is domains/<domain>/inquiry-log/, one per domain. Set to '' in
// inquiry-config.php to switch the log off.
$INQUIRY_LOG_DIR = dirname(__DIR__) . '/inquiry-log';

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

/**
 * Appends one JSON line to this month's log file. Never fails the request: a
 * log that cannot be written costs a line in the PHP error log and nothing
 * else, so the endpoint behaves exactly as it did before the log existed.
 */
function inquiry_log($dir, $record)
{
    if ($dir === '') {
        return false;
    }
    // Every filesystem call is silenced: under an open_basedir that excludes
    // $dir, a warning printed with display_errors on would corrupt the JSON
    // answer, which is the one thing the log must never do.
    if (!@is_dir($dir) && !@mkdir($dir, 0700, true)) {
        error_log('[inquiry] cannot create log directory ' . $dir);
        return false;
    }
    // Only matters if the directory was configured inside the document root,
    // where without this the log would be downloadable by anyone who guessed
    // its name.
    if (!@is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', 'Require all denied' . chr(10));
    }
    $file = $dir . '/inquiries-' . gmdate('Y-m') . '.jsonl';
    // Without the substitute flag, a value that the non-mbstring clean() cut
    // mid-character makes json_encode return false and the record is lost.
    $flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE;
    $line = json_encode($record, $flags) . chr(10);
    if (@file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
        error_log('[inquiry] cannot write to ' . $file);
        return false;
    }
    @chmod($file, 0600);
    return true;
}

/** The second line of a record: what happened when it was sent. */
function log_outcome($dir, $id, $result)
{
    inquiry_log($dir, ['id' => $id, 'time' => gmdate('c'), 'result' => $result]);
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

// ------------------------------------------------------------------------- LOG
// mail() can refuse a message, and until this log existed a refused enquiry
// existed nowhere: the visitor was sent to the phone, Profimann saw nothing.
// So the enquiry is written down before any attempt to send it, and the
// outcome is appended as a second line with the same id. A record with no
// "sent" line after it is one that never reached the mailbox. The honeypot
// has already answered above, so bots do not get this far.
$log_id = gmdate('Ymd-His') . '-' . bin2hex(random_bytes(3));
$log_fields = [];
foreach ($rows as $row) {
    $log_fields[$row['label']] = $row['value'];
}
inquiry_log($INQUIRY_LOG_DIR, [
    'id' => $log_id,
    'time' => gmdate('c'),
    'locale' => $locale,
    'subject' => $subject,
    'fields' => $log_fields,
]);

// ------------------------------------------------------------------------ SEND
if ($INQUIRY_TO === '' || $INQUIRY_FROM === '') {
    error_log('[inquiry] no mailbox configured; inquiry from ' . $fields['email'] . ' not delivered');
    log_outcome($INQUIRY_LOG_DIR, $log_id, 'not_configured');
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
    error_log('[inquiry] mail() refused the message from ' . $fields['email'] . '; kept as ' . $log_id);
    log_outcome($INQUIRY_LOG_DIR, $log_id, 'mail_refused');
    answer(503, ['error' => 'delivery_failed']);
}

// "sent" means mail() accepted it for delivery, not that it arrived; a bounce
// after this point is the mail server's to report.
log_outcome($INQUIRY_LOG_DIR, $log_id, 'sent');
answer(200, ['ok' => true, 'delivery' => 'mail']);
