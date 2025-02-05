<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { dayjs, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElTeamInvite from './ElTeamInvite.vue'

const { card } = defineProps<{
  card: Card
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
        label: 'Add Team Member',
        theme: 'primary',
        icon: 'i-tabler-user-plus',
        onClick: () => (modalVisible = true),
      }] }"
      list-title="Members"
      :index-meta="indexMeta"
      :zero="{
        title: 'No Team Members',
        description: 'There are no team members in this organization.',
        icon: 'i-tabler-users',
      }"
    />
    <ElModal v-model:vis="modalVisible" modal-class="max-w-screen-md p-12">
      <ElTeamInvite :card />
    </ElModal>
  </div>
</template>
