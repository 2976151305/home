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
  },
  /**
   * 设置cookie
   * @param {string} c_name cookie名
   * @param {string} value cookie值
   * @param {number} expiremMinutes cookie保存时间(分)
   */
  setCookie: function (c_name, value, expiremMinutes) {
    var exdate = new Date();
    var cipherValue = CryptoJS.AES.encrypt(value, "secret key 123").toString();
    // console.log(cipherValue)
    exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);
    document.cookie = c_name + "=" + cipherValue + (expiremMinutes == null ? "" : ";expires=" + exdate.toGMTString());
  },
  /**
   * 读取cookie
   * @param {string} c_name cookie名
   */
  getCookie: function (c_name) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(c_name + '=');
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        var c_end = document.cookie.indexOf(';', c_start);
        if (c_end == -1) c_end = document.cookie.length;
        var value = document.cookie.substring(c_start, c_end);
        var bytes = CryptoJS.AES.decrypt(value, "secret key 123");
        return unescape(bytes.toString(CryptoJS.enc.Utf8));
      }
    }
    return "";
  },
  /**
   * 删除cookie
   * @param {string} c_name cookie名
   */
  delCookie: function (c_name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(c_name);
    if (cval != null) {
      document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();
    }
  },
  /**
   * 表单验证
   * @param {string} strings 输入
   * @param {RegExp} reg 正则表达式
   */
  verify: function (strings, reg = '') {
    if (!strings.length) {
      return false
    } else if (reg.length) {
      var r = new RegExp(reg)
      if (!r.test(strings)) return false
      else return true
    } else {
      return true
    }
  }
}
/**
 * 获取手机验证码
 * @param {object} self 获取验证码dom节点
 * @param {string} phone 手机号
 */
function getCode(self, phone) {
  if (!active.verify(phone)) {
    layer.msg('请输入您的手机号码')
    return
  }
  if (!active.verify(phone, '^[1][3,4,5,6,7,8,9][0-9]{9}$')) {
    layer.msg('请输入有效的手机号码')
    return
  }
  let time = 60
  if (time === 60) {
    active.query('/decorate/users/api/sms/send/', {
      phone
    }).then(res => {
      console.log(res)
      if (res.code === 'success') {
        layer.msg(res.msg)
        var interval = setInterval(() => {
          if (time === 0) {
            time = 60
            self.html('获取验证码')
            clearInterval(interval)
            return
          }
          self.html(`请${time}s后重新获取`)
          time--
        }, 1000);
      } else {
        layer.msg(res.msg)
      }
    }).catch(err => new Error(err))
  }
}