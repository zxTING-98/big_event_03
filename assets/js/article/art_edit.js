$(function () {
    // 获取参数
    // alert(location.search.split('=')[1])
    // 渲染form表单

    function initForm() {
        let Id = location.search.split('=')[1];
        $.ajax({
            url: "/my/article/" + Id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
                // 渲染文章内容和封面
                // tinymce赋值(百度)
                setTimeout(function () {
                    tinyMCE.activeEditor.setContent(res.data.content);
                }, 120)
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像')
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')
                    .attr('src', newImgURL)
                    .cropper(options)
            }
        });
    }



    // 文章渲染
    let layer = layui.layer;
    let form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                let str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                // console.log(str);
                // 页面中的select 单选框 复选框样式不好更改,框架会以li dl等模拟以上的功能
                form.render();
                // 文章分类渲染成功完毕再调用,初始化form的方法
                initForm();
            }
        });
    }
    //  初始化富文本编辑器
    initEditor();

    // 3.封面
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();

    })

    // 5. 渲染图片
    $('#coverFile').on('change', function (e) {
        let file = e.target.files[0];
        if (file == undefined) {
            return;
        }
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6. 收集状态
    let state = '';
    $('#btnSave1').on('click', function () {
        state = '已发布';
    })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7.文章发布
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 文件上传必须使用FormData对象
        let fd = new FormData(this);

        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                // 发布文章的ajax一定要写到 toBlob()
                articlePublish(fd);
            });
    })

    function articlePublish(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 两个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 触动点击事件跳转
                setTimeout(function () {
                    // index页面id: art_list
                    window.parent.document.getElementById('art_list').click();
                }, 1300)
            }
        });
    }

})