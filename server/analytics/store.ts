import { MAX_EVENTS, type AnalyticsEvent } from './types'

/**
 * Event storage.
 *
 * Three adapters, chosen from the environment, because the right one depends on
 * where the site ends up running and that is not decided yet:
 *
 *   redis   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *           For Vercel or any serverless host, where the filesystem is not
 *           shared between invocations.
 *   file    ANALYTICS_DATA_DIR=/var/lib/liquilob
 *           For a VPS running `next start`. One JSONL file per month.
 *   memory  the fallback
 *           Works, but the log is lost on restart and is not shared between
 *           instances. The admin page says so in plain language rather than
 *           quietly showing numbers that reset overnight.
 *
 * The interface is deliberately small. Swapping in Postgres later means writing
 * `append` and `read`, nothing else.
 */

export interface AnalyticsStore {
  readonly kind: 'memory' | 'file' | 'redis'
  readonly persistent: boolean
  append(event: AnalyticsEvent): Promise<void>
  read(sinceTs: number): Promise<AnalyticsEvent[]>
}

/* ------------------------------------------------------------------ memory */

class MemoryStore implements AnalyticsStore {
  readonly kind = 'memory' as const
  readonly persistent = false
  private events: AnalyticsEvent[] = []

  async append(event: AnalyticsEvent) {
    this.events.push(event)
    if (this.events.length > MAX_EVENTS) {
      this.events = this.events.slice(-MAX_EVENTS)
    }
  }

  async read(sinceTs: number) {
    return this.events.filter((e) => e.ts >= sinceTs)
  }
}

/* -------------------------------------------------------------------- file */

class FileStore implements AnalyticsStore {
  readonly kind = 'file' as const
  readonly persistent = true

  constructor(private dir: string) {}

  private fileFor(ts: number) {
    const d = new Date(ts)
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
    return `${this.dir}/events-${month}.jsonl`
  }

  async append(event: AnalyticsEvent) {
    const { appendFile, mkdir } = await import('node:fs/promises')
    await mkdir(this.dir, { recursive: true })
    await appendFile(this.fileFor(event.ts), JSON.stringify(event) + '\n', 'utf8')
  }

  async read(sinceTs: number) {
    const { readFile, readdir } = await import('node:fs/promises')
    let names: string[]
    try {
      names = (await readdir(this.dir)).filter((n) => n.startsWith('events-') && n.endsWith('.jsonl'))
    } catch {
      return []
    }

    // Only the months the requested window can touch.
    const from = new Date(sinceTs)
    const cutoff = `events-${from.getUTCFullYear()}-${String(from.getUTCMonth() + 1).padStart(2, '0')}.jsonl`
    const relevant = names.filter((n) => n >= cutoff).sort()

    const out: AnalyticsEvent[] = []
    for (const name of relevant) {
      let text: string
      try {
        text = await readFile(`${this.dir}/${name}`, 'utf8')
      } catch {
        continue
      }
      for (const line of text.split('\n')) {
        if (!line) continue
        try {
          const event = JSON.parse(line) as AnalyticsEvent
          if (event.ts >= sinceTs) out.push(event)
        } catch {
          // A truncated final line from an interrupted write. Skip it.
        }
      }
    }
    return out
  }
}

/* ------------------------------------------------------------------- redis */

class RedisStore implements AnalyticsStore {
  readonly kind = 'redis' as const
  readonly persistent = true
  private key = 'liquilob:events'

  constructor(
    private url: string,
    private token: string
  ) {}

  private async command(body: unknown): Promise<unknown> {
    const response = await fetch(`${this.url}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`upstash responded ${response.status}`)
    return response.json()
  }

  async append(event: AnalyticsEvent) {
    await this.command([
      ['LPUSH', this.key, JSON.stringify(event)],
      ['LTRIM', this.key, '0', String(MAX_EVENTS - 1)],
    ])
  }

  async read(sinceTs: number) {
    const result = (await this.command([['LRANGE', this.key, '0', String(MAX_EVENTS - 1)]])) as {
      result: string[]
    }[]
    const rows = result?.[0]?.result ?? []
    const out: AnalyticsEvent[] = []
    for (const row of rows) {
      try {
        const event = JSON.parse(row) as AnalyticsEvent
        if (event.ts >= sinceTs) out.push(event)
      } catch {
        continue
      }
    }
    return out.reverse()
  }
}

/* ---------------------------------------------------------------- selection */

let cached: AnalyticsStore | null = null

export function analyticsStore(): AnalyticsStore {
  if (cached) return cached

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    cached = new RedisStore(redisUrl.replace(/\/$/, ''), redisToken)
    return cached
  }

  const dir = process.env.ANALYTICS_DATA_DIR
  if (dir) {
    cached = new FileStore(dir.replace(/\/$/, ''))
    return cached
  }

  cached = new MemoryStore()
  return cached
}
