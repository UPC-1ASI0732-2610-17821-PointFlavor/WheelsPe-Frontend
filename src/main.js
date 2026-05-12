import './assets/main.css'
import { createApp } from 'vue'
import './app/shared/styles/typography.css'
import './app/shared/styles/colors.css'
import App from './App.vue'
import router from './router.js'
import i18n from './i18n.js'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Material from '@primevue/themes/material'
import PrimeVue from 'primevue/config'
import {
  Button,
  Card,
  Checkbox,
  Column,
  ConfirmationService,
  ConfirmDialog,
  DataTable,
  Dialog,
  DialogService,
  Drawer,
  FileUpload,
  FloatLabel,
  IconField,
  InputIcon,
  InputText,
  InputNumber,
  Menu,
  Rating,
  Row,
  Select,
  SelectButton,
  Tag,
  Textarea,
  ToastService,
  Toast,
  Toolbar,
  Tooltip
} from 'primevue'

createApp(App)
  .use(router)
  .use(i18n)
  .use(PrimeVue, { theme: { preset: Material }, ripple: true })
  .use(ConfirmationService)
  .use(DialogService)
  .use(ToastService)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-checkbox', Checkbox)
  .component('pv-column', Column)
  .component('pv-confirm-dialog', ConfirmDialog)
  .component('pv-datatable', DataTable)
  .component('pv-dialog', Dialog)
  .component('pv-drawer', Drawer)
  .component('pv-file-upload', FileUpload)
  .component('pv-float-label', FloatLabel)
  .component('pv-icon-field', IconField)
  .component('pv-input-icon', InputIcon)
  .component('pv-input-text', InputText)
  .component('pv-input-number', InputNumber)
  .component('pv-menu', Menu)
  .component('pv-rating', Rating)
  .component('pv-row', Row)
  .component('pv-select', Select)
  .component('pv-select-button', SelectButton)
  .component('pv-tag', Tag)
  .component('pv-textarea', Textarea)
  .component('pv-toast', Toast)
  .component('pv-toolbar', Toolbar)
  .directive('tooltip', Tooltip)
  .mount('#app')