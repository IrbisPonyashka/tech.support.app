<template lang="pug">
div.sidepanel-task_back(:class="{'open':showModal}" @click="close")
transition(name="sidebar")
  div.sidepanel-task_popup(v-if="showModal")
    //- a.sidepanel-close(href="/")
    //- router-link.sidepanel-close(@click="close" to="/")
    div.sidepanel-close(@click="close")
      div.sidepanel-close-icon-box(title="Закрыть")
        div.sidepanel-close-icon
      span.sidepanel-close-text Закрыть
    div.sidepanel-task_popup-inner
      //- div.task__detail-header.task__detail-item
        h3.task__detail-title {{taskObject.title}}
      div.task__detail-box(v-if="taskObject")
        div.task__detail-left(v-if="taskObject")
          div.task__detail-content.task__detail-item
            div.task__detail-info 
              div.task__detail-info_header
                div.task__detail-info_status
                  //- span.task_detail-task_name Задача № {{taskObject.title}}
                  span.task_detail-task_name {{taskObject.title}} - задача № {{taskObject.id}}
                div.task__detail-info_important(@click="setPriority(taskObject.priority)")
                  span.task__detail-info-text(v-if="taskObject.priority==0 || taskObject.priority==1") Сделать важной задачей
                  span.task__detail-info-text.priority(v-if="taskObject.priority==2") Это важная задача
              div.task__detail-info_content
                div.task__detail-info_description(v-html="taskObject.description")
                div.task__detail-info_extra.task-project
                  div.task__detail-info_extra-group
                    span.task__detail-info_extra-name Задача в проекте (группе):
                    span.task__detail-info_extra-link {{taskObject.group.name}}
                  div.task__detail-info_extra-right
                div.task__detail-info_extra.task-files(v-if="taskObject.files.length>0")
                  div.task__detail-info_extra-group
                    span.task__detail-info_extra-name Файлы
                    div.taskpanel-task_info-file.field__file-content(data-field="FILE")
                      div.field__file-selected
                        div.field__file-files
                          a.field__file-files_item(v-for="file in taskObject.files" download :href="`https://${getAppTokens.portal_url}`+file.DOWNLOAD_URL")
                            div.field__file-files_preview
                              div.field__file-files_icon
                                div.ui-icon(:class="`ui-icon-file-${file.NAME}`") 
                                  i
                            div.field__file-files_name {{file.NAME}}
          //- Комментарии - start
          Comments(
            v-if="taskComments"
            :options="getAppTokens" 
            :comments="taskComments" 
            :formatDate="formatDate"
            )
          //- end 
        div.task__detail-info_panel.element__panel-content
          div.element__panel-wrapper
            div.element__panel-header
              span.element__panel-status Ждет выполнения 
              div.element__panel-status-value {{formatDateTime(taskObject.statusChangedDate)}}
            div.element__panel-inner
              div.element__panel-list
                div.element__panel-field.field_panel-deadline
                  span.element__panel-status Крайний срок:
                  div.element__panel-status-value {{taskObject.deadline?taskObject.deadline:"Нет"}}
                div.element__panel-field.field_panel-createdDate
                  span.element__panel-status Поставлена
                  div.element__panel-status-value {{formatDateTime(taskObject.createdDate)}}
                div.element__panel-field.field_panel-resposible
                  span.element__panel-status Постановщик:
                  div.element__panel-status-value 
                    div.element__panel-logo
                      img.element__panel-img(
                        @error="fileExists"
                        :src="`https://${getAppTokens.portal_url}`+taskObject.creator.icon" :alt="taskObject.creator.id")
                      //- span.ui-icon.ui-icon-common-user.app-icon-md(v-else)
                      //-   i
                    div.element__panel-text
                      span.element__panel-status-name {{taskObject.creator.name}}
                      span.element__panel-status-work {{taskObject.creator.workPosition}}
                div.element__panel-field.field_panel-resposible
                  span.element__panel-status Исполнитель:
                  div.element__panel-status-value 
                    div.element__panel-logo
                      img.element__panel-img(
                        @error="fileExists"
                        :src="`https://${getAppTokens.portal_url}`+taskObject.responsible.icon" :alt="taskObject.responsible.id")
                      //- span.ui-icon.ui-icon-common-user.app-icon-md(v-else)
                      //-   i
                    div.element__panel-text
                      span.element__panel-status-name {{taskObject.responsible.name}}
                      span.element__panel-status-work {{taskObject.responsible.workPosition}}
                div.element__panel-field.field_panel-resposible
                  span.element__panel-status Соисполнитель:
                  //- div.element__panel-status-value {{taskObject.accomplicesData[Object.keys(taskObject.accomplicesData)]}}
                  div.element__panel-status-value(v-for="accomplice in taskObject.accomplicesData")
                    div.element__panel-logo
                      img.element__panel-img(
                        @error="fileExists"
                        :src="`https://${getAppTokens.portal_url}`+accomplice.icon" :alt="accomplice.id")
                      //- span.ui-icon.ui-icon-common-user.app-icon-md(v-else)
                      //-   i
                    div.element__panel-text
                      span.element__panel-status-name {{accomplice.name}}
                      span.element__panel-status-work {{accomplice.workPosition}}
                div.element__panel-field.field_panel-resposible
                  span.element__panel-status Наблюдатели:
                  div.element__panel-status-value(v-for="auditor in taskObject.auditorsData")
                    div.element__panel-logo
                      img.element__panel-img(
                        @error="fileExists"
                        :src="`https://${getAppTokens.portal_url}`+auditor.icon" :alt="auditor.id")
                      //- span.ui-icon.ui-icon-common-user.app-icon-md(v-else)
                      //-   i
                    div.element__panel-text
                      span.element__panel-status-name {{auditor.name}}
                      span.element__panel-status-work {{auditor.workPosition}}
