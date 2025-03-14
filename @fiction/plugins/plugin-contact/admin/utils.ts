/**
 * Enhanced CSV to Email List Converter
 * Parses CSV files to extract email addresses with intelligent column detection
 * Provides validation statistics and categorizes issues
 */

export type ValidationResult = {
  isValid: boolean
  reason?: string
}

export type EmailStats = {
  emails: string[]
  validCount?: number
  invalidCount?: number
  invalidReasons?: Record<string, number>
  suspiciousDomains?: string[]
}

// List of known suspicious/fake domains
const SUSPICIOUS_DOMAINS = [
  'example.com',
  'test.com',
  'fake.com',
  'temporary.com',
  'disposable.com',
  'mailinator.com',
  'tempmail.com',
]

/**
 * Helper to create empty email stats
 */
function createEmptyStats(): EmailStats {
  return {
    emails: [],
    validCount: 0,
    invalidCount: 0,
    invalidReasons: {},
  }
}

/**
 * Sanitize and normalize an email address for processing
 */
function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase()
}

/**
 * Convert CSV file to a JSON array
 */
export async function csvToJson(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = reader.result as string

        // Handle different line endings and split the file into lines
        const lines = text.trim().split(/\r?\n/)
        if (!lines.length)
          return resolve([])

        const headerLine = lines[0]

        if (!headerLine)
          return reject(new Error('CSV file is empty or does not contain headers.'))

        // Parse CSV line while handling quoted values and commas within fields
        const parseCSVLine = (line: string): string[] => {
          const values: string[] = []
          let currentValue = ''
          let inQuotes = false

          for (let i = 0; i < line.length; i++) {
            const char = line[i]

            if (char === '"') {
              inQuotes = !inQuotes
            }
            else if (char === ',' && !inQuotes) {
              values.push(currentValue.trim())
              currentValue = ''
            }
            else {
              currentValue += char
            }
          }

          // Add the last value
          values.push(currentValue.trim())
          return values
        }

        const headers = parseCSVLine(headerLine).map(header =>
          header.replace(/^["']|["']$/g, '').trim().toLowerCase()
        )

        const json = lines.slice(1).map((line) => {
          if (!line.trim())
            return null

          const values = parseCSVLine(line)
          return headers.reduce((obj, header, index) => {
            let value = values[index] || ''
            // Remove surrounding quotes if any
            value = value.replace(/^["']|["']$/g, '')
            return { ...obj, [header]: value.trim() }
          }, {})
        }).filter(Boolean)

        resolve(json)
      }
      catch (error) {
        reject(new Error(`Error parsing CSV: ${(error as Error).message}`))
      }
    }

    reader.onerror = () => reject(new Error('Error reading the file.'))
    reader.readAsText(file)
  })
}

/**
 * Validate an email address and return detailed validation result
 */
export function validateEmail(email: string): ValidationResult {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail)
    return { isValid: false, reason: 'empty' }

  if (!normalizedEmail.includes('@'))
    return { isValid: false, reason: 'missing_at_symbol' }

  const [localPart, domain] = normalizedEmail.split('@')

  if (localPart.length === 0)
    return { isValid: false, reason: 'empty_local_part' }

  if (!domain)
    return { isValid: false, reason: 'invalid_domain' }

  if (!domain.includes('.'))
    return { isValid: false, reason: 'invalid_domain' }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    return { isValid: false, reason: 'invalid_format' }

  // Check for suspicious/fake domains
  if (SUSPICIOUS_DOMAINS.some(d => domain.includes(d)))
    return { isValid: false, reason: 'suspicious_domain' }

  return { isValid: true }
}

/**
 * Identify the most likely column containing email addresses
 */
