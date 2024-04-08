<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import type { vue } from '@fiction/core'
import { onMounted } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  container: { type: String, default: 'mapbox' },
  lng: { type: Number, default: -117.778_471 },
  lat: { type: Number, default: 33.535_439 },
  zoom: { type: Number, default: 14 },
  mapStyle: { type: String as vue.PropType<'satellite' | 'street'>, default: 'street' },
  mapboxAccessToken: { type: String, default: '' },
  markers: { type: Array as vue.PropType<{ lat: number, lng: number }[]>, default: () => [] },
})
onMounted(() => {
  mapboxgl.accessToken = props.mapboxAccessToken || 'pk.eyJ1IjoicmF5bG9wZXphbGVtYW4iLCJhIjoiY2trcHc3ODY4MGNycTJwcGE0MW5pcDNnMSJ9.gHtN2ew2g26gY7KSMzFBpw'

  const latlng = { lat: props.lat, lng: props.lng }

  const style = props.mapStyle === 'satellite' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12'
  const map = new mapboxgl.Map({

    container: props.container,
    minZoom: 12,
    zoom: props.zoom,
    center: latlng,
    style,
  })

  props.markers.forEach((marker) => {
    new mapboxgl.Marker()
      .setLngLat([marker.lng, marker.lat])
      .addTo(map)
  })

  // Disable zoom on scroll
  map.scrollZoom.disable()

  // Disable zoom on double-click
  map.doubleClickZoom.disable()
})
</script>

<template>
  <div class="mapper-wrap">
    <div class="mapper overflow-hidden">
      <div
        :id="container"
        class="h-[50dvh] lg:h-[90dvh] w-full outline-none focus:outline-none focus:ring-0"
      />
    </div>
  </div>
</template>

<style :lang="less">
.mapboxgl-ctrl-attrib{display: none !important;}
</style>
