<template lang="pug">
div.settings__wrapper
    div.settings__wrapper-inner
        h1.settings__wrapper-inner Пока в разработке
</template>
<script>

    import { mapActions, mapGetters } from "vuex";
    export default {
    name: "Settings",
    data() {
        return {
        };
    },
    components: {
    },
    methods: {
    },
    computed: {
        ...mapGetters(["getAppTokens"]),
        ...mapActions(["getTokens"]),
    },
    created() {
        // Запустите действия при инициализации приложения
        this.getTokens;
    },
    watch: {},
};
</script>