function identifyEmailColumn(data: any[]): string | null {
  if (!data.length)
    return null

  const firstRow = data[0]
  const columns = Object.keys(firstRow)

  if (columns.length === 0)
    return null

  // Check for explicit email column names
  const emailColumnPatterns = [
    /^email$/i,
    /^e-?mail$/i,
    /^email.?address$/i,
    /^contact$/i,
    /^subscriber$/i,
  ]

  // First, try to find columns with explicit email names
  for (const pattern of emailColumnPatterns) {
    const match = columns.find(col => pattern.test(col))
    if (match)
      return match
  }

  // If no explicit email column, look for columns that contain email-like values
  const isLikelyEmail = (value: string): boolean =>
    !!value && typeof value === 'string' && value.includes('@') && value.includes('.')

  // Count how many email-like values each column contains
  const emailLikenessCounts = columns.reduce((counts, column) => {
    const emailCount = data.filter(row => isLikelyEmail(row[column])).length
    return { ...counts, [column]: emailCount }
  }, {} as Record<string, number>)

  // Find the column with the most email-like values
  const bestColumn = Object.entries(emailLikenessCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .filter(([_, count]) => count > 0) // Only consider columns with at least one email
    .map(([col]) => col)[0] // Get the column name with the highest count

  return bestColumn || null
}

/**
 * Process email validations and generate statistics
 */
function processEmailValidations(validatedEmails: { email: string, validation: ValidationResult }[]): EmailStats {
  // Extract valid emails
  const validEmails = validatedEmails
    .filter(({ validation }) => validation.isValid)
    .map(({ email }) => email)

  // Deduplicate emails
  const uniqueValidEmails = [...new Set(validEmails)]

  // Count invalid reasons
  const invalidReasons = validatedEmails
    .filter(({ validation }) => !validation.isValid)
    .reduce((counts, { validation }) => {
      const reason = validation.reason || 'unknown'
      return { ...counts, [reason]: (counts[reason] || 0) + 1 }
    }, {} as Record<string, number>)

  // Identify suspicious domains
  const suspiciousDomains = validatedEmails
    .filter(({ validation }) => validation.reason === 'suspicious_domain')
    .map(({ email }) => email.split('@')[1])
    .filter((domain, index, self) => self.indexOf(domain) === index)

  return {
    emails: uniqueValidEmails,
    validCount: uniqueValidEmails.length,
    invalidCount: validatedEmails.length - validEmails.length,
    invalidReasons,
    suspiciousDomains: suspiciousDomains.length > 0 ? suspiciousDomains : undefined,
  }
}

/**
 * Parse CSV file and extract validated email addresses with statistics
 */
export async function csvToEmailList(file: File): Promise<EmailStats> {
  try {
    const json = await csvToJson(file)

    if (json.length === 0) {
      return createEmptyStats()
    }

    // Identify the column most likely to contain emails
    const emailColumn = identifyEmailColumn(json)

    if (!emailColumn) {
      return {
        ...createEmptyStats(),
        invalidCount: 1,
        invalidReasons: { no_email_column: 1 },
      }
    }

    // Extract and validate each email
    const validatedEmails = json
      .map((row) => {
        const email = normalizeEmail(row[emailColumn] || '')
        return { email, validation: validateEmail(email) }
      })

    return processEmailValidations(validatedEmails)
  }
  catch (error) {
    console.error("Error processing CSV file:", error)
    return createEmptyStats()
  }
}

/**
 * Parse and validate a list of emails from string input
 */
export function parseAndValidateEmails(input?: string[] | string): EmailStats {
  if (!input) {
    return createEmptyStats()
  }

  // Handle string input by splitting on commas, semicolons, spaces, and newlines
  const rawEmails = typeof input === 'string'
    ? input.split(/[\s,;]+/).filter(Boolean)
    : input

  // Process each email
  const validatedEmails = rawEmails
    .map((email) => {
      const normalizedEmail = normalizeEmail(email || '')
      return {
        email: normalizedEmail,
        validation: validateEmail(normalizedEmail)
      }
    })

  return processEmailValidations(validatedEmails)
}
