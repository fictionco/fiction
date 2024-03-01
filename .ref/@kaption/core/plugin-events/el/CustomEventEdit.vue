<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { vue } from '@factor/api'
import { useKaption } from '../../utils'
import ElPanel from '../../ui/ElPanel.vue'
import ElButton from '../../ui/ElButton.vue'
import type { CustomTrackEvent } from '../types'
import { customEventColumns } from '../tables'
import EventWrap from './EventWrap.vue'
import RulesList from './CustomEventRulesList.vue'

const { factorRouter, factorUser, kaptionEvents, factorAdmin } = useKaption()
const sending = vue.ref<string | boolean>(false)
const eventState = kaptionEvents.activeEventState

const allowedVars = [
  ...customEventColumns.filter(col => !col.isPrivate).map(col => col.key),
  'url',
  'timestamp',
  'projectName',
]

const form = vue.ref<Partial<CustomTrackEvent>>({
  conversion: '',
  eventTrigger: '',
  event: '',
  category: '',
  action: '',
  label: '',
  threshold: 0,
  metric: '',
  weight: 0,
  points: 0,
  pathMatch: '',
  selector: '',
  value: 0,
  rules: [],
  isNotification: false,
  notificationEmail: '',
  notificationTitle: '',
  notificationBody: '',
})

const customizeNotification = vue.ref(false)

const routeEventId = factorRouter.current.value.params.eventId as
  | string
  | undefined

vue.onMounted(async () => {
  await factorUser.userInitialized()

  if (!routeEventId)
    return factorRouter.goto('eventOverview')

  const r = await kaptionEvents.load({
    _action: 'getSingle',
    eventId: routeEventId,
  })

  const ev = r.data?.[0]

  if (ev?.notificationBody || ev?.notificationTitle)
    customizeNotification.value = true

  if (ev)
    form.value = ev
})

async function updateEvent(): Promise<void> {
  const { event } = form.value

  if (!event)
    return
  if (!routeEventId)
    return

  const r = await kaptionEvents.requests.ManageCustomEvent.projectRequest({
    _action: 'update',
    eventId: routeEventId,
    customEvent: form.value,
  })
  if (r.data)
    form.value = r.data[0]
}

async function maybeRemove(): Promise<void> {
  const confirmed = confirm('Are you sure?')

  if (confirmed) {
    sending.value = 'delete'

    const r = await kaptionEvents.requests.ManageCustomEvent.projectRequest({
      _action: 'delete',
      eventId: routeEventId,
    })

    sending.value = false
    if (r.status === 'success')
      await factorRouter.goto('eventOverview')
  }
}

async function send(context: string): Promise<void> {
  sending.value = context
  await updateEvent()
  sending.value = false
}
</script>

