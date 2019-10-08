'use strict';

var caseCarousel = [];
var $carousel = $('#carousel ul');
var $caseCarousel = $('#case_carousel ul');
var $articleList = $('.home-article-list');
var $caseInfo = $('.case-info .case-info-content');
var $bottomBar = $('.bottom-bar');
var $effect = $('.effect');
var $smart = $('.smart-box');
jQuery(function () {
  $("#distpicker").distpicker();
  if (localStorage.getItem('c')) {
    $bottomBar.append('<a href="javascript:;" class="close-bottom-bar"><i class="layui-icon layui-icon-close"></i></a>');
    $('.close-bottom-bar').on('click', function () {
      $bottomBar.remove();
    });
  }
  var flag = true;
  $smart.on('mouseover', function () {
    if (!flag) return
    var self = $(this);
    self.find('.smart-shade').css({
      'opacity': '1'
    });
    let imgArr = []
    for (let i = 0; i <= 8; i++) {
      let img = `<img class="hover-img hover-img${i} layui-anim layui-anim-fadein" src="../images/hover${i}.png" style="-webkit-animation-delay: ${500 + i * 500}s; animation-delay: ${500 + i * 500}ms;">`
      if (i === 0) {
        img = `<div class="tip layui-anim layui-anim-fadein" style="-webkit-animation-delay: ${500 + i * 500}s; animation-delay: ${500 + i * 500}ms;">
          <h1>HUMANIZED SERVICE</h1>
          <span class="layui-inline">智能化体验，让您拥有一个舒适的家</span>
        </div>`
      }
      imgArr.push(img.trim())
    }
    self.append(imgArr.join(''))
    flag = false;
  });
  active.query('/decorate/advertising/api/adverts/decorate/scene/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      res.data.forEach(function (item) {
        arr.push(('<div class="mhn-item">  <div class="mhn-inner">    <div class="mhn-img" style="background: url(' + item.image + ') no-repeat center / cover;"></div>  </div></div>').trim());
      });
      $('.mhn-slide').append(arr);
      $('.mhn-slide').owlCarousel({
        nav: true,
        //loop:true,
        slideBy: 'page',
        rewind: false,
        responsive: {
          350: {
            items: 3
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
        smartSpeed: 300,
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
    console.log(res)
    if (res.code === 'success') {
      var arr = [];
      res.data.forEach(function (item) {
        if (item.ad_location === '首页banner') {
          arr.push(('  <li>    <a class="w h block" style="background: url(' + item.image + ') no-repeat center / cover;" href="' + (item.link_url ? item.link_url : 'javascript:;') + '"></a>  </li>  ').trim());
        }
      });
      $carousel.html(arr);
      // big banner
      carousel.render({
        elem: '#carousel',
        width: '100%',
        anim: 'fade',
        interval: '5000'
      });
    }
  }).catch(function (err) {
    return 
        throw new Error(err);
  });
  // 案例轮播
  active.query('/decorate/cases/api/case/recommend/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      res.data.cases.forEach(function (item) {
        caseCarousel.push(item);
        arr.push('<li>  <a class="w h block" href="./case.html?id=' + item.id + '" style="background: url(' + item.cover_img + ') no-repeat center / cover;"></a></li>');
      });
      $caseCarousel.append(arr);
      $caseInfo.children('h2').text(caseCarousel[0].title);
      $caseInfo.children('p').html(caseCarousel[0].features_describe);
      // case banner
      carousel.render({
        elem: '#case_carousel',
        autoplay: false,
        width: '100%',
        arrow: 'always',
        indicator: 'none'
      });
    }
  }).catch(function (err) {
    return 
        throw new Error(err);
  });

  active.query('/decorate/articles/api/articles/').then(function (res) {
    if (res.code === 'success') {
      var i = 0;
      var arr = [];
      res.data.forEach(function (item) {
        if (i < 6) {
          if (item.if_join_recommend) {
            arr.push(('    <article class="article-item layui-col-xs6 ' + (i == 5 ? 'layui-show-xs-block layui-hide-lg' : '') + '">      <article>        <a class="block" href="./article.html?id=' + item.id + '">          <div class="article-cover-img" style="background: url(' + item.cover_img + ') no-repeat center / cover"></div>          <div class="layui-inline">            <h2 class="layui-elip">' + item.title + '</h2>            <p class="article-introduction">' + item.introduction + '</p>          </div>        </a>      </article>    </div>  ').trim());
            i++;
          }
        }
      });
      $articleList.append(arr);
    }
  }).catch(function (err) {
    
        throw new Error(err);
  });
  active.query('/decorate/rendering/api/renderings/').then(function (res) {
    if (res.code === 'success') {
      var arr = [];
      var i = 0;
      res.data.forEach(function (item) {
        if (i >= 6) return;
        if (item.if_join_recommend) {
          arr.push(('  <div class="layui-col-lg4 layui-col-xs6">    <div class="effect-item">      <div class="percent-box"></div>      <div class="effect-img-box" style="background: url(' + item.cover_img + ') no-repeat center / cover;"></div>      <div class="effect-shade">        <h3>' + item.name + '</h3>      </div>      <img layer-src="' + item.cover_img + '" class="effect-img" alt="' + item.name + '">    </div>  </div>  ').trim());
          i++;
        }
      });
      $effect.append(arr);
      layer.photos({
        photos: '.effect',
        anim: 5,
        move: false,
        shade: .3,
        tab: function tab(pic, layero) {}
      });
    }
  }).catch(function (err) {
    return 
        throw new Error(err);
  });
  // 滑动切换监听事件
  carousel.on('change(case_carousel)', function (e) {
    $caseInfo.children('h2').text(caseCarousel[e.index].title);
    $caseInfo.children('p').html(caseCarousel[e.index].features_describe);
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
    if (!active.verify($phone, '^[1][3,4,5,6,7,8,9][0-9]{9}$')) {
      layer.msg('请输入正确的手机格式');
      return false;
    }
    var data = {
      phone: $phone,
      area: $area,
      city: $province + $city
    };
    active.query('/decorate/cases/api/case/apply/', data, 'POST').then(function (res) {
      if (res.code === 'success') {
        layer.open({
          skin: 'open-skin1',
          title: '预约成功!',
          move: false,
          closeBtn: false,
          area: ['582px'],
          content: '稍后会有装修管家以xxxx或xxxx开头的号码回电您，向您免费提供装修咨询服务。',
          btn: '我知道了',
          shade: .3,
          shadeClose: true
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
      
        throw new Error(err);
    });
  });
});