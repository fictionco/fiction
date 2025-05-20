<script lang="ts" setup>
import type { MediaObject, OrganizationMember } from '@fiction/core'
import type { FictionTeam } from '@fiction/core/plugin-team'
import type { Card } from '@fiction/site'
import console from 'node:console'
import { gravatarUrlSync, resetUi, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { createOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import SettingsPanel from './SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
const { fictionTeam, fictionUser, fictionRouter } = useService<{ fictionTeam: FictionTeam }>()

const activeOrganization = fictionUser.activeOrganization

const userId = vue.computed(() => card.site?.siteRouter.query.value.userId as string | undefined)

const loading = vue.ref(true)
const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

const member = vue.ref<OrganizationMember>()

async function load() {
  loading.value = true

  const memberUserId = fictionRouter.query.value.userId as string | undefined

  try {
    if (!memberUserId)
      return

    member.value = await fictionTeam.loadMember(memberUserId)
  }
  catch (error) {
    console.error('Error loading contact', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => {
  vue.watch(
    () => fictionRouter.query.value.userId,
    async () => {
      load()
    },
    { immediate: true },
  )
})

const saveUtil = new AutosaveUtility({
  onSave: () => send(),
})

const canChangeRole = vue.computed(() => {
  const user = fictionUser.activeUser.value
  const privs = user?.relation?.memberAccess === 'owner' || user?.relation?.memberAccess === 'admin'

  const notCurrentUser = userId.value !== fictionUser.activeUser.value?.userId

  return privs && notCurrentUser
})

function update(memberNew: OrganizationMember) {
  member.value = memberNew

  saveUtil.autosave({ caller: 'updateTeamMember' })
}

async function setMemberRelation(_action: 'update' | 'delete'): Promise<void> {
  const orgId = activeOrganization.value?.orgId

  if (!userId.value)
    throw new Error('user id is required')
  if (!orgId)
    throw new Error('organization id is required')

  const r = await fictionUser.requests.ManageMemberRelation.request(
    {
      where: { userId: userId.value },
      orgId,
      fields: { memberAccess: member.value?.memberAccess ?? 'observer' },
      _action,
    },
    { debug: true },
  )

  if (r.status === 'success') {
    if (_action === 'delete')
      await card.goto(`/settings/team?orgId=${orgId}`)
    else
      await card.goto({ query: {} }, { replace: true })
  }
}
/**
 * Request to update user
 */
async function send(): Promise<void> {
  sending.value = 'update'

  if (!userId.value)
    throw new Error('user id is required')
  if (!fictionUser.activeOrganization.value?.orgId)
    throw new Error('organization id is required')

  await setMemberRelation('update')

  sent.value = true

  sending.value = false

  resetUi({ scope: 'all', cause: 'sendTeamEdit', trigger: 'manualReset' })
}

async function resendInvite(): Promise<void> {
  const orgId = fictionUser.activeOrganization.value?.orgId
  const { email, memberAccess = 'observer' } = member.value ?? {}
  if (!orgId || !email)
    return

  sending.value = 'invite'

  await fictionTeam.requests.TeamInvite.request({
    orgId,
    invites: [{ email, memberAccess }],
  })
  sending.value = false
}

async function maybeRemoveMember(): Promise<void> {
  const confirmed = confirm('Are you sure you want to remove this member?')

  if (confirmed) {
    sending.value = 'delete'
    await setMemberRelation('delete')
    sending.value = false
  }
}

const detailOptions = [

  createOption({
    key: 'memberActions',
    label: 'Actions',
    subLabel: 'Remove or resend invite',
    input: 'InputActionList',
    props: {
      buttons: () => [
        {
          label: 'Resend Invite',
          onClick: () => resendInvite(),
          theme: 'primary',
          design: 'outline',
          disabled: member.value?.memberStatus === 'active',
          icon: { class: 'i-tabler-send' },
        },
        {
          label: 'Remove...',
          onClick: () => maybeRemoveMember(),
          theme: 'rose',
          design: 'outline',
          disabled: !canChangeRole.value,
          icon: { class: 'i-tabler-trash' },
        },
      ],
    },
  }),

]

const options = vue.computed(() => {
  return [
    createOption({
      key: 'userDetails',
      label: 'Member Details',
      input: 'group',
      options: detailOptions,
    }),
  ]
})

function getAvatarUrl(member?: OrganizationMember): MediaObject | undefined {
  if (!member)
    return
  return member.avatar ? member.avatar : (gravatarUrlSync(member.email, { size: 400 }))
}

const header = vue.computed(() => {
  return {
    title: member.value?.fullName || member.value?.email,
    subTitle: 'Membership Details',
    media: getAvatarUrl(member.value),
    theme: member.value?.memberStatus === 'active' ? 'green' : 'orange',
    status: member.value?.memberStatus === 'active' ? 'active' : 'pending',
  } as const
})
</script>

<template>
  <SettingsPanel
    title="Member"
    :action="{ buttons: [{
      label: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => send(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }] }"
    :header
    :loading
  >
    <FormEngine
      :model-value="member"
      state-key="settingsTool"
      :classes="{ inputWrap: 'max-w-lg w-full' }"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(member)"
      @update:model-value="update($event as OrganizationMember)"
    />
  </SettingsPanel>
</template>
