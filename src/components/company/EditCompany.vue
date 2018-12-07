<template>
    <div>
        
        <div style="text-align: left;">
            
            <p>
                <span class="mycompanyedittitle">公司ID</span>
                <el-input placeholder="公司ID" v-model="companyid"  :disabled="true" style="width:200px"></el-input>
            </p>

            <p>
                <span class="mycompanyedittitle">公司名</span>
                <el-input placeholder="请输入公司名" v-model="companyname" style="width:200px"></el-input>
                <span style="color:red;">*</span>
            </p>

            <p>
                <span class="mycompanyedittitle">APIKEY</span>
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
            companyid:'',
            companyname:'',
            apikey:''
        }
    },
    methods:{


        submit(){
            this.$confirm("是否确认提交？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
            }).then(()=>{
                var _this=this
                var p = this.checkvalues();
                p.then(
                function(res) {
                console.log("resolve:" + res);
                _this.updatecompany();
                },
                function(res) {
                console.log(res);
                }
            ).catch(err => {
                console.log(err);
            });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });



            

        },
        updatecompany(){
            console.log("进入更新公司")
            let params= new URLSearchParams;
            params.append("companyname",this.companyname)
            params.append("companyid",this.companyid)
            if(this.apikey!=''&&this.apikey!=null&&this.apikey!=undefined)
                params.append("apikey",this.apikey)
            
            this.$axios.post("/api/company/updatecompany",params).then(data=>{
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
             if(this.companyid==''||this.companyid==null||this.companyid==undefined){
                    this.$message({
                    type: "error",
                    message: "公司ID不能为空"
                    });
                    return Promise.reject(-1);
             }
              return Promise.resolve(1);  
         }
    },

    created(){
        this.row = this.$route.query.row;
        let params = new URLSearchParams();
      if (
        this.row.id != "" &&
        this.row.id != null &&
        this.row.id != undefined
      ) {
        sessionStorage.setItem("updatecompanyid", this.row.id);
        params.append("companyid", this.row.id);
        
      } else params.append("companyid", sessionStorage.getItem("updatecompanyid"));
        this.companyid=sessionStorage.getItem("updatecompanyid")
        this.$axios.post("/api/company/getcompanybyid",params).then(data=>{
            this.companyname=data.data.data.companyname;
            this.apikey=data.data.data.apikey
        })

    }



}

</script>
<style scoped>

.mycompanyedittitle {
  display: inline-block;

  width: 80px;
  text-align: right;
  color: #606266;
}

</style>