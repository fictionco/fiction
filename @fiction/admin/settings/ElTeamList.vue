<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import type { Card } from '@fiction/site'
import { dayjs, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElTeamInvite from './ElTeamInvite.vue'

const { card, uiSize } = defineProps<{
  card: Card
  uiSize?: StandardSize
}>()

const service = useService()

const modalVisible = vue.ref(false)

const list = vue.computed<NavListItem[]>(() => {
  const activeOrganization = service.fictionUser.activeOrganization.value
  const members = activeOrganization?.members || []
  return members.map((p) => {
    const label = p.fullName || p.email || 'Unknown'
    const description = [`Added ${dayjs(p.createdAt).format('MMM D, YYYY')}`]

    if (!label.includes('@'))
      description.push(`Email: ${p.email}`)

    return {
      key: p.userId,
      label,
      description: description.join(' - '),
      href: card.link(`/settings/team-member?userId=${p.userId}`),
      media: p.avatar,
      isActive: card.site?.siteRouter.query.value.userId === p.userId,
    } as NavListItem
  })
})

const indexMeta = vue.ref()
</script>

<template>
  <div>
    <ElIndexGrid
      :list
      theme="primary"
      :action="{ buttons: [{
        testId: 'inviteButton',
        label: 'Invite',
        theme: 'primary',
        icon: 'i-tabler-user-plus',
        onClick: () => (modalVisible = true),
      }] }"
      :ui-size="uiSize"
      list-title="Members"
      :index-meta="indexMeta"
      :zero="{
        title: 'No Team Members',
        description: 'There are no team members in this organization.',
        icon: 'i-tabler-users',
      }"
    />
    <ElModal
      v-model:vis="modalVisible"
      modal-class="max-w-screen-md p-12"
      :has-close="true"
    >
      <ElTeamInvite :card />
    </ElModal>
  </div>
</template>
