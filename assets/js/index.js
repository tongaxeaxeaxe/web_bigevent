$(function() {
  // 调用 getUserInfo() 获取用户的基本信息
  getUserInfo()

  // 导入layui的内置模块
  const layer = layui.layer

  // 点击退出按钮，实现退出功能
  $("#btnLogout").on('click', function() {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
      //do something
      // console.log('ok')
      // 1. 清空本地存储中的 token
      localStorage.removeItem('token')
      // 2. 重新跳转到登录页面
      location.href = '/code/login.html'
      
      // 关闭 confirm 询问框
      layer.close(index)
    })
  })
})

// 封装一个获取用户的基本信息的函数
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers 就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    // 请求成功的回调函数
    success: function(res) {
      console.log(res)
      if(res.status !== 0) return layui.layer.msg(res.message)
      // 成功 调用renderAvatar() 渲染用户的头像
      renderAvatar(res.data)
    },
    // // 无论成功还是失败，最终都会调用complete回调函数
    // complete: function(res) {
    //   console.log('执行了 complete 回调')
    //   console.log(res)
    //   // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if(res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
    //     // 1. 强制清空token
    //     localStorage.removeItem('token')
    //     // 2. 强制跳转到登录页
    //     location.href = '/code/login.html'
    //   }
    // }
  })
}

// 渲染用户的头像
function renderAvatar(user) {
  // 1. 获取用户的名称
  const name = user.nickname || user.username
  // 2. 设置欢迎的文本
  $("#welcome").html(`欢迎&nbsp;&nbsp;${name}`)
  // 3. 按需渲染用户的头像
  if(user.user_pic !== null) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr('src', user.user_pic).show().siblings('.text-avatar').hide()
    // $(".text-avatar").hide()
  } else {
    // 3.2 渲染文本头像
    // 获取用户名称的第一个字母 用toUpperCase()转成大写
    const first = name[0].toUpperCase()
    $(".text-avatar").html(first).show().siblings('.layui-nav-img').hide()
    // $(".layui-nav-img").hide()
  }
}