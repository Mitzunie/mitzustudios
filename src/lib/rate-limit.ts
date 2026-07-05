interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private max: number
  private windowMs: number

  constructor(max: number = 10, windowMs: number = 60000) {
    this.max = max
    this.windowMs = windowMs
  }

  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs })
      return { allowed: true, remaining: this.max - 1, resetAt: now + this.windowMs }
    }

    if (entry.count >= this.max) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count++
    return { allowed: true, remaining: this.max - entry.count, resetAt: entry.resetAt }
  }

  reset(key: string): void {
    this.store.delete(key)
  }
}

class MonthlyLimiter {
  private _count = 0
  private monthKey = ''
  private max: number

  constructor(max: number) {
    this.max = max
  }

  check(): { allowed: boolean; remaining: number } {
    const now = new Date()
    const key = `${now.getFullYear()}-${now.getMonth()}`

    if (key !== this.monthKey) {
      this._count = 0
      this.monthKey = key
    }

    if (this._count >= this.max) {
      return { allowed: false, remaining: 0 }
    }

    this._count++
    return { allowed: true, remaining: this.max - this._count }
  }

  get count() {
    return this._count
  }
}

export const contactLimiter = new RateLimiter(
  Number(process.env.RATE_LIMIT_MAX) || 10,
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
)

export const loginLimiter = new RateLimiter(5, 60000)

export const zeroBounceLimiter = new MonthlyLimiter(90)
