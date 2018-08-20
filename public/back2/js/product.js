/**
 * Created by Jepson on 2018/8/20.
 */

$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 2; // 每页条数

  // 1. 一进入页面, 请求商品数据, 进行页面渲染
  render();

  function render() {
    // 发送请求渲染
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      // 后台如果在响应头中, 设置了响应头 Content-Type: application/json;
      // 前端可以省略  dataType: "json"
      // dataType: "json",
      success: function( info ) {
        console.log( info )
        // 通过 template 生成 html 模板
        var htmlStr = template("productTpl", info);
        $('.lt_content tbody').html( htmlStr );


        // 分页初始化
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),

          // 配置按钮大小
          size: "normal",

          // 配置按钮文本
          // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值进行设置文本
          // 参数1: type  取值: page  first  last  prev  next
          // 参数2: page  指当前这个按钮所指向的页码
          // 参数3: current 当前页
          itemTexts: function( type, page, current ) {
            // console.log( arguments );

            // switch case
            switch ( type ) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },

          // 配置 title 提示信息
          // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值设置title文本
          tooltipTitles: function( type, page, current ) {
            switch ( type ) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },

          // 使用 bootstrap 的提示框组件
          useBootstrapTooltip: true,

          // 给 页码 添加点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  };


  // 2. 点击添加商品按钮, 显示添加模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 发送 ajax 请求, 请求所有的二级分类数据, 进行下拉列表渲染
    // 通过分页接口, 模拟获取全部数据的接口
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "dropdownTpl", info );
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });



  // 3. 给dropdown-menu下面的 a 注册点击事件(通过事件委托)
  $('.dropdown-menu').on("click", "a", function() {
    // 设置文本
    var txt = $(this).text();
    $('#dropdownText').text( txt );

    // 设置 id 给隐藏域, name="brandId"
    var id = $(this).data("id");
    $('[name="brandId"]').val( id );
  });



  // 4. 文件上传初始化
  $('#fileupload').fileupload({
    // 返回的数据格式
    dataType: "json",
    // 文件上传完成时调用的回调函数
    done: function( e, data ) {
      // data.result 是后台响应的内容
      console.log( data.result )
    }
  })

})
