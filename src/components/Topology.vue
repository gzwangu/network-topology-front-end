<template>
  <v-container>
    <!-- 标题 -->
    <v-row>
      <p class="title font-weight-bold mb-3">网络拓扑</p>
    </v-row>

    <!-- 拓补图 -->
    <v-row>
      <v-col>
        <div style="height: 500px;width: 700px;" id="networktp"></div>
      </v-col>
      <!-- 信息展示 -->
      <v-col>
        <b style="color:steelblue;font-size: 19px;">路由器信息</b>
        <br />
        <b>R0-S0/0/0</b>
        <input readonly v-model="r0s0ip" />
        <br />
        <br />
        <b>R1-S0/0/0</b>
        <input readonly v-model="r1s0ip" />
        <br />
        <br />
        <b>R2-S0/0/0</b>
        <input readonly v-model="r2s0ip" />
        <br />
        <br />
        <b style="color:steelblue;font-size: 19px;">链路状态</b>
        <br />
        <input v-model="links0" readonly />
        <br />
        <br />
        <input v-model="links1" readonly />
        <br />
        <br />
        <b style="color:steelblue;font-size: 19px;">回环信息</b>
        <br />
        <ul id="loopback-info">
          <li v-for="loopback in loopback_list" :key="loopback">{{ loopback }}</li>
        </ul>
      </v-col>
      <v-col>
        <br />
        <b>R0-S0/0/1</b>
        <input v-model="r0s1ip" readonly />
        <br />
        <br />
        <b>R1-S0/0/1</b>
        <input v-model="r1s1ip" readonly />
        <br />
        <br />
        <b>R2-S0/0/1</b>
        <input v-model="r2s1ip" readonly />
        <br />
        <br />
        <input style="font-size: 17px;" v-model="link_state" readonly />
        <br />
        <input v-model="links0ip" readonly />
        <br />
        <br />
        <input v-model="links1ip" readonly />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { DataSet, Network } from 'vis';
