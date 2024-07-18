<script lang="ts" setup>
import type mapboxgl from 'mapbox-gl'
import { isDarkOrLightMode, vue } from '@fiction/core'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'

import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapSchemaConfig } from '.'

const props = defineProps({
  container: { type: String, default: 'mapbox' },
  mapConfig: { type: Object as vue.PropType<MapSchemaConfig>, default: () => ({}) },
  mapboxAccessToken: { type: String, default: '' },
  animate: { type: Boolean, default: true },
})

const fullMapConfig = vue.computed(() => {
  return {
    lng: -117.778_471,
    lat: 33.535_439,
    zoom: 14,
    pitch: 0,
    mapStyle: 'streets',
    markers: [],
    ...props.mapConfig,
  }
})

const map = vue.shallowRef<mapboxgl.Map>()
const markers = vue.shallowRef<mapboxgl.Marker[]>([])

const mode = vue.computed(() => {
  if (!props.container || typeof document === 'undefined')
    return 'light'

  const el = document.querySelector(`#${props.container}`)
  return el ? isDarkOrLightMode(el as HTMLElement) : 'light'
})

const styleUrl = vue.computed(() => {
  const styleMap = {
    'streets': 'mapbox://styles/mapbox/streets-v12',
    'outdoors': 'mapbox://styles/mapbox/outdoors-v12',
    'light': 'mapbox://styles/mapbox/light-v11',
    'dark': 'mapbox://styles/mapbox/dark-v11',
    'satellite': 'mapbox://styles/mapbox/satellite-v9',
    'satellite-streets': 'mapbox://styles/mapbox/satellite-streets-v12',
    'navigation-day': 'mapbox://styles/mapbox/navigation-day-v1',
    'navigation-night': 'mapbox://styles/mapbox/navigation-night-v1',
  }

  const r = () => mode.value === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
  // Check for the special 'mode' case or use the default style based on mode
  if (fullMapConfig.value.mapStyle === 'mode')
    return r()

  // Return the mapped style or default to 'dark' or 'light' based on the mode
  return styleMap[fullMapConfig.value.mapStyle as keyof typeof styleMap] || (r())
})

const cleanups: (() => void)[] = []

async function renderMap() {
  const { default: mapboxgl } = await import('mapbox-gl')

  mapboxgl.accessToken = props.mapboxAccessToken || 'pk.eyJ1IjoicmF5bG9wZXphbGVtYW4iLCJhIjoiY2trcHc3ODY4MGNycTJwcGE0MW5pcDNnMSJ9.gHtN2ew2g26gY7KSMzFBpw'

  const c = fullMapConfig.value

  const latlng = { lat: c.lat, lng: c.lng }

  const style = styleUrl.value
  map.value = new mapboxgl.Map({
    container: props.container,
    zoom: c.zoom,
    center: latlng,
    style,
  })

  // Dynamically create and style SVG element
  const createCustomMarker = (clr: { bg: string, stroke: string }) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
    <path fill="${clr.bg}" stroke="${clr.stroke}" stroke-width="0.7" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" filter="url(#dropshadow)"/>
  </svg>`

    const encodedSVG = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')
    const img = document.createElement('img')
    img.src = `data:image/svg+xml;charset=utf-8,${encodedSVG}`
    img.style.width = '50px' // Set to the size you want
    img.style.height = '50px'
    return img
  }

  map.value.on('load', () => {
    const m = map.value

    if (!m)
      throw new Error('Map not initialized')

    // Disable zoom on scroll
    m.scrollZoom.disable()

    // Disable drag
    m.dragPan.disable()

    // Disable zoom on double-click
    m.doubleClickZoom.disable()

    const markerColor = ['dark', 'night'].some(_ => styleUrl.value.includes(_)) ? { bg: '#fff', stroke: '#000' } : { bg: '#3452ff', stroke: '#FFF' }

    const sw1 = vue.watch(() => c.markers, (newMarkers) => {
      markers.value.forEach(marker => marker.remove())
      markers.value = []
      newMarkers.forEach((marker) => {
        const customMarkerEl = createCustomMarker(markerColor)
        const m = new mapboxgl.Marker({ element: customMarkerEl, anchor: 'bottom' })
          .setLngLat([marker.lng, marker.lat])
          .addTo(map.value!)

        if (marker.label) {
          const tooltip = new mapboxgl.Popup({ offset: 50 })
            .setHTML(marker.label) // Assuming marker has a tooltip property
            .addTo(map.value!)

          m.setPopup(tooltip)
        }

        markers.value.push(m)
      })
    }, { deep: true, immediate: true })

    const sw2 = vue.watch(() => props.mapConfig, () => {
      const v = fullMapConfig.value
      if (map.value && v) {
        map.value.setPitch(v.pitch || 0) // tilt view
        map.value.setCenter({ lat: v.lat, lng: v.lng })
        map.value.setZoom(v.zoom)
        map.value.setStyle(styleUrl.value)
      }
    }, { deep: true, immediate: true })

    cleanups.push(() => {
      sw1()
      sw2()
    })
  })
}

vue.onMounted(() => {
  renderMap()
})

vue.onUnmounted(() => {
  cleanups.forEach(c => c())
  markers.value.forEach(marker => marker.remove())
  map.value?.remove()
})
</script>

<template>
  <AnimClipPath :enabled="animate" class="w-full h-full outline-none focus:outline-none focus:ring-0 ">
    <div
      :id="container"
      class="h-full cursor-auto text-black font-bold font-sans text-xs"
    />
  </AnimClipPath>
</template>

<style :lang="less">
:root {
  --mapbox-tooltip-color: rgba(0,0,0,.75);
}
.mapboxgl-ctrl-attrib{display: none !important;}
.mapboxgl-canvas-container.mapboxgl-interactive{cursor: auto !important;}
.mapboxgl-popup-tip{
  border-top-color: var(--mapbox-tooltip-color) !important;
}
.mapboxgl-popup-content {
  background-color: var(--mapbox-tooltip-color) !important;
  filter: drop-shadow(0 0 0.5rem rgba(0,0,0,.2));
  padding: 1em 2em;
  border-radius: 1em;
  font-weight: 700;
  color: #fff;
  .mapboxgl-popup-close-button{
    display: none;
  }
}
</style>import { watch } from 'fs-extra'
import { onMounted } from 'vue'
