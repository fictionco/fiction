import type { TableJobConfig } from '../tables'

export type ProgressStatus =
  | 'pending'
  | 'requested'
  | 'processing'
  | 'ready'
  | 'error'
  | 'cancelled'

export type AimInstanceStatus =
  | 'running'
  | 'starting'
  | 'error'
  | 'stopping'
  | 'removing'
  | 'off'
  | 'paused'

export type ActivityStatus = 'idle' | 'busy' | 'ready' | 'error' | 'off'

export interface InstanceState {
  instanceId: string
  status: AimInstanceStatus
  activityStatus: ActivityStatus
  reason: string
  createdAt: number
  readyAt: number
  updatedAt: number
  upSeconds: number
  estimatedStartSeconds: number
  organizationId: string
  userId: string
  logs: string[]
  publicDns: string
  publicIp: string
}

export type AwsInstanceState =
  | 'pending'
  | 'running'
  | 'shutting-down'
  | 'terminated'
  | 'stopping'
  | 'stopped'

export interface CurrentInstanceDescription {
  organizationId?: string
  instanceId?: string
  status: AimInstanceStatus
  instanceState: AwsInstanceState
  activityStatus?: ActivityStatus
  publicIp?: string
  publicDns?: string
  instanceType?: string
  ami?: string
  secondsSinceLaunch: number
  startedAt: Date | undefined
  isStarting: boolean
  isTerminated: boolean
  isStopped: boolean
  isStopping: boolean
  isRunning: boolean
  additional: Record<string, unknown>
  activeJob?: Partial<TableJobConfig>
}
