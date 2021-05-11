$(function () {
    // 功能1: 登录注册页面切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 功能2: 表单验证
    console.log(layui);
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'
        ],
        repwd: function (value) {
            let pwd = $('.reg-box input[name=password]').val().trim();
            // 校验
            if (value != pwd) {
                return ('两次输入密码不一致')
            }
        }
    })


    // 功能3: 注册
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "POST",
            url: "http://api-breakingnews-web.itheima.net/api/reguser",
            data: {
                username: $('#form_reg input[name=username]').val(),
                password: $('#form_reg input[name=password]').val(),
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 6 });

                // 清空表单,并回到登录页面
                $('#link_login').click();
                $('#form_reg')[0].reset();
            }
        });
    })

    // 功能4: 登录
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "POST",
            url: "http://api-breakingnews-web.itheima.net/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 6 });
                // 跳转并保存token
                window.location.href = '/index.html';
                localStorage.setItem('token', res.token);
            }
        })
    })
})