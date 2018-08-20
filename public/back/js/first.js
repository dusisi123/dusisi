$(function(){

  var currentPage=1;
  var pageSize=5;

  render();

  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page: currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr=template("firstTpl",info);
        $('tbody').html(htmlStr);

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          
          onPageClicked:function(a,b,c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage=page;
            render()
          }
        });
        
        
      }
    })
  }

//点击总按钮

  
  $('#addCate').click(function(){
    //1.显示模态框
    $('#addModal').modal('show');
    
  })
    //2.非空校验、字体状态
  $('#form').bootstrapValidator({
      //状态设置
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },

      fields: {
        //校验用户名，对应name表单的name属性
        categoryName: {
           // 校验规则
          validators: {
            //不能为空
            notEmpty: {
              message: '请输入一级分类名称'
            },
          },
        },
      }
    
    
    
  })

  //3.注册表单验证成功事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      url:'/category/addTopCategory',
      type:'post',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          $('#addModal').modal("hide");
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm( true );
        }
        
      }
    })
});

 

})