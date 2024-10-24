export function replaceEmailDomain(email: string, newDomain?: string): string {
  if (!newDomain || email.includes('fiction.com'))
    return email

  return email.replace(/@[^>]+/, `@${newDomain}`)
}
