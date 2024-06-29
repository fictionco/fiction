export async function csvToJson(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const text = reader.result as string
      const [headerLine, ...lines] = text.trim().split('\n')

      if (!headerLine)
        return reject(new Error('CSV file is empty or does not contain headers.'))

      const headers = headerLine.split(',').map(header => header.trim().toLowerCase())

      const json = lines.map((line) => {
        const values = line.split(',').map(value => value.trim().toLowerCase())
        return headers.reduce((obj, header, index) => ({ ...obj, [header]: values[index] || '' }), {})
      })

      resolve(json)
    }

    reader.onerror = () => reject(new Error('Error reading the file.'))
    reader.readAsText(file)
  })
}

function cleanEmails(emails?: (string | undefined)[]): string[] {
  if (!emails || emails.length === 0)
    return []

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)
  const e = emails.filter(Boolean) as string[]
  return e.map(email => email.trim().toLowerCase()).filter(isValidEmail)
}

export async function csvToEmailList(file: File): Promise<string[]> {
  return csvToJson(file).then((json) => {
    if (json.length === 0)
      return []

    // Extract email addresses using the 'email' header
    return cleanEmails(json.map(row => row.email))
  })
}

export function parseAndValidateEmails(input?: string): string[] {
  if (!input)
    return []

  return cleanEmails(input.split(/[\s,]+/).filter(Boolean))
}
