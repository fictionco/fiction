// export async function sha256(message: string) {
//   if (typeof crypto !== 'undefined' && crypto.subtle) {
//     // Browser environment
//     const msgBuffer = new TextEncoder().encode(message)
//     const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
//     const hashArray = Array.from(new Uint8Array(hashBuffer))
//     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
//   }
//   else {
//     // Node.js environment
//     const crypto = await import('node:crypto')
//     return crypto.createHash('sha256').update(message, 'utf8').digest('hex')
//   }
// }
