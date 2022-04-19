/**
 * RegExp-escapes all characters in the given string.
 */
export const regExpEscape = (s: string): string => {
  return s.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&")
}

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 * https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
 */
export const wildcardToRegExp = (s: string): RegExp => {
  return new RegExp(
    "^" +
      s
        .split(/\*+/)
        .map((_) => regExpEscape(_))
        .join(".*") +
      "$",
  )
}
