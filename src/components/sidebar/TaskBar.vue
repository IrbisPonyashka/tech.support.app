<template lang="pug">
div.taskpanel-content_workarea(:key="componentKey")
  transition(name="actionLeft")
    div.taskpanel-content_error(v-if="showError")
      div.ui-alert.ui-alert-danger.ui-alert-icon-danger
        span.ui-alert-message
          strong {{errorMessage}}
        span.ui-alert-close-btn(@click="closeError")
  div.taskpanel-content_form
    form.ui-form.ui-form-line(@submit="formHandler" id="task_add")
      div.taskpanel-task_info
        div.taskpanel-task_info-title 
          div.taskpanel-task_info-name(data-field="TITLE" :class="{'field-error':fieldsBool.title}")
            input.taskpanel-task_field(placeholder="Введите название задачи" v-model="fields.title" name="TITLE")
          label.taskpanel-task_info-important(data-field="PRIORITY" @click="fields.important=(fields.important=='1'||fields.important=='0')?'2':'1'; inputChecked=!inputChecked;")
            input.taskpanel-task_checkbox(type="checkbox" v-model="inputChecked" name="IMPORTANT")
            label Это важная задача
        div.taskpanel-task_info-descr(data-field="DESCRIPTION")
          textarea.taskpanel-task_field(placeholder="Описание задачи" v-model="fields.description")
        div.taskpanel-task_info-file.field__file-content(data-field="FILE")
          div.field__file-selected(v-if="files.length>0")
            div.field__file-files
              div.field__file-files_item(v-for="file in files")
                div.field__file-files_delete(@click="deleteSelectedFile(file)")
                div.field__file-files_preview
                  div.field__file-files_icon
                    div.ui-icon(:class="`ui-icon-file-${file.format}`") 
                      i
                div.field__file-files_name {{file.newName}}
          label.ui-ctl.ui-ctl-file-drop(:data-active="active"
            @drop.prevent="onFileSelect" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive"
            :class="{'active':active}"
            )
            span Загрузить файл или картинку
            small Перетащите с помощью drag'n'drop
            input.ui-ctl-element(type="file" @change="onFileSelect" multiple name="FILES")
      div.taskpanel-task_options
        div.taskpanel-task_options-block.field__dropdown-content(data-field="GROUP_ID")
          div.field__dropdown-inner
            div.field__dropdown-name Проект
            div.field__dropdown-dropbox
              div.field__dropdown-value(@click="showDropDownList"  ref="dropdown")
                input.ui-ctl-element.field__dropdown-search(v-model="fields.projectName" @input="searchProjects" name="GROUP_NAME") 
                div.ui-ctl-after.ui-ctl-icon-angle(:class="{'active':dropdownShow}")
                input(type="hidden" name="GROUP_ID" v-model="fields.projectId" )
              transition(name="dropdown")
                div.field__dropdown-list(v-if="dropdownShow")
                  div.field__dropdown-element(v-for="project of projects" :data-value="project.ID" @click="selectProject(project)") {{project.NAME}}
      div.taskpanel-task_footer
        div.taskpanel-task_footer-box
          div.taskpanel-task_footer-conteiner
            button.taskpanel-content_btn.ui-btn.ui-btn-success(type="submit" v-if="!loading") Поставить задачу
            button.taskpanel-content_btn.ui-btn.ui-btn-success.ui-btn-clock(type="submit" v-else) Поставить задачу
</template>

