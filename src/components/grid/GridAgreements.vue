<template lang="pug">
div.main-grid-body 
    div.main-grid-row.main-grid-row-body(v-for="iblock in arrObjects" name="agreements")
        div.main-grid-cell(v-for="element in iblock" :field-name="element.name.title")
            div.main-grid-cell-inner
                span.main-grid-cell-content
                  span.main-grid-cell-task(v-if="element.value.TYPE=='HTML'" v-html="element.value.TEXT") 
                  router-link.main-grid-cell-task( v-else-if="element.name.title=='NAME'" :to="{ name: 'Agreement', params:{id:`${element.value.id}`}}") {{ element.value.property}}
                  span.main-grid-cell-task(v-else-if="element.name.title=='PROPERTY_3213'")
                    a.main-grid-cell-file(:href="`https://${portal_url}/`+getFile(element.parent,element.name.title)" type="download") Файл
                  span.main-grid-cell-task(v-else) {{ element.value }}
    div.main-grid-loader(v-if="loader")
      img.main-grid-loader-gif(alt="loader.gif" src="@/assets/img/elems/loader.gif")
</template>

<script>

  import { sendRequest } from "@/assets/scripts/bx24/call.methods";
  import {mapActions, mapGetters} from "vuex"
  export default {
    name: 'GridAgreements',
    props: {
      agreementsArr: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        appAuth:{},
        arrObjects:[],
        loader:false,
        portal_url:JSON.parse(sessionStorage.tokens).portal_url
      }
    },
    methods: {
      async fileExists(url) {
        var requestOptions = {
          method: 'GET',
          mode: 'no-cors', // Устанавливаем режим no-cors
        };
        return fetch(url,requestOptions)
          .then(response => {
            console.log(response);
            return response.ok;
          })
          .catch(error => {
            return false;
          });
      },
      formatDate(dateString) {
        const months = [
          'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
          'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        };

        const dateObject = new Date(dateString);
        return dateObject.toLocaleDateString('ru-RU', options)
          .replace(dateObject.getDate(), (dateObject.getDate() < 10 ? '0' : '') + dateObject.getDate())
          .replace(dateObject.toLocaleDateString('ru-RU', { month: 'long' }), months[dateObject.getMonth()])
          .replace('г. в', '');
      },
      async getFile(object,field){
        let params = {
          'IBLOCK_TYPE_ID': 'lists',
          'IBLOCK_ID':object.IBLOCK_ID,
          'ELEMENT_ID': object.ID,
          'FIELD_ID': field.split("_")[1]
        };
        const file = JSON.parse(await sendRequest(JSON.parse(sessionStorage.tokens).portal_url,"lists.element.get.file.url",params,JSON.parse(sessionStorage.tokens).access_token)).result; // элементы инфоблока "список"
        // console.log(file[0]);
        return file[0];
      }
    },
    computed: {
    },
    created() {
    },
    watch: {
      agreementsArr:{
        immediate: true,
        async handler(newValue, oldValue) {
          console.log(newValue);
          // console.log(.length);
          // Object.keys(newValue).length
          if(Object.keys(newValue[0]).length>0){
            var transformedArray = [];
            for(let index in newValue[0]){
              let i=0;
              // console.log(index);
              transformedArray.push(newValue[1].map(key => { i++;
                let idiotKey = Object.keys(newValue[0][index][key.title]);
                if(typeof newValue[0][index][key.title]=="object"){
                  if(key.title=="PROPERTY_3213"){ // файл
                    return ({ id: i, name:key, value: newValue[0][index][key.title][idiotKey],parent:newValue[0][index] })
                  }else{
                    return ({ id: i, name:key, value: newValue[0][index][key.title][idiotKey] });
                  }
                }else{
                  if(key.title=="NAME"){
                    return ({ id: i, name:key, value: {id:newValue[0][index].ID,property:newValue[0][index][key.title]} })
                  }else{
                    return ({ id: i, name:key, value: newValue[0][index][key.title] })
                  }
                }
              }));
            }
              this.arrObjects = transformedArray;
              this.loader = false;

          }else if(Object.keys(newValue).length==0){
            this.loader = true;
          }

        }
      }
    }, 
  }
</script>

