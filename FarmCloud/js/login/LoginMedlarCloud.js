// JavaScript Document

$(function(){
	
	//(1)文本框获取焦点失去焦点变化
	$('input[type=text]').focus(function(){  
        var txtVal = $(this).val();
        if( txtVal == this.defaultValue ){
            $(this).val('');   
        }       
    });
    $('input[type=text]').blur(function(){
        var txtVal = $(this).val();
        if( txtVal == '' ){
            $(this).val(this.defaultValue);    
        }   
    });
		
	//(3)设置密码和确认密码状态
	getPassword('#input_text1','#password1');
	function getPassword(obj,passw){
		$(obj).focus(function(){
			$(this).hide();
			$(passw).show();
			$(passw).focus();   
		})
		$(passw).blur(function(){
			if( $(passw).val() == '' ){
				$(obj).show();
				$(passw).hide();    
			}   
		})
	}

	
});