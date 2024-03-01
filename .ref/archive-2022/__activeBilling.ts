import { stored } from '@factor/api'
import { activeUser } from '@kaption/app'
import type { CustomerData } from '@factor/plugin-stripe'
import { computed } from 'vue'
import type { OrganizationMember, Plan } from '../typesProject'
import { activeOrganization } from '../plugin-admin/activeProject'

export const activeCustomerId = computed(() => {
  return activeOrganization.value?.customerId
})

export const activeCustomerData = computed(() => {
  return stored<CustomerData>('customerData')
})

export const activeSubscription = computed(() => {
  const subs = activeCustomerData.value?.subscriptions?.data ?? []

  return subs.find(_ => _.status)
})
/**
 * Get active sub plan
 * @computed
 */
export const activePlan = computed<Plan>(() => {
  const sub = activeSubscription.value
  const name
    = sub && ['active', 'trialing'].includes(sub.status) ? 'pro' : 'free'

  // to prevent flash of free/pro that doesn't represent state as user loads
  const defaultName = activeCustomerData.value ? 'free' : 'unknown'
  return sub ? { name, status: sub.status } : { name: defaultName }
})

/**
 * Get membership status in current org
 * @computed
 */
export const activeMembership = computed<OrganizationMember | undefined>(() => {
  const user = activeUser.value
  const org = activeOrganization.value
  return org?.members.find(_ => _.userId === user?.userId)
})
