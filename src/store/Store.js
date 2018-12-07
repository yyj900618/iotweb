import Vue from 'vue'

import  Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
      user:{},
      
    },
    mutations: {
        login (state, userid) {
            state.user.id=userid;
            state.user.islogin=true
            sessionStorage.setItem("user",JSON.stringify(state.user))

          },
    },

    actions:{
        login(context){
            context.commit('login')
        } 
    },

    getters: {
        getisloginById: (state) => (id) => {
             if(state.user.id!=undefined&&state.user.islogin!=undefined){
                if(id==state.user.id)
                    return state.user
                else
                    return {id:id,islogin:false};    
             }   
                
             else{
                 var userstr=sessionStorage.getItem("user")
                 if(userstr!==''&&userstr!=null&&userstr!=undefined){
                    var userjosn=JSON.parse(userstr)
                    if(id==userjosn.id){
                        state.user=userjosn
                        return state.user
                    }
                        
                    else
                        return {id:id,islogin:false}; 
                }else
                    return null;
             }   
          }
        }


  })

  export default store