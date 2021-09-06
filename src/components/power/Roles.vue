<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     style="margin-bottom:15px;"
                     @click="addUserVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleslist"
                border
                stripe>
        <!-- 角色权限浏览图 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统一行24列 -->
            <el-row :class="['bdbottom',i1===0 ?'bdtop':'','vcenter']"
                    v-for="(item1,i1) in scope.row.children"
                    :key="item1.i1">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[i2===0?'':'bdtop','vcenter']"
                        v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning"
                            v-for="(item3) in item2.children"
                            :key="item3.id"
                            closable
                            @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>

                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index">
        </el-table-column>

        <el-table-column prop="roleName"
                         label="角色名称">
        </el-table-column>

        <el-table-column prop="roleDesc"
                         label="角色描述">
        </el-table-column>

        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="roleDelete(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="showSetRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 添加角色弹出框 -->
    <el-dialog title="添加角色"
               :visible.sync="addUserVisible"
               width="50%"
               @close="addDialogClosed">
      <!-- 添加用户的数据 -->
      <el-form :model="addForm"
               :rules="addRoleFormRules"
               ref="addRoleFormRef"
               label-width="70px">
        <el-form-item label="名称："
                      prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述："
                      prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addUserVisible=false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editRoleVisible"
               width="50%"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormrules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="角色"
                      prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="描述"
                      prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible"
               width="50%">
      <!-- node-key="id" 
      1.每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      2.当我们选中那一项的复选框时，我们希望不是选中对应的文本，而是对应文本的id
       -->
      <!-- default-expand-all	是否默认展开所有节点 -->
      <!-- default-checked-keys	
      1.默认勾选的节点的 key 的数组 
      2.default-checked-keys设置默认展开和默认选中的节点。
      需要注意的是，此时必须设置node-key
      -->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>
      <!-- 为tree添加引用 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      //所有角色列表数据
      roleslist: [],
      //控制添加弹出框的显示与隐藏
      addUserVisible: false,
      //添加用户表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色的验证规则
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请描述角色', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      },
      //编辑用户表单数据
      editForm: {},
      //编辑用户对话框的显示与隐藏
      editRoleVisible: false,

      //编辑角色的信息规则
      editFormrules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请描述角色', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      },
      //控制分配权限的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //树型控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的id值数组
      defKeys: [],
      //即将分配权限的角色id
      roleId: ''
    }

  },
  //周期函数
  created () {
    this.getRolesList()
  },
  methods: {
    //获得角色列表
    async getRolesList () {
      const { data } = await this.$http.get('roles')
      //console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.$message.success('获取角色信息成功')
      this.roleslist = data.data
    },
    //点击添加用户按钮
    async addUser () {
      //获得表单对象，并进行预验证
      this.$refs.addRoleFormRef.validate(async valid => {
        //valid是boolean值
        console.log(valid);
        //验证不通过就结束
        if (!valid) return;
        //验证通过就请求数据
        const { data } = await this.$http.post('roles', this.addForm)
        //console.log(data)
        //判断状态码是否为201
        if (data.meta.status !== 201)
          return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.addUserVisible = false
        this.getRolesList()
      })
    },
    //添加对话框关闭事件，把表单重置
    addDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    //根据id查询修改角色
    async showRoleDialog (id) {
      const { data } = await this.$http.get('roles/' + id)
      console.log(data)
      this.editRoleVisible = true
      if (data.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editForm = data.data
    },
    //编辑角色信息按钮
    async editUser () {
      //获得表单对象，并进行预验证
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return;
        const { data } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        console.log(data)
        if (data.meta.status !== 200) {
          return this.$message.error('修改信息失败')
        }
        this.editRoleVisible = false
        this.$message.success('修改信息成功')
        this.getRolesList()
      })
    },
    //关闭编辑对话框时，重置表单
    editDialogClosed () {
      this.refs.editFormRef.resetFields()
    },
    //根据id删除角色
    async roleDelete (id) {
      //询问是否删除角色，返回一个promise对象
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
      const { data } = await this.$http.delete('roles/' + id)
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    //根据id删除对应的权限
    async removeRightById (role, rightId) {
      //弹框提示用户是否删除
      const confirmResult = await this.$confirm('是否永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      const { data } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('修改权限失败')
      }
      //因为调用这个函数会重新渲染页面，会把权限的列表合上，所以不建议使用这个函数
      //this.getRolesList()
      //所以把返回来的最新数据重新赋值
      role.children = data.data
      this.$message.success('删除权限成功')
    },
    //展示分配权限对话框
    async showSetRight (role) {
      //获取所有权限数据
      const { data } = await this.$http.get('rights/tree')
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.setRightDialogVisible = true
      //把获取到的权限数据保存到rightsList中
      this.rightsList = data.data
      //递归3级节点的id
      this.getLeaKeys(role, this.defKeys)
      //把当前行的角色id存起来，为了给角色分配权限用
      this.roleId = role.id
    },
    //通过递归形式，获得3级权限的id，id保存的defKeys数组中
    getLeaKeys (node, arr) {
      //如果当前node节点不包含children属性，则是3级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getLeaKeys(item, arr)
      )
    },
    //为角色分配权限
    async allotRights () {
      //两个数组合并成一个新数组
      const keys = [
        // 已选择节点的id数组
        ...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (data.meta.status !== 200) {
        return this.$message.error('权限赋予失败')
      }
      this.$message.success('权限赋予成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }
}
</script>


<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>