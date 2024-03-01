export type ClientLibrary = 'tracker' | 'client' | 'kaption'

export type BuildStage = 'local' | 'pre' | 'prod' | 'dev'

export enum StageId {
  Prod = 'prod',
  Pre = 'pre',
  Dev = 'dev',
  Local = 'local',
}
