const BASEURL = 'https://api.houyangguang.cn'
$(function () {
  $('#header').load('./header.html')
  $('#footer').load('./footer.html')
  // $('#footer').addClass('block-mt') 
})
var active = {
  query: function (api_url, data, method, headers) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${api_url}`,
        // url: `${BASEURL}${api_url}`,
        data: data || '',
        method: method || 'GET',
        headers: headers || {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          resolve(res)
          if (res.status != 200)
            reject(res.msg)
        },
        fail: err => new Error(err)
      })
    })
  },
  /**
   * 表单弹框
   * @param {object} config layer弹出层设置
   * @param {string} api_url api路径
   * @param {object} modules 需要重新加载的layui模块
   */
  openForm: function (config, api_url, modules = {}) {
    layer.open({
      title: config.title || '请填写信息',
      content: config.content,
      shade: config.shade || .5,
      closeBtn: false,
      shadeClose: true,
      btn: config.btn || '提交',
      area: config.area,
      move: false,
      success: function () {
        if ($("#distpicker")[0])
          $("#distpicker").distpicker()
        // 重新加载模块
        if (modules.form)
          modules.form.render()
        if (modules.upload)
          modules.upload.render()
      },
      yes: (index, layero) => {
        return new Promise((resolve, reject) => {
          let dataObj = []
          let id_arr = $('.layui-input-block *')
          id_arr.each((i, item) => {
            // 检索所有带有id的表单元素
            if (item.id) {
              if (item.tagName === 'INPUT') {
                let val = item.value
                if (!val.length) {
                  reject(false)
                  return false
                }
                dataObj.push({
                  [item.id]: val
                })
              }
            }
          })
          resolve(dataObj)
        }).then(r => {
          console.log(r)
          return
          $.ajax({
            url: `${BASEURL}${api_url}`,
            method: 'POST',
            data: r,
            dataType: 'json',
            headers: {
              'Content-Type': 'application/x-www-form-urlcoded'
            },
            success: res => {
              console.log(res)
              active.successCallBack('提交成功', index)
            },
            fail: err => {
              active.failCallBack('提交失败', err)
            }
          })
        }).catch(err => {
          if (!err) {
            layer.msg('请输入完整的信息')
            new Error(err)
          }
        })
      }
    })
  },
  /**
   * 成功回调
   * @param {string} msg 提示信息
   * @param {number} index 弹窗索引
   */
  successCallBack: function (msg, index) {
    layer.alert(msg, {
      icon: 1
    })
    layer.close(index)
  },
  /**
   * 失败回调
   * @param {string} msg 提示信息
   * @param {obj} err 错误提示
   */
  failCallBack: function (msg, err) {
    layer.msg(msg)
    new Error(err)
  }
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}