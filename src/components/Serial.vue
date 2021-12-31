<template>
  <v-container>
    <!-- 标题 -->
    <v-row>
      <p class="title font-weight-bold mb-3">
        接口配置
      </p>
    </v-row>

    <!-- 配置卡片 -->
    <v-row class="text-center">
      <v-col cols="12" sm="4">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 4">
            <v-card-title>Router0</v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="r0.serial0"
                  label="Serial0/0/0"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r0.serial1"
                  label="Serial0/0/1"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r0.mask0"
                  label="s0子网掩码"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r0.mask1"
                  label="s1子网掩码"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r0.port"
                  label="回环端口"
                  required
                  outlined
              ></v-text-field>

              <v-btn 
                  elevation="4"
                  color="primary"
                  :disabled="r0.state0"
                  :loading="r0.loader0"
                  @click="init_serial('r0', [r0.serial0, r0.serial1], [r0.mask0,r0.mask1])"
              >
                初始化串行接口
              </v-btn>
              
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r0.state1"
                  :loading="r0.loader1"
                  @click="init_loopback('r0', r0.serial0, r0.mask0, r0.port)"
              >
                初始化回环接口
              </v-btn>
            </v-card-text>

            <!-- 遮罩层 -->
            <v-overlay
                absolute
                :z-index=0
                :value="r0.state0"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                串行接口已初始化
              </v-btn>
            </v-overlay>
            <v-overlay
                absolute
                :z-index=0
                :value="r0.state1"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                回环接口已初始化
              </v-btn>
            </v-overlay>

          </v-card>
        </v-hover>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" sm="4">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 4">
            <v-card-title>Router1</v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="r1.serial0"
                  label="Serial0/0/0"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r1.serial1"
                  label="Serial0/0/1"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r1.mask0"
                  label="s0子网掩码"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r1.mask1"
                  label="s1子网掩码"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r1.port"
                  label="回环端口"
                  required
                  outlined
              ></v-text-field>

              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r1.state0"
                  :loading="r1.loader0"
                  @click="init_serial('r1', [r1.serial0, r1.serial1], [r1.mask0,r1.mask1])"
              >
                初始化串行接口
              </v-btn>
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r1.state1"
                  :loading="r1.loader1"
                  @click="init_loopback('r1', r1.serial0, r1.mask0, r1.port)"
              >
                初始化回环接口
              </v-btn>
            </v-card-text>

            <!-- 遮罩层 -->
            <v-overlay
                absolute
                :z-index=0
                :value="r1.state0"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                串行接口已初始化
              </v-btn>
            </v-overlay>
            <v-overlay
                absolute
                :z-index=0
                :value="r1.state1"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                回环接口已初始化
              </v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" sm="4">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 4">
            <v-card-title>Router2</v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="r2.serial0"
                  label="Serial0/0/0"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r2.serial1"
                  label="Serial0/0/1"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r2.mask0"
                  label="s0子网掩码"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r2.mask1"
                  label="s1子网掩码"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="r2.port"
                  label="回环端口"
                  required
                  outlined
              ></v-text-field>
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r2.state0"
                  :loading="r2.loader0"
                  @click="init_serial('r2', [r2.serial0, r2.serial1], [r2.mask0,r2.mask1])"
              >
                初始化串行接口
              </v-btn>
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r2.state1"
                  :loading="r2.loader1"
                  @click="init_loopback('r2', r2.serial0, r2.mask0, r2.port)"
              >
                初始化回环接口
              </v-btn>
            </v-card-text>

            <!-- 遮罩层 -->
            <v-overlay
                absolute
                :z-index=0
                :value="r2.state0"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                串行接口已初始化
              </v-btn>
            </v-overlay>
            <v-overlay
                absolute
                :z-index=0
                :value="r2.state1"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                回环接口已初始化
              </v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <p style="white-space: pre-line"></p>

    <!-- 统一操作选项 -->
    <v-row class="text-center">
      <v-col sm="10"></v-col>
      <v-col sm="2">
        <v-btn
            large
            elevation="4"
            color="primary"
            :disabled="r0.state0 && r1.state0 && r2.state0&&r0.state1 && r1.state1 && r2.state1"
            :loading="r0.loader0 && r1.loader0&& r2.loader0&&r0.loader1 && r1.loader1&& r2.loader1"
            @click="init_all"
        >
          一键初始化
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Serial",
  data() {
    return {
      r0: {
        serial0: '172.17.0.1', // 串行接口Serial0/0/0
        serial1: '0.0.0.0', // 串行接口Serial0/0/1
        mask0: '255.255.0.0', // s0串行接口子网掩码
        mask1: '255.255.0.0', // s1串行接口子网掩码
        port: '0', //回环接口的端口
        state0: false, // 串行接口配置状态(true:已初始化, false:未初始化)
        state1: false, // 回环接口配置状态
        loader0: false, // 加载器
        loader1: false // 加载器
      },
      r1: {
        serial0: '172.17.0.2', // 串行接口Serial0/0/0
        serial1: '172.18.0.1', // 串行接口Serial0/0/1
        mask0: '255.255.0.0', // s0串行接口子网掩码
        mask1: '255.255.0.0', // s1串行接口子网掩码
        port: '0', //回环接口的端口
        state0: false, // 串行接口配置状态(true:已初始化, false:未初始化)
        state1: false, // 回环接口配置状态
        loader0: false, // 加载器
        loader1: false // 加载器
      },
      r2: {
        serial0: '172.18.0.2', // 串行接口Serial0/0/0
        serial1: '0.0.0.0', // 串行接口Serial0/0/1
        mask0: '255.255.0.0', // s0串行接口子网掩码
        mask1: '255.255.0.0', // s1串行接口子网掩码
        port: '0', //回环接口的端口
        state0: false, // 串行接口配置状态(true:已初始化, false:未初始化)
        state1: false, // 回环接口配置状态
        loader0: false, // 加载器
        loader1: false // 加载器
      }
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
    setLoader(dev_no, num, state) {
      let set_loader = "this." + dev_no + ".loader" + num + " = " + state
      eval(set_loader)
    },
    // 设置配置状态
    setState(dev_no, num, state) {
      let set_state = "this." + dev_no + ".state" + num + " = " + state
      eval(set_state)
    },
    // 初始化串行接口
    init_serial(dev_no, ip_list, mask_list) {
      // 检查设备状态
      let state_check = "this." + dev_no + ".state0 === true" // 已初始化
      let waiting_check = "this." + dev_no + ".loader0 === true" // 初始化中
      if (eval(state_check) || eval(waiting_check)) {
        console.log("return")
        return
      }
      // 设置加载器
      this.setLoader(dev_no, 0, true)
      // 初始化串行接口
      const url = 'http://localhost:8999/init/serial'
      let data = {
        dev_no: dev_no,
        ip_list: ip_list,
        mask_list: mask_list
      }
      axios({
        url: url,
        method: 'post',
        data: data
      }).then(res => {
        console.log(res)
        if (res.data.state) {
          // 将状态设为已初始化
          this.setState(dev_no, 0, true)
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader(dev_no, 0, false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader(dev_no, 0, false)
        }
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader(dev_no, 0, false)
      })
    },
    // 初始化回环接口
    init_loopback(dev_no, ip, mask, port){
      // 检查设备状态
      let state_check = "this." + dev_no + ".state1 === true" // 已初始化
      let waiting_check = "this." + dev_no + ".loader1 === true" // 初始化中
      if (eval(state_check) || eval(waiting_check)) {
        console.log("return")
        return
      }
      // 设置加载器
      this.setLoader(dev_no, 1, true)
      // 初始化回环接口
      const url = 'http://localhost:8999/init/loopback'
      let data = {
        dev_no: dev_no,
        ip: ip,
        mask_list: mask,
        port: port
      }
      axios({
        url: url,
        method: 'post',
        data: data
      }).then(res => {
        console.log(res)
        if (res.data.state) {
          // 将状态设为已初始化
          this.setState(dev_no, 1, true)
          this.showMessage('mdi-checkbox-marked-circle', res.data.msg, 'success')
          this.setLoader(dev_no, 1, false)
        } else {
          this.showMessage('mdi-cancel', res.data.msg, 'error')
          this.setLoader(dev_no, 1, false)
        }
      }).catch(err => {
        console.log(err)
        this.showMessage('mdi-minus-circle', '网络连接失败', 'warning')
        this.setLoader(dev_no, 1, false)
      })
    },
    // 一键初始化串行接口
    init_all() {
      axios.all([this.init_serial("r0", [this.r0.serial0, this.r0.serial1], [this.r0.mask0,this.r0.mask1]),
        this.init_serial("r1", [this.r1.serial0, this.r1.serial1], [this.r1.mask0,this.r1.mask1]),
        this.init_serial("r2", [this.r2.serial0, this.r2.serial1], [this.r2.mask0,this.r2.mask1])
      ]).then(axios.spread(function (res) {
        console.log(res);
      })).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
