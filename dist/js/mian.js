'use strict';

var BASEURL = 'https://api.houyangguang.cn';
// var BASEURL = document.domain

$(function () {
  $('#header').load('header.html');
  $('#footer').load('footer.html');
  if (window.innerWidth <= 767) { // 手机尺寸
    if ($('.wap-menu')) {
      $('.wap-menu').on('click', function () {
        active.toggleSideBar($('.min-sidebar'), true, 'show');
        active.toggleSideBar($('.sm-menu'), false, 'active')
      })
    }
  }
});
var active = {
  /**
   * ajax封装
   * @param {string} api_url api地址
   * @param {obj} data data
   * @param {string} method 方法
   * @param {object} headers 请求头
   */
  query: function query(api_url, data, method, headers) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: BASEURL + api_url,
        data: data || '',
        method: method || 'GET',
        beforeSend: function (request) {
          request.setRequestHeader('token', active.getLocalStorage('token'))
        },
        headers: headers || {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function success(res) {
          // 清楚缓存
          function removeLocalStorage() {
            localStorage.removeItem('uid');
            localStorage.removeItem('token');
            localStorage.removeItem('phone');
          }
          // token过期
          if (res.expired) {
            removeLocalStorage();
          }
          if (res.code === 'failed' && res.msg === 'token验证失败') {
            removeLocalStorage();
          }
          return resolve(res);
        },
        fail: function fail(err) {
          return reject(err);
        }
      });
    });
  },
  /**
   * layui tab-content切换效果
   * @param {obj} el dom元素
   */
  tabChangeAnimate: function tabChangeAnimate(el) {
    var $tabItem = el.parent().siblings('.layui-tab-content').children('.layui-tab-item');
    $tabItem.removeClass('layui-anim layui-anim-fadein');
    $tabItem.eq(el.index()).addClass('layui-anim layui-anim-fadein');
  },
  /**
   * 获取参数值
   * @param {string} name 参数名
   */
  getQueryString: function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  },
  setCookies: function setCookie(name, value, expiremMinutes) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=/";
  },
  /**
   * 设置cookie
   * @param {string} c_name cookie名
   * @param {string} value cookie值
   * @param {number} expiremMinutes cookie保存时间(分)
   */
  encryptionCookie: function setCookie(c_name, value, expiremMinutes) {
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
  getCookie: function getCookie(c_name) {
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
  delCookie: function delCookie(c_name) {
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
  verify: function verify(strings) {
    var reg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (!strings.length) {
      return false;
    } else if (reg.length) {
      var r = new RegExp(reg);
      if (!r.test(strings)) return false;
      else return true;
    } else {
      return true;
    }
  },
  // 手机号显示
  slicePhone: function slicePhone(phone) {
    var start = phone.slice(0, 4);
    var end = phone.slice(7, 11);
    return start + '...' + end;
  },
  // 获取localStorage
  getLocalStorage: function getLocalStorage(name) {
    if (localStorage.getItem(name) && localStorage.getItem(name) !== '') return localStorage.getItem(name);
    else return null;
  },
  // 判断是否登录
  isLogin: function isLogin() {
    var uid = active.getLocalStorage('uid');
    if (uid === null) window.location.href = '../page/login.html';
    else return true;
  },
  // 获取日期
  formatDate: function formatDate(date) {
    var year = date.split('T');
    return year[0];
  },
  /**
   * 
   * @param {object} obj 元素
   * @param {boolean} b 显示隐藏
   * @param {string} c 样式
   */
  toggleSideBar: function toggleSideBar(obj, b, c) {
    if (obj) {
      if (b) obj.addClass(c)
      else obj.removeClass(c)
    }
  }
};