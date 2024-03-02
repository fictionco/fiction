<template>
  <div class="mapper-wrap lg:-mr-120">
    <div class="mapper rounded-2xl overflow-hidden">
      <div
        :id="container"
        class="w-full h-132 outline-none focus:ring-0 focus:outline-none"
      />
    </div>
  </div>
</template>
<script lang="ts">
import mapboxgl from "mapbox-gl"
import { onMounted } from "vue"
export default {
  props: {
    container: { type: String, default: "mapbox" },
    longitude: { type: Number, default: -117.778_471 },
    latitude: { type: Number, default: 33.535_439 },
    zoom: { type: Number, default: 16 },
  },
  setup(props) {
    onMounted(() => {
      mapboxgl.accessToken =
        "pk.eyJ1IjoicmF5bG9wZXphbGVtYW4iLCJhIjoiY2trcHc3ODY4MGNycTJwcGE0MW5pcDNnMSJ9.gHtN2ew2g26gY7KSMzFBpw"

      const mapbox = new mapboxgl.Map({
        container: props.container,
        minZoom: 12,
        zoom: props.zoom,
        center: [props.longitude, props.latitude], //[-117.783652, 33.541252]
        style: {
          version: 8,
          sources: {
            satellite: {
              type: "raster",
              url: "mapbox://mapbox.satellite",
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "background",
              type: "background",
              paint: {
                "background-color": "rgb(4,7,14)",
              },
            },
            {
              id: "satellite",
              type: "raster",
              source: "satellite",
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

    return {}
  },
}
</script>
