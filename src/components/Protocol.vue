<template>
  <v-container>
    <!-- 标题 -->
    <v-row>
      <p class="title font-weight-bold mb-3">
        拓扑配置及校验
      </p>
    </v-row>

    <!-- 路由协议及设备选择 -->
    <!-- <v-row>
      <v-col cols="8" sm="2">
        <v-select
            v-model="protocol_selected"
            :items="protocol_list"
            label="路由协议"
            outlined
        ></v-select>
      </v-col>
      <v-col sm="2">
        <v-text-field
          v-show="protocol_selected=='Static'"
          v-model="target_ip"
          label="target ip"
          placeholder="ip1,ip2,ip3"
          required
          outlined
        ></v-text-field>
        <v-text-field
          v-show="protocol_selected=='OSPF'"
          v-model="area"
          label="area"
          placeholder="0,51,0"
          required
          outlined
        ></v-text-field>
      </v-col>
      
      <v-col sm="2">
        <v-btn
            elevation="4"
            color="primary"
            :loading="loader_r0 || loader_r1 || loader_r2"
            @click="config_all"
        >
          一键配置拓扑
        </v-btn>
      </v-col>
      </v-row> -->

      <!-- 上传yaml文件配置拓扑 -->
      <v-row>
        <v-col sm="3">
          <input type="file" class="file" @change="tirgger_file($event)">
        </v-col>
        <v-col sm="2">
          <v-btn
              elevation="4"
              color="primary"
              :loading="loader_config"
              @click="config_script"
          >
            文本配置拓扑
          </v-btn>
        </v-col>
        <v-col sm="5">
          <v-textarea
              v-model="protocol_content"
              outlined
              placeholder="这里是配置或校验文件"
          >
          </v-textarea>
        </v-col>
        <!-- 拓扑校验 -->
        <v-col sm="2">
          <v-btn
              elevation="4"
              color="primary"
              :loading="loader_verify"
              @click="verify"
          >
            文本校验拓扑
          </v-btn>
        </v-col>
      </v-row>

      <!-- 查看路由 -->
      <v-row>
        <v-col cols="8" sm="2">
          <v-select
              v-model="dev_selected"
              :items="dev_list"
              label="设备选择"
              outlined
          ></v-select>
        </v-col>
        <v-col sm="3">
          <v-btn
              elevation="4"
              color="primary"
              :loading="loader_info"
              @click="info"
          >
            查看路由
          </v-btn>
        </v-col>

      <!-- ping -->
      <v-col cols="8" sm="2">
        <v-text-field
          v-model="ping_ip"
          label="ip"
          required
          outlined
        ></v-text-field>
        </v-col>
      <v-col sm="1">
        <v-btn
            elevation="4"
            color="primary"
            :loading="loader_ping"
            @click="ping"
        >
          ping
        </v-btn>
      </v-col>
    </v-row>

    <!-- 控制台 -->
    <v-row>
      <p class="title font-weight-bold mb-3">
        输入输出控制台
      </p>
    </v-row>
    <!-- 输入控制台 -->
    <v-row>
      <v-col cols="12" sm="6" >
        <v-textarea
            v-show="dev_selected=='Router0'"
            v-model="inmsg0"
            outlined
            dense
            dark
            background-color="#212121"
            height="300"
            no-resize
            class="console"
        >
        </v-textarea>
        <v-textarea
            v-show="dev_selected=='Router1'"
            v-model="inmsg1"
            outlined
            dense
            dark
            background-color="#212121"
            height="300"
            no-resize
            class="console"
        >
        </v-textarea>
        <v-textarea
            v-show="dev_selected=='Router2'"
            v-model="inmsg2"
            outlined
            dense
            dark
            background-color="#212121"
            height="300"
            no-resize
            class="console"
        >
        </v-textarea>
        <!-- 输出控制台 -->
      </v-col>
    <v-col>
        <v-textarea
            v-model="outmsg"
            outlined
            readonly
            dense
            dark
            background-color="#212121"
            height="300"
            no-resize
            class="console"
        >
        </v-textarea>
      </v-col>      
    </v-row>

    <!-- 控制台发送、清空按钮 -->
    <v-row class="text-center">
      <v-col sm="4">
        <v-btn
            v-show="dev_selected=='Router0'"
            large
            elevation="4"
            color="green"
            @click="inmsg0=''"
        >
          清空控制台
        </v-btn>
        <v-btn
            v-show="dev_selected=='Router1'"
            large
            elevation="4"
            color="green"
            @click="inmsg1=''"
        >
          清空控制台
        </v-btn>
        <v-btn
            v-show="dev_selected=='Router2'"
            large
            elevation="4"
            color="green"
            @click="inmsg2=''"
        >
          清空控制台
        </v-btn>
      </v-col>
      <v-col sm="1">
        <v-btn
            large
            elevation="4"
            color="primary"
            :loading="loader_command"
            @click="send_command"
        >
          发送命令
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Serial from "@/components/Serial"

