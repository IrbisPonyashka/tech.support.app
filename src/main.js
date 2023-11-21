import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  "@/assets/scripts/script.js"
import "@/assets/style/style.scss"
import initBX24 from '@/assets/scripts/bx24/bx24Init.js';

// Загрузка и инициализация BX24 перед созданием Vue-приложения
if(import.meta.env.PROD===true){
initBX24()
  .then(() => {
    createApp(App).use(store).use(router).mount('#app');
  })
  .catch((error) => {
    console.error('Error during BX24 initialization:', error);
  });
}else{
  createApp(App).use(store).use(router).mount('#app');
}