</template>

<script>
  import Comments from "@/components/elements/Comments.vue";

  import BBCode from 'nbbcjs';
  const bbcode = new BBCode();
  import {mapActions, mapGetters} from "vuex"
  import {sendRequest} from "@/assets/scripts/bx24/call.methods"
    export default {
      name: 'Task',
      data() {
        return {
          loader:false,
          taskObject:null,
          taskComments:null,
          showModal: false,
          body:document.querySelector("body")
        }
      },
      components: {
        Comments,
      },
      methods: {
        close(e) {
          e.prevent;
          this.body.style.overflow=!this.showModal?"hidden":"auto";
          this.showModal = !this.showModal;
          setTimeout(() => this.$router.push('/'), "350");
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
        formatDateTime(dateTime) {
          const date = new Date(dateTime);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const hours = date.getHours();
          const minutes = date.getMinutes();

          const formattedDate = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
          const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

          return `${formattedDate} ${formattedTime}`;
        },
        async getComments(token) {
          try {
            // console.log(this.$route.params.id);
            let params = {"taskId": this.$route.params.id};
            let taskCommentsar = JSON.parse(await sendRequest(token.portal_url, "task.commentitem.getlist", params, token.access_token)).result;
            for(let profile of taskCommentsar){
              let user = JSON.parse(await sendRequest(token.portal_url, "user.get", {id:profile.AUTHOR_ID}, token.access_token)).result[0];
              if(user.PERSONAL_PHOTO){
                profile.AUTHOR_PHOTO = user.PERSONAL_PHOTO;
              }
            }
            this.taskComments = taskCommentsar;  
          } catch (error) {
            console.error("Ошибка при получении данных: ", error);
          }
        },
        async setPriority(priorityVal){
          let value = (priorityVal==1||priorityVal==0)?2:1;
          let params = {
            "taskId": this.$route.params.id,
            fields:{
              "PRIORITY":value
            }
          };
          let task = JSON.parse(await sendRequest(this.getAppTokens.portal_url, "tasks.task.update", params, this.getAppTokens.access_token)).result.task;
          if(task.id){
            this.taskObject.priority = value;
          }
          return task.priority;
        },
        getTaskStatus(status){
          if(status=="-2"){
            return {code:status, value:"задача не просмотрена."}
          }else if(status=="-1"){
            return {code:status, value:"задача просрочена."}
          }else if(status=="-3"){
            return {code:status, value:"задача почти просрочена."}
          }else if(status=="2"){
            return {code:status, value:"ждёт выполнения."}
          }else if(status=="3"){
            return {code:status, value:"выполняется"}
          }else if(status=="4"){
            return {code:status, value:"ждет контроля."}
          }else if(status=="5"){
            return {code:status, value:"заврешина."}
          }else if(status=="6"){
            return {code:status, value:"отложена."}
          }
        },
        async getTask(token) {
          try {
            let params = {"taskId": this.$route.params.id};
            let taskObj = JSON.parse(await sendRequest(token.portal_url, "tasks.task.get", params, token.access_token)).result.task;
            taskObj.description = bbcode.parse(taskObj.description);
            taskObj.status = this.getTaskStatus(taskObj.status);
            let taskFiles = JSON.parse(await sendRequest(token.portal_url, "task.item.getfiles", {"TASKID":this.$route.params.id}, token.access_token)).result;
            taskObj.files = taskFiles;
            [taskObj.creator,taskObj.responsible].forEach(el => {
              const img = new Image();
              img.src = "https://"+token.portal_url+el.icon;
              img.onload = () => true; // Изображение успешно загружено
              img.onerror = () => el.icon = false; // Ошибка загрузки изображения
            })
              console.log(taskObj);//accomplice
            // if(taskObj.creator.icon){
            //   console.log(taskObj.creator.icon);
            //   taskObj.responsible.icon = false;
            // }
            // if(taskObj.responsible.icon){
            //   taskObj.responsible.icon = false;
            // }else{
            //   console.log(taskObj.responsible.icon);
            // }
            // console.log(taskObj);
            
            this.taskObject = taskObj; 
            this.body.style.overflow=!this.showModal?"hidden":"auto";
            this.showModal = true;
            // this.taskObject.description = this.taskObject.description.replace(/\r\n/g, '<br>');
          } catch (error) {
            console.error("Ошибка при получении данных: ", error);
          }
        },
        async fileExists(e){
          let span = document.createElement("span");
          span.className="ui-icon ui-icon-common-user app-icon-md";
          span.appendChild(document.createElement("i"));
          e.target.replaceWith(span);
          // console.log(url);
        },
        test(url) {
            return new Promise((resolve) => {
            });
          // image.onerror = function() {
          //   // Изображение не загружено
          //   console.log(image,false);
          //   return false;
          // };
          // return new Promise(async (resolve) => {
            // const response = await fetch("/check-image/" + url);
            // response.ok ? true  :  obj.icon = false; 
          // });
        }
      },
      computed: {
      ...mapGetters(["getAppTokens"]),
      },
      mounted(){
      },
      created() {
        // this.$router.go()
        // this.$store.dispatch('getAuthPortal');
      },
      watch: {
        getAppTokens:{
          immediate: true,
          handler(newValue, oldValue) {
            if(Object.keys(newValue).length!=0){
              this.getTask(newValue);
              this.getComments(newValue);
            } 
          }
        }
      }
    };
</script>