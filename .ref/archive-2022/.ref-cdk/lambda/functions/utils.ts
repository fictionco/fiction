import type { Project } from '@kaption/core'

export function toCamelCase(obj: Record<string, any>): Record<string, any> {
  let rtn = obj
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      rtn = obj.map(_ => toCamelCase(_ as Record<string, any>))
    }
    else {
      rtn = {}
      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
          const newKey = key.replace(/(_\w)/g, k => k[1].toUpperCase())
          rtn[newKey] = toCamelCase(obj[key] as Record<string, any>)
        }
      }
    }
  }
  return rtn
}

export function objectMap(obj: Record<string, any>, fn: (v: any, k: string, i: number) => any): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v], i) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return [k, fn(v, k, i)]
      })
      .filter(([_k, v]) => typeof v !== 'undefined'),
  )
}
export function recordMap(rec: Record<string, any>, fn: (v: any, k: string, i: number) => any): Record<string, any> {
  return objectMap(rec, (v) => {
    if (v && typeof v === 'object') {
      return objectMap(v as Record<string, any>, fn)
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return v
    }
  })
}
/**
 * Remove descriptive information not relevant for client script
 */
export function clientProjectInfoForClient(project?: Partial<Project>): Partial<Project | undefined> {
  if (!project)
    return project

  const projectPartial: Partial<Project> = objectMap(project, (v, k) => {
    const saveKeys = new Set([
      'projectId',
      'projectDomain',
      'projectStatus',
      'projectEvents',
      'trackingSettings',
      'experiments',
      'trackingStatus',
    ])
    if (!saveKeys.has(k)) {}
    else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return v
    }
  })

  return projectPartial
}
