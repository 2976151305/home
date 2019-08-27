'use strict';

var caseCarousel = [];
var $carousel = $('#carousel ul');
var $caseCarousel = $('#case_carousel ul');
var $articleList = $('.home-article-list');
var $caseInfo = $('.case-info .case-info-content');
var $bottomBar = $('.bottom-bar');
var $effect = $('.effect');
var $smart = $('.smart-box');
var flag = true;
jQuery(function () {
  $("#distpicker").distpicker();
  if (localStorage.getItem('c')) {
    $bottomBar.append('<a href="javascript:;" class="close-bottom-bar"><i class="layui-icon layui-icon-close"></i></a>');
    $('.close-bottom-bar').on('click', function () {
      $bottomBar.remove();
    });
  }
  if (flag) {
    $smart.on('mouseover', function () {
      var self = $(this);
      self.find('.smart-shade').css({
        'opacity': '1',
        'transform': 'translateX(0)'
      });
      flag = false;
    });
  }
  active.query('/decorate/advertising/api/adverts/decorate/scene/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      res.data.forEach(function (item) {
        arr.push(('\n            <div class="mhn-item">\n              <div class="mhn-inner">\n                <div class="mhn-img" style="background: url(' + item.image + ') no-repeat center / cover;"></div>\n              </div>\n            </div>').trim());
      });
      $('.mhn-slide').append(arr);
      $('.mhn-slide').owlCarousel({
        nav: true,
        //loop:true,
        slideBy: 'page',
        rewind: false,
        responsive: {
          350: {
            items: 1
          },
          768: {
            items: 2
          },
          992: {
            items: 3
          },
          1220: {
            items: 4
          }
        },
        smartSpeed: 500,
        navText: ['<i class="layui-icon layui-icon-prev"></i>', '<i class="layui-icon layui-icon-next"></i>']
      });
    }
  });
});
layui.use(['element', 'carousel', 'layer'], function () {
  var element = layui.element;
  var carousel = layui.carousel;
  var layer = layui.layer;
  active.query('/decorate/advertising/api/adverts/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      res.data.forEach(function (item) {
        if (item.ad_location === '首页banner') {
          arr.push(('\n              <li>\n                <a class="w h block" style="background: url(' + item.image + ') no-repeat center / cover;" href="' + (item.link_url ? item.link_url : 'javascript:;') + '"></a>\n              </li>\n              ').trim());
        }
      });
      $carousel.append(arr);
      // big banner
      carousel.render({
        elem: '#carousel',
        width: '100%',
        height: '670px',
        anim: 'fade',
        interval: '5000'
      });
    }
  }).catch(function (err) {
    return new Error(err);
  });
  // 案例轮播
  active.query('/decorate/cases/api/case/recommend/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      res.data.cases.forEach(function (item) {
        caseCarousel.push(item);
        arr.push('\n            <li>\n              <a class="w h block" href="./case.html?id=' + item.id + '" style="background: url(' + item.cover_img + ') no-repeat center / cover;"></a>\n            </li>');
      });
      $caseCarousel.append(arr);
      $caseInfo.children('h2').text(caseCarousel[0].title);
      $caseInfo.children('p').text(caseCarousel[0].features_describe);
      // case banner
      carousel.render({
        elem: '#case_carousel',
        autoplay: false,
        width: '100%',
        height: '470px',
        arrow: 'always',
        indicator: 'none'
      });
    }
  }).catch(function (err) {
    return new Error(err);
  });

  active.query('/decorate/articles/api/articles/').then(function (res) {
    if (res.code === 'success') {
      var i = 0;
      var arr = [];
      res.data.forEach(function (item) {
        if (i < 5) {
          if (item.if_join_recommend) {
            arr.push(('\n                <article class="article-item">\n                  <article>\n                    <a class="block" href="./article.html?id=' + item.id + '">\n                      <div class="article-cover-img" style="background: url(' + item.cover_img + ') no-repeat center / cover"></div>\n                      <div class="layui-inline">\n                        <h2 class="layui-elip">' + item.title + '</h2>\n                        <p class="article-introduction">' + item.introduction + '</p>\n                      </div>\n                    </a>\n                  </article>\n                </div>\n              ').trim());
            i++;
          }
        }
      });
      $articleList.append(arr);
    }
  }).catch(function (err) {
    new Error(err);
  });
  active.query('/decorate/rendering/api/renderings/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      var i = 0;
      res.data.forEach(function (item) {
        if (i >= 6) return;
        if (item.if_join_recommend) {
          arr.push(('\n              <div class="layui-col-lg4">\n                <div class="effect-item">\n                  <div class="percent-box"></div>\n                  <div class="effect-img-box" style="background: url(' + item.cover_img + ') no-repeat center / cover;"></div>\n                  <div class="effect-shade">\n                    <h3>' + item.name + '</h3>\n                  </div>\n                  <img layer-src="' + item.cover_img + '" class="effect-img" alt="' + item.name + '">\n                </div>\n              </div>\n              ').trim());
          i++;
        }
      });
      $effect.append(arr);
      layer.photos({
        photos: '.effect',
        anim: 5,
        move: false,
        tab: function tab(pic, layero) {}
      });
    }
  }).catch(function (err) {
    return new Error(err);
  });
  // 滑动切换监听事件
  carousel.on('change(case_carousel)', function (e) {
    $caseInfo.children('h2').text(caseCarousel[e.index].title);
    $caseInfo.children('p').text(caseCarousel[e.index].features_describe);
  });
  var $apply = $('.apply');
  // 申请
  $apply.on('click', function () {
    var $phone = $('#phone').val();
    var $area = $('#area').val();
    var $province = $('#province').val();
    var $city = $('#city').val();
    if (!$area.length || !$phone.length) {
      layer.msg('填写装修面积和手机号码之后才能免费预约哦！');
      return false;
    }
    var data = {
      phone: $phone,
      area: $area,
      city: $province + $city
    };
    active.query('/decorate/cases/api/case/apply/', data, 'POST').then(function (res) {
      console.log(res);
      if (res.code === 'success') {
        layer.open({
          title: '预约成功',
          icon: 1,
          content: '稍后会有装修管家以xxxx或xxxx开头的号码回电您，向您免费提供装修咨询服务。',
          btn: '知道了',
          shade: .5,
          shadeClose: false
        });
        if (!localStorage.getItem('c')) {
          localStorage.setItem('c', true);
          $bottomBar.append('<a href="javascript:;" class="close-bottom-bar"><i class="layui-icon layui-icon-close"></i></a>');
          $('.close-bottom-bar').on('click', function () {
            $bottomBar.remove();
          });
        }
      } else {
        layer.msg(res.data.msg);
      }
    }).catch(function (err) {
      layer.msg('提交失败,请稍后重试!');
      new Error(err);
    });
  });
});