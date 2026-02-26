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
            :label="$t('CANCEL')"
            icon="pi pi-times"
            @click="gotoHome()"
          />
          <Button type="submit" severity="primary" :label="$t('SAVE')" icon="pi pi-save" />
        </div>
      </template>
    </Menubar>
    <div class="grid grid-cols-5 gap-4">
      <!-- APPLICATION -->
      <Card class="w-full col-span-2">
        <template #content>
          <Fieldset :legend="$t('APPLICATION')">
            <div>
              <label class="uppercase text-sm block">{{ $t('THEME') }}</label>
              <SelectButton :options="themeOptions" v-model="darkMode">
                <template #option="{ option }">
                  <div class="flex gap-2 items-center">
                    <i :class="{ 'pi pi-sun': option === 'light', 'pi pi-moon': option === 'dark' }" />
                    <span class="uppercase text-sm">
                      {{ option === 'light' ? $t('LIGHT') : $t('DARK') }}
                    </span>
                  </div>
                </template>
              </SelectButton>
            </div>
            <div class="mt-4">
              <label class="uppercase text-sm block">{{ $t('LANGUAGE') }}</label>
              <SelectButton :options="appStore.availableLocalesCodes" v-model="currentLanguage">
                <template #option="{ option }">
                  <div class="pb-1" :title="option.toUpperCase()">
                    <CountryFlag :country="languageFlag(option)" size="normal" />
                  </div>
                </template>
              </SelectButton>
            </div>
          </Fieldset>
        </template>
      </Card>
      <!-- STRAVA -->
      <Card class="w-full col-span-3">
        <template #content>
          <Fieldset :legend="$t('STRAVA')">
            <div class="flex flex-col gap-2">
              <!-- STRAVA CLIENT ID -->
              <div>
                <label class="uppercase text-sm">{{ $t('CLIENT_ID') }}</label>
                <InputText name="stravaClientId" :model-value="initialValues.stravaClientId" type="text" fluid />
                <Message v-if="$form.stravaClientId?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.stravaClientId.error?.message }}
                </Message>
              </div>
              <!-- STRAVA CLIENT SECRET -->
              <div>
                <label class="uppercase text-sm">{{ $t('STRAVA_CLIENT_SECRET') }}</label>
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
          </Fieldset>
        </template>
      </Card>
      <!-- BIKE MAINTENANCE -->
      <Card class="w-full col-span-5">
        <template #content>
          <Fieldset :legend="$t('BIKE_MAINTENANCE')">
            <div class="grid grid-cols-2 gap-4">
              <!-- LAST MAINTENANCE DATE -->
              <div>
                <label class="uppercase text-sm">{{ $t('LAST_MAINTENANCE_DATE') }}</label>
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
                <label class="uppercase text-sm">{{ $t('MAINTENANCE_HOURS') }}</label>
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
          </Fieldset>
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
import { useI18n } from 'vue-i18n'
import {
  Menubar,
  Card,
  InputText,
  Password,
  InputNumber,
  DatePicker,
  Message,
  Button,
  SelectButton,
  Fieldset
} from 'primevue'
import { usePrimeVue } from 'primevue/config'
// TYPES
import { ApplicationSetting } from '@types'
// STORES
import { useAppStore } from '@renderer/stores/app'
// COMPONENTS
import CountryFlag from 'vue-country-flag-next'
import Logo from '@renderer/components/Logo.vue'

const primevue = usePrimeVue()
const router = useRouter()
const appStore = useAppStore()
const toast = useToast()
const { t } = useI18n()

const themeOptions = ref(['light', 'dark'])

const darkMode = computed({
  get: () => (appStore.darkMode ? 'dark' : 'light'),
  set: () => appStore.toggleDarkMode()
})

const currentLanguage = computed({
  get: () => appStore.locale,
  set: locale => appStore.setLocale(locale, primevue)
})

const languageFlag = locale => appStore.availableLocales.find(x => x.code === locale)?.flag

const resolver = ({ values }) => {
  const errors: Record<string, Array<object>> = {}

  if (!values.stravaClientId) errors.stravaClientId = [{ message: t('STRAVA_CLIENT_ID_REQUIRED') }]
  if (!values.stravaClientSecret) errors.stravaClientSecret = [{ message: t('STRAVA_CLIENT_SECRET_REQUIRED') }]
  if (!values.maintenanceHours) errors.maintenanceHours = [{ message: t('MAINTENANCE_HOURS_REQUIRED') }]

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

      toast.add({ severity: 'success', summary: t('DONE'), detail: t('SETTINGS_SAVED'), life: 3000 })
      await appStore.fetchData()
      gotoHome()
    } catch (e) {
      toast.add({ severity: 'error', summary: t('ERROR'), detail: t('SETTINGS_SAVE_ERROR'), life: 3000 })
    }
  }
}
</script>
