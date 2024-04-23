<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import { vue } from '@fiction/core'
import { onMounted, watch } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapSchemaConfig } from '.'

const props = defineProps({
  container: { type: String, default: 'mapbox' },
  mapConfig: { type: Object as vue.PropType<MapSchemaConfig>, default: () => ({}) },
  mapboxAccessToken: { type: String, default: '' },
  // lng: { type: Number, default: -117.778_471 },
  // lat: { type: Number, default: 33.535_439 },
  // zoom: { type: Number, default: 14 },
  // pitch: { type: Number, default: 0 },
  // mapStyle: { type: String as vue.PropType<'satellite' | 'streets' | 'outdoors' | 'dark' | 'light' | 'satellite-streets' | 'navigation-day' | 'navigation-night'>, default: 'street' },
  //
  // markers: { type: Array as vue.PropType<{ lat: number, lng: number }[]>, default: () => [] },
  // aspect: { type: String as vue.PropType<'aspect-[16/9]' | 'aspect-[2/1]'>, default: 'aspect-[2/1]' },
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

const map = vue.ref<mapboxgl.Map>()
const markers = vue.ref<mapboxgl.Marker[]>([])

const styleUrl = vue.computed(() => {
  switch (fullMapConfig.value.mapStyle) {
    case 'streets':
      return 'mapbox://styles/mapbox/streets-v12'
    case 'outdoors':
      return 'mapbox://styles/mapbox/outdoors-v12'
    case 'light':
      return 'mapbox://styles/mapbox/light-v11'
    case 'dark':
      return 'mapbox://styles/mapbox/dark-v11'
    case 'satellite':
      return 'mapbox://styles/mapbox/satellite-v9'
    case 'satellite-streets':
      return 'mapbox://styles/mapbox/satellite-streets-v12'
    case 'navigation-day':
      return 'mapbox://styles/mapbox/navigation-day-v2'
    case 'navigation-night':
      return 'mapbox://styles/mapbox/navigation-night-v2'
    default:
      return 'mapbox://styles/mapbox/streets-v12' // Default style
  }
})
function renderMap() {
  mapboxgl.accessToken = props.mapboxAccessToken || 'pk.eyJ1IjoicmF5bG9wZXphbGVtYW4iLCJhIjoiY2trcHc3ODY4MGNycTJwcGE0MW5pcDNnMSJ9.gHtN2ew2g26gY7KSMzFBpw'

  const c = fullMapConfig.value

  const latlng = { lat: c.lat, lng: c.lng }

  const style = styleUrl.value
  map.value = new mapboxgl.Map({
    container: props.container,
    minZoom: 12,
    zoom: c.zoom,
    center: latlng,
    style,
  })

  c.markers.forEach((marker) => {
    if (map.value)
      new mapboxgl.Marker().setLngLat([marker.lng, marker.lat]).addTo(map.value)
  })

  // Disable zoom on scroll
  map.value.scrollZoom.disable()

  // Disable zoom on double-click
  map.value.doubleClickZoom.disable()

  watch(() => c.markers, (newMarkers) => {
    markers.value.forEach(marker => marker.remove())
    markers.value = []
    newMarkers.forEach((marker) => {
      const m = new mapboxgl.Marker()
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.value!)
      markers.value.push(m)
    })
  }, { deep: true })

  watch(() => props.mapConfig, () => {
    const v = fullMapConfig.value
    if (map.value && v) {
      map.value.setPitch(v.pitch || 0) // tilt view
      map.value.setCenter({ lat: v.lat, lng: v.lng })
      map.value.setZoom(v.zoom)
      map.value.setStyle(styleUrl.value)
    }
  })
}
onMounted(() => {
  renderMap()
})
</script>

<template>
  <div
    :id="container"
    class=" w-full outline-none focus:outline-none focus:ring-0"
  />
</template>

<style :lang="less">
.mapboxgl-ctrl-attrib{display: none !important;}
</style>
