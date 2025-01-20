var is_seatchart = $('#is_seatchart').val();
var autoAssignSeats = $('#auto_assign_seats').val();

$(document).ready(function(){
	// fnResetPage();	
	fnUnsetsession('SESSION_VARS');
	
	if(is_seatchart == '1'){		
		checkNumberOfSeats();		
	}else{
		$('#num_tickets').html("<option value='0'> - select - </option>");
	}
		
	$('#showdatetime').change(function(){
		fnResetPage();								
		fnShowDateTimeChange();
	});	
	
	$('#num_tickets').change(function(){
		fnResetPage();		
		if(is_seatchart == '1'){
			fnNumTicketsChangeSC();
		}else{
			fnNumTicketsChange();			
		}					
	});
	
	$('#tickettype').change(function(){ // only relevant incase of non-seatchart events
		fnResetPage();		
		fnTicketTypeChange();
	});	
	
	$('#include_dinner').change(function(){
		fnResetPage();			
		fnIncludeDinnerChange();
		
	});
	
	$(document).on('change', '.ticket_addon', function() {		
		fnResetPage();		
		var addon_id;		
		addon_id = this.id.split('_')[2];		
		var thisVal = $(this).val().split('_');		
		fnTicketAddonChange(addon_id,thisVal,$(this).val());			
	});
	
	$('#apply_code').click(function(){	// GIFT CARD USE
		if($('#showdatetime').val() == '') return false;
		if($('#gc_coupon').val() == '') return false;
		if($('#gc_coupon').val() == 'Gift Card Code' || $('#gc_coupon').val() == 'Gift Code'){
			$('#gc_coupon').val('');
			alertModal("Please enter a valid Gift Card Code.");
			return false;
		}
		
		if(is_seatchart == '1'){
			if($('#strDBSeat').val() == ''){
				$('#gc_coupon').val('');
				alertModal("Please select seat(s) to apply Gift Card Code.");
				return false;
			}
		}
		
		$('#apply_code').attr('disabled','disabled');		
		fnApplyGiftCard();	
				
	});	
		
	$('#apply_code1').click(function(){ 	// PRMO CODE USE
		if($('#showdatetime').val() == '') return false;
		if($('#pc_coupon').val() == '') return false;
		if($('#pc_coupon').val() == '' || $('#pc_coupon').val() == 'Promo Code'){
			alertModal("Please enter a valid Promo Code.");
			return false;
		}
		
		if(is_seatchart == '1'){
			if($('#strDBSeat').val() == ''){
				$('#pc_coupon').val('');
				alertModal("Please select seat(s) to apply Promo Code.");
				return false;
			}
		}
			
		$('#apply_code1').attr('disabled','disabled');		
		fnApplyPromoCode();
			
	});	
	
	$('#remove_pc').click(function(){
		removePromoCodeUse();
	});
	$('#remove_gc').click(function(){
		removeGiftCardUse();
	});
	
	// no seat chart specific
	
	$('.btn_seats_next').click(function(){
		// do the hold thing procedure here:
		if($('#showdatetime').val() == ''){
			alertModal('Please select a show date to proceed.'); return false;
		}
		$('#allinfo_section').show();
	});
	
	// seat chart specific:
	$('#btn_seats_next').click(function(){	
		if($('#strDBSeat').val() == ''){
			alertModal('Please select seats on the map.'); return false;
		}
		if($('#num_tickets').val()*1 > $('#num_seats_Selected').html()*1){
			alertModal('Please select all '+$('#num_tickets').val()+' seats on the map.'); return false;
		}
		
		fnShowLoader();
		
		if($('#num_tickets').val()*1 < 7*1 && $('#in_validate').val()*1 == '0'){ //pre-assigning and validation of seat selection is allowed for seats chosen less than 7 and invalide = 1 when no suggestions there on 1st selection.				
			preAssignSeatsByDefault($('#num_tickets').val()*1,true); // validating manual selection of seats.
		}else{			
			processAndHoldSeatsForPurchase();
		}				
	});
	
	$('#clear_all_seats').click(function(){
		fnResetPage();
		fnShowLoader();
		
		setTimeout(function(){
			$('.cancel_Seat').trigger('click'); // remove all seats already selected
			$('#suggestion_count').val(0*1);
			$('#DbRow_id').val(1*1);			
		},1000); // added this delay just like that - better feel.
		
		fnHideLoader();
		
	});
	
	$('#suggest_another').click(function(){
		fnShowLoader();
		
		$('#suggest_another').attr('disabled',true); 	
				
		$('.cancel_Seat').trigger('click'); // remove all seats already selected	
		
		setTimeout(function(){
			if($('#cr_arr_cnt').val()*1-1*1 == $('#suggestion_count').val()*1){
				$('#suggestion_count').val(0*1);
				$('#DbRow_id').val($('#DbRow_id').val()*1+1*1);
			}else{
				$('#suggestion_count').val($('#suggestion_count').val()*1+1);
			}		
			preAssignSeatsByDefault($('#num_tickets').val());
			$('#suggest_another').attr('disabled',false); 
			
		},1000); // added this delay just like that - better feel.
		
		fnHideLoader();		
	});
	
	$('#nt2').change(function(){
		fnShowLoader();	
		$('#num_tickets').val($(this).val()).trigger('change');					
	});
	
	
	$('#dpd_country').change(function(){
		$.ajax({
			url: siteDomain+"actions.php?mode=csdpd&cntry="+$(this).val(),
			type: ajaxMethod,			
			dataType: "html",
			cache: false,
			success: function (html) {				
				$('#dpd_state').html(html);
			}		
		});
	});
	
	
});


