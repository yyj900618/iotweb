<template>
    <div>
        
        <div style="text-align: left;">
            <p>
                <span class="mycompanyaddtitle">公司名</span>
                <el-input placeholder="请输入公司名" v-model="companyname" style="width:200px"></el-input>
                <span style="color:red;">*</span>
            </p>

            <p>
                <span class="mycompanyaddtitle">APIKEY</span>
                <el-input placeholder="请输入APIKEY" v-model="apikey" style="width:200px"></el-input>
            </p>
        </div>

        <p>
            <el-button type="primary" @click="submit()">提交</el-button>
            <el-button type="success" @click="back()">返回</el-button>
        </p>

    </div>
</template>
<script>
export default {
    data() {
        return{
            companyname:'',
            apikey:''
        }
    },
    methods:{
        submit(){
            var _this=this
            var p = this.checkvalues();
            p.then(
            function(res) {
            console.log("resolve:" + res);
            _this.addcompany();
            },
            function(res) {
            console.log(res);
            }
        ).catch(err => {
            console.log(err);
        });

        },
        addcompany(){
            console.log("进入添加公司")
            let params= new URLSearchParams;
            params.append("companyname",this.companyname)
            if(this.apikey!=''&&this.apikey!=null&&this.apikey!=undefined)
                params.append("apikey",this.apikey)
            
            this.$axios.post("/api/company/addcompany",params).then(data=>{
                if(data.data.code==0){
                    this.$message({
                    type: "success",
                    message: data.data.msg
                    });
                }else{
                    this.$message({
                    type: "error",
                    message: data.data.msg
                    });
                }
            })
        },





        back(){
          this.$router.go(-1);
        },


         checkvalues(){
             if(this.companyname==''||this.companyname==null||this.companyname==undefined){
                    this.$message({
                    type: "error",
                    message: "公司名不能为空"
                    });
                    return Promise.reject(-1);
             }
              return Promise.resolve(1);  
         }

    },



}

</script>
<style scoped>

.mycompanyaddtitle {
  display: inline-block;

  width: 80px;
  text-align: right;
  color: #606266;
}

</style>