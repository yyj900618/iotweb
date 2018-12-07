<template>

    <div>
        <div id="searchcompany">
          公司ID: <el-input  placeholder="请输入公司ID" v-model="companyid" clearable  style="width:200px"></el-input>
          公司名: <el-input  placeholder="请输入公司名" v-model="companyname" clearable  style="width:200px"></el-input>
          状态: <el-select  v-model="isvalid" clearable placeholder="请选择状态" style="width:150px">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>  

                <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>

                <el-button type="primary" icon="el-icon-circle-plus" @click="addCompany()" v-hasPermission="'company:add'">新增</el-button>
        </div>

      

      <el-table
      :data="tableData.filter(data => !search || data.id.toLowerCase().includes(search.toLowerCase()))"
      :header-cell-style="getRowClass"
      :row-style="tableRowStyle">

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>

            <el-form-item label="公司名">
              <span>{{ props.row.companyname }}</span>
            </el-form-item>

            <el-form-item label="APIKEY">
              <span v-if="props.row.isvalid==1">有效</span>
              <span v-if="props.row.isvalid==0">无效</span>
            </el-form-item>


            <el-form-item label="APIKEY">
              <span>{{ props.row.apikey }}</span>
            </el-form-item>

            <el-form-item label="创建时间">
              <span>{{ props.row.createtime }}</span>
            </el-form-item>

            <el-form-item label="更新时间">
              <span>{{ props.row.updatetime }}</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="公司ID" prop="id"></el-table-column>

      <el-table-column label="公司名" prop="companyname"></el-table-column>

      <el-table-column label="是否有效" prop="isvalid">
          <template slot-scope="scope">
            <span v-if="scope.row.isvalid==1">有效</span>
            <span v-if="scope.row.isvalid==0">无效</span>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot="header" slot-scope="slot">
          <el-input v-model="search" size="mini" placeholder="设备ID过滤"/>
          <br>
        </template>

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            title="编辑"
            @click="handleEdit(scope.$index, scope.row)"
            v-hasPermission="'company:update'"
          ></el-button>
         
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            title="删除"
            @click="handleDelete(scope.$index, scope.row)"
            v-hasPermission="'company:delete'"
          ></el-button>

          <el-button
            v-show="scope.row.isvalid==1"
            size="mini"
            type="warning"
            icon="fa fa-lock"
            circle
            title="锁定"
            @click="handleUnlockOrLock(scope.$index, scope.row,0)"
            v-hasPermission="'company:update'"
          ></el-button>

          <el-button
            v-show="scope.row.isvalid==0"
            size="mini"
            type="warning"
            icon="fa fa-unlock"
            circle
            title="解锁"
            @click="handleUnlockOrLock(scope.$index, scope.row,1)"
            v-hasPermission="'company:update'"
          ></el-button>

        </template>
      </el-table-column>
    </el-table>

</div>
</template>
<script>
export default {
    data() {
        return{
            tableData:[],
            search:'',
            companyid:'',
            companyname:'',
            isvalid: '',
            options: [{
                value: '1',
                label: '有效'
                }, {
                value: '0',
                label: '禁用'
            }]
            
            }
    },
methods: {

    handleUnlockOrLock(index,row,isvalid){
      console.log("锁定/解锁按钮")
      let params = new URLSearchParams();
      params.append("companyid",row.id);
      params.append("isvalid",isvalid);
      this.$axios.post("/api/company/lockcompanybyid",params).then(data=>{
        if(data.data.code==0){
          this.tableData[index].isvalid=isvalid
          this.$message({
          type: "success",
          message: "操作成功"
          });
        }else{
          this.$message({
          type: "error",
          message: "操作失败"
          });

        }
      })
    },

    // handleUnlock(index,row){
    //   console.log("解锁按钮")
    //   let params = new URLSearchParams();
    //   params.append("companyid",row.id);
    //   params.append("isvalid",1);
    //   this.$axios.post("/api/company/lockcompanybyid",params).then(data=>{
    //      if(data.data.code==0){
    //       this.tableData[index].isvalid=1
    //       this.$message({
    //       type: "success",
    //       message: "解锁成功"
    //       });
    //     }else{
    //       this.$message({
    //       type: "error",
    //       message: "解锁失败"
    //       });

    //     }       
    //   })
    // },


    handleDelete(index,row){
       console.log("删除按钮")

      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{

        let params = new URLSearchParams() 
        if(row.id!=''&&row.id!=null&&row.id!=undefined)
          params.append('companyid', row.id)
          this.$axios.post('/api/company/deletecompany',params).then(data=>{
              console.log(data);
              if(data.data.code==0){
                this.$message({
                type: "success",
                message: data.data.msg
                });
                this.tableData.splice(index,1)
              }else{
                this.$message({
                type: "error",
                message: data.data.msg
                });
              }
          }) 

        }).catch(() => {
            this.$message({
              type: "info",
              message: "取消"
            });
          });


      

      
    },
    handleEdit(index,row){
      console.log("编辑按钮")
      this.$router.push({ path: "/company/companyupdate",query: { index: index, row: row }});
    },

     addCompany(){
      console.log("新增按钮")
      this.$router.push({ path: "/company/companyadd" });
    },

    handleSearch(){
      let params= new URLSearchParams
      if(this.companyid!=''&&this.companyid!=null&&this.companyid!=undefined)
        params.append("companyid",this.companyid)
      if(this.companyname!=''&&this.companyname!=null&&this.companyname!=undefined)
        params.append("companyname",this.companyname)
      if(this.isvalid!=''&&this.isvalid!=null&&this.isvalid!=undefined)
        params.append("isvalid",this.isvalid)
      this.$axios.post("/api/company/getcompanylist",params).then(data=>{
        console.log(data)
        this.tableData=data.data.data
      })


      console.log("搜索按钮")
    },
   

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F7F6Fd;color: #606266;font-weight: 500;";
      }
    },

    tableRowStyle({ row, rowIndex }) {
      return "background-color: #F7F6Fd";
    },

},

created(){
    this.$axios.post("/api/company/getcompanylist").then(data=>{
        console.log(data)
        this.tableData=data.data.data
    })
}



}

</script>
<style scoped>

#searchcompany {
  color: #606266;
  font-size: 16px;
  text-align: left;
  margin-top: 20px;
  margin-right: auto;
  margin-bottom: 20px;
  margin-left: auto;
}

</style>