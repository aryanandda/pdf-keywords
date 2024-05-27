import 'primevue/resources/themes/aura-light-green/theme.css'
import './assets/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Chips from 'primevue/chips';
import FileUpload from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ProgressSpinner from 'primevue/progressspinner';


const app = createApp(App);
app.use(PrimeVue, { ripple: true })
app.component('Stepper', Stepper)
app.component('StepperPanel', StepperPanel)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('FloatLabel', FloatLabel)
app.component('Chips', Chips)
app.component('FileUpload', FileUpload)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')