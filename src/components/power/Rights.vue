<template>
  <div>
 <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>权限管理</el-breadcrumb-item>
     <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->

   <el-card>
       <el-table
      :data="rightsList"
      style="width: 100%"
      border
      stripe>
      <!-- type="index"自动添加索引列 -->
      <el-table-column
        type="index">
      </el-table-column>
      
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>

      <el-table-column
        prop="path"
        label="途径">
      </el-table-column>

      <el-table-column
        prop="level"
        label="权限等级">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
            
        </template>
      </el-table-column>
       </el-table>
   </el-card>

 </div>
</template>

<script>
export default {
  data(){
      return{
          //权限列表
          rightsList:[]
      }
  },
      //生命周期函数
      created(){
          //获取所有的权限
          this.getRightsList()
      },
      methods: {
          //获取权限列表
          async getRightsList(){
              const {data} =await this.$http.get('rights/list')
              //console.log(data)
              if(data.meta.status!==200){
                  return this.$message.error('获取权限列表失败')
              }
              this.rightsList=data.data
              console.log(this.rightsList)
          }
      }
}
</script>

<style lang="less" cosped>

</style>