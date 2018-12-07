

<template>
    <div>
        <h1>接收器</h1>
        
        
           
        <p>
            <span class="receivertitle">设备ID：</span> 
            <el-input placeholder="请输入设备号" v-model="device_id" clearable style="width:200px"></el-input>
            <span style="color:red;font-size: 10px;">默认查询所有设备上传消息（时间倒序），可用*进行模糊查询</span> 
        </p>
        <p>
            <span class="receivertitle">查询最大条数：</span> 
            <el-input placeholder="请输入条数" v-model="count" clearable style="width:200px"></el-input>
            <span style="color:red;font-size: 10px;">默认为1000</span> 
        </p>
            
         
         <p>    
            <el-button type="primary" icon="el-icon-search" @click="sreach()">搜索</el-button>
         </p>
        <div v-html="msg">
             {{msg}}
         </div> 
         <!-- <pre>
             {{msg}}
         </pre> -->
        

    </div>
</template>
<script>
import {formatDate} from '../../common/js/DateFormat.js'
export default {
    data(){
        return{
        device_id:'',
        count:'',
        receive:{},
        msg:''
        }
    },
    methods:{
        sreach(){
            this.msg='';
            console.log("点击搜索按钮");
            let params = new URLSearchParams();
            if(this.device_id!=''&&this.device_id!=null&&this.device_id!=undefined)
            params.append('device_id', this.device_id) ;
            
            this.$axios({
                method:"post",
                url:"/api/receive/getcache",
                params:params
                }).then(data=>{
                    if(data.data.code==0){
                    this.receive=data.data.data;
                    console.log(this.receive)
                    this.$message({type: 'success',message: "获取设备上传信息成功"});
                    };

                    this.receive.forEach((item,index) => {
                        if(item.type==2&&item.status==0)
                            this.msg+=formatDate(new Date(item.at),'yyyy-MM-dd hh:mm:ss')+":  设备ID："+item.dev_id+" 下线......."+"<br>";
                        if(item.type==2&&item.status==1)
                            this.msg+=formatDate(new Date(item.at),'yyyy-MM-dd hh:mm:ss')+":  设备ID："+item.dev_id+" 上线......."+"<br>";
                        if(item.type==1)
                            this.msg+=formatDate(new Date(item.at),'yyyy-MM-dd hh:mm:ss')+":  设备ID："+item.dev_id+" 发送消息："+item.value+" 数据流:"+item.ds_id+"<br>";
                        if(item.type==7&&item.cmd_type==1)  
                            this.msg+=formatDate(new Date(item.at),'yyyy-MM-dd hh:mm:ss')+":  设备ID："+item.dev_id+" 缓存命令下发后设备收到cmd的ACK响应信息:"+item.confirm_body+" confirm_time:"+new Date(item.confirm_time)+" send_status:"+item.send_status+" send_time:"+new Date(item.send_time)+" send_status:"+item.send_status+" cmd_id:"+item.cmd_id+" imei:"+item.imei+" cmd_type:"+item.cmd_type+"<br>";
                        if(item.type==7&&item.cmd_type==1) 
                         this.msg+=formatDate(new Date(item.at),'yyyy-MM-dd hh:mm:ss')+":  设备ID："+item.dev_id+" 缓存命令下发后设备收到cmd的Confirm响应信息:"+item.confirm_body+" confirm_time:"+new Date(item.confirm_time)+" send_status:"+item.send_status+" send_time:"+new Date(item.send_time)+" send_status:"+item.send_status+" cmd_id:"+item.cmd_id+" imei:"+item.imei+" cmd_type:"+item.cmd_type+"<br>";
                    });
                    // console.log(this.msg);
                    // let time=formatDate(new Date(12312414),'yyyy-MM-dd hh:mm:ss');
                    // console.log(time);
                })
        }
    }





}

</script>
<style scoped>
.receivertitle {
  font-size: 20px;
  display: inline-block; 
  width: 200px;
  text-align: right;
  margin-left: auto;
  color: #343536;
  
}




</style>