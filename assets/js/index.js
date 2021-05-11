$(function () {
    // 获取用户信息
    getUserInfo();

    let layer = layui.layer;
    // 退出
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            layer.close(index);
            location.href = '/login.html';
            localStorage.removeItem('token');
        })
    })
})

function getUserInfo() {
    $.ajax({
        url: "/my/userinfo",
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg(res.message);
            }

            renderAvatar(res.data)
        }
    });
}


// 渲染方法

function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcom').html('欢迎&emsp;' + name);
    if (user.user_pic) {
        $('.text-avatar').hide();
        $('.layui-nav-img').show().attr('src', user.user_pic);
    } else {
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
        $('.layui-nav-img').hide();
    }
}