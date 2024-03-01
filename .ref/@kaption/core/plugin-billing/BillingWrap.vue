<script lang="ts" setup>
import { vue } from '@factor/api'
import ElPanel from '../ui/ElPanel.vue'
import { useKaption } from '..'
import AdminPage from '../plugin-admin/AdminPage.vue'

const { factorRouter } = useKaption()

const navItems = vue.ref([
  { name: 'Overview and Usage', path: factorRouter.link('billing') },
  { name: 'Invoices', path: factorRouter.link('billingHistory') },
  { name: 'Payment Methods', path: factorRouter.link('billingPaymentMethods') },
  { name: 'Plans and Pricing', path: factorRouter.link('billingPlans') },
])
</script>

<template>
  <AdminPage>
    <ElPanel title="Billing">
      <div class="px-4 py-8 md:px-8">
        <div
          class="billing-nav text-theme-600 mb-8 flex space-x-6 border-b border-slate-200 pb-3"
        >
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="hover:text-primary-600"
            active-class="text-primary-500"
          >
            {{ item.name }}
          </router-link>
        </div>
        <slot />
      </div>
    </ElPanel>
  </AdminPage>
</template>
