// 入口函数
$(function() {
    // 点击'去注册账号的链接'
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击'去登录的链接'
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 从layui中导入表单form内置模块(对象)
    var form = layui.form
    // 从layui中导入弹出层layer内置模块(对象)
    var layer = layui.layer

    // 通过form.verify()自定义校验规则
    form.verify({
        // 自定义一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是使用本校验规则(确认密码框)中的内容
            // 还需要拿到密码框中的内容，然后进行一次等于判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $(".reg-box [name=repassword]").val()
            if(pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $("#form_reg").on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        // 发起post请求注册新用户
        var data = {username: $(".reg-box [name=username]").val(), password: $(".reg-box [name=password]").val()}
        $.post('/api/reguser', data, function(res) {
            // 判断是否成功
            if(res.status !== 0) return layer.msg(res.message)

            // 成功
            layer.msg('注册成功，请登录！')

            // 注册成功后直接跳转到登录页面 模拟人的点击行为
            $('#link_login').click()
        })
    })


    // 监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        // 阻止默认的提交行为
        e.preventDefault()
        // 发起post请求登录
        $.ajax({
            url: '/api/login',
            type: "POST",
            // jquery中 serialize()快速获取form表单的数据
            data: $(this).serialize(),
            success: function(res) {
                // 判断是否成功
                if(res.status !== 0 ){
                    return layer.msg('登录失败！')
                }
                // 成功
                layer.msg('登录成功！')
                // console.log(res.token)
                // 将登录成功后得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/code/index.html'
            }
        })
    })
})