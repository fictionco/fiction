<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import { vue } from '@factor/api'

const props = defineProps({
  container: { type: String, default: 'mapbox' },
  longitude: { type: Number, default: -117.747_947 },
  latitude: { type: Number, default: 33.652_737 },
  zoom: { type: Number, default: 8 },
})
vue.onMounted(() => {
  mapboxgl.accessToken
    = 'pk.eyJ1IjoicmF5bG9wZXphbGVtYW4iLCJhIjoiY2trcHc3ODY4MGNycTJwcGE0MW5pcDNnMSJ9.gHtN2ew2g26gY7KSMzFBpw'

  const mapbox = new mapboxgl.Map({
    container: props.container,
    minZoom: 10,
    zoom: props.zoom,
    pitch: 60,
    center: [props.longitude, props.latitude], // [-117.783652, 33.541252]
    style: {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          url: 'mapbox://mapbox.satellite',
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': 'rgb(4,7,14)',
          },
        },
        {
          id: 'satellite',
          type: 'raster',
          source: 'satellite',
        },
      ],
    },
  })

  // Disable zoom on scroll
  mapbox.scrollZoom.disable()

  // Disable zoom on double-click
  mapbox.doubleClickZoom.disable()

  // Location Marker
  new mapboxgl.Marker().setLngLat([-117.776_98, 33.535_96]).addTo(mapbox)
})
</script>

<template>
  <div class="mapper-wrap h-full">
    <div class="mapper h-full overflow-hidden">
      <div
        :id="container"
        class="h-full w-full outline-none focus:outline-none focus:ring-0"
      />
    </div>
  </div>
</template>

<style lang="less">
.mapboxgl-control-container {
  display: none;
}
</style>
