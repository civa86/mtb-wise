<template>
  <div v-if="!appStore.isFetching" class="flex flex-col gap-4">
    <Card v-if="appStore.settings">
      <template #subtitle>
        <span class="uppercase">Suspensions usage</span>
      </template>
      <template #content>
        <Suspensions
          :activities="appStore.activities"
          :maintenance-hours="appStore.settings.maintenanceHours"
          :last-maintenance="appStore.settings.lastMaintenance"
          :dark-mode="appStore.darkMode"
        />
      </template>
    </Card>

    <div class="grid grid-cols-3 gap-4">
      <Card>
        <template #content>
          <Time :seconds="appStore.totalTime" :dark-mode="appStore.darkMode" label="Total Time" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Distance :distance="appStore.totalDistance" :dark-mode="appStore.darkMode" label="Total Kilometers" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Elevation :elevation="appStore.maxElevation" :dark-mode="appStore.darkMode" label="Highest +Elevation" />
        </template>
      </Card>

      <Card>
        <template #content>
          <Time :seconds="appStore.avgTime" :dark-mode="appStore.darkMode" label="Average Time" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Distance :distance="appStore.avgDistance" :dark-mode="appStore.darkMode" label="Average Kilometers" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Elevation :elevation="appStore.avgElevation" :dark-mode="appStore.darkMode" label="Average +Elevation" />
        </template>
      </Card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Card from 'primevue/card'
import { useAppStore } from '../stores/app'

import Time from '../components/Time.vue'
import Distance from '../components/Distance.vue'
import Elevation from '../components/Elevation.vue'
import Suspensions from '../components/Suspensions.vue'

const appStore = useAppStore()
</script>