<template>
  <EventWrap>
    <template #actions>
      <ElButton
        btn="slate"
        :loading="sending === 'secondary'"
        @click="send('secondary')"
      >
        Save Changes
      </ElButton>
    </template>
    <ElForm :loading="eventState.status === 'loading'" @submit="send('primary')">
      <ElPanel :title="`Edit Event: ${form.event}`">
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            class="my-8"
            label="Event Reference Key"
            description="This is the value that is tracked and used in the API"
          >
            <div
              class="mt-2 inline-block rounded-md bg-theme-100 px-6 py-2 font-bold text-theme-800"
            >
              {{ form.event }}
            </div>
          </ElInput>

          <ElInput
            v-model="form.conversion"
            class="my-8"
            input="InputSelectCustom"
            label="Event Type"
            description="How should this event be tracked and handled"
            :list="[
              {
                value: 'conversion',
                name: `Conversion`,
                desc: `A fully qualified conversion event (purchase, lead, call)`,
              },
              {
                value: 'goal',
                name: `Goal`,
                desc: `A step on the path to a full conversion (view pricing, add to cart)`,
              },
              {
                value: 'standard',
                name: `Standard`,
                desc: `Any behavior or action you want to track but not treat as a conversion`,
              },
            ]"
            required
          />
        </div>
      </ElPanel>
      <ElPanel title="Event Trigger">
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            v-model="form.eventTrigger"
            class="my-8"
            input="InputSelectCustom"
            label="Trigger Type"
            description="Select the type of trigger for this event"
            :list="[
              {
                value: 'url',
                name: `Page / URL`,
                desc: `When a visitor reaches a specific url`,
              },

              {
                value: 'click',
                name: `Element Click`,
                desc: `When an element is clicked`,
              },
              {
                value: 'element',
                name: `Element View`,
                desc: `When an element is detected on the page`,
              },
              {
                value: 'metric',
                name: `Engagement Metric`,
                desc: `When an engagement metric hits a specified value`,
              },
              {
                value: 'api',
                name: `JavaScript API`,
                desc: `When the event is triggered via API (trackEvent)`,
              },
            ]"
            required
          />

          <ElInput
            v-if="form.eventTrigger === 'metric'"
            v-model="form.metric"
            class="my-8"
            input="InputSelectCustom"
            label="Engagement Metric"
            description="Which engagement metric should trigger this event?"
            :list="[
              {
                value: 'engageDuration',
                name: `Seconds Engaged`,
                desc: `The total amount of engaged time in seconds during a session`,
              },
              {
                value: 'totalClicks',
                name: `Total Clicks`,
                desc: `The total amount of clicks or touches during a session`,
              },
            ]"
            required
          />

          <ElInput
            v-if="form.eventTrigger === 'metric'"
            v-model="form.threshold"
            class="my-8"
            input="InputNumber"
            label="Metric Threshold Value"
            min="1"
            max="99999"
            description="What is the metric threshold value to trigger this event"
            required
          />

          <ElInput
            v-if="form.eventTrigger === 'url'"
            v-model="form.pathMatch"
            class="my-8"
            input="InputText"
            label="Trigger Paths/URLs"
            placeholder="/success?x=y, https://www.example.com/checkout"
            description="(Comma separated) Paths or full URLs that will trigger this event"
            required
          />

          <ElInput
            v-if="
              form.eventTrigger === 'click' || form.eventTrigger === 'element'
            "
            v-model="form.selector"
            class="my-8"
            input="InputText"
            label="Element CSS Selector"
            placeholder=".home > #myButton"
            description="Enter the css selector string for the trigger element"
            required
          />
        </div>
      </ElPanel>
      <ElPanel title="Event Information">
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            v-model="form.category"
            class="my-8"
            input="InputText"
            label="Event Category"
            description="(Optional) A category to associate with this event"
          />
          <ElInput
            v-model="form.label"
            class="my-8"
            input="InputText"
            label="Event Label"
            description="(Optional) A label to give this event"
          />
          <ElInput
            v-model="form.action"
            class="my-8"
            input="InputText"
            label="Event Action"
            description="(Optional) An action to assign this event"
            placeholder="Video Watched"
          />
          <ElInput
            v-model="form.value"
            class="my-8"
            input="InputNumber"
            label="Event Value"
            description="(Optional) An value to associate with this event"
            placeholder="1"
          />
        </div>
      </ElPanel>
      <ElPanel title="Targeting Rules">
        <RulesList v-model="form.rules" />
      </ElPanel>
      <ElPanel title="Notification">
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            v-model="form.isNotification"
            class="my-8"
            label="Send Notification"
            description="Send a notification when this event is triggered"
            input="InputCheckbox"
          />
          <template v-if="form.isNotification">
            <ElInput
              v-model="form.notificationEmail"
              class="my-8"
              label="Notification Email Addresses"
              description="Comma separated email addresses. Subject to daily limit. "
              input="InputText"
              placeholder="cicero@kaption.co, plato@kaption.co"
            />
            <ElInput
              v-model="customizeNotification"
              class="my-8"
              label="Customize Notification"
              description="Use markdown and handlebar variables to customize information in the notification"
              input="InputCheckbox"
            />
            <template v-if="customizeNotification">
              <ElInput
                v-model="form.notificationTitle"
                class="my-8"
                label="Notification Title"
                input="InputText"
                placeholder="New Event {{event}}"
              />
              <ElInput
                v-model="form.notificationBody"
                class="my-8"
                label="Notification Body"
                input="InputTextarea"
                placeholder="A new event was triggered at {{timestamp}}"
              />
              <div class="my-8">
                <div class="text-sm">
                  Allowed Vars:
                </div>
                <div class="text-xs text-theme-500">
                  {{ allowedVars.join(", ") }}
                </div>
              </div>
            </template>
          </template>
        </div>
      </ElPanel>
      <ElPanel title="Danger Zone">
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            class="my-8"
            s
            label="Remove Event"
            description="Permanently delete this event. Analytics data will be retained."
          >
            <div class="rounded-md pt-4">
              <ElButton
                :loading="sending === 'delete'"
                btn="red"
                @click.prevent="maybeRemove()"
              >
                Remove Event
              </ElButton>
            </div>
          </ElInput>
        </div>
      </ElPanel>
    </ElForm>
  </EventWrap>
</template>
