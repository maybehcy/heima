<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <!-- loginFormRef就是这个表单的实例对象 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  //点击重置按钮，重置表单的校验结果
  methods:{
    resetLoginForm(){
      //指向组件的实例，里面数据对象$refs: {loginFormRef: VueComponent}
      //(loginFormRef: VueComponent)引用对象，这个引用对象就是这个表单实例
    console.log(this);
    //调用表单重置方法
    this.$refs.loginFormRef.resetFields();
    },
    //预验证
    login(){
      //valid对整个表单进行校验的方法，参数为一个回调函数。
      //该回调函数会在校验结束后被调用，
      //并传入两个参数：参数1：boolean值和参数2：未通过校验的字段。
      //若不传入回调函数，则会返回一个 promise
      this.$refs.loginFormRef.validate(async valid=>{
        //console.log(valid);
        //如果返回false验证失败，不发起请求
        if(!valid) return;
        const {data}= await this.$http.post("login",this.loginForm);
        console.log(data);
        //这个对象里面只有data对象里的数据才是真实的数据
        //使用状态码判断是否登陆成功
        if(data.meta.status!==200) return this.$message.error('登陆失败！');
        this.$message.success('登陆成功！')
          // 1. 将登录成功之后的服务器给我们的token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        //setItem() 作为 Storage 接口的方法
        //接受一个键名和值作为参数
        //将会把键名添加到存储中，如果键名已存在，则更新其对应的值。
        window.sessionStorage.setItem('token', data.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box{
  position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    height: 300px;
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid #000;
    box-shadow: 2px 2px 10px #000;
}
.avatar_box{
    position:absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 130px;
    width: 130px;
    border-radius: 75px;
    border: 10px solid #eee;
    box-shadow: 2px 2px 10px #ddd;
    overflow: hidden;
    background-color: #fff;
    img{
        width: 100%;
        background-color: #fff;
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 10%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>