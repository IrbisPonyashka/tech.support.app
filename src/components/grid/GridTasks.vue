<template lang="pug">
div.main-grid-body
    div.main-grid-row.main-grid-row-body(v-for="task in tasksList" name="tasks")
        div.main-grid-cell(v-for="taskItem in task" :class="taskItem.name")
            div.main-grid-cell-inner
                span.main-grid-cell-content
                    //- router-link.main-grid-cell-task(:to="'/task/'+taskItem.value.id" v-if="taskItem.name=='title'") {{ taskItem.value.title}}
                    router-link.main-grid-cell-task(:to="{ name: 'Task', params:{id:`${taskItem.value.id}`}}" v-if="taskItem.name=='title'") {{ taskItem.value.title}}
                    a.main-grid-cell-task(
                      v-else-if="taskItem.name=='creator'" )
                      img.main-grid-cell-ava(alt="avatar.png" :src="`https://${portal_url}`+taskItem.value.icon" v-if="taskItem.value.icon")
                      span.ui-icon.ui-icon-common-user.app-icon-sm(v-else) 
                        i
                      span.main-grid-cell-span {{ taskItem.value.name}}
                    a.main-grid-cell-task(
                      v-else
                      :class="{'ui-label ui-label-default ui-label-fill ui-label-link':taskItem.name==='deadline'}") {{ taskItem.value.name?taskItem.value.name:taskItem.value}}
    div.main-grid-loader(v-if="loader")
      img.main-grid-loader-gif(alt="loader.gif" src="@/assets/img/elems/loader.gif")
</template>

<script>

  import {mapActions, mapGetters} from "vuex"
  export default {
    name: 'GridBody',
    props: {
      tasksObj: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        appAuth:{},
        tasksList:{},
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
      }
    },
    computed: {
    },
    created() {
    },
    watch: {
      tasksObj:{
        immediate: true,
        handler(newValue, oldValue) {
          if(Object.keys(newValue).length>0){
            // let requiredKeys = ["id","title","activityDate","deadline","createdBy","responsibleId","description","createdDate","groupId"];
            let requiredKeys = ["title","activityDate","deadline","creator","responsible","group"];
            var transformedArray = [];
            function formatDate(dateString) {
              const options = {
                // year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                // timeZoneName: "short"
              };
                const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
                return formattedDate;
            };
            for(let j = 0;j<this.tasksObj.length;j++){
              let i = 0;
              transformedArray.push(requiredKeys.map(key => { i++;
                if(key=="activityDate"){
                  
                  this.tasksObj[j][key] = this.tasksObj[j][key]==null?"Без срока":formatDate(this.tasksObj[j][key]);
                  return ({ id: i, name:key, value: this.tasksObj[j][key] })
                }else if(key=="deadline"){
                  
                  this.tasksObj[j][key] = this.tasksObj[j][key]==null?"Без срока":formatDate(this.tasksObj[j][key]);
                  return ({ id: i, name:key, value: this.tasksObj[j][key] })
                }else if(key=="creator"){
                  let obj = { id: i, name:key, value: this.tasksObj[j][key] };
                  let icon = obj.value.icon;
                  if(icon.startsWith("/upload/")){
                    return (obj);
                  }else{
                    obj.value.icon = false;
                    return (obj);
                  }
                }else if(key=="title"){
                  
                  return ({ id: i, name:key, value: {id:this.tasksObj[j]["id"],title:this.tasksObj[j]["title"]} })
                }else{
                  
                  return ({ id: i, name:key, value: this.tasksObj[j][key] })
                }
              }));
            }
            this.tasksList = transformedArray;
            this.loader = false;
          }else if(Object.keys(newValue).length==0){
            this.loader = true;
          }
        }
      }
    }, 
  }
</script>

