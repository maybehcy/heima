<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息"
                center
                show-icon
                type="info"
                :closable="false"
                style="margin-bottom:20px">
      </el-alert>
      <!-- 步骤条 -->
      <!-- 步骤条激活索引项:active="activeIndex",数字型 -->
      <el-steps :space="200"
                :active="activeIndex-0"
                finish-status="success"
                align-center
                style="justify-content: center;margin-bottom:15px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 添加商品页面form表单 -->
      <el-form :model="addForm"
               :rules="addFormrules"
               ref="ruleFormRef"
               label-width="100px"
               label-position="top">
        <!-- tab栏区域 -->
        <!--v-model="activeIndex"会绑定到name的值，而且是字符串  -->
        <!-- before-leave	切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换 -->
        <!-- Function(activeName：即将进入的标签页的名字, oldActiveName:即将离开的标签页的名字) -->
        <el-tabs v-model="activeIndex"
                 :tab-position="'left'"
                 :before-leave="beforeTableave"
                 @tab-click="tabClicked">
          <el-tab-pane label="基本信息"
                       name="0">
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addForm.goods_weight"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addForm.goods_number"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <!-- 级联选择器 -->
              <!-- selecteKeys是一个数组，选中项的id数组 -->
              <el-cascader expand-trigger="hover"
                           :options="catelist"
                           :props="cateProps"
                           v-model="addForm.goods_cat"
                           @change="handleChange">
              </el-cascader>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane label="商品参数"
                       name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTabData"
                          :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"
                             v-for="(cb,i) in item.attr_vals"
                             :key="i"
                             border></el-checkbox>
              </el-checkbox-group>

            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTabData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <!-- 图片上传功能 -->
            <!-- action=""图片上传到这个后台API地址 -->
            <!-- 文件列表的预览类型方式，例如图片方式 -->
            <!-- on-success文件上传成功时的钩子	function(response, file, fileList) -->
            <!-- on-preview	点击文件列表中已上传的文件时的钩子,预览图片 -->
            <el-upload :action="uploadURL"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :headers="headerObj"
                       :on-success="handleSuccess">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary"
                       style="margin-top:15px"
                       @click="Add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览"
               :visible.sync="previewVisible"
               width="50%">
      <img :src="previewPath"
           class="previewImg">

    </el-dialog>
  </div>
</template>

<script>
//导入lodash
import _ from 'lodash'
export default {
  data () {
    return {
      //步骤条激活索引项
      activeIndex: '0',
      //添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        //商品所属的分类数组
        goods_cat: [],
        //图片数组
        pics: [],
        //商品的详情描述
        goods_introduce: '',
        //动态参数和静态属性的集合
        attrs: []
      },
      //表单的验证规则
      addFormrules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      //商品分类列表
      catelist: [],
      cateProps: {
        //在级联选择器中的显示字段
        label: 'cat_name',
        //级联选择器选择对应的id
        value: 'cat_id',
        children: 'children'
      },
      //动态参数列表数据
      manyTabData: [],
      //静态属性列表数据
      onlyTabData: [],
      //上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传组件的header请求头对象
      //因为上传功能没有调用axios,所以调用API时会产生bug，所以要在其请求头添加token，完成token验证
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      previewPath: '',
      //图片预览对话框的显示与隐藏
      previewVisible: false
    }
  },
  created () {
    //获取所有商品分类列表数据
    this.getCateList()
  },
  methods: {
    //获取所有商品分类列表数据
    async getCateList () {
      const { data } = await this.$http.get('categories')
      if (data.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.$message.success('获取数据成功！')
      this.catelist = data.data
      console.log(this.catelist)
    },
    //级联选择器选中项变化触发函数
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTableave (activeName, oldActiveName) {
      // console.log('即将进入的标签页的名字：' + oldActiveName + '  即将离开的标签页的名字：' + activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //tag点击事件
    async tabClicked () {
      //console.log(this.activeIndex)
      //证明访问的是动态参数面版
      if (this.activeIndex === '1') {
        //console.log('动态参数面版')
        const { data } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (data.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        data.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = data.data
        console.log(this.manyTabData)
      } else if (this.activeIndex === '2') {
        const { data } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (data.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        console.log(data.data)
        this.onlyTabData = data.data
      }
    },
    //处理图片预览效果
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //处理移除图片函数
    handleRemove (file) {
      console.log(file)
      //1.获取将要删除的图片的临时地址
      const filePath = file.response.data.tmp_path
      //2.从pics数组中，找到这个图片的索引值
      const i = this.addForm.pics.findIndex(x => {
        x.pic === filePath
      })
      //3.调用数组的split方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    //监听图片上传成功事件
    handleSuccess (response) {
      console.log(response)
      //1.拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      //2.将图片信息对象，push到pics数组
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    //添加商品
    Add () {
      // console.log(this.addForm)
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        //执行添加的业务逻辑
        //将addForm进行深拷贝
        //lodash.cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数和静态属性
        this.manyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        //发起请求添加商品
        //商品名称必须唯一
        const { data } = await this.$http.post('goods', form)
        if (data.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }

  },
  computed: {
    //获取3级分类索引为2的id
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 7px 0 0 !important;
}
.previewImg {
  width: 100% !important;
}
</style>