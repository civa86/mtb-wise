<template>
  <div class="flex justify-center">
    <Card class="w-full">
      <template #title>
        <div class="flex items-center gap-2 border-b pb-2">
          <i class="pi pi-cog" style="font-size: 1.5rem"></i>
          <span>Settings</span>
        </div>
      </template>
      <template #content>
        <Form v-slot="$form" :resolver :initialValues @submit="onFormSubmit" class="mt-2 flex flex-col gap-4 w-full">
          <div class="flex flex-col gap-4">
            <!-- STRAVA CLIENT ID -->
            <div>
              <label class="uppercase text-sm">Strava Client ID</label>
              <InputText name="stravaClientId" :model-value="initialValues.stravaClientId" type="text" fluid />
              <Message v-if="$form.stravaClientId?.invalid" severity="error" size="small" variant="simple">
                {{ $form.stravaClientId.error?.message }}
              </Message>
            </div>
            <!-- STRAVA CLIENT SECRET -->
            <div>
              <label class="uppercase text-sm">Strava Client Secret</label>
              <InputText name="stravaClientSecret" :model-value="initialValues.stravaClientSecret" type="text" fluid />
              <Message v-if="$form.stravaClientSecret?.invalid" severity="error" size="small" variant="simple">
                {{ $form.stravaClientSecret.error?.message }}
              </Message>
            </div>
            <!-- LAST MAINTENANCE DATE -->
            <div>
              <label class="uppercase text-sm">Last Maintenance Date</label>
              <DatePicker
                name="lastMaintenance"
                :model-value="initialValues.lastMaintenance"
                dateFormat="dd/mm/yy"
                showClear
                fluid
              />
              <Message v-if="$form.lastMaintenance?.invalid" severity="error" size="small" variant="simple">
                {{ $form.lastMaintenance.error?.message }}
              </Message>
            </div>

            <!-- MAINTENANCE HOURS -->
            <div>
              <label class="uppercase text-sm">Maintenance Hours</label>
              <InputNumber
                name="maintenanceHours"
                :model-value="initialValues.maintenanceHours"
                inputId="integeronly"
                :useGrouping="false"
                :min="1"
                :max="999"
                fluid
              />
              <Message v-if="$form.maintenanceHours?.invalid" severity="error" size="small" variant="simple">
                {{ $form.maintenanceHours.error?.message }}
              </Message>
            </div>
          </div>
          <Button type="submit" severity="primary" label="Save" icon="pi pi-save" />
        </Form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { Form } from '@primevue/forms'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { useAppStore } from '../stores/app'
import { ApplicationSetting } from '../../../types'

const router = useRouter()
const appStore = useAppStore()

const resolver = ({ values }) => {
  const errors: Record<string, Array<object>> = {}

  if (!values.stravaClientId) errors.stravaClientId = [{ message: 'Strava Client ID is required.' }]
  if (!values.stravaClientSecret) errors.stravaClientSecret = [{ message: 'Strava Client Secret is required.' }]
  if (!values.maintenanceHours) errors.maintenanceHours = [{ message: 'Maintenance Hours is required.' }]

  return {
    values, // (Optional) Used to pass current form values to submit event.
    errors
  }
}

const initialValues = {
  stravaClientId: appStore.settings?.stravaClientId || '',
  stravaClientSecret: appStore.settings?.stravaClientSecret || '',
  lastMaintenance:
    appStore.settings && appStore.settings.lastMaintenance ? new Date(appStore.settings.lastMaintenance) : null,
  maintenanceHours: appStore.settings?.maintenanceHours
}

const onFormSubmit = async ({ states, errors }) => {
  if (Object.keys(errors).length === 0) {
    const payload: Partial<ApplicationSetting> = {
      stravaClientId: states.stravaClientId.value,
      stravaClientSecret: states.stravaClientSecret.value,
      maintenanceHours: states.maintenanceHours.value,
      lastMaintenance: states.lastMaintenance.value === null ? null : states.lastMaintenance.value.getTime()
    }
    await appStore.saveSettings(payload)
    await appStore.readSettings()

    router.push({ name: 'main' })
  }
}
</script>
