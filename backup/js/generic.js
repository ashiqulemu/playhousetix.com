function number_format (number, decimals, dec_point, thousands_sep) {    
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');    }
    return s.join(dec);
}
	
//Display Loading Image
function Display_Load(){		
	$("#loading").fadeIn(900,0);
	// $("#loading").html("<img src='../images/ajax-loader.gif' />");
}
//Hide Loading Image
function Hide_Load(){
	$("#loading").fadeOut('slow');
}	
function displayAlertMessage(title,message,button,timeOut,width,height,overflow,action) {
	//jQuery('#messageBox').slideUp();
	//alert(timeOut);
	// var timeOutEnable = false;
	// var timeOutDefault = 5;
	// jQuery('#messageBox').css('top',113+$(window).scrollTop());	
	jQuery('#message_title').html(title);
	jQuery('#message').html(message);	
	
	if(button != '0'){
		if(button != '1'){			
			jQuery('#message_button').html(button);
		}
		jQuery('#message_button').show();
	}else{		
		jQuery('#message_button').hide();
	}
	
	
	if(width != ''){		
		var mLeft = width*1/2;
		var widthTitle = width*1-10;
		jQuery('#messageBox').css('margin-left','-'+mLeft+'px');
		jQuery('#messageBox').css('width',width+'px');
		jQuery('#message_title').css('width',widthTitle+'px');	
	}
	if(height != ''){
		jQuery('#messageBox').css('height',height+'px');	
		
		if(overflow == 'true'){
			var msgHt = height*1 - 80;
			jQuery('#message').css('height',msgHt+'px');		
			jQuery('#message').css('overflow','auto');
			jQuery('#message').css('margin-right','5px');
		}
	}
	// jQuery('#messageBox').fadeIn('fast');
	jQuery('#messageBox').modalBox({
		onClose:function(){
			if(action == ''){			
				return false;
			}else if(action == 'self'){
				window.location.reload();
			}else{
				//alert(action);
				var rAction = action.split(':');
				if(rAction[0] == 'overlay') $('#'+rAction[1]).click();
				else window.location.href = action;
			}
		}
	});
	
	// if(timeOutEnable){
		// if(timeOut != 'CLOSE'){
			// if(timeOut == '') timeOut = timeOutDefault;
			// setTimeout(function() {
				// jQuery('#messageBox').fadeOut('fast');
			// }, timeOut * 1000);
		// }
	// }
	
}
function modifyAlertMessage(title,message,button,timeOut,width,height,overflow,action) {	
	jQuery('#message_title').html(title);
	jQuery('#message').html(message);
	
	if(button != '0'){
		if(button != '1'){			
			jQuery('#message_button').html(button);
		}
		jQuery('#message_button').show();
	}else{		
		jQuery('#message_button').hide();
	}	
	
	if(width != ''){		
		var mLeft = width*1/2;
		var widthTitle = width*1-10;
		jQuery('#messageBox').css('margin-left','-'+mLeft+'px');
		jQuery('#messageBox').css('width',width+'px');
		jQuery('#message_title').css('width',widthTitle+'px');	
	}
	if(height != ''){
		jQuery('#messageBox').css('height',height+'px');	
		
		if(overflow == 'true'){
			var msgHt = height*1 - 80;
			jQuery('#message').css('height',msgHt+'px');		
			jQuery('#message').css('overflow','auto');
			jQuery('#message').css('margin-right','5px');
		}
	}
	// jQuery('#messageBox').fadeIn('fast');
	jQuery('#messageBox').modalBox({
		onClose:function(){
			if(action == ''){			
				return false;
			}else if(action == 'self'){
				window.location.reload();
			}else{
				//alert(action);
				var rAction = action.split(':');
				if(rAction[0] == 'overlay') $('#'+rAction[1]).click();
				else window.location.href = action;
			}
		}
	});
	
}
function closeAlertMessage(){
	$.modalBox.close();
}