const BASEURL = 'https://api.houyangguang.cn'
$(function () {
  $('#header').load('./header.html')
  $('#footer').load('./footer.html')
})
var active = {
  /**
   * 表单弹框
   * @param {object} config layer弹出层设置
   * @param {string} api_url api路径
   */
  openForm: function (config, api_url) {
    layer.open({
      title: config.title,
      content: config.content,
      shade: config.shade || .5,
      closeBtn: false,
      shadeClose: true,
      btn: config.btn || '提交',
      area: config.area,
      move: false,
      yes: (index, layero) => {
        return new Promise((resolve, reject) => {
          let dataObj = []
          let id_arr = $('.layui-input-block *') || $('.layui-input-inline *')
          id_arr.each((i, item) => {
            // 检索所有带有id的表单元素
            if (item.id) {
              if (item.tagName === 'INPUT') {
                let val = item.value
                if(!val.length){
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