<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList"
                border
                stripe
                style="margin:10px 0">

        <el-table-column type="index">
        </el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款"
                         prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger"
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send">
        </el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showBox"></el-button>
            <el-button type="success"
                       icon="el-icon-location"
                       size="mini"
                       @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页功能 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryInfo.pagenum"
                   :page-sizes="[5, 10, 20, 25]"
                   :page-size="queryInfo.pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址"
               :visible.sync="addressVisible"
               width="50%"
               @close="addressDialogClosed">
      <!-- 修改地址表单 -->
      <el-form :model="addressForm"
               :rules="addressFormRules"
               ref="addressFormRef"
               label-width="100px">
        <el-form-item label="省市去/县"
                      prop="address1">
          <!-- 级联选择器 -->
          <el-cascader :options="cityDate"
                       v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度"
               :visible.sync="progressVisible"
               width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata.js'
export default {
  data () {
    return {
      //订单数据列表查询
      queryInfo: {
        //查询条件
        query: '',
        //当前页
        pagenum: 1,
        //每页显示的条数
        pagesize: 10
      },
      //总数据条数
      total: 0,
      //订单列表
      orderList: [],
      //修改地址对话框的显示与隐藏
      addressVisible: false,
      //地址表单
      addressForm: {
        //省市县级联选择器
        address1: [],
        //详细地址
        address2: ''
      },
      //地址验证规则
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      //导入的省市区县
      cityDate: cityDate,
      //物流进度对话框的显示与隐藏
      progressVisible: false,
      //物流进度列表数据
      progressInfo: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        }, {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    //获取订单数据列表数据
    async getOrderList () {
      const { data } = await this.$http.get('orders', { params: this.queryInfo })
      if (data.meta.status !== 200) {
        return this.$message.error('获取订单数据列表失败')
      }
      console.log(data.data)
      this.total = data.data.total
      this.orderList = data.data.goods
    },
    //每页显示的条数发生改变的触发事件
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    //当前所在页码值发生变化触发事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    //展示修改地址的对话框
    showBox () {
      this.addressVisible = true
    },
    //对话框关闭事件
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    //物流进度按钮
    showProgressBox () {
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>