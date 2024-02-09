<template lang="pug">
//- div.task__create-btn
//-   button.ui-btn.ui-btn-success(@click="close") Создать
//-   //- button.ui-btn.ui-btn-success.ui-btn-icon-add.ui-btn-round(@click="close") Создать
//- div.sidepanel-task_back(:class="{'open':showModal}")
//- transition(name="sidebar")
//-   div.sidepanel-task_popup(v-if="showModal")
//-     div.sidepanel-close(@click="close")
//-       div.sidepanel-close-icon-box(title="Закрыть")
//-         div.sidepanel-close-icon
//-       span.sidepanel-close-text Закрыть
//-     div.sidepanel-task_popup-inner
//-       SidePanel(:auth="getAppTokens")
div.main-grid
  div.main-grid-container
    GridHead(:fieldKeys="projectKeys")
    GridProjects(:projectsArray="[projectsFields,projectKeys]")
router-view
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import GridHead from "@/components/grid/GridHead.vue";
import GridProjects from "@/components/grid/GridProjects.vue";
import { sendRequest } from "@/assets/scripts/bx24/call.methods";

export default {
  name: "Projects",
  data() {
    return {
      projectsFields: [],
      projectKeys:[
        // { name:"ID", title:"ID"},
        { name:"Название", title:"NAME"},
        // { name:"Активность", title:"ACTIVE"},
        { name:"Дата последнией активности", title:"DATE_ACTIVITY"},
        { name:"Дата создание", title:"DATE_CREATE"},
        { name:"Дата обновления", title:"DATE_UPDATE"},
        { name:"Количество участников", title:"NUMBER_OF_MEMBERS"},
        // { name:"Тип приватности", title:"OPENED"},
      ],
    };
  },
  components: {
    GridHead,
    GridProjects,
  },
  methods: {
  },
  computed: {
    ...mapGetters(["getAppTokens"]),
    ...mapActions(["getTokens"]),
  },
  created() {
    // Запустите действия при инициализации приложения
    if(Object.keys(this.getAppTokens).length==0){
      this.getTokens;
    }
  },
  watch: {
    getAppTokens: {
      immediate: true,
      async handler(newValue, oldValue) {
        // console.log(newValue);
        let paramsProject = {IS_ADMIN:"N"};
        console.log(this.getAppTokens);
        if (newValue.access_token) {
          console.time("Время выполнения скрипта"); //

          this.projectsFields = JSON.parse(await sendRequest(newValue.portal_url,"sonet_group.get",paramsProject,newValue.access_token)).result;
        
          console.timeEnd("Время выполнения скрипта"); //
        }
      },
    },
  },
};
</script>
