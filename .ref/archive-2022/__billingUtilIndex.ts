import { activeUser, log, storeItem } from '@factor/api'
import { activeOrganization, activeOrganizations } from '@kaption/core/utils'
import { getPaymentEndpointsMap } from '@factor/plugin-stripe'
import { watch } from 'vue'

const CUSTOMER_LOADING = 'customerLoading'

async function setCustomerData(organizationId: string): Promise<void> {
  log.l({
    level: 'info',
    context: 'setCustomerData',
    description: `set customer: ${organizationId}`,
  })
  const org = activeOrganizations.value.find(
    o => o.organizationId === organizationId,
  )
  if (!org)
    throw new Error('missing organization')

  const { customerId, organizationName, organizationEmail } = org

  storeItem(CUSTOMER_LOADING, true)

  await getPaymentEndpointsMap().ManageCustomer.request({
    customerId,
    id: organizationId,
    name: organizationName,
    email: organizationEmail ?? activeUser.value?.email,
    _action: 'retrieve',
  })
  storeItem(CUSTOMER_LOADING, false)
}

export function initializeCustomer(): void {
  storeItem(CUSTOMER_LOADING, true)
  watch(
    () => activeOrganization.value?.organizationId,
    async (v) => {
      if (v)
        await setCustomerData(v)
    },

    { immediate: true },
  )
}
