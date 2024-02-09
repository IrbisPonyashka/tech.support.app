<template lang="pug">
div.modal-task_header
    span.modal-task_title Новая задача
form.modal-task_inner.ui-form.ui-form-line(@submit="formHandler" id="task_add")
    div.ui-form-row
        div.ui-form-label
            div.ui-ctl-label-text
        div.ui-form-content
            div.ui-ctl.ui-ctl-textbox.ui-ctl-w100
                input.ui-ctl-element(placeholder="Введите название задачи" v-model="fields.title")
    div.ui-form-row
        div.ui-form-label
            div.ui-ctl-label-text
        div.ui-form-content
            div.ui-ctl.ui-ctl-textarea
                textarea.ui-ctl-element(placeholder="Описание задачи" v-model="fields.description")
    div.ui-form-row
        div.ui-form-label
            div.ui-ctl-label-text Ответственный
        div.ui-form-content
            div.ui-ctl.ui-ctl-textbox.ui-ctl-w100
                input.ui-ctl-element(placeholder="Ответственный за задачу" v-model="fields.responsbleId")
    button.modal-task_btn.ui-btn.ui-btn-success(type="submit") Поставить задачу
</template>

<script>

  import {mapActions, mapGetters} from "vuex"
  import {sendRequest} from "@/assets/scripts/bx24/call.methods"

  // sendRequest("cp.micros.uz","tasks.task.list")
  export default {
    name: 'Modal',
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
        },
        projectsId:[]
      }
    },
    components: {
    },
    methods: {
        async formHandler(e){
            e.preventDefault();
            let params = {
                "fields":{
                    "TITLE":this.fields.title,
                    "DESCRIPTION":this.fields.description,
                    "RESPONSIBLE_ID":this.fields.responsbleId,
                    "GROUP_ID":604,
                }
            }
            var taskAdd = await sendRequest("cp.micros.uz","tasks.task.add",params,this.auth.access_token);
            console.log(taskAdd);
            // this.getAuth({title:this.title, description:this.description,assignId:this.assignId});
        }
    },
    computed: {
    },
    created() {
    },
    watch: {
      projectsId: {
        immediate: true,
        handler(newValue, oldValue) {
        }
      }
    },
  }
          
</script>

