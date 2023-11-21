<template lang="pug">
div.main-grid-header
    div.main-grid-row-head(v-if="fieldKeys")
        div.main-grid-cell-head.main-grid-cell-left(v-for="field in fieldKeys" :data-field="field.title")
            div.main-grid-cell-inner
                span.main-grid-cell-head-container
                    span.main-grid-head-title {{field.name}}
                    span.main-grid-resize-button(:title="field.title")
                    span.main-grid-control-sortmain-grid-control-sort-desc
    div.main-grid-row-head(v-else)
        div.main-grid-cell-head.main-grid-cell-left(v-for="field in headerTitles" :data-field="field.title")
            div.main-grid-cell-inner
                span.main-grid-cell-head-container
                    span.main-grid-head-title {{field.name}}
                    span.main-grid-resize-button(:title="field.title")
                    span.main-grid-control-sortmain-grid-control-sort-desc

</template>

<script>

  import {mapActions, mapGetters} from "vuex"

  export default {
    name: 'GridHead',
    props: {
      fieldKeys: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        headerTitles:[
          {name:"Название", title:"TITLE"},
          { name:"Дата создания", title:"DATE_START"},
          { name:"Крайний срок", title:"DEADLINE"},
          { name:"Постановщик", title:"CREATED_BY"},
          { name:"Ответственный", title:"Исполнитель"},
          { name:"Проект", title:"GROUP_ID"},
        ],
      }
    },
    methods: {
    },
    computed: {
    },
    created() {
    },
    watch: {
    }, 
  }
          
</script>

