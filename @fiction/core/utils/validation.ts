type ValidationTypes = 'email' | 'domain' | 'url'

export async function isValid(value: string, type: ValidationTypes): Promise<boolean> {
  const { default: validator } = await import('validator')
  if (type === 'email') {
    return validator.isEmail(value)
  }
  else if (type === 'domain' || type === 'url') {
    const opts = type === 'domain' ? { require_protocol: false } : {}
    return validator.isURL(value, opts)
  }
  else {
    return false
  }
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value)
}

export function cleanEmail(value?: string) {
  if (!value)
    return ''

  return value.trim().toLowerCase()
}
