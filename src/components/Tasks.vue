<template lang="pug"> 
router-view
</template>


<script>
// @ is an alias to /src
  // import {mapActions, mapGetters} from "vuex"
  // import {sendRequest} from "../src/assets/scripts/bx24/call.methods"
console.log(import.meta.env);
export default {
  name: 'Tasks',
  data () {
    return {
      appAuth:{},
      tasksList:{},
      projectsId:[]
    }
  },
  components: {
  },
}
</script>