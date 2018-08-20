$(function(){

  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;

  // 1. 一进入页面进行渲染
  render();
  function render() {
    $.ajax({
      url: "/category/querySecondCategoryPaging",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function( info ) {
        console.log(info);
        var htmlStr = template( "secondTpl", info );
        $('.lt-content tbody').html( htmlStr );

        // 进行分页初始化
        $('#paginator').bootstrapPaginator({
          // 配置bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 注册每个页码的点击事件
          onPageClicked: function( a, b, c, page ) {
            // 重新渲染页面
            currentPage = page;
            render();
          }
        })
      }
    })
  };

//2.点击添加分类按钮，显示添加模态框
  $('#addCate').click(function(){
    $('#addModal').modal("show");
    $.ajax({
      url: "/category/queryTopCategoryPaging",
      type: "get",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function( info ) {
        console.log( info );
        // 将模板和数据相结合, 渲染到下拉菜单中
        var htmlStr = template( "dropdownTpl", info );
        $('.dropdown-menu').html( htmlStr );
      }
    })

  })

  //3.让下拉菜单选中，动态生成的需要给父元素加点击事件
  $('.dropdown-menu').on('click','a',function(){
    var txt=$(this).text();
    var id=$(this).data('id');
    // 修改文本内容
    $('.dropdownText').text( txt );
   
    $('[name="categoryId"]').val(id);

    //需要将校验状态置成 VALID
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");



  })
//4.配置图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      
      var imgUrl = data.result.picAddr;
       // 设置图片地址
       $('#imgBox img').attr("src",imgUrl);
       $('[name="brandLogo"]').val(imgUrl);
    }
});

//5.表单验证

  $('#form').bootstrapValidator({

    excluded: [],
     
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:'请选择一级分类'
          }
        }
        
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请上传图片'
          }
        }

      },

      brandName:{
        validators:{
          notEmpty:{
            message:'请选择二级分类'
          }
        }
      }
    
    
    }

  })

  //6.注册校验成功事件，通过ajax进行添加

  $("#form").on('success.form.bv', function (e) {
    
    e.preventDefault();

    $.ajax({
      url:"/category/addSecondCategory",
      type:'post',
      data:$('#form').serialize(),
      success:function(info){
        console.log(info);
       
         $('#addModal').modal("hide");
         currentPage = 1;
         render();
        
         //重置
         $('#form').data("bootstrapValidator").resetForm( true );
        
         //不是表单的元素得手动清除

         $('.dropdownText').text('请选择1级分类')

         $('#imgBox img').attr("src", "images/none.png")
      }
    })
  
  
  })



})