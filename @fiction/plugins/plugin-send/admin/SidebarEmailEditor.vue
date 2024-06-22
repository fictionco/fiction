<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { ActionItem } from '@fiction/core'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site'
import InputActions from '@fiction/ui/inputs/InputActions.vue'
import InputAuthors from '@fiction/posts/el/InputAuthors.vue'
import type { TablePostConfig } from '@fiction/posts/schema'
import type { Email } from '../email.js'
import type { FictionSend } from '../index.js'
import InputAudience from './InputAudience.vue'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  email: { type: Object as vue.PropType<Email>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionSend: FictionSend }>()

const options = vue.computed(() => {
  const email = props.email
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  return [
    new InputOption({
      key: 'scheduleSettings',
      label: 'Schedule Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'scheduleMode',
          label: 'Sending Time',
          input: 'InputSelectCustom',
          isRequired: true,
          list: [
            { label: 'Send Now', value: 'now' },
            { label: 'Schedule Send', value: 'schedule' },
          ],
        }),
        new InputOption({
          key: 'scheduledAt',
          label: 'Scheduled Send Time',
          input: 'InputDate',
          isRequired: true,
          isHidden: email?.scheduleMode.value !== 'schedule',
          props: { includeTime: true, dateMode: 'future' },
        }),
        new InputOption({
          key: 'audience',
          label: 'Audience',
          input: InputAudience,
        }),
      ],
    }),

    new InputOption({
      key: 'emailSettings',
      label: 'Email Settings',
      input: 'group',
      options: [
        new InputOption({ key: 'title', label: 'Internal Title', input: 'InputText', isRequired: true }),
        new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true }),
        new InputOption({ key: 'preview', label: 'Preview Text', input: 'InputText' }),
      ],
    }),

    new InputOption({
      key: 'emailContent',
      label: 'Email Content',
      input: 'group',
      options: [

        new InputOption({
          key: 'post.title',
          label: 'Title',
          input: 'InputText',
          placeholder: 'Title',
          isRequired: true,
        }),
        new InputOption({
          key: 'post.subTitle',
          label: 'Subtitle',
          input: 'InputText',
        }),
        new InputOption({ key: 'post.authors', label: 'Authors', input: InputAuthors, props: { } }),
      ],
    }),
    new InputOption({
      key: 'dangerZone',
      label: 'Danger Zone',
      input: 'group',
      options: [
        new InputOption({
          key: 'deletePost',
          label: 'Permanently Delete Email',
          input: InputActions,
          props: {
            actions: [
              {
                name: 'Delete Email...',
                btn: 'default',
                onClick: (args) => {
                  const e = args.props as { email: Email }
                  const confirmed = confirm('Are you sure you want to delete this email?')

                  if (confirmed) {
                    e.email?.delete()
                    props.card.goto('/send')
                  }
                },
              },
            ] as ActionItem[],
          },
        }),

      ],
    }),
  ]
})

function updatePost(config: TablePostConfig) {
  props.email?.update(config)
}
</script>

<template>
  <ElTool :tool="tool">
    <ElForm v-if="email" id="toolForm">
      <ToolForm
        :model-value="email.toConfig()"
        :options="options"
        :input-props="{ email, card }"
        @update:model-value="updatePost($event as TablePostConfig)"
      />
    </ElForm>
  </ElTool>
</template>
