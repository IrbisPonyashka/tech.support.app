<template lang="pug">
div.task-detail__comments
    div.task-detail__comments-items(v-if="comments" v-for="comment in comments")
        div.task-detail__comments-box
            img.task-detail__comments-logo(v-if="comment.AUTHOR_PHOTO" :src="comment.AUTHOR_PHOTO" :alt="comment.AUTHOR_PHOTO")
            span.ui-icon.ui-icon-common-user.app-icon-md(v-else)
                i
            div.task-detail__comments-item
                div.task-detail__item
                    span.task-detail__item-author-name(:name="comment.AUTHOR_NAME")
                    div.task-detail__item-info
                        span.item-user(target="_top" id="59433" :bx-user-id="comment.id") {{comment.AUTHOR_NAME}}
                        span.item-time {{formatDate(comment.POST_DATE)}}
                        //- span.item-time xx.xx.xxxx
                    div.task-detail__item-text
                        div.task-detail__item-text-inner
                            div(v-html="comment.POST_MESSAGE_HTML")
                            div.attached_elemes(v-if="comment.ATTACHED_OBJECTS")
                                div.feed-com-files(v-for="object in comment.ATTACHED_OBJECTS")
                                    div.feed-com-files-title Файлы:
                                    div.feed-com-files-wrapper
                                        //- div.feed-con-file-icon.ui-icon.ui-icon-file-empty
                                        //-     i
                                        //- span.feed-con-file-icon xxx 
                                        a(:href="'https://'+options.portal_url+object.DOWNLOAD_URL" download).feed-con-file-name {{object.NAME}} 
                                        span.feed-con-file-size {{formatBytes(object.SIZE)}} 
    div.task-detail__comments-box
        div.task-detail__comments-add
            div.ui-ctl.ui-ctl-md.ui-ctl-round(:class="commentField?'ui-ctl-textbox':'ui-ctl-textarea'")
                    button(v-if="commentField" @click="commentField=false").task-detail__comments-link.ui-ctl-element.task-detail__comments-field Добавить комментарий
                    textarea(:style="commentField?'position:absolute;height:0px;z-index:-1;':''").ui-ctl-element.task-detail__comments-field(
                        placeholder="Оставить комментарий"
                        v-model.trim="commentText"
                        @input="commentText.length!=0? senCommentBtn=false : senCommentBtn=true ")
                    div(v-if="!commentField").task-detail__comments-toolbar.field__file-content
                        div.comments__toolbar-buttons
                            div.comments__toolbar-buttons-container
                                button.comments__toolbar-button.toolbar-button(data-id="file")
                                    i
                                    span Файл
                        label.ui-ctl.ui-ctl-file-drop(:data-active="active"
                            @drop.prevent="onFileSelect" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive"
                            :class="{'active':active}"
                            )
                            span Загрузить файл или картинку
                            small Перетащите с помощью drag'n'drop
                            input.ui-ctl-element(type="file" @change="onFileSelect" multiple name="FILES")

            div(v-if="!commentField").task-detail__comments-send(@click="sendComment(commentText)")
                button(:disabled="senCommentBtn").ui-btn.ui-btn-sm.ui-btn-primary Отправить
                button(@click="commentField=true").ui-btn.ui-btn-sm.ui-btn-light-border Отменить
</template>

<script>

  import {sendRequest} from "@/assets/scripts/bx24/call.methods"

  export default {
    name: 'Comments',
    props: {
      comments: {
        type: Object,
        required: true
      },
      formatDate: Function,
      options: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
          commentText:"",
          senCommentBtn:true,
          commentField:true
      }
    },
    components: {
    },
    methods: {
        async sendComment(text){
          let profile = JSON.parse(await sendRequest(JSON.parse(sessionStorage.tokens).portal_url, "profile", {}, JSON.parse(sessionStorage.tokens).access_token)).result;
          let params = [ this.taskObject.id,
            {
              "AUTHOR_ID":profile.ID,
              'POST_MESSAGE': text
            }
          ]
          let commentAdd =  JSON.parse(await sendRequest(JSON.parse(sessionStorage.tokens).portal_url, "task.commentitem.add", params, JSON.parse(sessionStorage.tokens).access_token)).result;
          if(commentAdd){
            let commentAddedGet = JSON.parse(await sendRequest(JSON.parse(sessionStorage.tokens).portal_url, "task.commentitem.get", [this.$route.params.id,commentAdd], JSON.parse(sessionStorage.tokens).access_token)).result; 
            let user = JSON.parse(await sendRequest(JSON.parse(sessionStorage.tokens).portal_url, "user.get", {id:commentAddedGet.AUTHOR_ID}, JSON.parse(sessionStorage.tokens).access_token)).result[0];
            if(user.PERSONAL_PHOTO){
              commentAddedGet.AUTHOR_PHOTO = user.PERSONAL_PHOTO;
            }
            this.taskComments.push(commentAddedGet);
            this.commentText="";
            // console.log(commentAddedGet);
            // console.log(this.taskComments);
          }

        },
        formatBytes(bytes, decimals = 2) { // форматириуем байты в человеческий вид
          if (bytes === 0) return '0 Bytes';

          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));

          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        onComment(text){
          console.log(text);
        },
    },
    computed: {
    },
    created() {

    },
    watch: {
      comments: {
        immediate: true,
        handler(newValue, oldValue) {
            newValue.forEach(element => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(element.POST_MESSAGE_HTML, 'text/html');
                let users = Array.from(doc.querySelectorAll("a.blog-p-user-name"));
                let linksTagA = Array.from(doc.querySelectorAll("a"));
                users.length ? users.map(function(item, index, array) { item.style.pointerEvents = "none",item.style.color = "#00" }) : null ;
                linksTagA.length ? linksTagA.map(function(item, index, array) { item.style.color = "var(--ui-color-link-primary-base)", console.log(item) }) : null ;
                element.POST_MESSAGE_HTML = new XMLSerializer().serializeToString(doc)
            });
        }
      }
    },
  }
          
</script>

