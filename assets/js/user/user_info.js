$(function () {
    let layer = layui.layer;
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度不能大于6位'
            }
        }
    })

    initUserInfo();

    // 用户信息
    function initUserInfo() {
        $.ajax({
            url: "/my/userinfo",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data);
            }
        });
    }

    // 重置回原来的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    // 修改用户信息
    $('#formUserInfo').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);

                window.parent.getUserInfo();
            }
        });
    })

})