function fnShowDateTimeChange(){
	if(is_seatchart == '1'){
		$('#payment_frm').attr('action','');
		$('#payment_frm').submit();				
	}else{
		// non seat chart here:		
		fnShowLoader();
		
		var val = $('#showdatetime').val();
		$('#continue_down').show();
		$('#continue_pay').show();		
		$('#num_tickets').val('1'); $('#tax_percentage').html('');  $('.taxable_or_not').html('');
		
		if(val == ''){
			fnUnsetsession('SESSION_VARS');		
			$('#top_event_date').html($('#show_date_range').val());
			$('#top_event_desc').html($('#show_default_desc').val());
			$('#tickettype').html("<option value=''>--select--</option>");
			
			$('#include_dinner').val('No');
			$('.ticket_addon').val('0');
			$('#section_include_dinner').hide();
			$('#include_dinner').html('');
			$('#tickets_addon_block').hide();
			
			// onload of page - get price calculations: (by default should be all ZERO)
			setCalculatedValues();
			fnHideLoader();
			return false;
		}
		
		$.ajax({
			url: siteDomain+"actions.php",		
			type: ajaxMethod,
			data: 'mode=getPricingLevelFromDate&dt='+val,
			dataType: "json",
			cache: false,
			success: function (res) {						
				$('#tickettype').html(res.dpd_price_levels);							
				$('#top_event_date').html(res.event_date);
				$('#top_event_desc').html(res.event_short_desc);		
							
				setCalculatedValues();
				
				fnShowDinnerOption(res.strDinnerDpd);
				fnShowAddonOption(res.showAddonOption);
				
				$('#tickettype').trigger('change');	
				
				// fnHideLoader();			
				
			}
		});
	}		
}

