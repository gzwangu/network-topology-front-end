<template>
  <div class="component-snackbar" v-if="value" :class="message.color">
    <div class="snackbar-logo">
      <v-icon color="white">
        {{ message.icon }}
      </v-icon>
    </div>
    <div class="snackbar-content">
      {{ message.msg }}
    </div>
    <div class="snackbar-close" @click="close">
      <v-icon color="white">
        mdi-window-close
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "component-snackbar",
  props: {
    value: Boolean, // 调用本组件v-model传入的值
    message: Object // 消息内容
  },
  data: function () {
    return {
      showTime: 5000, // snackbar显示的时长
      timer: null // 定时器
    }
  },
  mounted() {
    // 在showTime到期后自动关闭snackbar
    this.timer = setTimeout(() => {
      this.close()
    }, this.showTime)
  },
  methods: {
    close() {
      // 清除定时器
      clearTimeout(this.timer)
      // 不能直接在组件中修改props中的数据，因此不能直接修改this.value = false
      // 而是实现了在自定义组件中使用v-model，通过外传input事件通知调用者自动更新v-model传入的值
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>
.component-snackbar {
  z-index: 1;
  width: 350px;
  height: 50px;
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  top: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.4);
  transition: transform 500ms ease-in;
}

.component-snackbar .snackbar-logo {
  margin: 0 16px;
}

.component-snackbar .snackbar-content {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: white;
}

.component-snackbar .snackbar-close {
  margin: 0 16px;
  cursor: pointer;
}
</style>