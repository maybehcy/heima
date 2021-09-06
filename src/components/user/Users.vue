<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户权限</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 栅格布局 -->
      <!-- gutter列与列之间的间距 -->
      <el-row :gutter="20"
              style="margin-bottom:10px">
        <!-- 一行有24列，span对应占的列数 -->
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist"
                style="width: 100%"
                border
                stripe>
        <!-- type="index"自动添加索引列 -->
        <el-table-column type="index">
        </el-table-column>

        <el-table-column prop="username"
                         label="姓名">
        </el-table-column>

        <el-table-column prop="email"
                         label="邮箱">
        </el-table-column>

        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>

        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>

        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <!-- slot-scope="scope" 取到当前单元格的
             scope.$index  拿到当前行的index
             scope.row  拿到当前行的数据对象 
        -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作区域 -->
        <el-table-column label="操作"
                         width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top">
              <!-- enterable="false"鼠标是否可进入到 tooltip 中 -->
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         :enterable="false"
                         @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页区域 -->
      <!-- current-page当前展示第几页的数据 -->
      <!-- page-sizes每页显示的条数 -->
      <!-- page-size当前情况下每页显示的条数 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     style="margin-top:25px">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormrules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="用户名">
          <!-- disabled禁用表单的输入 -->
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               width="50%"
               @close="setRoleDialogCloded">
      <div>
        <p>当前用户：{{userInfo.username}}
        </p>
        <p>
          当前角色：{{userInfo.role_name}}
        </p>
        <!-- v-model的值为当前被选中的el-option的 value 属性值 -->
        <!-- :label显示的文本 -->
        <!-- 我们选中的其实是id,也就是说label是为了显示选中id的值 -->
        <p>分配新角色：
          <el-select v-model="selectedRoleId"
                     placeholder="请选择">
            <el-option v-for="item in roleList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data () {
    //验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        //合法邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //校验手机号的规则
    var checkMobile = (rule, value, callback) => {
      //验证电话的规则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //合法电话
        return callback()
      }
      callback(new Error('请输入合法的电话号码'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        //当前情况下每页显示的条数
        pagesize: 5
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        //因为邮箱，电话的格式还没有验证，所以还要自定义校验规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //控制修改用户的显示与隐藏对话框
      editDialogVisible: false,
      editForm: {},
      //编辑表单的验证规则对象
      editFormrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配权限的角色
      userInfo: {},
      //所有角色的数据列表
      roleList: [],
      //以选中的角色id值
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data } = await this.$http.get('users', { params: this.queryInfo })
      if (data.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = data.data.users
      this.total = data.data.total
      console.log(data)
    },
    //监听pagesize改变的事件,一改变就发起数据请求
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值改变的事件，一改变就发起数据请求
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听switch开关状态的改变
    async userStateChanged (userInfo) {
      console.log(userInfo)
      //因为要动态传参，所以用模板字符串
      const { data } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      //console.log(data)
      if (data.meta.status != 200) {
        //如果更新失败就取反回来
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
    },
    //监听添加用户对话框关闭事件,然后把写的东西都清掉
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮添加新用户，预验证
    async addUser () {
      //valid对整个表单进行校验的方法，参数为一个回调函数。
      //该回调函数会在校验结束后被调用，
      //并传入两个参数：参数1：boolean值和参数2：未通过校验的字段。
      //若不传入回调函数，则会返回一个 promise
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid);
        //如果返回false验证失败，不发起请求
        if (!valid) return;
        //校验通过发起请求
        const { data } = await this.$http.post('users', this.addForm)
        console.log(data)
        if (data.meta.status !== 201) return this.$message.error('添加用户失败')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    //展示编辑用户的对话框
    async showEditDialog (id) {
      console.log(id)
      this.editDialogVisible = true
      const { data } = await this.$http.get(`users/${id}`)
      console.log(data.data)
      if (data.meta.status !== 200) return this.$message.error('查询用户失败')
      this.editForm = data.data
    },
    //监听用户修改对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息
    async editUsers () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('修改用户失败')
        const { data } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        console.log(data.data)
        if (data.meta.status !== 200) return this.$message.error('更新失败')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    //根据id删除对应的用户信息
    async removeUserById (id) {
      console.log(id)
      //询问是否删除用户，返回一个promise对象
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认删除，则返回值为字符串confirm
      //如果用户取消了删除，则返回值为字符串cancel
      //console.log(result)
      if (result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data } = await this.$http.delete('users/' + id)
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除成功')
      this.getUserList()
    },
    //展示分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // console.log(userInfo)
      //在展示对话框之前获取所有角色列表
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = data.data
      console.log(data.data)
      this.setRoleDialogVisible = true
    },
    //点击按钮分配角色
    async saveRoleInfo () {
      //如果用户没有选择新的id
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      // this.userInfo.id当前用户id
      // this.selectedRoleId用户选择的新id
      const { data } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (data.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    //监听关闭角色对话框的关闭，selected选择框重置
    setRoleDialogCloded(){
      this.selectedRoleId=''
      this.userInfo={}
    }

  }
}
</script>

<style lang="less" scoped>
</style>