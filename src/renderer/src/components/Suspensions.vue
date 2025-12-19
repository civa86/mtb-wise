<template>
  <div>
    <ProgressBar :value="usagePercentage"></ProgressBar>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <Fieldset legend="SINCE LAST MAINTENANCE">
      <Time :seconds="secondsSinceLast" :dark-mode="darkMode" />
    </Fieldset>
    <Fieldset legend="BEFORE NEXT MAINTENANCE">
      <Time :seconds="secondsBeforeNext" :dark-mode="darkMode" />
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from 'primevue/progressbar'
import Fieldset from 'primevue/fieldset'
import { getActivitiesMinDate } from '../utils'
import Time from '../components/Time.vue'

const props = defineProps<{
  activities: Array<any>
  maintenanceHours: number
  lastMaintenance: number | null
  darkMode: boolean
}>()

const getLastMaintenance = () => (props.lastMaintenance ? '' : getActivitiesMinDate(props.activities))

const lastMaintenanceDate = getLastMaintenance()

const maxUsageSeconds = props.maintenanceHours * 60 * 60
// const maxUsageSeconds = 500 * 60 * 60

const secondsSinceLast = props.activities
  .filter(a => a.start_date >= lastMaintenanceDate)
  .reduce((acc, activity) => acc + activity.moving_time, 0)

const secondsBeforeNext = maxUsageSeconds - secondsSinceLast

const usagePercentage = Math.round((100 * secondsSinceLast) / maxUsageSeconds)
</script>
