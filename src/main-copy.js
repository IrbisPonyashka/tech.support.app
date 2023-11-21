if(import.meta.env.PROD===true){
  const script = document.createElement('script');
  script.src = '//api.bitrix24.com/api/v1/';  
  document.head.appendChild(script);
  script.onload = function () {
    // Библиотека загружена
    // console.log(document.body.clientWidth, document.querySelector("#app").clientHeight);
    BX24.resizeWindow(document.body.clientWidth, document.querySelector("#app").clientHeight);
    if (!sessionStorage.tokens) {
      BX24.callMethod("app.option.get", {}, (result) => {
        if(result.error()){
          console.log("error");
        }else{
          console.log(result.data());
          sessionStorage.tokens = JSON.stringify(result.data());
        }
      });
    }
    
  }
}

import { createApp } from 'vue'
import App from './App.vue'


import router from './router'
import store from './store'

import  "@/assets/scripts/script.js"

import "@/assets/style/style.scss"


createApp(App).use(store).use(router).mount('#app')
