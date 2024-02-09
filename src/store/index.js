import { createStore } from 'vuex'

export default createStore({
  state: {
    app_tokens:{},
  },
  getters: {
    getAppTokens(state){
      return state.app_tokens
    }
  },
  mutations: {
    getAppTokensMutation(state,app_tokens){
      return state.app_tokens = app_tokens;
    }
  },
  actions: {
    async getTokens({commit}){
      if(import.meta.env.MODE=="development"){
        let refreshToken = "43de85650068ca490004ce04000021e0000007249027b562081e03c3903a82fc71c5df",
          portal_url = "cp.micros.uz",
          client_id = "local.655e3c8e4e20d6.38542819",
          client_secret = "l5JkyaghQalIx1rf0jULA316kt5HaZ6vzBBSKvzMp8w6JVufPN";

        var requestOptions = {
          method: 'POST',
          redirect: 'follow',
          'x-target': 'https://micros.uz'
        };
        
        let url = import.meta.env.NODE_ENV=="production"?"https://micros.uz":"/proxy";
        await fetch(`${url}/it/solutions_our/micros.tech.support/ajax.php?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refreshToken}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            let newObject = {
              "access_token": result.access_token ,
              "refresh_token": result.refresh_token,
              "client_id":client_id,
              "client_secret":client_secret ,
              "portal_url":portal_url
            }
            sessionStorage.tokens = JSON.stringify(newObject);
            commit("getAppTokensMutation",newObject);
            
          })
          .catch(error => console.log('error', error));
      
      }else{
        // if(!sessionStorage.tokens){
          
          var requestOptions = {
            method: 'POST',
            redirect: 'follow'
          };
          
          BX24.callMethod("app.option.get", {}, async (result) => {
            // sessionStorage.tokens = JSON.stringify(result.data());
            let url = import.meta.env.NODE_ENV=="production"?"https://micros.uz":"/proxy",
            authTokens = result.data().tokens,
              refreshToken = authTokens.refresh_token,
              client_id = authTokens.client_id,
              client_secret = authTokens.client_secret,
              portal_url = authTokens.portal_url;


            await fetch(`${url}/it/solutions_our/micros.tech.support/ajax.php?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refreshToken}`, requestOptions)
              .then(response => response.json())
              .then(result => {
                let newObject = {
                  "access_token": result.access_token ,
                  "refresh_token": result.refresh_token,
                  "client_id":client_id,
                  "client_secret":client_secret ,
                  "portal_url":portal_url
                }
                sessionStorage.tokens = JSON.stringify(newObject);
                commit("getAppTokensMutation",newObject);
                BX24.callMethod("app.option.set",{
                  "options":{
                    "tokens":newObject, 
                  }
                  },function(result){
                      if(result.error()){
                        console.log(result.error());
                      }else{
                        console.log(result.data());
                      }
                });
              })
              .catch(error => console.log('error', error));
          });
        // }
      }
    }
  },
  modules: {
  }
})
