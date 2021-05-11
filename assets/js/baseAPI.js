let baseURL = 'http://api-breakingnews-web.itheima.net';


$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;

    if (params.url.indexOf('/my/') != -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }

    // 登录拦截
    params.complete = function (res) {
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败！") {
            location.href = '/login.html';
            localStorage.removeItem('token');
        }
    }
})