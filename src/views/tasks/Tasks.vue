<template lang="pug">
div.task__create-btn
  button.ui-btn.ui-btn-success(@click="close") Создать
  //- button.ui-btn.ui-btn-success.ui-btn-icon-add.ui-btn-round(@click="close") Создать
div.sidepanel-task_back(:class="{'open':showModal}" @click="close")
transition(name="sidebar")
  div.sidepanel-task_popup(v-if="showModal")
    div.sidepanel-close(@click="close")
      div.sidepanel-close-icon-box(title="Закрыть")
        div.sidepanel-close-icon
      span.sidepanel-close-text Закрыть
    div.sidepanel-task_popup-inner
      TaskBar(:auth="getAppTokens")
div.main-grid
  div.main-grid-container
    GridHead
    GridTasks(:tasksObj="tasksList")
router-view
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import GridHead from "@/components/grid/GridHead.vue";
import GridTasks from "@/components/grid/GridTasks.vue";
import TaskBar from "@/components/sidebar/TaskBar.vue";
import { sendRequest } from "@/assets/scripts/bx24/call.methods";

export default {
  name: "Tasks",
  data() {
    return {
      appAuth: {},
      tasksList: {},
      showModal: false,
      projectsId: [],
      body:document.querySelector("body")
    };
  },
  components: {
    TaskBar,
    GridHead,
    GridTasks,
  },
  methods: {
    close(e) {
      e.prevent;
      this.body.style.overflow=!this.showModal?"hidden":"auto";
      this.showModal = !this.showModal;
    },
    handleResize(e) {
      console.log(e);
    },
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
        let paramsProject = {};
        if (newValue.access_token) {
          // async function checkTime(){

          console.time("Время выполнения скрипта");
          var projects = JSON.parse(await sendRequest(newValue.portal_url,"sonet_group.user.groups",paramsProject,newValue.access_token)).result;
          // var projectsId = projects.filter((project) => { project.GROUP_ID});
          var projectsId = [];
          projects.forEach((el) => {
            projectsId.push(el.GROUP_ID);
          });

          let paramsTasks = {
            filter: {
              GROUP_ID: projectsId,
            },
            order: {
              ID: "ACS",
            },
            select: [
              "ID",
              "TITLE",
              "DATE_START",
              "RESPONSIBLE_ID",
              "CREATED_DATE",
              "DEADLINE",
              "CLOSED_DATE",
              "CREATED_BY",
              "GROUP_ID",
            ],
          };
          this.tasksList = JSON.parse(await sendRequest(newValue.portal_url,"tasks.task.list",paramsTasks,newValue.access_token)).result.tasks;

          console.timeEnd("Время выполнения скрипта");
        }
      },
    },
  },
};
</script>
