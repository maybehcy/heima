<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row style="margin-bottom:15px">
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table :data="catelist"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border
                  :show-row-hover="false">
        <!-- 是否有效模板 -->
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted===false"
             style="color:lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color:red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success"
                  size="mini"
                  v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning"
                  size="mini"
                  v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt"
                  slot-scope="">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <!--  :current-page="queryInfo.pagenum"显示当前页码 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     style="margin-top:15px">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="addDialogClosed">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm"
               :rules="addCateFormrules"
               ref="addCateFormRef"
               label-width="100px">
        <!-- 分类名称 -->
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 注意 -->
        <!--
          注如果父级分类不填，添加的分类名称就是父级一级分类，如果填了父级一级分类，那么分类名称就是其子分类，即二级分类，以此类推，但是父级分类只能是前两级
         -->
        <!--前两级父级分类 -->
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <!-- options用来指定数据源 -->
          <el-cascader expand-trigger="hover"
                       :options="parentCateList"
                       v-model="selectedKeys"
                       @change="parentCateChange"
                       :props="cascaderProps"
                       clearable
                       change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        //当前页码值
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示这一列定义为模板列
        type: 'template',
        //表示当前这一列使用模板名称，名称自定义
        template: 'isok'
      }, {
        label: '排序',
        // 表示这一列定义为模板列
        type: 'template',
        //表示当前这一列使用模板名称，名称自定义
        template: 'order'
      }, {
        label: '操作',
        // 表示这一列定义为模板列
        type: 'template',
        //表示当前这一列使用模板名称，名称自定义
        template: 'opt'
      }],
      //控制分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类名称
        cat_name: '',
        //父级分类的id，默认是0
        cat_pid: 0,
        //当前分类等级，默认为一级分类
        cat_level: 0
      },
      //添加分类的校验规则对象
      addCateFormrules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //获取前两级父级分类列表
      parentCateList: [],
      //用来指定配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //选中的父级分类的id数组
      selectedKeys: []
    }
  },
  //生命周期函数
  created () {
    this.getCateList()
  },
  //处理事件处理函数
  methods: {
    //获取商品分类数据
    async getCateList () {
      const { data } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(data.data)
      if (data.meta.status !== 200) {
        return this.$message.error('商品分类列表获取失败')
      }
      //把数据列表赋值给catelist
      this.catelist = data.data.result
      //为总数据条数赋值
      this.total = data.data.total
    },
    //监听pagesize改变
    handleSizeChange (newpagesize) {
      //把新的newpagesize给pagesize,并且刷新一下数据
      this.queryInfo.pagesize = newpagesize
      this.getCateList()
    },
    //监听pagenum的改变
    handleCurrentChange (newpagenum) {
      //把新的newpagenum给pagenum,并且刷新一下数据
      this.queryInfo.pagenum = newpagenum
      this.getCateList()
    },
    //点击按钮显示点击添加分类对话框
    showAddCateDialog () {
      this.addCateDialogVisible = true
      //获取前两级父级数据列表
      this.getParentCateList()
    },
    //获取父级分类的数据列表,因为父级分类只能是前两级，所有type为2
    async getParentCateList () {
      const { data } = await this.$http.get('categories', { params: { type: 2 } })
      if (data.meta.status !== 200) {
        return this.$message.error('获取前两级父级失败')
      }
      //console.log(data)
      this.parentCateList = data.data
    },
    //级联选择器选择项发生变化触发这个函数
    parentCateChange () {
      console.log(this.selectedKeys)
      //如果selectedKeys数据中length大于0,则选中了父级分类
      //反之，就是明没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //点击按钮添加分类
    addCate () {
      console.log(this.addCateForm)
      //对表单的预验证
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.post('categories', this.addCateForm)
        if (data.meta.status !== 201) {
          return this.$message.error('添加用户分类失败！')
        }
        this.$message.success('添加用户分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //监听对话框的关闭事件，重置表单数据
    addDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>