<script>

  import {mapActions, mapGetters} from "vuex"
  import { ref, onMounted, onUnmounted } from 'vue'
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  import {sendRequest} from "@/assets/scripts/bx24/call.methods"

  export default {
    name: 'TaskBar',
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
          important:"1",
          description:"",
          responsbleId:"",
          projectName:"",
          projectId:"",
          files:[],
          // date:new Date(),
        },
        fieldsBool:{
          title:false,
          description:false,
          projectId:false,
        },
        showError:false,
        errorMessage:"",
        customFormat: 'dd.MM.yyyy HH:mm',
        dropdownShow:false,
        inActiveTimeout:null,
        inputChecked:false,
        loading:false,
        files:[],
        projects:[],
        componentKey:0,
        active:ref(false),
        events:['dragenter', 'dragover', 'dragleave', 'drop']
      }
    },
    components: { VueDatePicker },
    computed: {
      ...mapGetters(["getAppTokens"]),
      ...mapActions(["getTokens"]),
    },
    methods: {
        checkFields(){
          console.log(this.fields);
          if(this.fields.title=="" && this.fields.description=="" && this.fields.projectId==""){
            this.errorMessage = "Не указаны название, описания и проект задачи"
            this.showError=true;
            return false;
          }else if(this.fields.title=="" && this.fields.description==""){
            this.errorMessage = "Не указаны название и описания задачи"
            this.showError=true;
            return false;
          }else if(this.fields.title=="" && this.fields.projectId==""){
            this.errorMessage = "Не указаны название и проект задачи"
            this.showError=true;
            return false;
          }else if(this.fields.description=="" && this.fields.projectId==""){
            this.errorMessage = "Не указаны описание и проект задачи"
            this.showError=true;
            return false;
          }else if(this.fields.title==""){
            this.errorMessage = "Не указано название задачи"
            this.showError=true;
            return false;
          }else if(this.fields.description==""){
            this.errorMessage = "Нет описания задачи"
            this.showError=true;
            return false;
          }else if(this.fields.projectId==""){
            this.errorMessage = "Не выбран проект задачи"
            this.showError=true;
            return false;
          }else{
            return true;
          }
        },
        deleteSelectedFile(file){

          const indexOfFieldsFiles = this.fields.files.findIndex(el => el.id === file.id);
          const indexOfFiles = this.files.findIndex(el => el.id === file.id);
          if (indexOfFieldsFiles !== -1 && indexOfFiles !==-1) {
            this.fields.files.splice(indexOfFieldsFiles, 1);
            this.files.splice(indexOfFiles, 1);
          }
          console.log(this.files);
          
        },
        async formHandler(e){ // <*> форма создании задачи
            e.preventDefault();
            if(!this.checkFields()) return false;
            // const dateObject = new Date(this.fields.title);
            
            this.loading = true;
            let batchPrarams = {
              "halt":1,"cmd": {
                "atask_add":`tasks.task.add?fields[TITLE]=${this.fields.title}&fields[DESCRIPTION]=${this.fields.description}&fields[PRIORITY]=${this.fields.important}&fields[RESPONSIBLE_ID]=${8262}&fields[GROUP_ID]=${this.fields.projectId}`
              }
            };
            for(let file in this.fields.files){
              // batchPrarams.cmd[`file_${Number(file)+1}`] = 
              batchPrarams.cmd[`fileAdd_${Number(file)+1}`] = `task.item.addfile?TASK_ID=$result[atask_add][task][id]&FILE[NAME]=${this.fields.files[file].name}&FILE[CONTENT]=${this.fields.files[file].base64}`;
            }
            if(batchPrarams){
              console.log(batchPrarams);
              var taskAddBatch = await sendRequest(this.auth.portal_url,"batch",batchPrarams,this.auth.access_token);
              if(taskAddBatch){
                console.log(JSON.parse(taskAddBatch));
                this.loading = false;
                this.$router.go(0);
                location.reload();
              }
            }
        },
        async getProjects(params){ // <*> список проектов
          var projects = JSON.parse(await sendRequest(this.getAppTokens.portal_url,"sonet_group.get",params,this.getAppTokens.access_token)).result;
          this.projects = projects;
          return projects;
        },
        async onFileSelect(e){
          this.setActive();
          // console.log(e.dataTransfer,e.target.files);
          this.errorMessage = ""
          this.showError = false;
          if(e.dataTransfer && e.dataTransfer.files){
            for(let file of e.dataTransfer.files){
              if(!await this.getFile(file)){
                this.errorMessage = "Нельзя выбрать файл больше 15 MB"
                this.showError = true;
              }
            }
          }else if(e.target.files[0]){
            for(let file of e.target.files){
              if(!await this.getFile(file)){
                this.errorMessage = "Нельзя выбрать файл больше 15 MB"
                this.showError = true;
              }
            }
          }
        },
        setActive() {
          this.active = true;
          clearTimeout(this.inActiveTimeout) // clear the timeout
        },
        setInactive() {
          this.inActiveTimeout = setTimeout(() => {
              this.active = false
          }, 100)
          this.active = false;
        },
        async getFile(file){ // работы с файлами при дробе и при селекте из input
          // let file = e.dataTransfer.files[0];
          if(file.size<15728640){
            file.formatedSize = this.formatBytes(file.size);
            console.log(file.size," --> ",file.formatedSize);
            file.base64 = await this.fileToBase64(file);
            file.format = file.name.split(".")[file.name.split(".").length-1];
            file.newName = this.truncateText(file.name,20)+'.'+file.format;
            file.id = this.generateUniqueId();
            this.fields.files.push(file);
            this.files.push(file);
            // console.log(this.files);
            return true;
          }else{
            console.log("болшой файл",file.size);
            return false;
          }
          /* let decodeFile = this.dataURLtoFile(`data:${file.type};base64,${encodeFile}`,file.name); 
          console.log(e.dataTransfer.files); */
        },
        formatBytes(bytes, decimals = 2) { // форматириуем байты в человеческий вид
          if (bytes === 0) return '0 Bytes';

          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));

          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        dataURLtoFile(dataurl, filename) { // из строки base64 обратно в файл
          var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[arr.length - 1]), 
              n = bstr.length, 
              u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, {type:mime});
        },
        truncateText(text, maxLength) {
          if (text.length <= maxLength) {
            return text;
          }
          return text.slice(0, maxLength) + '...';
        },
        async fileToBase64(file) { // файл в строку base64
          return new Promise(async (resolve, reject) => {
            const reader = new FileReader();
            /* reader.readAsArrayBuffer(file); */
            reader.readAsDataURL(file);

            reader.onload = () => {
              const base64String = reader.result.split(',')[1];
              resolve(base64String);
            };
            reader.onerror = error => {
              reject(error);
            };
          });
        },
        showDropDownList(){
          // this.getP rojects({});
          // this.dropdownShow = !this.dropdownShow;
        },
        async searchProjects(e){
          let value = e.target.value;
          let projectParams = {};
          if(e.target.value!=""){
            projectParams.FILTER = {
              "%NAME":value
            };
          }
          let projects = await this.getProjects(projectParams);
          this.dropdownShow = true;
          this.fields.projectId = "";
        },
        selectProject(project){
          this.dropdownShow = !this.dropdownShow;
          this.fields.projectName = project.NAME;
          this.fields.projectId = project.ID;
        },
        preventDefaults(e) {
          e.preventDefault();
        },
        onClickOutside(event) {
          if (this.dropdownShow==true && this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
            this.dropdownShow = false;
          }
        },
        generateUniqueId() {
          return '_' + Math.random().toString(36).substr(2, 9);
        },
        closeError(){
            this.showError=false;
        }
    },
    computed: {
      ...mapGetters(["getAppTokens"]),
      ...mapActions(["getTokens"]),
    },
    async created() {
      // Запустите действия при инициализации приложения
      if(this.getAppTokens==undefined || Object.keys(this.getAppTokens).length==0){
        // this.getTokens;
      }
    },
    async mounted() {
      let projectsRes = await this.getProjects({});
      if(projectsRes){
        this.fields.projectName = this.projects[0].NAME;
        this.fields.projectId = this.projects[0].ID;
      }
      this.events.forEach((eventName) => {
          document.body.addEventListener(eventName, this.preventDefaults)
      });
      document.addEventListener('click', this.onClickOutside);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.onClickOutside);
    },
    unmounted() {
      this.events.forEach((eventName) => {
          document.body.removeEventListener(eventName, this.preventDefaults)
      })
    },
    watch: {},
  }
          
</script>

