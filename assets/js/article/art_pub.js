$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                let str = template('tpl-cate', { data: res.data });
                $('[name=cate_id]').html(str);
                form.render();
            }
        });
    }

    ///  初始化富文本编辑器
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

    // 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function () {
        let file = this.files[0];
        if (file == undefined) {
            return;
        }
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 收集状态
    let state;
    $('#btnSave1').on('click', function () {
        state = '已发布'
    });
    $('#btnSave2').on('click', function () {
        state = '草稿'
    });

    // 文章发布
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData(this)
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
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1300)
            }
        });
    }
})