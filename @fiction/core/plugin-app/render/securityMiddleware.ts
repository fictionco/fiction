import type express from 'express'
import { getRequestVars } from './utils'

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
  // New patterns for email/webmail probing
  /roundcube/i,
  /zimbra/i,
  /webmail/i,
  /cpanel/i,
  /smtp/i,
  /imap/i,
  /pop3/i,
  /email-admin/i,
  /mail-admin/i,
  // Manual patterns
  /fan\.fiction/i,
  /lat\.fiction/i,
  /non\.fiction/i,
  /test-dom/i,
  /404_404/,
]

const BLOCKED_USER_AGENTS = [
  /acunetix/i,
  /nessus/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
]

function hasPathTraversalAttempt(pathname: string): boolean {
  return (
    /%2e/i.test(pathname)
    || /%2f/i.test(pathname)
    || /\.\.\//.test(pathname)
    || /\/{2,}/.test(pathname)
  )
}

function getClientIP(req: express.Request): string {
  return (
    (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || ''
  )
    .split(',')[0]
    .trim()
}

export function detectRecursivePath(args: { pathname: string, maxLength?: number, checkLength?: number }): boolean {
  const { pathname, maxLength = 500, checkLength = 50 } = args
  const pathNoQuery = pathname.split('?')[0]
  const pathSegments = pathNoQuery.split('/') || []
  // eslint-disable-next-line regexp/optimal-quantifier-concatenation
  return pathNoQuery.length > maxLength || pathSegments.some(seg => seg.length > checkLength && /(.{3,})\1{3,}/.test(seg))
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

function incrementIPBlock(ip: string): number {
  const record = blockedIPs.get(ip) || {
    count: 0,
    expires: Date.now() + BLOCK_DURATION,
  }
  record.count++

  if (record.count >= BLOCK_THRESHOLD) {
    record.expires = Date.now() + BLOCK_DURATION
  }

  blockedIPs.set(ip, record)
  return record.count
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
_interval.unref?.()

export const securityMiddleware: express.RequestHandler = (req, res, next) => {
  try {
    const clientIP = getClientIP(req)

    // Check if IP is already blocked
    if (isIPBlocked(clientIP)) {
      // could block here
    }

    const vars = getRequestVars({ request: req })
    const url = vars.URL || ''
    const userAgent = vars.USER_AGENT || ''
    const pathname = vars.PATHNAME || ''

    const fails = []

    if (hasPathTraversalAttempt(pathname)) {
      fails.push('path traversal')
    }

    if (BLOCKED_PATTERNS.some(pattern => pattern.test(url))) {
      fails.push('blocked pattern')
    }

    if (BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent))) {
      fails.push('blocked user agent')
    }

    // Check for recursive URL blowups
    if (detectRecursivePath({ pathname })) {
      fails.push('recursive URL pattern')
    }

    const isSuspicious = fails.length > 0

    if (isSuspicious) {
      incrementIPBlock(clientIP)
      res.status(403).end()
      return
    }

    next()
  }
  catch (err) {
    console.error('Security middleware error:', err)
    res.status(400).end()
  }
}
