(function(){
  var currentPage=1;
  var pageSize = 5;  
//要让别的没有关系的分支也能得到别的变量，只需要把变量设在全局
  var currentId;
  var isDelete

  render();

  function render(){
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
          page: currentPage,
          pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
          console.log( info );
          // 参数1: 模板id
          // 参数2: 数据对象
          var htmlStr = template("tpl", info);
          $('.lt-content tbody').html( htmlStr );
          $("#paginator").bootstrapPaginator({
            bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
            currentPage:info.page,//当前页
            totalPages:Math.ceil(info.total/info.size),//总页数
            
            onPageClicked:function(a,b,c,page){
              //为按钮绑定点击事件 page:当前点击的按钮值
              currentPage= page;
              render();
            }
          });
      }
    })
  }

  //2.给按钮启用和禁用功能
  //发送ajax请求，参数为id和isDelete

  //利用委托时间进行点击
  $('tbody').on('click',".btn",function(){
    $('#isdeleteModal').modal('show');

    //自定义属性获取用attr
    currentId=$(this).parent().attr('data-id');

    //对本身的属性用addClass removeClass hasClass
    isDelete=$(this).hasClass('btn-danger') ? 0 : 1;

    $('#isdeleteBtn').click(function(){
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id : currentId,
          isDelete: isDelete
        },
        dataType:'json',
        success:function(info){
          console.log(info);
          if(info.success){
            $('#isdeleteModal').modal('hide');
            render();
          }
          
        }

      })

      
    })
  })
})()




