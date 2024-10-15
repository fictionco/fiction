export function replaceEmailDomain(email: string, newDomain?: string): string {
  if (!newDomain)
    return email

  return email.replace(/([^@\s]+@)[^@\s]+(\s*>?$)/, `$1${newDomain}$2`)
}
