<script lang="ts" setup>
import type { LogoObject, Organization } from '@fiction/core'
import { determineMediaFormat, vue } from '@fiction/core'
import { googleFontsUtility } from '@fiction/core/utils/fonts'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import { twMerge } from 'tailwind-merge'
import XIcon from './XIcon.vue'

defineOptions({ name: 'XLogoType' })

const { logo = {}, classes = {}, mediaHandling = {}, org } = defineProps<{
  logo?: LogoObject
  classes?: { media?: string, text?: string, image?: string }
  alt?: string
  mediaHandling?: { height?: number, width?: number } // height or width in rem
  org?: Organization
}>()

const variant = vue.computed(() => {
  // Legacy behavior
  if (logo.variant) {
    return logo.variant
  }
  else if (logo.media?.url && !logo.typography?.label) {
    return 'media'
  }
  else {
    return 'typography'
  }
})

const containerRef = vue.ref<HTMLElement | null>(null)
const imageRef = vue.ref<HTMLImageElement | null>(null)
const svgRef = vue.ref<SVGElement | null>(null)

const activeLogo = vue.computed((): LogoObject => {
  const v = variant.value
  if (['brandLogo', 'brandName'].includes(v || '') && !org) {
    console.error('Organization object is required for brandLogo and brandName variants')
  }

  if (v === 'brandLogo' && org?.logo?.url) {
    return {
      variant: 'media',
      media: org.logo,
    }
  }

  if (v === 'brandName' && org) {
    return {
      variant: 'typography',
      typography: {
        label: org.orgName || 'Organization',
      },
    }
  }

  return logo
})

const media = vue.computed(() => activeLogo.value.media)
const mediaFormat = vue.computed(() => determineMediaFormat(activeLogo.value.media))

// Load Google Fonts for typography format
vue.watch(
  () => activeLogo.value.typography?.font,
  async (font) => {
    if (font) {
      await googleFontsUtility.loadFont(font)
    }
  },
  { immediate: true },
)

// Typography styles based on media config
const typographyStyle = vue.computed(() => {
  const t = activeLogo.value.typography
  if (!t)
    return {}

  return {
    fontFamily: t.font?.family,
    fontWeight: t.weight,
    lineHeight: t.lineHeight || '1.2',
    letterSpacing: t.letterSpacing,
    fontSize: activeLogo.value.scale ? `${activeLogo.value.scale}em` : 'inherit',
  }
})

// Handle container classes
const mediaClass = vue.computed(() => {
  const cls = [
    'relative',
    'inline-flex',
    'items-center',
  ]
  return twMerge(cls.join(' '), classes.media)
})

const imageClass = vue.computed(() => {
  const cls = [
    'object-contain',
    'transition-all',
    'duration-200',
  ]

  if (mediaFormat.value === 'image' || !mediaFormat.value) {
    cls.push('w-auto h-auto')
  }

  return twMerge(cls.join(' '), classes.image)
})

// Handle SVG specific sizing and scaling
function handleSvgContent() {
  if (mediaFormat.value === 'html' && svgRef.value) {
    const svg = svgRef.value
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')

    // Remove fixed dimensions if present
    svg.removeAttribute('width')
    svg.removeAttribute('height')
  }
}

// Image load handler to ensure proper sizing
function handleImageLoad() {
  if (imageRef.value && containerRef.value) {
    const img = imageRef.value
    const container = containerRef.value
    const imgRatio = img.naturalWidth / img.naturalHeight
    const containerRatio = container.clientWidth / container.clientHeight

    if (imgRatio > containerRatio) {
      // Image is wider than container
      img.style.width = '100%'
      img.style.height = 'auto'
    }
    else {
      // Image is taller than container
      img.style.width = 'auto'
      img.style.height = '100%'
    }
  }
}

// Add computed style for natural size scaling
const elementStyle = vue.computed(() => {
  const styles: Record<string, string> = {}

  // Handle media-handling dimensions first
  if (mediaHandling) {
    if (mediaHandling.height) {
      styles.height = `${mediaHandling.height}rem`
    }
    if (mediaHandling.width) {
      styles.width = `${mediaHandling.width}rem`
    }
  }

  // Apply scale after dimensions if present
  if (activeLogo.value.scale && activeLogo.value.scale !== 1) {
    const scale = activeLogo.value.scale
    // Scale from the base rem size if media-handling is present
    if (mediaHandling?.height) {
      styles.height = `${mediaHandling.height * scale}rem`
    }
    if (mediaHandling?.width) {
      styles.width = `${mediaHandling.width * scale}rem`
    }
    // If no media-handling, scale naturally
    if (!mediaHandling?.height && !mediaHandling?.width) {
      styles.transform = `scale(${scale})`
      styles.transformOrigin = 'left center'
    }
  }

  return styles
})

// ResizeObserver for container size changes
let resizeObserver: ResizeObserver | undefined
vue.onMounted(() => {
  handleSvgContent()

  resizeObserver = new ResizeObserver(() => {
    if (mediaFormat.value === 'image' || !mediaFormat.value) {
      handleImageLoad()
    }
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

vue.onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    v-if="variant === 'media'"
    ref="containerRef"
    :data-media-format="mediaFormat || 'none'"
    :data-media-url="media?.url || 'no-url'"
    :class="mediaClass"
  >
    <!-- Image/URL Format -->
    <img
      v-if="(mediaFormat === 'image' || !mediaFormat) && media?.url"
      ref="imageRef"
      :src="media.url"
      :alt="alt || media?.alt || (org?.orgName ? `${org.orgName} logo` : 'Logo')"
      :class="imageClass"
      :style="elementStyle"
      @load="handleImageLoad"
    >

    <!-- Video Format -->
    <video
      v-else-if="mediaFormat === 'video' && media?.url"
      :src="media.url"
      :alt="alt || media?.alt || (org?.orgName ? `${org.orgName} logo` : 'Logo')"
      :class="imageClass"
      autoplay
      loop
      muted
      :style="elementStyle"
    />

    <!-- HTML/SVG Format -->
    <div
      v-else-if="mediaFormat === 'html'"
      class="h-full inline-flex items-center justify-center"
      :style="elementStyle"
    >
      <div
        ref="svgRef"
        class="svg-wrapper h-full inline-flex items-center justify-center"
        v-html="media?.html"
      />
    </div>

    <!-- Icon Format -->
    <div v-else-if="mediaFormat === 'icon'" class="h-full">
      <XIcon
        v-if="media"
        :media="media"
        class="h-full w-full aspect-square"
        :class="imageClass"
        :style="elementStyle"
      />
    </div>

    <!-- Component Format -->
    <component
      :is="media?.el"
      v-else-if="mediaFormat === 'component'"
      v-bind="media?.props"
      :class="imageClass"
      :style="elementStyle"
    />
  </div>
  <div
    v-else
    class="x-logo-type flex items-center gap-4"
    :class="classes.text"
    :data-logo-variant="variant"
    :data-media-scale="activeLogo?.scale"
  >
    <ElAvatar v-if="org?.avatar?.url" :org class="size-8" />
    <span :style="typographyStyle">
      {{ activeLogo.typography?.label || (org?.orgName || 'Logo') }}
    </span>
  </div>
</template>

<style scoped>
.svg-wrapper :deep(svg) {
  height: 100%;
  max-height: 100%;
}
</style>
