<template>
    <div class="loginbackgound">
        <h1 class="logintitle">欢迎登录后台系统</h1>

        <div class="logintable">
            <p style="text-align: center;margin-top: 60px;">
            <el-input placeholder=" 请输入用户名" v-model="loginname" style=" width: 250px ">
                <i slot="prefix" class="el-input__icon fa fa-id-card fa-lg" aria-hidden="true"></i>
            </el-input>
            </p>
            <p style="text-align: center; margin-bottom: 60px;">
            <el-input v-if="this.ispassword" type="password" placeholder=" 请输入密码" v-model="password" style=" width: 250px" @keyup.enter.native="handleLogin">
                <i slot="prefix" class="el-input__icon fa fa-key fa-lg" aria-hidden="true"></i>
                <i slot="suffix" class="el-input__icon fa fa-eye fa-lg" aria-hidden="true" @click="showpassword()"></i>
            </el-input>

            <el-input v-if="!this.ispassword" type="text" placeholder=" 请输入密码" v-model="password" style=" width: 250px" @keyup.enter.native="handleLogin">
                <i slot="prefix" class="el-input__icon fa fa-key fa-lg" aria-hidden="true"></i>
                 <i slot="suffix" class="el-input__icon fa fa-eye-slash fa-lg" aria-hidden="true" @click="showpassword()"></i>
            </el-input>

            </p>
            <p>
             <el-button type="primary" @click="handleLogin()" style="width:300px" v-if="!logining">登录</el-button>
             
             <el-button type="info" disabled style="width:300px" icon="el-icon-loading" v-if="logining">登录中....</el-button>
            </p>
           
             <!-- <el-button type="success"@click="showpassword()">成功按钮</el-button> -->

        </div>


    </div>
</template>
<script>
export default {

data(){
    return{
        logining:false,
        loginname:'',
        password:'',
        ispassword:true
    }
},
methods:{
    handleLogin(){
        console.log('登录按钮')
        this.logining=true
        let params = new URLSearchParams()
        params.append('loginname', this.loginname)
        params.append('password', this.password)
        
        this.$axios({
              method:"post",
              url:"/api/login",
              params:params,
              }).then(data=>{
                console.log(data)  
                if(data.data.code==0){
                    let userid=data.data.data.id
                    sessionStorage.setItem("userid_login",data.data.data.id)
                    let permissionStr = JSON.stringify(data.data.data.permissionList) 
                    sessionStorage.setItem("permissionStr",permissionStr)
                    sessionStorage.setItem("roletype",data.data.data.roletype)
                    sessionStorage.setItem("companyid",data.data.data.companyid)
                    sessionStorage.setItem("name",data.data.data.name)
                    // let apikeyList= JSON.stringify(data.data.data.apikeyList)
                    // sessionStorage.setItem("apikeylist",apikeyList)
                    // console.log(data.data.data)
                    this.$store.commit('login',userid)
                    this.$router.push({path: '/main'})
                    this.logining=false
                }else{
                    this.logining=false
                    this.$message({
                    type: 'error',
                    message: data.data.msg+":"+data.data.data
                   });
                }
              })
             
    },

    showpassword(){
        // console.log("显示密码")
        this.ispassword=!this.ispassword
        // console.log(this.ispassword)
    },


    handlecheck(){
        console.log('检查按钮')
        let user=this.$store.getters.getisloginById(2);
         console.log(user)
    }

}





}
</script>
<style>
.logintitle{
    text-align: center;
    color: #fff;
   
}
.logintable{
     background-color:rgb(203, 207, 230);
     margin:0 auto;
     border:1px solid #000;
     width:400px;
     height:300px;
     text-align: center;
     border-radius:10px 10px 10px 10px;

}

.loginbackgound{
    height: 550px;
    width: 100%;
    background-color:rgba(48, 51, 230, 0.767);
    padding-top: 100px;



}

</style>