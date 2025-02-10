import type express from 'express'

// Known malicious patterns
const BLOCKED_PATTERNS = [
  // WordPress probes (assuming this isn't a WordPress site)
  /wp-admin/i,
  /wp-login/i,
  /wp-content/i,
  /wp-includes/i,

  // PHP probes (assuming this isn't a PHP application)
  /\.php$/i,
  /phpMyAdmin/i,

  // Known vulnerability files
  /\.env$/i,
  /\.git/i,

  // Known malicious shell files
  /c99\.php/i,
  /r57\.php/i,
  /shell\.php/i,

  // CGI/Shell access attempts
  /cgi-bin/i,
  /bin\/sh$/i,
]

// Known malicious scanner user agents
const BLOCKED_USER_AGENTS = [
  /acunetix/i,
  /nessus/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
]

// Check for path traversal or encoding attacks
function hasPathTraversalAttempt(url: string): boolean {
  // Check for percent-encoded path traversal
  if (/%2e/i.test(url) || /%252e/i.test(url)) {
    return true
  }

  // Check for multiple encoded slashes
  if (/%2f/i.test(url) || /%5c/i.test(url)) {
    return true
  }

  // Check for basic path traversal
  if (/\.\.\//.test(url) || /\.\.\\/.test(url)) {
    return true
  }

  // Check for multiple forward/backward slashes
  if (/\/{2,}/.test(url) || /\\{2,}/.test(url)) {
    return true
  }

  return false
}

export const securityMiddleware: express.RequestHandler = (req, res, next) => {
  try {
    const path = req.path
    const userAgent = req.get('user-agent') || ''
    const fullUrl = req.originalUrl || req.url

    // Check for path traversal or encoding attacks
    if (hasPathTraversalAttempt(fullUrl)) {
      res.status(400).end()
      return
    }

    // Check for maliciously encoded URLs
    try {
      decodeURIComponent(fullUrl)
    }
    catch (e) {
      // If we can't decode the URL, it's malformed
      res.status(400).end()
      return
    }

    // Check for blocked path patterns
    if (BLOCKED_PATTERNS.some(pattern => pattern.test(path))) {
      res.status(404).end()
      return
    }

    // Check for known malicious user agents
    if (BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent))) {
      res.status(403).end()
      return
    }

    next()
  }
  catch (err) {
    console.error('Security middleware error:', err)
    // If anything goes wrong in our security checks, fail closed
    res.status(400).end()
  }
}
