import { createApp } from "vue";
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import "bootstrap/dist/css/bootstrap-grid.min.css";
import './assets/theme.css';
import './assets/fontawesome-free-6.4.0-web/css/all.min.css'
import App from "./App.vue";
import router from "./router";

const app = createApp(App)
app.use(PrimeVue);
app.use(router)
app.mount("#app");
