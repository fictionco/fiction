import type express from 'express'

// Using a Map for better performance with large sets of IPs
const blockedIPs = new Map<string, { count: number, expires: number }>()

// Cleanup interval (every hour)
const CLEANUP_INTERVAL = 60 * 60 * 1000
// Block duration (24 hours)
const BLOCK_DURATION = 24 * 60 * 60 * 1000
// Threshold for blocking (3 suspicious requests)
const BLOCK_THRESHOLD = 3

// Existing patterns...
const BLOCKED_PATTERNS = [
  /wp-admin/i,
  /wp-login/i,
  /wp-content/i,
  /wp-includes/i,
  /\.php$/i,
  /phpinfo/i,
  /phpMyAdmin/i,
  /_profiler\/php/i,
  /\.env$/i,
  /\.git/i,
  /c99\.php/i,
  /r57\.php/i,
  /shell\.php/i,
  /cgi-bin/i,
  /bin\/sh$/i,
]

const BLOCKED_USER_AGENTS = [
  /acunetix/i,
  /nessus/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
]

function hasPathTraversalAttempt(url: string): boolean {
  return (
    /%2e/i.test(url)
    || /%2f/i.test(url)
    || /\.\.\//.test(url)
    || /\/{2,}/.test(url)
  )
}

function getClientIP(req: express.Request): string {
  return (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim()
}

function isIPBlocked(ip: string): boolean {
  const record = blockedIPs.get(ip)
  if (!record)
    return false

  if (Date.now() > record.expires) {
    blockedIPs.delete(ip)
    return false
  }
  return true
}

function incrementIPBlock(ip: string): void {
  const record = blockedIPs.get(ip) || { count: 0, expires: Date.now() + BLOCK_DURATION }
  record.count++

  if (record.count >= BLOCK_THRESHOLD) {
    record.expires = Date.now() + BLOCK_DURATION
  }

  blockedIPs.set(ip, record)
}

// Cleanup expired blocks periodically
const _interval = setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of blockedIPs.entries()) {
    if (now > record.expires) {
      blockedIPs.delete(ip)
    }
  }
}, CLEANUP_INTERVAL)

// Unref the interval to prevent it from keeping the process alive
_interval.unref()

export const securityMiddleware: express.RequestHandler = (req, res, next) => {
  try {
    const clientIP = getClientIP(req)

    // Check if IP is already blocked
    if (isIPBlocked(clientIP)) {
      res.status(403).end()
      return
    }

    const path = req.path
    const userAgent = req.get('user-agent') || ''
    const fullUrl = req.originalUrl || req.url

    // Check for suspicious behavior
    const isSuspicious
      = hasPathTraversalAttempt(fullUrl)
        || BLOCKED_PATTERNS.some(pattern => pattern.test(path))
        || BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent))

    if (isSuspicious) {
      incrementIPBlock(clientIP)

      // If threshold reached, block immediately
      if (isIPBlocked(clientIP)) {
        res.status(403).end()
        return
      }
    }

    next()
  }
  catch (err) {
    console.error('Security middleware error:', err)
    res.status(400).end()
  }
}
