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

    <Card>
      <template #content>
        <Fieldset legend="SUMMARY">
          <div class="grid grid-cols-3 gap-8">
            <Time :seconds="appStore.totalTime" :dark-mode="appStore.darkMode" label="Total Time" />

            <Distance :distance="appStore.totalDistance" :dark-mode="appStore.darkMode" label="Total Kilometers" />

            <Elevation :elevation="appStore.maxElevation" :dark-mode="appStore.darkMode" label="Highest +Elevation" />

            <Time :seconds="appStore.avgTime" :dark-mode="appStore.darkMode" label="Average Time" />

            <Distance :distance="appStore.avgDistance" :dark-mode="appStore.darkMode" label="Average Kilometers" />

            <Elevation :elevation="appStore.avgElevation" :dark-mode="appStore.darkMode" label="Average +Elevation" />
          </div>
        </Fieldset>
      </template>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import Card from 'primevue/card'
import Fieldset from 'primevue/fieldset'

import { useAppStore } from '../stores/app'

import Time from '../components/Time.vue'
import Distance from '../components/Distance.vue'
import Elevation from '../components/Elevation.vue'
import Suspensions from '../components/Suspensions.vue'

const appStore = useAppStore()
</script>
