<script lang="ts" setup>
import type { FictionTeam } from '@fiction/core/plugin-team'
import type { Card } from '@fiction/site'
import { type OrganizationMember, resetUi, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import ElHeader from './ElHeader.vue'
import SettingsPanel from './SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
const { fictionTeam, fictionUser } = useService<{ fictionTeam: FictionTeam }>()

const activeOrganization = fictionUser.activeOrganization

const userId = vue.computed(() => card.site?.siteRouter.query.value.userId as string | undefined)

const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

const member = vue.ref<OrganizationMember>()
vue.onMounted(async () => {
  if (userId.value)
    member.value = await fictionTeam.loadMember(userId.value)
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

  saveUtil.autosave()
}

async function setMemberRelation(_action: 'update' | 'delete'): Promise<void> {
  const orgId = activeOrganization.value?.orgId

  if (!userId.value)
    throw new Error('user id is required')
  if (!orgId)
    throw new Error('organization id is required')

  const r = await fictionUser.requests.ManageMemberRelation.request(
    {
      memberId: userId.value,
      orgId,
      memberAccess: member.value?.memberAccess ?? 'observer',
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
  new InputOption({
    label: 'Organization Access',
    subLabel: 'Set the level of access this user has to your organization',
    input: 'InputControl',

    valueDisplay: () => {
      return {
        status: member.value?.memberAccess ? 'ready' : 'incomplete',
        data: member.value?.memberAccess,
      }
    },
    options: [
      new InputOption({
        disabled: !canChangeRole.value ? 'You can\'t change this user\'s role' : undefined,
        key: 'memberAccess',
        label: 'Organization Role',
        input: 'InputSelectCustom',
        list: [
          { value: 'owner', name: 'Owner' },
          { value: 'admin', name: 'Administrator' },
          { value: 'editor', name: 'Editor (Read/Write)' },
          { value: 'observer', name: 'Observer (Read Only)' },
        ],
      }),
    ],
  }),
  new InputOption({
    label: 'Member Status',
    subLabel: 'The status of this member in your organization',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: member.value?.memberStatus === 'active' ? 'ready' : 'incomplete',
        data: member.value?.memberStatus,
      }
    },
    actions: () => [
      {
        name: 'Resend Invite',
        onClick: () => resendInvite(),
        theme: 'primary',
        disabled: member.value?.memberStatus === 'active',
        icon: { class: 'i-tabler-send' },
      },
      {
        name: 'Remove...',
        onClick: () => maybeRemoveMember(),
        theme: 'rose',
        design: 'ghost',
        disabled: !canChangeRole.value,
        icon: { class: 'i-tabler-trash' },
      },
    ],
  }),

]

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'userDetails',
      label: 'Organization Relationship',
      input: 'group',
      options: detailOptions,
      format: 'control',
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: member.value?.fullName || member.value?.email,
    subTitle: 'Accounts Details',
    media: member.value?.avatar,
  }
})
</script>

<template>
  <SettingsPanel
    title="Team Member"
    :actions="[{
      name: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => send(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }]"
  >
    <div class="p-6">
      <ElHeader
        v-if="header"
        class="dark:bg-theme-700/50 rounded-xl p-8"
        :model-value="header"
      />
    </div>
    <FormEngine
      :model-value="member"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(member)"
      @update:model-value="update($event as OrganizationMember)"
    />
  </SettingsPanel>
</template>