export default {
  name: "Config",
  data() {
    return {
      // 路由协议列表
      protocol_selected: 'RIP',
      protocol_list: ['RIP', 'Static','OSPF'],
      //导入的拓扑文件内容
      protocol_content: '',
      // 设备列表
      dev_selected: 'Router0',
      dev_list: ['Router0', 'Router1', 'Router2'],
      // ping ip
      ping_ip: '',
      // 静态路由下一跳ip
      target_ip:'',
      // OSPF域
      area: '',
      // 加载器
      loader_r0: false,
      loader_r1: false,
      loader_r2: false,
      loader_info: false,
      loader_config: false,
      loader_ping: false,
      loader_verify: false,
      loader_command: false,
      // 输入控制台信息
      inmsg0: '',
      inmsg1: '',
      inmsg2: '',
      // 输出控制台
      outmsg: ''
    }
  },
  methods: {
    // 弹出消息条
    showMessage(icon, msg, color) {
      // 通过触发showSnackbar事件并传递消息参数，从而调用全局Snackbar
      this.$eventBus.$emit('showSnackbar', {
        id: new Date().getTime(), // id用于设置Snackbar在v-for循环中的key属性，避免排序混乱的问题
        content: {icon, msg, color}
      })
    },
    // 设置加载器
    setLoader(dev_no, state) {
      let set_loader = "this.loader_" + dev_no + " = " + state
      eval(set_loader)
    },
    // 配置协议
    config(dev_no, dev_data) {
      // 设置加载器
      let set_loader = "this.loader_" + dev_no + " = true"
      eval(set_loader)
      // 配置协议
      let url = 'http://localhost:8999/config/' + this.protocol_selected.toLowerCase()
      let data = {
        dev_no: dev_no,
        dev_data: dev_data,
        target_list: this.target_ip,
        area_list: this.area
      }
      // console.log(data)
      // 调用接口
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        // console.log(res)
        if (res.data.state) {
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader(dev_no, false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader(dev_no, false)
        }
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader(dev_no, false)
      })
    },
    // 一键配置协议
    config_all() {
      axios.all([this.config("r0", Serial.data().r0),
        this.config("r1", Serial.data().r1),
        this.config("r2", Serial.data().r2)
      ]).then(axios.spread(function (res) {
        console.log(res);
      })).catch(err => {
        console.log(err)
      })
    },
    // 查看信息
    info() {
      this.setLoader('info', true) // 设置加载器
      let data = {
        dev_no: this.dev_selected[0].toLowerCase() + this.dev_selected[this.dev_selected.length - 1]
      }
      let url = 'http://localhost:8999/info'
      // 调用接口
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        // console.log(res)
        if (res.data.state) {
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader('info', false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader('info', false)
        }
        // 输出信息到控制台
        let result = res.data
        this.outmsg += '# IP Route\n' + result.info.route + '\n# IP Protocols\n' + result.info.protocol + '\n'
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader('info', false)
      })
    },
    // 上传配置或校验文件
    tirgger_file: function (event) {//校验文件后缀
        var file = event.target.files[0].name; // (利用console.log输出看file文件对象) xml/json/yaml/yml
        var num = file.split('.');
        var filetype = num[num.length - 1];
        console.log(filetype)
        if (filetype == 'yaml'|| filetype == 'yml' || filetype=='json') {
            this.readFile();
        } else {
            alert('请上传yaml或json文件');
        }
    },
    // 读取文件内容
    readFile() {
        let self = this;
        let fileselect = document.querySelector('input[type=file]').files[0]; //找到文件上传的元素        
        let reader = new FileReader()
        // console.log(fileselect);
        if (typeof FileReader === 'undefined') {
            alert('您的浏览器不支持FileReader接口');
        }
        reader.readAsText(fileselect, 'gb2312') //中文编码
        reader.onload = function () {
            // console.log(reader.result);//文件内容
            self.protocol_content = reader.result;
        }
    },
    // 文本配置拓扑
    config_script(){
      this.setLoader('config', true) // 设置加载器
      const url = "http://localhost:8999/config/file";
      let data = {
        config_content: this.protocol_content
      }
      // console.log(data)
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        console.log(res)
        if (res.data.state) {
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader('config', false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader('config', false)
        }
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader('config', false)
      })
    },
    //文本校验拓扑
    verify(){
      this.setLoader('verify', true) // 设置加载器
      const url = "http://localhost:8999/verify";
      let data = {
        verify_content: this.protocol_content
      }
      console.log(data)
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        console.log(res)
        if (res.data.state) {
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader('verify', false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader('verify', false)
        }
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader('verify', false)
      })
    },
    // ping
    ping(){
      this.setLoader('ping', true) // 设置加载器
      let data = {
        dev_no: this.dev_selected[0].toLowerCase() + this.dev_selected[this.dev_selected.length - 1],
        ip: this.ping_ip
      }
      // console.log(data)
      let url = 'http://localhost:8999/ping'
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        // console.log(res)
        if (res.data.state) {
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader('ping', false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader('ping', false)
        }
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader('ping', false)
      })
    },
    // 向设备发送命令
    send_command(){
      this.setLoader('command', true) // 设置加载器
      let inmsg = eval("this.inmsg" + this.dev_selected[this.dev_selected.length - 1])
      let data = {
        dev_no: this.dev_selected[0].toLowerCase() + this.dev_selected[this.dev_selected.length - 1],
        command: inmsg
      }
      console.log(data)
      let url = 'http://localhost:8999/send_command'
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        // console.log(res)
        if (res.data.state) {
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader('command', false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader('command', false)
        }
        // 输出信息到控制台
        let result = res.data
        this.msg += result.msg
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader('command', false)
      })
    }
  }
}
</script>

<style scoped>
.console {
  font-family: Consolas, sans-serif;
  font-size: 16px;
}

.console ::selection {
  color: black;
  background: white;
}
</style>