function fnTicketTypeChange(){
	fnShowLoader();
	
	var val = $('#tickettype').val();
	$('#num_tickets').val('1');		
	var arr_val = val.split('::');
	$('#include_dinner').val('No');
	$('.ticket_addon').val('0');
	
	$.ajax({
		url: siteDomain+"actions.php",		
		type: ajaxMethod,		
		data: 'mode=getCalculationFromTicketType&tt='+arr_val[1]+'&dt='+$('#showdatetime').val(),
		dataType: "json",
		cache: false,
		success: function (res) {				
			if(res.tt2 == 'Sold out'){
				$('#continue_down').hide();
				$('#continue_pay').hide();
			}else{
				$('#continue_down').show();
				$('#continue_pay').show();
			}
									
			setCalculatedValues();				
			
			// generating num_tickets dpd on thh fly:				
			$('#num_tickets').html(res.dpd_num_tickets);
				
			fnHideLoader();			
		}
	});	
}

function fnNumTicketsChange(){
	fnShowLoader();
	
	var val = $('#num_tickets').val();
	if($('#tickettype').val() == '') return false;	
	var arr_ttype = ($('#tickettype').val()).split('::');	
			
	$.ajax({
		url: siteDomain+"actions.php",		
		type: ajaxMethod,		
		data: 'mode=getCalculationFromTickets&nt='+val+'&dt='+$('#showdatetime').val()+'&ttyp='+arr_ttype[1],
		dataType: "json",
		cache: false,
		success: function (res) {				
			if(res.status == 'NO_TICKETS'){				
				$('#num_tickets').val('1');
				alertModal(res.message);
				// $('#num_tickets').trigger('change');
				return false;
			}else{					
				setCalculatedValues();

				fnShowAddonOption(res.showAddonOption);				
			}
			fnHideLoader();			
		}
	});
}

function fnIncludeDinnerChange(){
	var val = $('#include_dinner').val();	
	fnShowLoader();
	data = 'mode=setDinnerSessionAndCalculate&include_dinner='+val;	
	$.ajax({
			url: siteDomain+"actions.php",
			type: ajaxMethod,
			data: data,
			dataType: "json",
			cache: false,
			success: function (res) {
				if(is_seatchart == '1'){
					calculateTotals();
				}else{
					setCalculatedValues();
				}
				
				fnHideLoader();
			}		
		});
}

function fnTicketAddonChange(addon_id,thisVal,thisChangeVal){	
	fnShowLoader();
	data = 'mode=setTicketAddonsSession&addon_id='+addon_id+'&addon='+thisChangeVal+'&nt='+$('#num_tickets').val();	
	$.ajax({
			url: siteDomain+"actions.php",
			type: ajaxMethod,
			data: data,
			dataType: "json",
			cache: false,
			success: function (res) {														
				if(thisVal[0] == addon_id){
					if(is_seatchart == '1'){
						calculateTotals();
					}else{
						setCalculatedValues();
					}
				}else{	
					$('#num_tickets').trigger('change');						
				}			
				
				fnHideLoader();
			}		
		});	
}

function fnApplyPromoCode(){
	fnShowLoader();	
									
	var d = $('#showdatetime').val();	
	data = "mode=promocard&pc_code="+$('#pc_coupon').val()+"&nt="+$('#num_tickets').val()+"&dt="+d;
	$.ajax({
		url: siteDomain+"actions.php",
		type: ajaxMethod,
		data: data,
		dataType: "json",
		cache: false,
		success: function (res) {					
			$('#apply_code1').attr('disabled','');				
			
			if(res.status == 'OK'){				
				$('#pc_coupon').val('');			
				if(is_seatchart == '1'){
					calculateTotals();
				}else{
					setCalculatedValues();
				}
			}else{
				$('#pc_coupon').val('');
				$('#pc_coupon').focus();
				alertModal(res.message);
			}
			
			fnHideLoader();
		}		
	});
}		

function fnApplyGiftCard(){	
	fnShowLoader();		
	data = "mode=giftcard&gc_code="+$('#gc_coupon').val();
	$.ajax({
		url: siteDomain+"actions.php",		
		type: ajaxMethod,		
		data: data,
		dataType: "json",
		cache: false,
		success: function (res) {
			
			$('#apply_code').attr('disabled','');						
			
			if(res.status == 'OK'){							
				$('#gc_coupon').val('');			
				if(is_seatchart == '1'){
					calculateTotals();
				}else{
					setCalculatedValues();
				}	
			}else{
				$('#gc_coupon').val('');
				$('#gc_coupon').focus();
				alertModal(res.message);						
			}
			fnHideLoader();
		}		
	});
}			

