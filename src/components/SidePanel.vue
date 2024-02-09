<template lang="pug">
//- div.taskpanel-content_header
    span.taskpanel-content_title Новая задача
div.taskpanel-content_workarea
  div.taskpanel-content_form
    form.ui-form.ui-form-line(@submit="formHandler" id="task_add")
      div.taskpanel-task_info
        div.taskpanel-task_info-title
          div.taskpanel-task_info-name(data-field="TITLE")
            input.taskpanel-task_field(placeholder="Введите название задачи" v-model="fields.title")
          div.taskpanel-task_info-important(data-field="PRIORITY")
            input.taskpanel-task_checkbox(type="checkbox" v-model="fields.important")
            label Это важная задача
        div.taskpanel-task_info-descr(data-field="DESCRIPTION")
          textarea.taskpanel-task_field(placeholder="Описание задачи" v-model="fields.description")
        div.taskpanel-task_info-file(data-field="FILE")
          div.taskpanel-task_info-selected(v-if="files.length>0")
            div.taskpanel-task_info-files
              div.taskpanel-task_info-item(v-for="file in files")
                div.taskpanel-task_info-inner {{file}}
          label.ui-ctl.ui-ctl-file-drop
            span Загрузить файл или картинку
            small Перетащите с помощью drag'n'drop
            //- div.ui-ctl-label-text
            input.ui-ctl-element(type="file" @change="selectFile")
      div.taskpanel-task_options
        div.taskpanel-task_options-block(data-field="GROUP_ID")
          span.taskpanel-task_options-name Проект
          div.taskpanel-task_options-name
            input.ui-ctl-element.taskpanel-task_option-field.datapicker
        div.taskpanel-task_options-block(data-field="DEADLINE")
          span.taskpanel-task_options-name Крайний срок
          VueDatePicker(v-model="date")
          //- div.ui-ctl.ui-ctl-after-icon.ui-ctl-datetime.taskpanel-task_options-name
            div.ui-ctl-after.ui-ctl-icon-calendar
            input.ui-ctl-element.taskpanel-task_option-field.datapicker
      //- div.taskpanel-task_options
      div.taskpanel-task_footer
        div.taskpanel-task_footer-box
          div.taskpanel-task_footer-conteiner
            button.taskpanel-content_btn.ui-btn.ui-btn-success(type="submit") Поставить задачу
</template>

<script>

  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'

  import {mapActions, mapGetters} from "vuex"
  import {sendRequest} from "@/assets/scripts/bx24/call.methods"

  export default {
    name: 'SidePanel',
    props: {
      auth: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        fields:{
            title:"",
            description:"",
            responsbleId:"",
            date:null,
        },
        files:[],
        projectsId:[]
      }
    },
    components: { VueDatePicker },
    computed: {
      ...mapGetters(["getAppTokens"]),
    },
    methods: {
        async formHandler(e){
            e.preventDefault();
            let params = {
                "fields":{
                    "TITLE":this.fields.title,
                    "DESCRIPTION":this.fields.description,
                    "PRIORITY":this.fields.important,
                    // "DEADLINE":this.fields.description,
                    "RESPONSIBLE_ID":8262,
                    "GROUP_ID":604,
                }
            }
            var taskAdd = await sendRequest("cp.micros.uz","tasks.task.add",params,this.auth.access_token);
            console.log(taskAdd);
            // this.getAuth({title:this.title, description:this.description,assignId:this.assignId});
        },
        selectFile(e){
          if(e.target.value){
            this.files.push(e.target.value);
          }
          console.log(e.target.value);
        }
    },
    computed: {
    },
    created() {
    },
    watch: {
      // getAppTokens: {
      //   immediate: true,
      //   async handler(newValue, oldValue) {
      //     console.log(newValue);
      //   }
      // },
      projectsId: {
        immediate: true,
        handler(newValue, oldValue) {
        }
      }
    },
  }
          
</script>

