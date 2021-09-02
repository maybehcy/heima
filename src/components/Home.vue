<template>
        <el-container class="home-container">
          <!-- 页面头部区域开始-->
        <el-header>
          <div>
            <img src="../assets/heima.png" alt="">
            <span>管理系统</span>
          </div>
          <el-button type="info" @click="logout"> 退出 </el-button>
          </el-header>
          <!-- 页面头部区域开始 -->
        <el-container>
          <!-- 侧边栏开始-->
          <!-- 如果flag为true，宽度变为64px -->
        <el-aside :width="flag ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse" >|||</div>
        <el-menu
      background-color="#333"
      text-color="#fff"
      active-text-color="#409EFF" 
      unique-opened
      :collapse="flag"
      :collapse-transition="true"
      :router="true"
      :default-active="activePath"
      >
      <!-- collapse是否折叠 -->
      <!-- collapse-transition是否关闭动画 -->
      <!-- 为了保持左侧菜单每次只能打开一个，显示其中的子菜单，我们可以在el-menu中添加一个属性unique-opened
或者也可以数据绑定进行设置(此时true认为是一个bool值，而不是字符串) :unique-opened="true" -->
      <!-- active-text-color激活文本的颜色，即二级菜单文本颜色 -->
      <!-- 侧边栏菜单区域开始-->

      <!-- 一级菜单模板区域开始 -->
      <!-- 因为我们点开其中一个导航其余会跟着打开，是因为index值一样的原因，所以动态给唯一index -->
      <!-- 又因为index后面的数值是字符串，而我们给的是数字型，所以简单拼接字符串 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
      
      <!-- 二级菜单开始 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)"> 
            <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      <!-- 二级菜单结束 -->
      </el-submenu>
      <!-- 一级菜单区域结束 -->
    </el-menu>
      <!-- 侧边栏菜单区域结束-->
    </el-aside>
        <!-- 侧边栏结束 -->
          <!-- 页面主体区域开始-->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
        <!-- 页面主体区域结束 -->
        </el-container>
        </el-container>
    
</template>

<script>
export default {
  data(){
    return{
    //左侧菜单数据
    menulist:[],
    //因为导航栏是动态生成的，引入外部图标库也得是动态的
    //定义一个字体图标对象，一级导航栏的id作为对象的属性k
    iconsObj:{
      '125':'iconfont icon-user',
      '103':'iconfont icon-tijikongjian',
      '101':'iconfont icon-shangpin',
      '102':'iconfont icon-danju',
      '145':'iconfont icon-baobiao'
    },
    flag:false,
    //被激活的链接地址
    activePath:''
  }
  },
  
  //整个home组件一被创建的时候，会自动调用生命周期函数
  //处理数据库写在这里
  //我们就把sessionStorage中的值给default-active
  created () {
    // 调用"获取所有的左侧菜单"函数
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // async和await简化promise操作
    async getMenuList(){
      const{data}=await this.$http.get('menus')
      console.log(data)
      //如果获取数据失败
      if(data.meta.status!==200) return this.$message.error(data.meta.msg)
      this.menulist=data.data
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse(){
      this.flag=!this.flag 
    },
    //保存连接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      //当我们点击其他二级菜单时，点回原来的就不亮了，所以我们要重新赋值
      this.activePath=activePath
    }
  }
}
</script>

<style lang='less' scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #333;
  .el-menu{
    border:none;
  }
}
.el-main{
   background-color:#fff;
}
.home-container{
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // 文字之间的间距
  letter-spacing: 0.2em;
  cursor: pointer;

}
</style>