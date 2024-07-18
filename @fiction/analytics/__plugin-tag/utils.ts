export function objectMap(obj: Record<string, any>, fn: (v: any, k: string, i: number) => any): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v], i) => {
        return [k, fn(v, k, i)]
      })
      .filter(([_k, v]) => v !== undefined),
  )
}
export function recordMap(rec: Record<string, any>, fn: (v: any, k: string, i: number) => any): Record<string, any> {
  return objectMap(rec, (v) => {
    if (v && typeof v === 'object') {
      return objectMap(v as Record<string, any>, fn)
    }
    else {
      return v
    }
  })
}
