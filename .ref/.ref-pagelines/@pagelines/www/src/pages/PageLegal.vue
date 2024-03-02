<script lang="ts" setup>
import type {
  FactorRouter,
} from '@factor/api'
import {
  useMeta,
  useService,
  vue,
} from '@factor/api'
import SiteWrap from './SiteWrap.vue'
import * as privacy from './legalPrivacy.md'
import * as terms from './legalTerms.md'
import * as gdpr from './legalGdpr.md'
import * as ccpa from './legalCcpa.md'

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()

const mode = vue.computed(() => {
  const m = {
    privacy,
    terms,
    gdpr,
    ccpa,
  }
  const n = factorRouter.current.value.name as keyof typeof m
  return m[n] || {}
})

useMeta({
  title: mode.value.attributes.title,
  meta: [
    {
      name: `description`,
      content:
        mode.value.attributes.description
        || `Information about ${mode.value.attributes.title}`,
    },
  ],
})
</script>

<template>
  <SiteWrap>
    <div class="font-brand">
      <div class="my-12 text-center">
        <h1 class="text-4xl font-bold">
          {{ mode.attributes.title }}
        </h1>
      </div>
      <div class="entry m-6 mx-auto max-w-prose" v-html="mode.bodyHtml" />
    </div>
  </SiteWrap>
</template>

<style lang="less">
@import "@factor/ui/entry.less";
.entry {
  > p {
    &:first-of-type {
      &::first-letter {
        font-size: 327%;
        line-height: 1;
        margin-right: 0.3rem;
        float: left;
        margin-top: -0.1rem;
      }
    }
  }
}
</style>