function setCalculatedValues(){
	fnShowLoader();
	$('#allinfo_section').hide();
	var arr_ttype = ($('#tickettype').val()).split('::');
	data = "mode=getCalculation&nt="+$('#num_tickets').val()+"&dt="+$('#showdatetime').val()+"&tt="+arr_ttype[1];	
	$.ajax({
		data: data,
		url: siteDomain+"actions.php",
		type: ajaxMethod,			
		dataType: "json",
		cache: false,
		success: function (res) {
			$('#ticket_price').val('$'+res.calculations.ticketBasePrice);
			$('#num_tickets').val(res.calculations.numberOfTickets);	
			$('#taxable_total').val('$'+res.calculations.ticketSubtotal);	
			$('#platformfee').val('$'+res.calculations.TicketConvenienceFee);
			$('#lettotal').val('$'+res.calculations.LiveEntertainmentTax);	
			$('#new_total').html('$'+res.calculations.GrandTotal);	
			
			(res.calculations.LiveEntertainmentTaxPercentage > 0)?$('.taxable_or_not').html(':') : $('.taxable_or_not').html(':') ;
			$('#tax_percentage').html(res.calculations.LiveEntertainmentTaxPercentage+'%');
				
			// for displaying Fnb Detais
			if(res.calculations.fnb_total > 0){
				$('#fnb_detail_showcase').show();
				$('#fnb_amount').html('$'+res.calculations.fnb_subtotal);
				$('#fnb_sales_tax_amount').html('$'+res.calculations.fnb_sales_tax_amount);
				$('#fnb_gratuity_amount').html('$'+res.calculations.fnb_gratuity_amount);
				$('#fnb_total').html('$'+res.calculations.fnb_total);
			}else{
				$('#fnb_detail_showcase').hide();
			}			
			
			if(res.calculations.promoCodeDiscount*1 > 0){
				$('#promo_card_details').css('display','');
				$('#applied_pc').html(res.calculations.applied_pc);						
				$('#span_PC_amt_used').html('$'+res.calculations.promoCodeDiscount);
			}
			
			if(res.calculations.giftCardDiscount*1 > 0){
				$('#gift_card_details').css('display','');
				$('#applied_gc').html(res.calculations.applied_gc);	
				$('#span_GC_amt_used').html('$'+res.calculations.giftCardDiscount);
			}		
			
			// $0 ticket selling allow
			if(res.calculations.GrandTotal*1 == 0){					
				showHidePaymentMode(false);
			}else{
				showHidePaymentMode();
			}
				
			fnHideLoader();	
		}		
	});
	
}


// seatchart specific functions:

