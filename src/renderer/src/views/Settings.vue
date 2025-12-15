<template>
  <div class="flex flex-col gap-4 w-full">
    <Card class="w-full">
      <template #subtitle>
        <div class="flex items-center gap-2 border-b border-orange-600 pb-1">
          <span>APPLICATION</span>
        </div>
      </template>
      <template #content>
        <div class="flex gap-2 items-center">
          <label class="uppercase text-sm">Theme</label>
          <SelectButton :options="themeOptions" v-model="darkMode">
            <template #option="{ option }">
              <div class="flex gap-2 items-center">
                <i :class="{ 'pi pi-sun': option === 'light', 'pi pi-moon': option === 'dark' }" />
                <span class="uppercase text-sm">{{ option }}</span>
              </div>
            </template>
          </SelectButton>
        </div>
      </template>
    </Card>
    <Form v-slot="$form" :resolver :initialValues @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <Card class="w-full">
        <template #subtitle>
          <div class="flex items-center gap-2 border-b border-orange-600 pb-1">
            <span>STRAVA</span>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-4 gap-4">
            <!-- STRAVA CLIENT ID -->
            <div>
              <label class="uppercase text-sm">Client ID</label>
              <InputText name="stravaClientId" :model-value="initialValues.stravaClientId" type="text" fluid />
              <Message v-if="$form.stravaClientId?.invalid" severity="error" size="small" variant="simple">
                {{ $form.stravaClientId.error?.message }}
              </Message>
            </div>
            <!-- STRAVA CLIENT SECRET -->
            <div class="col-span-3">
              <label class="uppercase text-sm">Strava Client Secret</label>
              <Password
                name="stravaClientSecret"
                :model-value="initialValues.stravaClientSecret"
                toggleMask
                fluid
                :feedback="false"
              />
              <Message v-if="$form.stravaClientSecret?.invalid" severity="error" size="small" variant="simple">
                {{ $form.stravaClientSecret.error?.message }}
              </Message>
            </div>
          </div>
        </template>
      </Card>
      <Card class="w-full">
        <template #subtitle>
          <div class="flex items-center gap-2 border-b border-orange-600 pb-1">
            <span>BIKE MAINTENANCE</span>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-2 gap-4">
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
        </template>
      </Card>
      <div class="flex items-center justify-end">
        <Button class="w-1/3" type="submit" severity="primary" label="Save" icon="pi pi-save" />
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from '@primevue/forms'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Message from 'primevue/message'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import { useAppStore } from '../stores/app'
import { ApplicationSetting } from '../../../types'

const router = useRouter()
const appStore = useAppStore()

const themeOptions = ref(['light', 'dark'])

const darkMode = computed({
  get: () => {
    console.log('asd')
    return appStore.darkMode ? 'dark' : 'light'
  },
  set: () => appStore.toggleDarkMode()
})

const resolver = ({ values }) => {
  const errors: Record<string, Array<object>> = {}

  if (!values.stravaClientId) errors.stravaClientId = [{ message: 'Strava Client ID is required.' }]
  if (!values.stravaClientSecret) errors.stravaClientSecret = [{ message: 'Strava Client Secret is required.' }]
  if (!values.maintenanceHours) errors.maintenanceHours = [{ message: 'Maintenance Hours is required.' }]

  return { values, errors }
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

    router.push({ name: 'statistics' })
  }
}
</script>
