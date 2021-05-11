$(function () {
    // 定义校验规则
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,16}$/
            , '密码必须6到16位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码与原密码相同,请重新输入'
            }
        },
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '两次输入的密码不一致,请重新输入'
            }
        }
    })

    // 修改密码
    $('#formPwd').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('#formPwd')[0].reset();
                window.parent.location.href = '/login.html';
            }
        });
    })
})