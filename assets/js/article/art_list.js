$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    return dt.toLocaleString()
  }
  // template.defaults.imports.dataFormat = function(date) {
  //   const dt = new Date(date)

  //   var y = dt.getFullYear()
  //   var m = (dt.getMonth() + 1).toString().padStart(2, '0')
  //   var d = dt.getDate().toString().padStart(2, '0')

  //   var hh = dt.getHours().toString().padStart(2, '0')
  //   var mm = dt.getMinutes().toString().padStart(2, '0')
  //   var ss = dt.getSeconds().toString().padStart(2, '0')

  //   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  // }


  // 定义一个查询的参数对象，将来请求数据的时候
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 	页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认两条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  // 调用获取文章列表数据的方法
  initTable()
  // 调用初始化文章分类的方法
  initCate()

  // 封装获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面数据
        const htmlStr = template('tpl-table', res)
        $("tbody").html(htmlStr)
        // console.log(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 封装初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取文章分类数据失败！')
        // 成功 调用模板引擎渲染分类的可选项
        // console.log(res);
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // console.log(htmlStr);
        // 当表单存在动态生成时，需要重新进行渲染 用layui
        form.render();
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中的值
    var cate_id = $("[name=cate_id]").val()
    var state = $("[name=state]").val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,  //每页显示几条
      curr: q.pagenum,  //设置默认选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候  //first 为 false
      // 2. 调用了 laypage.render() 方法  //first 为 true
      jump: function (obj, first) {
        // console.log(first);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        // console.log(obj.curr);
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到 q 这个查询参数对象中
        // console.log(obj.limit);
        q.pagesize = obj.limit
        // 只有当点击页码的时候 才获取文章列表的数据
        if (!first) {
          // 根据最新的 q 调用获取文章列表数据的方法 获取对应的数据列表
          initTable()
        }
      }
    });
  }


  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $("tbody").on('click', '.btn-delete', function () {
    // 获取当前页面上删除按钮的个数
    var len = $('.btn-delete').length
    // 拿到当前文章的id
    var id = $(this).data('id')
    // var id = $(this).attr('data-id')
    // console.log(id);
    // 弹出层 询问是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了，则让页码值 -1 之后，
          // 再重新调用 initTable 方法
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          // 重新渲染 调用获取文章列表数据的方法
          initTable()
        }
      })

      // 关闭弹出层
      layer.close(index);
    })
  })
})