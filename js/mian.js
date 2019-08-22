const BASEURL = 'https://api.houyangguang.cn'
$(function () {
  $('#header').load('header.html')
  $('#footer').load('footer.html')
})
var active = {
  /**
   * ajax封装
   * @param {string} api_url api地址
   * @param {obj} data data
   * @param {string} method 方法
   * @param {object} headers 请求头
   */
  query: function (api_url, data, method, headers) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${BASEURL}${api_url}`,
        data: data || '',
        method: method || 'GET',
        headers: headers || {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })
  },
  /**
   * layui tab-content切换效果
   * @param {obj} el dom元素
   */
  tabChangeAnimate: function (el) {
    let $tabItem = el.parent().siblings('.layui-tab-content').children('.layui-tab-item')
    $tabItem.removeClass('layui-anim layui-anim-fadein')
    $tabItem.eq(el.index()).addClass('layui-anim layui-anim-fadein')
  },
  /**
   * 获取参数值
   * @param {string} name 参数名
   */
  getQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
}