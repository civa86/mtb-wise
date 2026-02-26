<template>
  <div id="map" class="w-full h-screen"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import PolyUtils from 'polyline-encoded'
import { $dt } from '@primeuix/themes'
// TYPES
import { Activity } from '@types'
// STORES
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()
const route = useRoute()

const activity = ref<Activity | null>(null)

document.title = ''

onMounted(async () => {
  activity.value = await appStore.fetchActivity(route.params.id as string)
  if (activity.value) {
    document.title = activity.value.name
    const map = L.map('map').setView(activity.value.start_latlng, 12)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map)
    const coordinates = PolyUtils.decode(activity.value.map.polyline)
    L.polyline(coordinates, {
      color: $dt('orange.600').value,
      weight: 3,
      opacity: 1,
      lineJoin: 'round'
    }).addTo(map)
  }
})
</script>
