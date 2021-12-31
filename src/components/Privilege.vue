<template>
  <v-container>
    <!-- 标题 -->
    <v-row>
      <p class="title font-weight-bold mb-3">
        特权模式
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
                  v-show="!unify.enable"
                  v-model="r0.pwd"
                  label="特权密码"
                  required
                  outlined
                  :append-icon="r0.show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="r0.show ? 'text' : 'password'"
                  @click:append="r0.show = !r0.show"
              ></v-text-field>
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r0.state"
                  :loading="r0.loader"
                  @click="enable('r0', r0.pwd)"
              >
                进入特权模式
              </v-btn>
            </v-card-text>

            <!-- 遮罩层 -->
            <v-overlay
                absolute
                :z-index=0
                :value="r0.state"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                已进入特权模式
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
                  v-show="!unify.enable"
                  v-model="r1.pwd"
                  label="特权密码"
                  required
                  outlined
                  :append-icon="r1.show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="r1.show ? 'text' : 'password'"
                  @click:append="r1.show = !r1.show"
              ></v-text-field>
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r1.state"
                  :loading="r1.loader"
                  @click="enable('r1', r1.pwd)"
              >
                进入特权模式
              </v-btn>
            </v-card-text>

            <!-- 遮罩层 -->
            <v-overlay
                absolute
                :z-index=0
                :value="r1.state"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                已进入特权模式
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
                  v-show="!unify.enable"
                  v-model="r2.pwd"
                  label="特权密码"
                  required
                  outlined
                  :append-icon="r2.show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="r2.show ? 'text' : 'password'"
                  @click:append="r2.show = !r2.show"
              ></v-text-field>
              <v-btn
                  elevation="4"
                  color="primary"
                  :disabled="r2.state"
                  :loading="r2.loader"
                  @click="enable('r2', r2.pwd)"
              >
                进入特权模式
              </v-btn>
            </v-card-text>

            <!-- 遮罩层 -->
            <v-overlay
                absolute
                :z-index=0
                :value="r2.state"
            >
              <v-btn
                  elevation="4"
                  color="success"
              >
                已进入特权模式
              </v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <p style="white-space: pre-line"></p>

    <!-- 统一操作选项 -->
    <v-row class="text-center">
      <v-col sm="3">
        <v-switch
            v-model="unify.enable"
            :label="`使用统一密码`"
        ></v-switch>
      </v-col>
      <v-col sm="7">
        <v-text-field
            v-show="unify.enable"
            v-model="unify.pwd"
            label="统一特权密码"
            required
            outlined
            :append-icon="unify.show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="unify.show ? 'text' : 'password'"
            @click:append="unify.show = !unify.show"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn
            large
            elevation="4"
            color="primary"
            :disabled="r0.state && r1.state && r2.state"
            :loading="r0.loader && r1.loader && r2.loader"
            @click="enable_all"
        >
          一键进入<br>特权模式
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Privilege",
  data() {
    return {
      r0: {
        pwd: '', // 特权密码
        show: false, // 密码可见性
        state: false, // 设备状态(true:特权模式, false:非特权模式)
        loader: false // 加载器
      },
      r1: {
        pwd: '', // 特权密码
        show: false, // 密码可见性
        state: false, // 设备状态(true:特权模式, false:非特权模式)
        loader: false // 加载器
      },
      r2: {
        pwd: '', // 特权密码
        show: false, // 密码可见性
        state: false, // 设备状态(true:特权模式, false:非特权模式)
        loader: false // 加载器
      },
      unify: {
        enable: true, // 使用统一密码
        pwd: '', // 统一特权密码
        show: false // 密码可见性
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
    setLoader(dev_no, state) {
      let set_loader = "this." + dev_no + ".loader = " + state
      eval(set_loader)
    },
    // 设置设备状态
    setState(dev_no, state) {
      let set_state = "this." + dev_no + ".state = " + state
      eval(set_state)
    },
    // 进入特权模式
    enable(dev_no, pwd) {
      // 检查设备状态
      let state_check = "this." + dev_no + ".state === true" // 已进入特权模式
      let waiting_check = "this." + dev_no + ".loader === true" // 进入特权模式中
      if (eval(state_check) || eval(waiting_check)) {
        return
      }
      // 检查密码是否为空
      let pwd_check = "this." + dev_no + ".pwd === ''"
      if ((this.unify.enable && this.unify.pwd === '') || (!this.unify.enable && eval(pwd_check))) {
        this.showMessage('mdi-alert-circle', '密码不能为空', 'warning')
        return
      }
      // 设置加载器
      this.setLoader(dev_no, true)
      // 进入特权模式
      const url = 'http://127.0.0.1:5000/enable'
      let data = {
        dev_no: dev_no,
        pwd: pwd
      }
      axios({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        console.log(res)
        if (res.data.state) {
          // 将状态设为特权模式
          this.setState(dev_no, true)
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
    // 一键进入特权模式
    enable_all() {
      axios.all([this.enable("r0", this.unify.enable ? this.unify.pwd : this.r0.pwd),
        this.enable("r1", this.unify.enable ? this.unify.pwd : this.r1.pwd),
        this.enable("r2", this.unify.enable ? this.unify.pwd : this.r2.pwd)
      ]).then(axios.spread(function (res) {
        console.log(res);
      })).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
