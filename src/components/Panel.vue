<template lang="pug">
div.app__panel-view
    div.app__panel-inner
        //- div.app__panel-logo
        div.app__panel-blocks
            ul.app__panel-list
                router-link.router-link-active.router-link-exact-active.app__panel-item(:to="'/'" :class="{'active':isActive('/')}")
                    div.ui-icon.ui-icon-service-dod
                        i
                    span.app__panel-link Задачи
                router-link.router-link-active.router-link-exact-active.app__panel-item(:to="'/projects/'" :class="{'active':isActive('/projects/')}")
                    div.ui-icon.ui-icon-common-company
                        i
                    span.app__panel-link Проекты
                router-link.router-link-active.router-link-exact-active.app__panel-item(:to="'/agreements/'" :class="{'active':isActive('/agreements/')}")
                    div.ui-icon.ui-icon-service-deal
                        i
                    span.app__panel-link Договоры
                router-link.router-link-active.router-link-exact-active.app__panel-item(:to="'/settings/'" :class="{'active':isActive('/settings/')}")
                    div.ui-icon.ui-icon-service-wheel
                        i
                    span.app__panel-link Настройки
</template>
<script>
export default {
  name: 'Panel',
  data () {
    return {
      appAuth:{},
      tasksList:{},
      projectsId:[],
      currentPage:this.$route.name
    }
  },
  methods:{
    isActive(route) {
      return this.$route.path === route;
    },
  },
  components: {
  },
  mounted(){
  }
}
</script>