<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索文本框区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getGoodList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品按钮区域 -->
          <el-button type="primary"
                     @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- table表格区域 -->
    <el-table :data="goodlist"
              border
              stripe>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="goods_name"
                       label="商品名称">
      </el-table-column>
      <el-table-column prop="goods_price"
                       label="商品价格(元)"
                       width="95px">
      </el-table-column>
      <el-table-column prop="goods_weight"
                       label="商品重量"
                       width="70px">
      </el-table-column>
      <el-table-column prop="add_time"
                       label="创建时间"
                       width="140px">
        <template slot-scope="scope">
          {{scope.row.add_time|dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="130px">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="removeById(scope.row.goods_id)"></el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryInfo.pagenum"
                   :page-sizes="[5, 10, 15, 20]"
                   :page-size="queryInfo.pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //把查询到的商品列表保存起来
      goodlist: [],
      //总数据条数
      total: 0

    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    //根据分页获取对应的商品列表
    async getGoodList () {
      const { data } = await this.$http.get('goods', { params: this.queryInfo })
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功！')
      console.log(data.data)
      this.goodlist = data.data.goods
      this.total = data.data.total
    },
    //一页显示多少条数的改变，会触发此事件
    //重新赋值给data数据
    //刷新数据
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getGoodList()
    },
    //页码数发生变化，触发此事件，刷新数据
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getGoodList()
    },
    //根据id删除商品
    async removeById (id) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (result !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data } = await this.$http.delete(`goods/${id}`)
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getGoodList()
    },
    //点击添加商品按钮，使用路由导航跳转到添加商品页码
    goAddPage () {
      this.$router.push('/goods/add')
    }

  }
}
</script>

<style lang="less" scoped>
</style>
