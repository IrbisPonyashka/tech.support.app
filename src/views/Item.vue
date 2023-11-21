<template lang="pug">
div.sidepanel-task_back(:class="{'open':showModal}")
transition(name="sidebar")
  div.sidepanel-task_popup(v-if="showModal")
    //- a.sidepanel-close(href="/")
    //- router-link.sidepanel-close(@click="close" to="/")
    div.sidepanel-close(@click="close")
      div.sidepanel-close-icon-box(title="Закрыть")
        div.sidepanel-close-icon
      span.sidepanel-close-text Закрыть
    div.sidepanel-task_popup-inner
      div.task__detail-box(v-if="taskObject")
        div.task__detail-header.task__detail-item
          h3.task__detail-header-title {{taskObject.title}}
        div.task__detail-content.task__detail-item
          div.task__detail-info
            div.task__detail-info_header
              h3.task_detail-task_name Задача № {{taskObject.id}}
            div.task__detail-info_content
              div.task__detail-info_description(v-html="taskObject.description")
      div.task-detail__comments
        div.task-detail__comments-items(v-if="taskComments" v-for="comment in taskComments")
          div.task-detail__comments-box
            div.task-detail__comments-item
              div.task-detail__item
                span.task-detail__item-author-name(:name="comment.AUTHOR_NAME")
                div.task-detail__item-info
                  span.item-user(target="_top" id="59433" :bx-user-id="comment.id") {{comment.AUTHOR_NAME}}
                  span.item-time {{formatDate(comment.POST_DATE)}}
                div.task-detail__item-text
                  div.task-detail__item-text-inner
                    div(v-html="comment.POST_MESSAGE_HTML") 
        div.task-detail__comments-add
          div.task-detail__comments-box
            div.ui-ctl.ui-ctl-textarea.ui-ctl-round
              textarea.ui-ctl-element.task-detail__comments-field(placeholder="Оставить комментарий" v-model="commentText")
          div.task-detail__comments-send(@click="sendComment(commentText)")
            div.ui-btn.ui-btn-sm.ui-btn-primary
              button.ui-btn-main Отправить
</template>

<script>

  import {mapActions, mapGetters} from "vuex"
  import {sendRequest} from "@/assets/scripts/bx24/call.methods"
    export default {
      name: 'Item',
      data() {
        return {
          loader:false,
          taskObject:null,
          taskComments:null,
          showModal: false,
          commentText:"",
          body:document.querySelector("body")
        }
      },
      methods: {
        close(e) {
          e.prevent;
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
        async sendComment(text){
          // console.log(this.getAppTokens);
          // console.log(JSON.parse(sessionStorage.tokens));
          let profile = JSON.parse(await sendRequest(this.getAppTokens.portal_url, "profile", {}, JSON.parse(sessionStorage.tokens).access_token)).result;
          let params = [ this.taskObject.id,
            {
              "AUTHOR_ID":profile.ID,
              'POST_MESSAGE': text
            }
          ]
          let commentAdd =  JSON.parse(await sendRequest(this.getAppTokens.portal_url, "task.commentitem.add", params, JSON.parse(sessionStorage.tokens).access_token)).result;
          if(commentAdd){
            // this.$router.go();
            console.log(commentAdd);
          }
        },
        async getTask(token) {
          try {
            let params = {"taskId": this.$route.params.id};
            let taskObj = await sendRequest(token.portal_url, "tasks.task.get", params, token.access_token);
            this.taskObject = JSON.parse(taskObj).result.task;
            this.body.style.overflow=!this.showModal?"hidden":"auto";
            this.showModal = true;
            // this.taskObject.description = this.taskObject.description.replace(/\r\n/g, '<br>');
          } catch (error) {
            console.error("Ошибка при получении данных: ", error);
          }
        },
        async getComments(token) {
          try {
            // console.log(this.$route.params.id);
            let params = {"taskId": this.$route.params.id};
            let taskCommentsar = await sendRequest(token.portal_url, "task.commentitem.getlist", params, token.access_token);
            this.taskComments = JSON.parse(taskCommentsar).result;  
            // console.log(this.taskComments);
          } catch (error) {
            console.error("Ошибка при получении данных: ", error);
          }
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
              // console.log(newValue);
              this.getTask(newValue);
              this.getComments(newValue);
            } 
          }
        }
      }
    };
</script>