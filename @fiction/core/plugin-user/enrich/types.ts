export type NullablePartial<T> = {
  [P in keyof T]?: T[P] extends object ? NullablePartial<T[P]> | null : T[P] | null;
}

type EmploymentHistory = NullablePartial<{
  _id: string
  created_at: string
  current: boolean
  degree: string
  description: string
  emails: string
  end_date: string
  grade_level: string
  kind: string
  major: string
  organization_id: string
  organization_name: string
  raw_address: string
  start_date: string
  title: string
  updated_at: string
  id: string
  key: string
}>

type PhoneNumber = NullablePartial<{
  raw_number: string
  sanitized_number: string
  type: string
  position: number
  status: string
  dnc_status: string
  dnc_other_info: string
  dialer_flags: string
}>

type Technology = NullablePartial<{
  uid: string
  name: string
  category: string
}>

type Organization = NullablePartial<{
  id: string
  name: string
  website_url: string
  blog_url: string
  angellist_url: string
  linkedin_url: string
  twitter_url: string
  facebook_url: string
  primary_phone: NullablePartial<{
    number: string
    source: string
    sanitized_number: string
  }>
  languages: string[]
  alexa_ranking: string
  phone: string
  linkedin_uid: string
  founded_year: number
  publicly_traded_symbol: string
  publicly_traded_exchange: string
  logo_url: string
  crunchbase_url: string
  primary_domain: string
  sanitized_phone: string
  industry: string
  keywords: string[]
  estimated_num_employees: number
  industries: string[]
  secondary_industries: string[]
  snippets_loaded: boolean
  industry_tag_id: string
  industry_tag_hash: {
    [key: string]: string
  }
  retail_location_count: number
  raw_address: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  owned_by_organization_id: string
  suborganizations: string[]
  num_suborganizations: number
  seo_description: string
  short_description: string
  total_funding: string
  total_funding_printed: string
  latest_funding_round_date: string
  latest_funding_stage: string
  funding_events: string[]
  technology_names: string[]
  current_technologies: Technology[]
  org_chart_root_people_ids: string[]
  org_chart_sector: string
  org_chart_removed: boolean
  org_chart_show_department_filter: boolean
}>

type Person = NullablePartial<{
  id: string
  first_name: string
  last_name: string
  name: string
  linkedin_url: string
  title: string
  email_status: string
  photo_url: string
  twitter_url: string
  github_url: string
  facebook_url: string
  extrapolated_email_confidence: string
  headline: string
  email: string
  organization_id: string
  employment_history: EmploymentHistory[]
  state: string
  city: string
  country: string
  restricted: boolean
  organization: Organization
  is_likely_to_engage: boolean
  phone_numbers: PhoneNumber[]
  intent_strength: string
  show_intent: boolean
  revealed_for_current_team: boolean
  departments: string[]
  subdepartments: string[]
  functions: string[]
  seniority: string
}>

export type ApolloApiResponse = {
  person?: Person
}
