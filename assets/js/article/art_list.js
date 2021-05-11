$(function () {
    // 0 日期函数
    template.defaults.imports.dataFormat = function (dtStr) {
        let dt = new Date(dtStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 查询参数
    let q = {
        pagenum: 1,       // 页码值
        pagesize: 2,     // 每页显示多少条数据
        cate_id: '',      // 文章分类的 Id
        state: '',        // 文章的状态，可选值有：已发布、草稿
    }

    let layer = layui.layer;
    let form = layui.form;

    // 渲染文章列表
    initTable();
    function initTable() {
        $.ajax({
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let str = template('tpl-table', { data: res.data });
                $('tbody').html(str);
                renderPage(res.total);
            }
        });
    }

    // 获取文章分类
    initCate();
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message);
                let str = template('tpl-cate', { data: res.data })
                $('[name=cate_id]').html(str);
                form.render();
            }
        });
    }

    // 筛选
    $('#search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    })

    // 分页
    function renderPage(total) {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示的条数
            curr: q.pagenum, //启示页面
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 20],  // 每页多少选择框
            // 跳转页面到的回调函数
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数

                // 改变当前页
                q.pagenum = obj.curr;
                // 改变一页显示多少
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 删除
    $('tbody').on('click', '.btn-del', function () {
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message);
                    if ($('.btn-del').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();
                    layer.close(index);
                }
            });
        })
    })
})