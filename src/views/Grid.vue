<template lang="pug">
button.ui-btn.ui-btn-success(@click="close") Создать
div.sidepanel-task_back(:class="{'open':showModal}")
transition(name="sidebar")
  div.sidepanel-task_popup(v-if="showModal")
    div.sidepanel-close(@click="close")
      div.sidepanel-close-icon-box(title="Закрыть")
        div.sidepanel-close-icon
      span.sidepanel-close-text Закрыть
    div.sidepanel-task_popup-inner
      SidePanel(:auth="getAppTokens")
div.main-grid
  div.main-grid-container
    GridHead
    GridBody(:tasksObj="tasksList")
router-view
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import GridHead from "@/components/grid/GridHead.vue";
import GridBody from "@/components/grid/GridBody.vue";
import SidePanel from "@/components/SidePanel.vue";
import { sendRequest } from "@/assets/scripts/bx24/call.methods";

export default {
  name: "Grid",
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
    SidePanel,
    GridHead,
    GridBody,
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
    this.getTokens;
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
