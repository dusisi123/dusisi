/**
 * Created by Jepson on 2018/8/18.
 */


//// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 结束进度条
//  NProgress.done();
//}, 2000);


// 实现在第一个ajax发送的时候, 开启进度条
// 在所有的ajax请求都完成的时候, 结束进度条

// ajax 全局事件

// 1. ajaxComplete 当每个 ajax 请求完成的时候, 调用 (不管成功还是失败都调用)
// 2. ajaxError    当 ajax 请求失败的时候, 调用
// 3. ajaxSuccess  当 ajax 请求成功的时候, 调用
// 4. ajaxSend     在每个 ajax 请求发送前, 调用
// 5. ajaxStart    在第一个 ajax 发送时, 调用
// 6. ajaxStop     在所有的 ajax 请求完成时, 调用


// ajaxStart 在第一个 ajax 发送时, 调用
$(document).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
});

// ajaxStop 在所有的ajax完成时, 调用
$(document).ajaxStop(function() {

  // 模拟网络延迟
  setTimeout(function() {
    // 关闭进度条
    NProgress.done();
  }, 500);

});

//登录拦截

//前后分离
//用户已登录
//用户未登录文档
if ( location.href.indexOf("login.html") === -1 ) {
  // 地址栏中没有 login.html, 说明不是登录页, 需要进行登录拦截
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function( info ) {
      console.log( info )
      if ( info.success ) {
        // 已登录, 让用户继续访问
        console.log("用户已登录")
      }

      if ( info.error === 400 ) {
        // 未登录, 拦截到登录页
        location.href = "login.html";
      }
    }
  })
}


//index 实现的js
//1.折叠，荧光效果  模态框  侧边栏隐藏
$('.nav .category').on('click',function(){
  $('.nav .child').stop().slideToggle();
})

$('.lt-header .icon-menu').on('click',function(){
  $('.lt-aside').toggleClass("hidemenu")
  $('.lt-header').toggleClass("hidemenu")
  $('.lt-content').toggleClass("hidemenu")
})

$('.lt-header .icon-logout').click(function() {
  // 显示模态框, 显示模态框 modal("show");
  console.log(111);
  
  $('#logoutModal').modal("show");
})

$('#logoutBtn').click(function(){
  $.ajax({
    type: "get",
    url: "/employee/employeeLogout",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      if ( info.success ) {
        // 退出成功, 跳转到登录页了
        location.href = "login.html";
      }
    }
  })
})
