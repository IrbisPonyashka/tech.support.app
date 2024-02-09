<template lang="pug">
div.app__panel
  Panel
div.app__workarea
  router-view
</template>

<script>

import Panel from "@/components/Panel.vue";
export default {
  name: 'App',
  data () {
    return {
      appAuth:{},
      tasksList:{},
      projectsId:[],
    }
  },
  methods:{
  },
  components: {
    Panel
  },
}
</script>