<template lang="pug">
div.main-grid-body 
    div.main-grid-row.main-grid-row-body(v-for="project in arrObjects" name="projects")
        div.main-grid-cell(v-for="item in project" :field-name="item.name.title")
            div.main-grid-cell-inner
                span.main-grid-cell-content
                    span.main-grid-cell-task(v-if="item.name.title=='DATE_ACTIVITY'||item.name.title=='DATE_CREATE'||item.name.title=='DATE_UPDATE'") {{ formatDate(item.value) }}
                    span.main-grid-cell-task(v-else) {{ item.value }}
    div.main-grid-loader(v-if="loader")
      img.main-grid-loader-gif(alt="loader.gif" src="@/assets/img/elems/loader.gif")
</template>

<script>

  import {mapActions, mapGetters} from "vuex"
  export default {
    name: 'GridProjects',
    props: {
      projectsArray: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        appAuth:{},
        arrObjects:[],
        loader:false
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
    },
    computed: {
    },
    created() {
      // console.log(this.projectsArray);
      // for(let index in this.projectsArray[0]){
      //   let i=0;
      //   this.arrObjects.push(this.projectsArray[1].map(key => { i++;
      //     // console.log(newValue[0][index][key.title]);
      //     return ({ id: i, name:key, value: this.projectsArray[0][index][key.title] })
      //   }));
      // }
    },
    watch: {
      projectsArray:{
        immediate: true,
        async handler(newValue, oldValue) {
          if(newValue[0].length>0){
            for(let index in newValue[0]){
              let i=0;
              this.arrObjects.push(newValue[1].map(key => { i++;
                // console.log(newValue[0][index][key.title]);
                return ({ id: i, name:key, value: newValue[0][index][key.title] })
              }));
            }
            // this.arrObjects = newValue[0];
            // var arrKeys = newValue[1];
          }



          // if(Object.keys(newValue).length>0){

          // }else if(Object.keys(newValue).length==0){
          //   this.loader = true;
          // }
        }
      }
    }, 
  }
</script>

