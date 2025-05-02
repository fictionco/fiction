<script lang="ts" setup>
import type { ListItem, User } from '@fiction/core'
import type { FictionTeam } from '@fiction/core/plugin-team'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import InputSelectCustom from '@fiction/ui/inputs/InputSelectCustom.vue'

const {
  modelValue = [],
} = defineProps<{
  modelValue?: User[]
  card: Card
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: User[]): void
}>()

const { fictionUser, fictionTeam } = useService<{ fictionTeam: FictionTeam }>()
const addMore = vue.ref(false)
const users = vue.ref<User[]>([])
const list = vue.computed<ListItem[]>(() => users.value.map(t => ({ value: t.userId, label: t.fullName, description: t.email })))
const isFocused = vue.ref(false)
const search = vue.ref<string | undefined>()

async function fetchList() {
  try {
    const orgId = fictionUser.activeOrganization?.value

    if (!orgId)
      return []

    const r = await fictionTeam.loadMemberIndex()

    users.value = r as User[]
  }
  catch (e) {
    console.error(e)
  }
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
  // Normalize the search text by converting to lower case and removing all whitespace
  const searchValue = search.value?.toLowerCase().replace(/\s+/g, '') || ''
  return !searchValue
    ? list.value
    : list.value.filter((item) => {
      // Construct a single string from name, description, and value, also normalized
        const searchString = `${item.name?.toLowerCase() || ''} ${item.desc?.toLowerCase() || ''} ${item.value}`
          .replace(/\s+/g, '') // Remove all whitespace for robust matching

        return searchString.includes(searchValue)
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
    <div v-if="modelValue && modelValue.length" class="tag-list flex flex-row flex-wrap gap-3 items-center">
      <XButton
        v-for="(user, i) in modelValue"
        :key="i"
        class="gap-1"
        size="sm"
        design="outline"
      >
        <span class="flex items-center gap-1.5 ">
          <span><ElAvatar :user class="size-4" /></span>
          <span>{{ user.fullName || user.email }}</span>
          <span
            v-if="modelValue.length > 1"
            class="i-tabler-x hover:opacity-70 cursor-pointer text-theme-500"
            @click.stop="remove(user)"
          />
        </span>
      </XButton>
      <XButton
        v-if="modelValue.length > 1 || !addMore"
        class="gap-1"
        size="sm"
        design="ghost"
        @click.stop="addMore = !addMore"
      >
        Add
      </XButton>
    </div>
    <InputSelectCustom
      v-if="addMore || !modelValue.length"
      v-model:search="search"
      v-model:focused="isFocused"
      :allow-search="true"
      :list="renderList"
      zero-text="No additional users found"
      @update:model-value="addFromId($event as string)"
    />
  </div>
</template>
