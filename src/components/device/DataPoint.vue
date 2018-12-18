<template>
  <div>
    
    <span class="mypoint">数据流：</span>

    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group
      v-model="checked"
      @change="handleCheckedChange"
    >
      <el-checkbox
        v-for="streamid in streamids"
        :label="streamid"
        :key="streamid"
      >{{streamid}}</el-checkbox>
    </el-checkbox-group>

    <!-- <p v-for="(datastream,index) in allpoint"> -->

    <div
      v-for="(datastream,index) in allpoint"
      v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow"
      style=" border:1px solid #fff;border-radius:10px 10px 10px 10px;margin-top:30px;padding: 10px;"
    >

      <span v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow">{{allpoint[index].id}}:</span>
      <br>
      <span v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow">条数：</span>

      <el-input
        v-model="limit_input[index]"
        v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow"
        placeholder="条数"
        style="width:200px"
        clearable
      >
      </el-input>
      <span v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow">开始时间：</span>

      <el-date-picker
        v-model="starttime_input[index]"
        v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow"
        type="datetime"
        placeholder="选择开始日期时间"
        value-format="yyyy-MM-ddTHH:mm:ss"
      ></el-date-picker>
      <span v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow">结束时间：</span>

      <el-date-picker
        v-model="endtime_input[index]"
        v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow"
        type="datetime"
        placeholder="选择结束日期时间"
        value-format="yyyy-MM-ddTHH:mm:ss"
      ></el-date-picker>
      <el-button
        v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch(index,allpoint[index].id)"
        style=" margin-left: 20px;"
      >搜索
      </el-button>
      <br><br>
      <el-table
        v-if="allpoint[index]!=undefined&&allpoint[index].id==show[index].streamid&&show[index].isshow"
        :data="allpoint[index].datapoints.filter(data => !search || data.value.toLowerCase().includes(search[index].toLowerCase()))"
        style="width: 100%"
        :max-height="300"
      >
        <el-table-column
          sortable
          prop="at"
          label="日期"
        >
        </el-table-column>
        <el-table-column
          prop="value"
          label="值"
        >
        </el-table-column>
        <el-table-column align="right">
          <template
            slot="header"
            slot-scope="scope"
          >
            <el-input
              v-model="search[index]"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>

        </el-table-column>

      </el-table>
    </div>
    <!-- </p> -->
  </div>
</template>
<script>
import { formatDate } from "../../common/js/DateFormat.js";
import { getFirstDayOfYear } from "../../common/js/DateFormat.js";
export default {
  data() {
    return {
      search: [],
      device_id: "",

      limit_input: [],
      starttime_input: [],
      endtime_input: [],

      //选择框属性
      checkAll: true,
      checked: [],
      streamids: [],

      isIndeterminate: false,

      //   streamid: "",
      //请求参数
      allpoint: [],
      allpoint_temp: [],
      starttime: "",
      endtime: "",
      limit: 100,
      sort: "DESC",
      //显示参数
      show: []
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checked = val ? this.streamids : [];
      this.isIndeterminate = false;
      if (val) {
        this.show.forEach(element => {
          element.isshow = true;
        });
      } else {
        this.show.forEach(element => {
          element.isshow = false;
        });
      }
    },

    handleCheckedChange(value) {
      // console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.streamids.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.streamids.length;
      this.show.forEach(element => {
        element.isshow = false;
      });

      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.show.length; j++) {
          if (value[i] == this.show[j].streamid) {
            this.show[j].isshow = true;
            continue;
          }
        }
      }
    },
    handleSearch(index, streamid) {
      let starttime = this.starttime;
      let endtime = this.endtime;
      let limit = this.limit;
      if (
        this.starttime_input[index] != undefined &&
        this.starttime_input[index] != ""
      )
        starttime = this.starttime_input[index];
      if (
        this.endtime_input[index] != undefined &&
        this.endtime_input[index] != ""
      )
        endtime = this.endtime_input[index];
      if (this.limit_input[index] != undefined && this.limit_input[index] != "")
        limit = this.limit_input[index];

      this.$axios
        .get(
          "/iot/devices/" +
            this.device_id +
            "/datapoints?datastream_id=" +
            streamid +
            "&limit=" +
            limit +
            "&sort=" +
            this.sort +
            "&end=" +
            endtime +
            "&start=" +
            starttime
        )
        .then(data => {
          console.log(data.data.data.datastreams[0]);
          console.log(this.allpoint[index]);
          if (data.data.data.datastreams.length == 0)
            this.$set(this.allpoint, index, { datapoints: [], id: streamid });
          else this.$set(this.allpoint, index, data.data.data.datastreams[0]);
        });
    }
  },

  created() {
    let row = this.$route.query.row;
    if (row.id != "" && row.id != null && row.id != undefined) {
      sessionStorage.setItem("device_id", row.id);
      this.device_id = row.id;
    } else {
      this.device_id = sessionStorage.getItem("device_id");
    }
    this.$axios.get("/iot/devices/" + this.device_id).then(data => {
      for (let i = 0; i < data.data.data.datastreams.length; i++) {
        this.$set(this.streamids, i, data.data.data.datastreams[i].id);
        this.$set(this.checked, i, data.data.data.datastreams[i].id);
        this.$set(this.search, i, "");
        this.$set(this.limit_input, i, "");
        this.$set(this.starttime_input, i, "");
        this.$set(this.endtime_input, i, "");
        this.$set(this.show, i, {
          streamid: data.data.data.datastreams[i].id,
          isshow: true
        });
        let firstday = getFirstDayOfYear(new Date());
        this.starttime = firstday; //默认设置为当年第一天
        this.endtime = formatDate(new Date(), "yyyy-MM-ddThh:mm:ss"); //默认设置为当前时间

        this.$axios
          .get(
            "/iot/devices/" +
              this.device_id +
              "/datapoints?start=" +
              this.starttime +
              "&end=" +
              this.endtime +
              "&limit=" +
              this.limit +
              "&sort=" +
              this.sort +
              "&datastream_id=" +
              data.data.data.datastreams[i].id
          )
          .then(data => {
            if (data.data.data.datastreams.length > 0) {
              // this.$set(this.allpoint_temp,i,data.data.data.datastreams[0])
              this.$set(this.allpoint, i, data.data.data.datastreams[0]);
            }
          });
      }
    });
  }
};
</script>
<style scope="scoped">
.mypoint {
  font-size: 16px;
  /* display: inline-block;  */
  width: 100%;
  text-align: left;
  margin-left: auto;
  color: #343536;
}
</style>