$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let str = template('tpl-art-cate', res)
                $('tbody').html(str);
            }
        });
    }

    // 窗口展示

    let indexAdd;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edd').html()
        });
    })

    // 添加文章
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArtCateList();
                layer.close(indexAdd);
            }
        });
    })


    // 修改文章窗口展示
    let indexEdit;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        // 弹窗后获取数据并赋值,通过自定义属性属性获取
        let Id = $(this).attr('data-id');
        $.ajax({
            url: "/my/article/cates/" + Id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        });



    })

    // 修改
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArtCateList();
                layer.close(indexEdit);
            }
        });
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除的是哪一个
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: "/my/article/deletecate/" + Id,
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList();
                    layer.close(index);
                }
            });
        })
    })

})