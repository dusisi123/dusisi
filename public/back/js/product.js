$(function(){

  var currentPage=1;
  var pageSize=2;

  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr=template('proTpl',info);
        $('tbody').html(htmlStr);

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数

          //first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
          //新添了几个功能1.收尾页  2.提示字  3.使用 bootstrap 样式的提示框组件 true
          itemTexts:function(type, page, current){
            switch(type){
              case('first'):
                return '首页';
              case('last'):
                return '尾页';
              case('prev'):
                return '上一页';
              case('next'):
                return '下一页';
              case('page'):
                return page;
            }

          },

          tooltipTitles:function(type, page, current){
            switch(type){
              case('first'):
                return '首页';
              case('last'):
                return '尾页';
              case('prev'):
                return '上一页';
              case('next'):
                return '下一页';
              case('page'):
                return '前往第'+page+'页';
            }
          },

          useBootstrapTooltip:true,
          
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage=page;
            render();
          }
        });
        


        
      }
    })
  }


  //点击添加按钮，显示模态框

  $('#addCate').click(function(){
    $('#addModal').modal('show');

    $.ajax({
      
    })
  })
})