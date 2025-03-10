<script lang="ts" setup>
import type { ListItem, User } from '@fiction/core'
import type { FictionTeam } from '@fiction/core/plugin-team'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputSelectCustom from '@fiction/ui/inputs/InputSelectCustom.vue'

const { modelValue = [], teamLink = '' } = defineProps<{
  modelValue?: User[]
  teamLink?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: User[]): void
}>()

const service = useService<{ fictionTeam: FictionTeam }>()
const users = vue.ref<User[]>([])
const list = vue.computed<ListItem[]>(() => users.value.map(t => ({ value: t.userId, label: t.fullName, description: t.email })))
const isFocused = vue.ref(false)
const search = vue.ref<string | undefined>()

async function fetchList() {
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  const orgId = activeOrganizationId

  if (!orgId)
    return []

  const r = await service.fictionTeam.loadMemberIndex()

  users.value = r as User[]
}

function addFromId(userId: string) {
  const user = users.value.find(t => t.userId === userId)

  if (!user)
    return

  if (modelValue.find(t => t.userId === user.userId))
    return

  emit('update:modelValue', [...modelValue, user])
}

const renderList = vue.computed(() => {
  const v = modelValue
  // Normalize the search text by converting to lower case and removing all whitespace
  const s = search.value?.toLowerCase().replace(/\s+/g, '')
  const li = list.value.filter(l => !v.find(t => t.userId === l.value))
  return !s
    ? li
    : li.filter((item) => {
      // Construct a single string from name, description, and value, also normalized
        const searchString = `${item.name?.toLowerCase() || ''} ${item.desc?.toLowerCase() || ''} ${item.value}`
          .replace(/\s+/g, '') // Remove all whitespace for robust matching

        return searchString.includes(s)
      })
})

function remove(user: User) {
  emit('update:modelValue', modelValue.filter(t => t.userId !== user.userId))
}

vue.onMounted(async () => {
  await fetchList()
})
</script>

<template>
  <div class="space-y-2">
    <div v-if="modelValue && modelValue.length" class="tag-list flex flex-row flex-wrap gap-1">
      <XButton
        v-for="(user, i) in modelValue"
        :key="i"
        class="gap-1"
        theme="primary"
        size="sm"
        design="outline"
      >
        <span class="flex items-center gap-1">
          <span>{{ user.fullName || user.email }}</span>
          <span class="i-tabler-x hover:opacity-70 cursor-pointer" @click.stop="remove(user)" />
        </span>
      </XButton>
    </div>
    <InputSelectCustom
      v-model:search="search"
      v-model:focused="isFocused"
      :allow-search="true"
      :list="renderList"
      zero-text="No users found"
      @update:model-value="addFromId($event as string)"
    />
    <div v-if="teamLink" class="flex justify-start gap-2">
      <XButton
        class="shrink-0"
        size="xs"
        btn="default"
        :href="teamLink"
        icon-after="i-tabler-arrow-up-right"
      >
        Add to Team
      </XButton>
    </div>
  </div>
</template>
