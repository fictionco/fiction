import validator from "validator"

type ValidationTypes = "email" | "domain" | "url"

export const isValid = (value: string, type: ValidationTypes): boolean => {
  if (type == "email") {
    return validator.isEmail(value)
  } else if (type == "domain" || type == "url") {
    const opts = type == "domain" ? { require_protocol: false } : {}
    return validator.isURL(value, opts)
  } else {
    return false
  }
}
