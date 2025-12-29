<template>
  <Form v-slot="$form" :resolver :initialValues @submit="onFormSubmit">
    <Menubar breakpoint="0px" class="mb-4">
      <template #start>
        <router-link :to="{ name: 'statistics' }" class="mr-4">
          <Logo class="size-16" />
        </router-link>
      </template>
      <template #end>
        <div class="flex items-center gap-4">
          <Button
            v-if="appStore.isSettingFilled"
            type="button"
            severity="secondary"
            label="Cancel"
            icon="pi pi-times"
            @click="gotoHome()"
          />
          <Button type="submit" severity="primary" label="Save" icon="pi pi-save" />
        </div>
      </template>
    </Menubar>
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
                show-clear
                show-time
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
                v-keyfilter.int
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
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Form } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { Menubar, Card, InputText, Password, InputNumber, DatePicker, Message, Button, SelectButton } from 'primevue'

import { ApplicationSetting } from '../../../types'

import { useAppStore } from '../stores/app'
import Logo from '../components/Logo.vue'

const router = useRouter()
const appStore = useAppStore()

const toast = useToast()

const themeOptions = ref(['light', 'dark'])

const darkMode = computed({
  get: () => (appStore.darkMode ? 'dark' : 'light'),
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

const gotoHome = () => router.push({ name: 'home' })

const onFormSubmit = async ({ states, errors }) => {
  if (Object.keys(errors).length === 0) {
    const payload: Partial<ApplicationSetting> = {
      stravaClientId: states.stravaClientId.value,
      stravaClientSecret: states.stravaClientSecret.value,
      maintenanceHours: states.maintenanceHours.value,
      lastMaintenance: states.lastMaintenance.value === null ? null : states.lastMaintenance.value.getTime()
    }

    try {
      await appStore.saveSettings(payload)
      await appStore.readSettings()

      toast.add({ severity: 'success', summary: 'Done', detail: 'Settings saved successfully', life: 3000 })
      gotoHome()
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Settings could not be saved', life: 3000 })
    }
  }
}
</script>