function setCalculatedValuesSC(){	
	fnShowLoader();
	$('#allinfo_section').hide();
	var strDBSeat = 0;
	if($('#showdatetime').val() > 0)  strDBSeat = $('#strDBSeat').val();
	$.ajax({
		url: siteDomain+"actions.php",		
		type: ajaxMethod,		
		data: 'mode=getCalculation&dt='+$('#showdatetime').val()+'&strDBSeat='+strDBSeat,
		dataType: "json",
		cache: false,
		success: function (res) {		
					
			 $('#seats_sub_total').html(res.calculations.ticketSubtotal);
			 $('#seats_taxes_fees').html(res.calculations.TaxesAndFeesSubtotal);
			 $('#seats_grand_total').html(res.calculations.GrandTotal);
			 
			 
			 if(res.calculations.dinner_total*1 > 0){
				 $('#dinner_pricing').css('display','');
				 $('#seats_dinner').html(res.calculations.dinner_subtotal);
				 $('#seats_dinner_taxes').html(res.calculations.dinner_total_taxes);
			 }else{
				 $('#dinner_pricing').css('display','none');
				 $('#seats_dinner, #seats_dinner_taxes').html('');
			 }
			 
			 if(res.calculations.addon_super_total*1 > 0){
				 var addonItems = "";
				 $.each(res.calculations.arrAllAddonsUsed, function (addon_id, addon_data) {		 	
					 addonItems += "<div style = 'float:right;'>"+addon_data.addon_title+":&nbsp; $<span class = 'seats_addon' id = 'seats_addon_"+addon_id+"'>"+addon_data.addon_price+"</span></div><br /><div style = 'float:right;'>"+addon_data.addon_title+" Taxes/Fees:&nbsp; $<span class = 'seats_addon_taxes' id = 'seats_addon_taxes_"+addon_id+"'>"+addon_data.addon_tax_fee+"</span></div><br />";
				 });
				 $('#ticket_addon_pricing').html(addonItems).css('display','');				 
			 }else{
				 $('#ticket_addon_pricing').html('').css('display','none');				 
			 }
			 
			 
			 if(res.calculations.promoCodeDiscount*1 > 0){
				$('#promo_card_details').css('display','');
				$('#applied_pc').html(res.calculations.applied_pc);						
				$('#span_PC_amt_used').html('$'+res.calculations.promoCodeDiscount);
			}			 
			 
			
			if(res.calculations.giftCardDiscount*1 > 0){
				$('#gift_card_details').css('display','');
				$('#applied_gc').html(res.calculations.applied_gc);						
				$('#span_GC_amt_used').html('$'+res.calculations.giftCardDiscount);
				$('#seats_grand_total').css('text-decoration','line-through');
				$('#seats_grand_total').html(res.calculations.GrandTotalBeforeGC);
				$('#seats_grand_total_new').css('display','');
				$('#seats_grand_total_new').html(res.calculations.GrandTotal);
			}
			
			if(res.calculations.GrandTotal*1 <= 0){	
				$('#seats_grand_total_new').html('$0.00');
				showHidePaymentMode(false);
			}else{				
				showHidePaymentMode();
			}
			
		    fnHideLoader();
		}
	});
	
}

function fnNumTicketsChangeSC(){
	fnShowLoader();
	
	if($('#num_tickets').val() >= 5) $('#suggest_another').hide(); else $('#suggest_another').show();
	
	$('#num_seats_to_Select').html($('#num_tickets').val());
	$('#nt2').val($('#num_tickets').val());
	
	data = 'mode=checkNumberOfSeats&mode2=checkForAddons&dt='+$('#showdatetime').val()+'&nt='+$('#num_tickets').val();	
	$.ajax({
			url: siteDomain+"actions.php",
			type: ajaxMethod,
			data: data,
			dataType: "json",
			cache: false,
			success: function (res) {
				
				fnShowAddonOption(res.showAddonOption);		
					
				$('.cancel_Seat').trigger('click'); // remove all seats already selected
				calculateTotals(); 
				
				// for pre assignig seats based on num tickets selected.
				$('#suggestion_count').val('0');
				$('#DbRow_id').val('1');
				$('#in_validate').val('0');
				
				if($('#num_tickets').val()*1 < 7*1){ //pre-assigning and validation of seat selection is allowed for seats chosen less than 7
					preAssignSeatsByDefault($('#num_tickets').val());
				}
				
				fnHideLoader();
			}		
		});	
	
}



