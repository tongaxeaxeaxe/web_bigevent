$(function () {
  // 导入layui的form内置模块 定义表单的验证规则
  const form = layui.form
  // 导入layer内置模块
  const layer = layui.layer

  // 创建自定义的验证规则
  form.verify({
    // value 代表当前input表单的值
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })

  // 调用初始化用户的基本信息的函数
  initUserInfo()


  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        // console.log(res)
        // 调用 form.val() 快速为表单赋值
        form.val("formUserInfo", res.data)
      }
    })
  }

  // 重置表单的数据
  $("#btnReset").on('click', function (e) {
    // 阻止表单默认重置行为
    e.preventDefault()
    // 调用初始化用户的基本信息的函数 回到初始状态
    initUserInfo()
  })

  // 监听表单的提交事件
  $(".layui-form").on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求 更新用户的基本信息
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      // data: form.val("formUserInfo"),
      success: function(res) {
        // console.log(res);
        if(res.status !== 0) return layer.msg('更新用户信息失败！')
        // 成功
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
})