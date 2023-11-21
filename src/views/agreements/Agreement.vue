<template lang="pug">
div.sidepanel-task_back(:class="{'open':showModal}")
transition(name="sidebar")
  div.sidepanel-task_popup(v-if="showModal")
    //- a.sidepanel-close(href="/")
    //- router-link.sidepanel-close(@click="close" to="/")
    div.sidepanel-close(@click="close")
      div.sidepanel-close-icon-box(title="Закрыть")
        div.sidepanel-close-icon
      span.sidepanel-close-text Закрыть
    div.sidepanel-task_popup-inner
      div.task__detail-box(v-if="agreement")
        //- div.task__detail-header.task__detail-item
          h3.task__detail-header-title {{agreement.NAME}}
        div.task__detail-content.task__detail-item
          div.task__detail-info
            //- div.task__detail-info_header
              h3.task_detail-task_name Номер договора 
            div.agreement__about-content 
              div.agreement__about-field.agreement__field-NAME 
                span.agreement__field-title Номер договора:
                span.agreement__field-value {{agreement.NAME}} 
              div.agreement__about-field.agreement__field-PROPERTY_3205 
                span.agreement__field-title Дата договора:
                span.agreement__field-value {{  agreement.PROPERTY_3205[Object.keys(agreement.PROPERTY_3205)[0]]  }} 
              div.agreement__about-field.agreement__field-PROPERTY_3205 
                span.agreement__field-title Стоимость:
                span.agreement__field-value {{  agreement.PROPERTY_3206[Object.keys(agreement.PROPERTY_3206)[0]]  }} 
              div.agreement__about-field.agreement__field-PROPERTY_3205 
                span.agreement__field-title НДС 12%:
                span.agreement__field-value {{  agreement.PROPERTY_3207[Object.keys(agreement.PROPERTY_3207)[0]]  }} 
              div.agreement__about-field.agreement__field-PROPERTY_3205 
                span.agreement__field-title Стоимость с учетом НДС:
                span.agreement__field-value {{  agreement.PROPERTY_3208[Object.keys(agreement.PROPERTY_3208)[0]] }} 
              div.agreement__about-field.agreement__field-PROPERTY_3211 
                span.agreement__field-title Срок действия с:
                span.agreement__field-value {{  agreement.PROPERTY_3211[Object.keys(agreement.PROPERTY_3211)[0]] }} 
              div.agreement__about-field.agreement__field-PROPERTY_3212 
                span.agreement__field-title Срок действия до:
                span.agreement__field-value {{  agreement.PROPERTY_3212[Object.keys(agreement.PROPERTY_3212)[0]] }} 
              div.agreement__about-field.agreement__field-PROPERTY_3213 
                span.agreement__field-title Файл:
                a.agreement__field-value(:href="`https://${getAppTokens.portal_url}`+agreement.PROPERTY_3213.value" type="download") Скачать файл 
              div.agreement__about-field.agreement__field-PROPERTY_3214 
                span.agreement__field-title Ссылка на договор:
                a.agreement__field-title(:href="agreement.PROPERTY_3214.value" target="_blank") drx.micros.uz

</template>

<script>

  import {mapActions, mapGetters} from "vuex"
  import {sendRequest} from "@/assets/scripts/bx24/call.methods"
    export default {
      name: 'Agreement',
      data() {
        return {
          loader:false,
          agreement:null,
          showModal: false,
          body:document.querySelector("body"),
          linkToAgreement:document.querySelector(".agreement__field-value a")
        }
      },
      methods: {
        close(e) {
          e.prevent;
          this.body.style.overflow=!this.showModal?"hidden":"auto";
          this.showModal = !this.showModal;
          setTimeout(() => this.$router.push('/agreements'), "350");
        },
        async getFile(object,field){
          // console.log(field);
            let params = {
              'IBLOCK_TYPE_ID': 'lists',
              'IBLOCK_ID':object.IBLOCK_ID,
              'ELEMENT_ID': object.ID,
              'FIELD_ID': field.split("_")[1]
            };
            const file = JSON.parse(await sendRequest(JSON.parse(sessionStorage.tokens).portal_url,"lists.element.get.file.url",params,JSON.parse(sessionStorage.tokens).access_token)).result; // элементы инфоблока "список"
            // console.log(file[0]);
            return file[0];
        },
        formatDate(dateString) {
          const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
          ];

          const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          };

          const dateObject = new Date(dateString);
          return dateObject.toLocaleDateString('ru-RU', options)
            .replace(dateObject.getDate(), (dateObject.getDate() < 10 ? '0' : '') + dateObject.getDate())
            .replace(dateObject.toLocaleDateString('ru-RU', { month: 'long' }), months[dateObject.getMonth()])
            .replace('г. в', '');
        },
        async getElement(token) {
          let params = {
            IBLOCK_TYPE_ID: "lists",
            IBLOCK_ID: "452",  
            FILTER:{
              "ID":this.$route.params.id
            }
          };
              console.log(token);
          let newAgreement = JSON.parse(await sendRequest(token.portal_url,"lists.element.get",params,token.access_token)).result[0]; // элементы инфоблока "список"
          // console.log(newAgreement);
          // this.agreement = {};
          for(let field in newAgreement){
            // this.agreement[field] = {name:field,value:newAgreement[field]}
            if(field=="PROPERTY_3213"){
              let file = await this.getFile({"ID":newAgreement.ID,"IBLOCK_ID":newAgreement.IBLOCK_ID},"PROPERTY_3213");
              newAgreement.PROPERTY_3213 = {value:file};
            }else if(field=="PROPERTY_3214"){
              let hrefStr = newAgreement[field][Object.keys(newAgreement[field])[0]].TEXT;

              // Создаем временный контейнер для парсинга
              const tempContainer = document.createElement('div');
              tempContainer.innerHTML = hrefStr;
              const hrefValue = tempContainer.querySelector('a').getAttribute('href');

              newAgreement.PROPERTY_3214 = {value:hrefValue};
            }
          }
          this.agreement = newAgreement;
          // console.log(this.agreement);

          this.body.style.overflow=!this.showModal?"hidden":"auto";
          this.showModal = true;
        }
      },
      computed: {
      ...mapGetters(["getAppTokens"]),
      },
      mounted(){
      },
      created() {
        // this.$router.go()
        // this.$store.dispatch('getAuthPortal');
      },
      watch: {
        getAppTokens:{
          immediate: true,
          async handler(newValue, oldValue) {
            if(Object.keys(newValue).length!=0){
              this.getElement(newValue);
              // this.agreement = agreementAr[0];
              // console.log(this.agreement);
            } 
          }
        }
      }
    };
</script>