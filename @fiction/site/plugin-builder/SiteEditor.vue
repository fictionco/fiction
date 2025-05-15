<script lang="ts" setup>
import type { FictionApp, FictionRouter } from '@fiction/core'
import type { FictionSites } from '..'
import type { Card } from '../card'
import type { Site } from '../site'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import CardButton from '@fiction/cards/CardButton.vue'
import { onResetUi, resetUi, useService, vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import { getMountContext, loadSite } from '../load'
import SiteEditorFrame from './SiteEditorFrame.vue'

const { card } = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionSites: FictionSites, fictionRouterSites: FictionRouter, fictionAppSites: FictionApp }>()
const { fictionRouter, fictionSites, fictionRouterSites, fictionEnv, fictionUser } = service

const loading = vue.ref(true)
const sending = vue.ref('')
const editing = vue.ref(false)

const site = vue.shallowRef<Site | undefined>()

async function load() {
  loading.value = true

  try {
    const q = fictionRouter.query.value as Record<string, string>
    const { siteId = q.site, themeId = q.theme, cardId = q.card } = q
    const orgId = fictionUser.activeOrgId.value

    // create the router for the site
    await fictionRouterSites.create({ noBrowserNav: true, caller: 'SiteEditor' })

    const mountContext = getMountContext({ orgId, queryVars: { siteId, themeId, cardId }, siteMode: 'designer', caller: 'SiteEditor' })

    site.value = await loadSite({
      fictionSites,
      siteRouter: fictionRouterSites,
      mountContext,
    })

    if (!site.value) {
      await card.goto({ path: '/sites' })
      return
    }

    site.value.frame.init({ caller: 'SiteEditor' })

    site.value.events.on('setActiveCard', () => {
      site.value?.editorActivateTool({ toolId: 'cardEdit' })
    })

    fictionEnv.events.on('resetUi', (event) => {
      const { scope, trigger } = event.detail
      if (scope === 'iframe' && trigger !== 'routeChange')
        site.value?.editorActivateTool({ toolId: '' })
    })
  }
  catch (error) {
    console.error('Error loading site', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => {
  await fictionUser.userInitialized({ caller: 'SiteEditor' })
  await load()
})

onResetUi(() => {
  editing.value = false
})

async function save() {
  if (!site.value)
    throw new Error('No site to save')

  sending.value = 'save'

  // make sure any blur events are triggered
  resetUi({ scope: 'all', cause: 'saveSite', trigger: 'manualReset' })

  await site.value.save({ minTime: 500, scope: 'publish' })
  sending.value = ''
}

async function resetToPublished() {
  if (!site.value)
    throw new Error('No site to revert')
  const s = site.value
  const siteId = s.siteId

  const r = await s.settings.fictionSites.requests.ManageSite.projectRequest({
    _action: 'revertDraft',
    where: { siteId },
    caller: 'siteEditor',
  })

  if (r.status === 'success') {
    await site.value.update({ ...r.data }, { noSave: true, caller: 'resetToPublished' })
  }
}
</script>

<template>
  <div
    class="h-full w-full"
    :data-site-router-path="fictionRouterSites?.params.value.viewId ?? '[empty]'"
    :data-view-id="site?.currentViewId.value ?? '[empty]'"
    :data-page-id="site?.activePageId.value ?? '[empty]'"
    :data-theme-id="site?.themeId.value ?? '[empty]'"
    :data-active-pathname="site?.currentPath.value ?? '[empty]'"
  >
    <div v-if="loading" class="">
      <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
        <ElSpinner class="h-12 w-12" />
      </div>
    </div>

    <template v-else>
      <ViewEditor :tool-props="{ site, card }" :controller="site?.editorController" :card>
        <template #headerLeft>
          <div>
            <CardButton
              :card
              size="md"
              href="/"
              icon="i-tabler-arrow-left"
              design="link"
            />
          </div>
          <div class="flex space-x-1 font-semibold items-center">
            <span class="text-theme-500">Site Editor</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
            <XText v-if="site" v-model="site.title.value" title="Site Title" :is-editable="true" class="hover:bg-theme-100 hover:dark:bg-theme-700 whitespace-nowrap" />
          </div>
        </template>
        <template v-if="site" #headerRight>
          <div class="flex gap-2 items-center">
            <ElSavingSignal
              :is-dirty="site?.saveUtil.isDirty.value"
              data-test-id="draft-control-dropdown"
              :classes="{ text: 'hidden md:inline' }"
              ui-size="sm"
              class="mr-2"
            />
            <CardButton
              :card
              theme="default"
              target="_blank"
              size="md"
              icon="i-tabler-eye"
              design="ghost"
              data-test-id="viewSiteButton"
              :href="`${site.url.value}?_scope=draft`"
            >
              View Site
            </CardButton>
          </div>
          <CardButton
            v-if="site.editor.value.savedNeedsPublish"
            :card
            theme="primary"
            :loading="sending === 'save'"
            icon="i-tabler-upload"
            size="md"
            data-test-id="publishChangesButton"
            @click.prevent="save()"
          >
            Publish
          </CardButton>
          <CardButton
            v-else
            :card
            theme="primary"
            design="outline"
            :loading="sending === 'save'"
            icon="i-tabler-check"
            size="md"
            data-test-id="changesPublishedButton"
            @click.prevent="save()"
          >
            Published
          </CardButton>
        </template>
        <template #default>
          <El404 v-if="!site && !loading" title="Site Not Found" sub-title="Site is missing at this url" :buttons="[{ href: card.link('/sites'), label: 'View Sites' }]" />
          <SiteEditorFrame v-else class="h-full" :site="site" />
        </template>
      </ViewEditor>
    </template>
  </div>
</template>
