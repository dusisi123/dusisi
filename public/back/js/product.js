$(function(){

  var currentPage=1;
  var pageSize=2;
  var picArr = []

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


  //点击添加按钮，显示模态框,二级列表出现

  $('#addCate').click(function(){
    $('#addModal').modal('show');

    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr=template('dropdownTpl',info);
        $('.dropdown-menu').html(htmlStr)
        
      }
    })
  })

  //渲染二级列表，事件委托
  $('.dropdown-menu').on('click','a',function(){
    
    var txt=$(this).text();
    var id=$(this).data('id');
    
    $('.dropdownText').text(txt);
    $('[name=brandId]').val(id);
  })

  // 4. 配置上传图片回调函数

  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      

      var picObj=data.result;
      var imgUrl=data.result.picAddr;
      //将得到的结果推到数组最前面
      picArr.unshift(picObj);
      //把图片地址渲染到图片盒子的最前面
      $('#imgBox').prepend('<img src="'+imgUrl+'" width="100">');

      //判断图片个数
      if(picArr.length>3){
        picArr.pop();
        //清除渲染的盒子

        $('#imgBox img').remove();
      }
      if(picArr.length===3){
        //说明可以提交了，修改状态

        $("#form").data('bootstrapValidator').updateStatus("picStatus", "VALID")
      }
      
    }
    
  });

   //5.配置表单验证

  $('#form').bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName:{
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品名称'
          }
        },
      },

      proDesc:{
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        },
      },

      num:{
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        },
      },

      size:{
        validators: {
          notEmpty: {
            message: '请输入商品尺码'
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        },

      },

      oldPrice:{
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        },
      },

      price:{
        validators: {
          notEmpty: {
            message: '请输入商品价格'
          }
        },
      },

      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    },

  })

  //注册校验成功事件

  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    
    var params = $('#form').serialize();

    params+='&picName1='+picArr[0].picName+'&picAddr1='+picArr[0].picAddr;
    params+='&picName2='+picArr[1].picName+'&picAddr2='+picArr[1].picAddr;
    params+='&picName3='+picArr[2].picName+'&picAddr3='+picArr[2].picAddr;

    console.log(params);

    $.ajax({
      url: "/product/addProduct",
      type: "post",
      data: params,
      dataType:'json',
      success:function(info){
       
        if(info.success){
          
          $('#addModal').modal("hide");
          // 重置校验状态和文本内容
          $('#form').data("bootstrapValidator").resetForm(true);
          // 重新渲染第一页
          currentPage = 1;
          render();

         // 手动重置, 下拉菜单
         $('.dropdownText').text("请选择二级分类")
          // 删除结构中的所有图片
          $('#imgBox img').remove();
          // 重置数组 picArr
          picArr = [];
        }
      }
    })

  });

})