function checkNumberOfSeats(){ // this is only checking if seats are avialble then return DPD	
	var val = $('#showdatetime').val();		
	if(val == ''){		
		$('#top_event_date').html($('#show_date_range').val());
		$('#top_event_desc').html($('#show_default_desc').val());
		return false;			
	}	
	
	fnShowLoader();
	
	$('#section_include_dinner').show();
	$('#continue_pay').show();
	$('#num_tickets').val('1');
	$('#num_seats_to_Select').html('1');	
	
	$.ajax({
		url: siteDomain+"actions.php",		
		type: ajaxMethod,		
		data: 'mode=checkNumberOfSeats&dt='+val,
		dataType: "json",
		cache: false,
		success: function (res) {			
			if(res.status == 'Message'){										
				alertModal(res.message);
				return false;							
			}else{
				fnShowAddonOption(res.showAddonOption);		
				fnShowDinnerOption(res.strDinnerDpd);
				
				$('#num_tickets').html(res.str_num_tickets); // populating nt DPD					
				$('#nt2').html(res.str_num_tickets); // populating nt DPD new added near seats					
				preAssignSeatsByDefault('1');
			}
			fnHideLoader();			
		}
	});	
}

function preAssignSeatsByDefault(num_tickets,on_next=false){	
	if(autoAssignSeats == 1){ // if this is 0 - Manual seating will work.	
		if(num_tickets <= 0 || num_tickets > 10){
			alertModal('There is something wrong. Please try again.');
			return false;
		}
		
		fnShowLoader();
		
		var DbRow_id; var slction;
		if(on_next){			
			DbRow_id =  $('#strDBSeat').val().split(':-:')[0];
			slction = 'manual';
		}else{
			DbRow_id =  $('#DbRow_id').val();			
			slction = 'auto';
		}		
		$.ajax({
			url: siteDomain+"actions.php",		
			type: ajaxMethod,		
			data: 'mode=preAssignSeatsByDefault&dt='+$('#showdatetime').val()+'&nt='+num_tickets+'&pos=0&suggestion_count='+$('#suggestion_count').val()+'&DbRow_id='+DbRow_id+'&strDBSeat='+$('#strDBSeat').val()+'&slction='+slction,
			dataType: "json",
			cache: false,
			success: function (res) {				
				if(res.type == 'MANUAL'){					
					if(res.status == 'TRUE'){										
						processAndHoldSeatsForPurchase();
					}else{
						$('#clear_all_seats').click();						
						alertModal('SORRY!  Since you are attempting to buy tickets that leaves a single empty seat we are unable to proceed.  Please click CLOSE and choose new seats.');								
						
						fnHideLoader();
						return false;
					}
				}else{
					var seats = res.seats; 
					var arrSeats = seats.split(',');
					var seatRowId = res.seatRowId; 
					var newSuggestedCount = res.newSuggestedCount;
					var arrSize = res.arrSize;	
			
					if(seatRowId == ''){					
											
						if($('#suggestion_count').val() == 0 && DbRow_id == 1){
							$('#in_validate').val('1');						
						}else{
							alertModal("No more suggestions. You can select seats manually!!!");
							$('#in_validate').val('0');	
						}							
					}else{
						$('#cr_arr_cnt').val(arrSize*1);
						$('#DbRow_id').val(seatRowId*1);			
						arrSeats.forEach(function (seat) {
							$('#'+seatRowId+'_'+seat).click();
						});
					}					
				}
				
				calculateTotals();						
				fnHideLoader();
			}
		});
	}else{
		if(on_next) processAndHoldSeatsForPurchase(); else return;
	}
}

function processAndHoldSeatsForPurchase(){
	fnShowLoader();
	
	$.ajax({
		url: siteDomain+"actions.php",		
		type: ajaxMethod,		
		data: 'mode=checkIfSoldOut&dt='+$('#showdatetime').val()+'&seats='+$('#strDBSeat').val(),
		dataType: "json",
		cache: false,
		success: function (res) {			
			if(res.seatsNOK*1>0){				
				session_break(false); // false means no relaod of page // default setting  is true
				alertModal('Cannot reserve the selected seats. Someone else may have picked them first. <br /> Click close and start again!',true,res.eventId); // true means reload on close of modal.				
			}else{			
				if(res.status != 'GO'){				
					alertModal(res.seatsNOK);
				}else{					
					$('#allinfo_section').show();	
					$('#move_to_allinfo').click();
					scrollToAnchor('allinfo');
				}					
			}
			fnHideLoader();
		}
	});
}

