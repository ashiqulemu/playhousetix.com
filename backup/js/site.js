var ajaxMethod = 'POST';

$(document).ready(function(){
	
	$("#continue_pay").click(function () {
		$("#continue_pay").attr('disabled',true); 
		err = 0;err1=0;
		$(":input[required]").each(function () {						
			if($(this).val() == ''){
				// alert($(this).attr('name'));
				err += 1;
				$(this).css('background','#FEF1F0');
			}else{
				$(this).css('background','#FFF');
			}
			if($(this).attr('name') == 'email' && $(this).val() != ''){
				if(!isEmail($(this).val())){
					err1 += 1;
				}
			}	
		});	
		if($('#dpd_country').val() == ''){
			err += 1;
			$('#dpd_country').css('background','#FEF1F0');
		}else{
			$('#dpd_country').css('background','#FFF');
		}
		if($('#dpd_state').val() == ''){
			err += 1;
			$('#dpd_state').css('background','#FEF1F0');
		}else{
			$('#dpd_state').css('background','#FFF');
		}
		
		if(err > 0 || err1 > 0){
			var msg = "Fields marked red are mandatory to be filled.";
			if(err1 > 0) msg += "\n - Please enter a valid email address.";
			alertModal(msg); 
			$("#continue_pay").attr('disabled',false);
			return false;
		}else{
			$('#payment_frm').submit();
		}
	});
	
	 $('.fp_error').hide();
	  $('#frm_fanpass').submit(function(e) {
        e.preventDefault();	
		$('#loader').show();
		$('.fp_error').hide();	
        $.ajax({
            type: ajaxMethod,
            url: 'actions.php',
            data: $('#frm_fanpass').serialize(),
			dataType: "json",
			cache: false,
            success: function(res) {
			   $('#loader').hide();			   
			   if(res.status == 'OK'){
					$('.fp_error').removeClass('alert-danger').addClass('alert-success');
					$('.fp_error').show();
					$('.fp_error').html('Success! Please wait...');					
					window.location.href = "details.php?eid="+res.eid;
			   }else{
					$('#event_fan_passcode').val('');
					$('.fp_error').show();
					$('.fp_error').html(res.eid);
			   }
			   
            }
        });
        return false;
    });
	
	
});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}	
function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}
function ajaxCall(action_mode,params){
	$('#loader1').show();
	$.ajax({
		data: "mode="+action_mode+"&"+params,
		url: siteDomain+"actions.php",
		type: ajaxMethod,			
		dataType: "html",
		cache: false,
		success: function (html) {/*do nothing here*/
			// console.log(html);
			setTimeout(function(){$('#loader1').hide();},2000);
			
		}		
	});
}

function alertModal(msg,reload=false,eid=0){	
	$('#alertMessage').html(msg);	
	$('#showAlertModal').modal('toggle');
	if(reload){		
		$('#showAlertModal').on('hidden.bs.modal', function () {		  
		  // document.location.reload();
		  window.location.href='details.php?eid='+eid;
		});
	}
}

