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
import Time from '../components/Time.vue'

const props = defineProps<{
  activities: Array<any>
  maintenanceHours: number
  lastMaintenance: number | null
  darkMode: boolean
}>()

const getLastMaintenance = () => {
  let result = ''
  if (props.lastMaintenance !== null && props.lastMaintenance > 0) {
    //TODO: parse number...
  } else {
    const maxDate = '9999-12-31T23:59:59Z'
    result = props.activities
      .map(x => x.start_date_local || maxDate)
      .sort()
      .shift()
  }

  return result
}

const lastMaintenanceDate = getLastMaintenance()

const maxUsageSeconds = props.maintenanceHours * 60 * 60
// const maxUsageSeconds = 500 * 60 * 60

const secondsSinceLast = props.activities
  .filter(a => a.start_date_local >= lastMaintenanceDate)
  .reduce((acc, activity) => acc + activity.moving_time, 0)

const secondsBeforeNext = maxUsageSeconds - secondsSinceLast

const usagePercentage = Math.round((100 * secondsSinceLast) / maxUsageSeconds)
</script>