// Common functions:
function fnResetPage(){	
	fnHideLoader();		
	removePromoCodeUse();removeGiftCardUse();	
}

function fnShowLoader(loader=''){
	if(loader == '') $('.fr_loader').show();
	else $('#'+loader).show();
}
function fnHideLoader(loader=''){
	if(loader == '') setTimeout(function(){$('.fr_loader').hide();},500);
	else setTimeout(function(){$('#'+loader).hide();},500);
	
}

function removeGiftCardUse(){
	fnUnsetsession('gc_codes');	
	$('#gc_coupon').val('');	
	$('#gift_card_details').css('display','none');
	$('#applied_gc').html('');
	
	if(is_seatchart == '1'){
		$('#seats_grand_total').css('text-decoration','none');
		$('#seats_grand_total_new').css('display','none');
	}
}

function removePromoCodeUse(){
	fnUnsetsession('pc_code');	
	$('#pc_coupon').val('');	
	$('#span_PC_amt_used').html('');
	$('#applied_pc').html('');
	$('#promo_card_details').css('display','none');
}

function fnUnsetsession(sesvar){
	fnShowLoader();
	$.ajax({
		data: "mode=unsetsessionvar&var="+sesvar,
		url: siteDomain+"actions.php",
		type: ajaxMethod,			
		dataType: "html",
		cache: false,
		success: function (res) {
			if(is_seatchart == '1'){				
				setCalculatedValuesSC();				
			}else{
				setCalculatedValues();
			}
			
		}		
	});
}

function fnShowAddonOption(showAddonOption){
	if(showAddonOption != ''){					
		$('#tickets_addon_block').show();
		$('#tickets_addon_block div').html(showAddonOption);
	}else{
		$('#tickets_addon_block').hide();
	}
}
function fnShowDinnerOption(strDinnerDpd){	
	if(strDinnerDpd != ''){		
		$('#section_include_dinner').show();
		$('#include_dinner').html(strDinnerDpd);
	}else{
		$('#section_include_dinner').hide();
		$('#include_dinner').html('');
	}
}


// sesion timer
var timer2 = "15:01";
// var timer2 = "00:03";
var interval = setInterval(function() {
  var timer = timer2.split(':');
  //by parsing integer, I avoid all extra string processing
  var minutes = parseInt(timer[0], 10);
  var seconds = parseInt(timer[1], 10);
  --seconds;
  minutes = (seconds < 0) ? --minutes : minutes;
  if (minutes < 0) clearInterval(interval);
  seconds = (seconds < 0) ? 59 : seconds;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  minutes = (minutes < 10) ?  '0' + minutes : minutes;
  if(minutes <=0 && seconds <= 0){
	session_break();
  }
  $('.countdown').html(minutes + ':' + seconds);
  timer2 = minutes + ':' + seconds;
}, 1000);


function session_break($reload=true){
	$.ajax({
		url: siteDomain+"actions.php?mode=session_break",
		type: ajaxMethod,			
		dataType: "html",
		cache: false,
		success: function (eid) {
			if($reload){
				alertModal('Your session has expired. Please start again.');				
				if(eid == 0){
					window.location.href='index.php';
				}else{
					window.location.href='details.php?eid='+eid;
				}
			}
		}		
	});
}

function showHidePaymentMode(mode=true){
	if(mode){
		$('#payment_mode,#chnage_payment_mode_block').show();		
		$('#cc_form .pmt_frm_items').attr('required','required');
	}else{
		$('#payment_mode,#chnage_payment_mode_block').hide();
		$('.pmt_frm_items').removeAttr('required');
	}
}