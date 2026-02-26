<template>
  <div v-if="!appStore.isFetching" class="flex flex-col gap-4">
    <Card v-if="appStore.settings">
      <template #subtitle>
        <span class="uppercase">{{ $t('SUSPENSION_USAGE') }}</span>
      </template>
      <template #content>
        <Suspensions
          :activities="appStore.activities"
          :maintenance-hours="appStore.settings.maintenanceHours"
          :last-maintenance="appStore.settings.lastMaintenance"
        />
      </template>
    </Card>

    <Card>
      <template #content>
        <Fieldset :legend="$t('SUMMARY')">
          <div class="pt-3 grid grid-cols-3 gap-8">
            <Time :seconds="appStore.totalTime" :label="$t('TOTAL_TIME')" />

            <Distance :distance="appStore.totalDistance" :label="$t('TOTAL_DISTANCE')" />

            <Elevation :elevation="appStore.maxElevation" :label="$t('HIGHEST_ELEVATION')" />

            <Time :seconds="appStore.avgTime" :label="$t('AVERAGE_TIME')" />

            <Distance :distance="appStore.avgDistance" :label="$t('AVERAGE_DISTANCE')" />

            <Elevation :elevation="appStore.avgElevation" :label="$t('AVERAGE_ELEVATION')" />
          </div>
        </Fieldset>
      </template>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { Card, Fieldset } from 'primevue'
// STORES
import { useAppStore } from '@renderer/stores/app'
// COMPONENTS
import Time from '@renderer/components/Time.vue'
import Distance from '@renderer/components/Distance.vue'
import Elevation from '@renderer/components/Elevation.vue'
import Suspensions from '@renderer/components/Suspensions.vue'

const appStore = useAppStore()
</script>