import axios from 'axios'
export default {
  name: "Topology",
  data() {
    return {
      network: null,
      r0s0ip: '未配置', // 路由器s0和s1口ip
      r0s1ip: '未配置',
      r1s0ip: '未配置',
      r1s1ip: '未配置',
      r2s0ip: '未配置',
      r2s1ip: '未配置',
      link_state: '未知',  // 链路状态
      links0: 'R1.S0/0/0', // 链路s0名称
      links1: 'R0.S0/0/1', // 链路s1名称
      links0ip: '0.0.0.0/24', // 链路s0 ip
      links1ip: '0.0.0.0/24', // 链路s1 ip
      loopback_list: [''] // 回环列表
    }
  },
  mounted() {
    this.createTp();
  },
  methods: {
    createTp() {
      // create an array with nodes
      var nodes = new DataSet([
        { id: 0, label: 'Router0' },
        { id: 1, label: 'Router1' },
        { id: 2, label: 'Router2' },
        // {id: 3, label: 'Switch'},
      ]);

      // 创建节点数据数组
      var edges = new DataSet([
        { from: 0, to: 1, label: 'r0.s0/0/1-r1.s0/0/0', id: 0 },
        { from: 1, to: 2, label: 'r1.s0/0/1-r2.s0/0/0', id: 1 },
        { from: 0, to: 2, label: 'r2.s0/0/1-r0.s0/0/0', id: 2 },
        // {from: 0, to: 3},
        // {from: 1, to: 3},
        // {from: 2, to: 3}
      ]);

      // 获取容器
      var container = document.querySelector('#networktp');

      // 将数据赋值给vis 数据格式化器
      var data = {
        nodes: nodes,
        edges: edges
      };
      // 配置项
      var options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        edges: {  // 边的配置
          color: {
            color: 'black',
            highlight: '#F4E019',
            // hover: 'yellow',
            // inherit: 'both',
            // opacity: 1
          }
        },
        nodes: {  // 节点的配置
          color: {
            border: '#2B7CE9',
            background: '#D2E5FF',
            highlight: {
              border: '#2196f3',
              background: 'yellow'
            }
          },
        },
        physics: { enabled: false }, // 详细配置请查看'物理引擎'模块，
      }

      // 初始化关系图
      this.network = new Network(container, data, options);

      let self = this;
      // 监听事件
      this.network.on('click', function (params) {
        let node = params.nodes[0];
        let edge = params.edges[0];
        // console.log(node);
        let url = 'http://localhost:8999/interface_info'

        // 点击路由器获取接口信息
        if (node == 0 || node == 1 || node == 2) {
          let data0 = {
            dev_no: 'r' + node,
            interface: 's0/0/0'
          }
          // 请求路由器s0/0/0
          axios({
            method: 'post',
            url: url,
            data: data0
          }).then(res => {
            if (res.data.state) {
              let set_rns0ip = 'self.r' + node + 's0ip=' + 'res.data.ip'
              eval(set_rns0ip)
            } else {
              alert(res.data.msg);
            }
            // 成功后再请求s0/0/1
            let data1 = {
              dev_no: 'r' + node,
              interface: 's0/0/1'
            }
            axios({
              method: 'post',
              url: url,
              data: data1
            }).then(res => {
              if (res.data.state) {
                let set_rns1ip = 'self.r' + node + 's1ip=' + 'res.data.ip'
                eval(set_rns1ip)
              } else {
                alert('router fail' + res.data.msg);
              }
              // 请求回环信息
              axios({
                method: 'post',
                url: 'http://localhost:8999/loopback_info',
                data: { dev_no: 'r' + node }
              }).then(res => {
                if (res.data.state) {
                  self.loopback_list = res.data.result_list
                } else {
                  alert(res.data.msg);
                }
              }).catch(err => {
                alert('loopback' + err);
              })
            }).catch(err => {
              alert('router' + err);
            })
          }).catch(err => {
            alert('router' + err);
          })

        } else if (edge == 0 || edge == 1 || edge == 2) { //点击网线获取接口信息
          let data0, data1;
          let link_state0 = false, link_state1 = false;
          if (edge == 0) {
            data0 = {
              dev_no: 'r0',
              interface: 's0/0/1'
            }
            data1 = {
              dev_no: 'r1',
              interface: 's0/0/0'
            }
            self.links0 = 'R1.S0/0/0'
            self.links1 = 'R0.S0/0/1'
          } else if (edge == 1) {
            data0 = {
              dev_no: 'r1',
              interface: 's0/0/1'
            }
            data1 = {
              dev_no: 'r2',
              interface: 's0/0/0'
            }
            self.links0 = 'R2.S0/0/0'
            self.links1 = 'R1.S0/0/1'
          } else {
            data0 = {
              dev_no: 'r2',
              interface: 's0/0/1'
            }
            data1 = {
              dev_no: 'r0',
              interface: 's0/0/0'
            }
            self.links0 = 'R0.S0/0/0'
            self.links1 = 'R2.S0/0/1'
          }
          // 请求链路
          axios({
            method: 'post',
            url: url,
            data: data0
          }).then(res => {
            if (res.data.state) {
              link_state0 = res.data.link_state
              self.links0ip = res.data.ip
            } else {
              alert(res.data.msg);
            }
            axios({
              method: 'post',
              url: url,
              data: data1
            }).then(res => {
              if (res.data.state) {
                link_state1 = res.data.link_state
                self.links1ip = res.data.ip
              } else {
                alert(res.data.msg);
              }
              if (link_state0 && link_state1) {
                self.link_state = '连接成功'
              } else {
                self.link_state = '连接失败'
              }
            }).catch(err => {
              alert('edge' + err);
            })
          }).catch(err => {
            alert('edge' + err);
          })
        }
      });
    },
    // 刷新网络
    refreshTp() {
      this.network.setData({
        nodes: this.nodes,
        edges: this.edges
      });
    },
  }
}
</script>
