<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main"
           style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>
    
<script>
//1.导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      //需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {

  },
  //3.此时页面上的元素，已经被渲染完毕了
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data } = await this.$http.get('reports/type/1')
    if (data.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }

    //4.准备数据和配置项
    // _.merge合并两个对象
    const result = _.merge(data.data, this.options)

    //5.展示数据
    myChart.setOption(result)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>