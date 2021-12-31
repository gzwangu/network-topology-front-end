<template>
  <v-app>
    <!-- 顶栏 -->
    <!-- <v-app-bar
        app
        color="blue"
        dark
    >
      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="./assets/logo.png"
            transition="scale-transition"
            width="170"
        />
      </div>
      <v-app-bar-title class="d-flex align-center">
        <h2>拓扑自动化搭建及校验管理应用系统</h2>
      </v-app-bar-title>
    </v-app-bar> -->

    <!-- 主页面 -->
    <v-main>
      <div id="app">
        <!-- 全局Snackbar队列 -->
        <!-- 根据当前Snackbar的index动态计算Y方向的位移，达到依次排列的目的 -->
        <snackbar
            v-model="item.show"
            :style="{transform: 'translateY(' + 60 * index + 'px)'}"
            :message="item.content"
            v-for="(item, index) in messages"
            :key="item.id"
            @input="onSnackbarClose($event, index)">
        </snackbar>
      </div>
      <p style="white-space: pre-line"></p>
      <Topology/>
      <p style="white-space: pre-line"></p>
      <Login/>
      <!-- <p style="white-space: pre-line"></p>
      <Privilege/> -->
      <!-- <p style="white-space: pre-line"></p>
      <Serial/>  -->
      <p style="white-space: pre-line"></p>
      <Protocol/>
      <p style="white-space: pre-line"></p>
    </v-main>

    <!-- 底栏 -->
    <!-- <v-footer
        color="primary"
        dark
    >
      <div class="align-center">
        Copyright &copy; <a href="https://github.com/HaoNShi" style="color: white">Haonan Shi</a>
      </div>
    </v-footer> -->
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar';
import Login from '@/components/Login';
// import Privilege from "@/components/Privilege";
// import Serial from "@/components/Serial";
import Topology from '@/components/Topology';
import Protocol from "@/components/Protocol";

export default {
  name: 'App',

  components: {
    Snackbar,
    Login,
    // Privilege,
    // Serial,
    Topology,
    Protocol
  },
  data: function () {
    return {
      messages: [] // 消息队列
    }
  },
  mounted() {
    // 全局Snackbar控制器事件监听
    this.snackbarController()
  },
  methods: {
    snackbarController() {
      // 监听showSnackbar事件
      this.$eventBus.$on('showSnackbar', data => {
        // 将收到的message推入messages数组中
        this.messages.push({
          ...data,
          show: true
        })
      })
    },
    onSnackbarClose(value, index) {
      // value为Snackbar组件内部传递出来的
      // index为当前关闭Snackbar的索引
      // 删除已关闭的Snackbar对应的消息数据
      this.messages.splice(index, 1)
    }
  }
};
</script>
