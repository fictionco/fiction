import type { Project } from '@factor/api/plugin-admin'
import type { CreateObjectType } from '../utils/db'
import type { customEventColumns } from './tables'

export type ProjectEvents = Record<string, CustomTrackEvent | null>

export type ProjectWithEvents = {
  projectEvents?: ProjectEvents
} & Project

export type StandardEvent =
  | 'view'
  | 'click'
  | 'stat'
  | 'rageClick'
  | 'error'
  | 'bot'
  | 'duration'

export type TriggerType = 'url' | 'metric' | 'element' | 'click' | 'api' | ''
export type ConversionType = 'conversion' | 'goal' | 'event' | ''
export type MetricType = 'engageDuration' | 'totalClicks' | ''

export type CustomTrackEvent = CreateObjectType<typeof customEventColumns> & {
  createdAt: string
  updatedAt: string
}

export interface TrackingEvent {
  event: StandardEvent
}

export interface TargetingList<T = string> {
  value?: T
  name: string
  desc?: string
  icon?: string
  list?: TargetingList<TargetingFilter['field']>[]
}

export type TargetingFilter = {
  ruleId?: string
  operator?: '=' | '!='
  filter?: string
} & (
  | {
    category?: 'referrer'
    field?:
      | 'referrer'
      | 'referralCampaign'
      | 'referralMedium'
      | 'referralSource'
  }
  | {
    category?: 'geography'
    field?: 'cityName' | 'countryCode'
  }
  | {
    category?: 'technology'
    field?: 'browser' | 'os' | 'deviceType'
  }
  | {
    category?: 'session'
    field?:
      | 'isReturning'
      | 'pathname'
      | 'event'
      | 'category'
      | 'label'
      | 'action'
  }
)

export type TargetingRule = {
  ruleId?: string
  ruleValues?: string
  ruleOperator?: '=' | '!='
} & (
  | {
    ruleCategory: 'utm'
    ruleType: 'utm_campaign' | 'utm_medium' | 'utm_source'
  }
  | {
    ruleCategory: 'device'
    ruleType: 'device'
  }
  | {
    ruleCategory: 'behavior'
    ruleType: 'referrer' | 'isReturning' | 'pathname'
  }
  | {
    ruleCategory: 'geography'
    ruleType: 'city' | 'country'
  }
  | {
    ruleCategory: 'technology'
    ruleType: 'browser' | 'os'
  }
)
