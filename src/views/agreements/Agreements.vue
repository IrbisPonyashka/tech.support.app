<template lang="pug">
div.task__create-btn
  button.ui-btn.ui-btn-success(@click="close") Заявка на сервисное облуживание
  //- button.ui-btn.ui-btn-success.ui-btn-icon-add.ui-btn-round(@click="close") Заявка на сервисное облуживание
div.sidepanel-task_back(:class="{'open':showModal}")
transition(name="sidebar")
  div.sidepanel-task_popup(v-if="showModal")
    div.sidepanel-close(@click="close")
      div.sidepanel-close-icon-box(title="Закрыть")
        div.sidepanel-close-icon
      span.sidepanel-close-text Закрыть
    div.sidepanel-task_popup-inner
      TicketBar(:auth="getAppTokens")
div.main-grid
  div.main-grid-container
    GridHead(:fieldKeys="agreementKeys")
    GridAgreements(:agreementsArr="[agreements,agreementKeys]")
router-view
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import GridHead from "@/components/grid/GridHead.vue";
import GridAgreements from "@/components/grid/GridAgreements.vue";
import TicketBar from "@/components/sidebar/TicketBar.vue";
import { sendRequest } from "@/assets/scripts/bx24/call.methods";

export default {
  name: "Agreements",
  data() {
    return {
      appAuth: {},
      agreements: {},
      showModal: false,
      iblockId: [],
      agreementKeys:[
        // {name:"ID",title:"ID"},
        {name:"Название",title:"NAME"},
        {name:"Дата договора",title:"PROPERTY_3205"}, //  
        {name:"Стоимость",title:"PROPERTY_3206"}, //  
        {name:"НДС 12%",title:"PROPERTY_3207"}, // 
        {name:"Стоимость с учетом НДС",title:"PROPERTY_3208"}, // 
        {name:"Срок действия с",title:"PROPERTY_3211"}, // 
        {name:"Срок действия по",title:"PROPERTY_3212"}, // 
        {name:"Файл",title:"PROPERTY_3213"}, // 
        {name:"Cсылка на договор",title:"PROPERTY_3214"}, //  
        // {name:"Заказчик",title:"PROPERTY_3230"}, //  
      ],
      body:document.querySelector("body")
    };
  },
  components: {
    TicketBar,
    GridHead,
    GridAgreements,
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.body.style.overflow=!this.showModal?"hidden":"auto";
      this.showModal = !this.showModal;
    },
    handleResize(e) {
      console.log(e);
    }
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
        if(newValue.access_token) {
          console.time("Время выполнения скрипта");

          /* let paramsProject = {};
          var iblock = JSON.parse(await sendRequest("cp.micros.uz","lists.get.json",paramsProject,newValue.access_token)).result; // инфоблок список
          iblock.forEach((el) => {
            iblock.push(el.GROUP_ID);
          }); */

          let params = {
            IBLOCK_TYPE_ID: "lists",
            IBLOCK_ID: "452",  
          };

          let selectID= ["ID","NAME",
              "PROPERTY_3205", // Дата договора 
              "PROPERTY_3206", // стоимость 
              "PROPERTY_3207", // НДС 12%
              "PROPERTY_3208", // Стоимость с учетом НДС
              "PROPERTY_3211", // Срок действия с
              "PROPERTY_3212", // Срок действия по
              "PROPERTY_3213", // файл
              "PROPERTY_3214", // ссылка на договор 
              "PROPERTY_3230", // Заказчик 
          ];
          let seletcName = [
            "ID","NAME","Дата договора","Стоимость","НДС 12%","Стоимость с учетом НДС","Срок действия с","Срок действия по","Файл","Ссылка надоговор","Заказчик"
          ];
          // console.log(newValue);
          this.agreements = JSON.parse(await sendRequest(newValue.portal_url,"lists.element.get",params,newValue.access_token)).result; // элементы инфоблока "список"

          /* фильтруем список полей 
            let fieldsparams = {
              "IBLOCK_TYPE_ID": "lists",
              "IBLOCK_ID": "452",
              // "FIELD_ID" : select
            };
            let x = [];  
            let fields = JSON.parse(await sendRequest("cp.micros.uz","lists.field.get",fieldsparams,newValue.access_token)).result; // элементы инфоблока "список"
            for(let key in fields){
              x.push(selectID.map(arrKey => { 
                if(fields[key].FIELD_ID==arrKey){
                  return console.log(fields[key]);
                }
              }))
            } 
          */
          
          console.timeEnd("Время выполнения скрипта");
        }
      },
    },
  },
};
</script>
