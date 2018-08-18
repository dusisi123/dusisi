/**
 * Created by Jepson on 2018/8/18.
 */

$(function() {
  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  // 配置的字段和 input 框中指定的 name 关联, 所以必须要给 input 加上 name
  $("#form").bootstrapValidator({

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置字段
    fields: {
      username: {
        // 配置校验规则
        validators: {
          // 非空
          notEmpty: {
            // 提示信息
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须在 2-6 位"
          },
          callback:{
            message:'用户名不存在'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是 6-12 位"
          },
          callback:{
            message:'密码错误'
          }
        }
      }
    }
  });

  /*
  * 2. 登陆功能
  *    表单校验插件会在提交表单时进行校验
  *    (1) 校验成功, 默认就提交表单, 会发生页面跳转,
  *        我们需要注册表单校验成功事件, 阻止默认的提交, 通过ajax进行发送请求
  *    (2) 校验失败, 不会提交表单, 配置插件提示用户即可
  * */

  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    
    $.ajax({
      type:'post',
      url:"/employee/employeeLogin",
      data:$('#form').serialize(),
      dataType:"json",
      success:function(info){
        console.log(info)

        if(info.success){
         
            location.href="index.html";
       
        }

        if(info.error===1000){
          //更新校验状态
          //实例调用原型方法 updateStatus 更新校验状态
          // 在总文件中点击地址获得
          //更新字段的状态 updateStatus(field, status, validatorName)
          // validatorName  校验规则的名称
          // - NOT_VALIDATED：未校验的
          // - VALIDATING：校验中的
          // - INVALID ：校验失败的
          // - VALID：校验成功的。
          $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');


        }
        if(info.error===1001){
          $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');

        }
        
      }
    })


  })

  // 3. 重置功能
  $('[type="reset"]').click(function(){
   // 调用插件的方法, 进行重置校验状态
    // resetForm(boolean),
    // 1. 传true, 重置内容以及校验状态
    // 2. 传false, 只重置校验状态
    $('#form').data('bootstrapValidator').resetForm();
  })



 


});

