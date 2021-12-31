<template>
  <v-container>
    <!-- 标题 -->
    <v-row>
      <p class="title font-weight-bold mb-3">
        网络拓扑
      </p>
    </v-row>

    <!-- 拓补图 -->
    <v-row>
      <v-col>
        <div style="height: 400px" id="networktp"></div>
      </v-col>
      <v-col>
        <v-textarea
          v-model="topoinfo"
          v-show="topoinfo!=''"
          readonly
          outlined
          dense
          dark
          height="400"
          no-resize
          background-color="#5CA3CD"
        >
        </v-textarea>
      </v-col>
    </v-row>
  </v-container>  
</template>

<script>
import { DataSet, Network } from 'vis';
import axios from 'axios'
export default {
  name: "Topology",
  data () {
    return {
      network: null,
      topoinfo: '',
    }
  },
  mounted(){
    this.createTp();
  },
  methods: {
    createTp () {
      // create an array with nodes
      var nodes = new DataSet([
          {id: 0, label: 'Router0'},
          {id: 1, label: 'Router1'},
          {id: 2, label: 'Router2'},
          // {id: 3, label: 'Switch'},
      ]);

      // 创建节点数据数组
      var edges = new DataSet([
          {from: 0, to: 1, label: 'r0.s0/0/1-r1.s0/0/0', id: 0},
          {from: 1, to: 2, label: 'r1.s0/0/1-r2.s0/0/0', id: 1},
          {from: 0, to: 2, label: 'r2.s0/0/1-r0.s0/0/0', id: 2},
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
        physics: {enabled: false},      // 详细配置请查看'物理引擎'模块，
      }

      // 初始化关系图
      this.network = new Network(container, data, options);
      
      let self = this;
      // 监听事件
      this.network.on('click', function (params) {
        // console.log(params);
        let node = params.nodes[0];
        let edge = params.edges[0];
        // console.log(node);
        let url = 'http://localhost:8999/interface_info' 

        // 点击路由器获取接口信息
        if(node==0||node==1||node==2){
          let data0 = {
            dev_no: 'r'+node,
            interface: 's0/0/0'
          }
          console.log(data0)
          axios({
            method: 'post',
            url: url,
            data: data0
          }).then(res => {
            if (res.data.state) {
              self.topoinfo +='link_state: '+res.data.link_state +'\n'+res.data.ip      
            } else {
              self.topoinfo += '\n'+res.data.msg
            }
          }).catch(err => {
            self.topoinfo += '\n'+err
          }) 
          let data1 = {
            dev_no: 'r'+node,
            interface: 's0/0/1'
          }
          console.log(data1)
          axios({
            method: 'post',
            url: url,
            data: data1
          }).then(res => {
            if (res.data.state) {
              self.topoinfo +='link_state: '+res.data.link_state +'\n'+res.data.ip      
            } else {
              self.topoinfo += '\n'+res.data.msg
            }
          }).catch(err => {
            self.topoinfo += '\n'+err
          }) 
        }else if(edge==0||edge==1||edge==2){ //点击网线获取接口信息
          let data0,data1;
          if(edge==0){
            data0 = {
              dev_no: 'r0',
              interface: 's0/0/1'
            }
            data1 = {
              dev_no: 'r1',
              interface: 's0/0/0'
            }
          }else if(edge==1){
            data0 = {
              dev_no: 'r1',
              interface: 's0/0/1'
            }
            data1 = {
              dev_no: 'r2',
              interface: 's0/0/0'
            }
            }else{
              data0 = {
                dev_no: 'r2',
                interface: 's0/0/1'
              }
              data1 = {
                dev_no: 'r0',
                interface: 's0/0/0'
              }
            }
          // console.log(data0)
          // console.log(data1)
          axios({
            method: 'post',
            url: url,
            data: data0
          }).then(res => {
            if (res.data.state) {
              self.topoinfo +='link_state: '+res.data.link_state +'\n'+res.data.ip
            } else {
              self.topoinfo += '\n'+res.data.msg
            }
          }).catch(err => {
            self.topoinfo += '\n'+err
          })
          axios({
            method: 'post',
            url: url,
            data: data1
          }).then(res => {
            if (res.data.state) {
              self.topoinfo +='link_state: '+res.data.link_state +'\n'+res.data.ip
            } else {
              self.topoinfo += '\n'+res.data.msg
            }
          }).catch(err => {
            self.topoinfo += '\n'+err
          })
        }
      });
    },
    // 刷新网络
    refreshTp(){
      this.network.setData({
        nodes: this.nodes,
        edges: this.edges
      });
    },
  }
}
</script>
