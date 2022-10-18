$(function () {
  const layer = layui.layer
  const form = layui.form

  // 调用获取文章分类列表的函数
  initArtCateList()

  // 封装获取文章分类列表的函数
  function initArtCateList() {
    $.get('/my/article/cates', function (res) {
      // console.log(res)
      if (res.status !== 0) return layui.layer.msg('获取文章列表失败！')

      // 调用template()函数 得到一个html结构的字符串
      const htmlStr = template('tpl-table', res)
      // 渲染到tbody中
      $(".layui-table tbody").html(htmlStr)
    })
  }


  // 为添加类别按钮绑定点击事件
  var indexAdd = null
  $("#btnAddCate").on('click', function () {
    // 弹出 弹出层
    indexAdd = layer.open({
      type: 1,   // 页面层
      area: ['500px', '250px'],  // 宽和高
      title: '添加文章分类',  // 标题
      content: $("#dialog-add").html()  // 内容 导入页面中的script模板结构
    })
  })

  // 通过代理的形式，为 form-add 表单绑定 submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('新增文章类别失败！')
        }
        // 成功 调用获取文章分类列表的函数 重新渲染
        initArtCateList()
        layer.msg('新增文章类别成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })


  // 通过代理的形式，为 btn-edit 编辑按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,   // 页面层
      area: ['500px', '250px'],  // 宽和高
      title: '修改文章分类',  // 标题
      content: $("#dialog-edit").html()  // 内容 导入页面中的script模板结构
    })

    // 拿到自定义属性里存储的Id
    var id = $(this).data('id')
    // console.log(id);
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res)
        // 通过layui的form内置模块，快速为表单赋值
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        // 关闭弹出层
        layer.close(indexEdit)
        // 调用获取文章分类列表的函数 重新渲染
        initArtCateList()
      }
    })
  })


  // 通过代理的形式，为删除按钮 btn-delete 绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // console.log('ok');
    // 拿到自定义属性里存储的Id
    var id = $(this).data('id')

    // 弹出一个提示用户是否要删除的层
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 确认发起ajax请求删除对应的数据
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          // 成功
          layer.msg('删除分类成功！')
          // 关闭弹出层
          layer.close(index);
          // 调用获取文章分类列表的函数 重新渲染
          initArtCateList()
        }
      })
    })
  })
})