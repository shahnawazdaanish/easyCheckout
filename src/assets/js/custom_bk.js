var payform = $.payform;

function loadPayForm() {
  $("#cvc").payform('formatCardCVC');
}
function loadCleaveInput() {
  var cleave = new Cleave('#ccnum2', {
    creditCard: true,
    onCreditCardTypeChanged: function (type) {
      //document.querySelector('.type').innerHTML = type;
      window.card_type = type;
    }
  });
  console.log("cleave details");
  console.log(cleave);
  new Cleave('#expiry', {
    date: true,
    datePattern: ['m', 'y']
  });
}

function loadHeight() {
  $(".loading-btn__text").unbind("click");
  console.log("Loading height");
  jQuery( document ).ready(function($) {
    if ($(window).width() < 580) {
      var winHeight = $(window).height();
      // console.log(winHeight);
      console.log($('.modal-header').length, $('#pay_button').length);
      var headerHeight = $('.modal-header').outerHeight(true);
      var footerHeight = $('#pay_button').outerHeight(true);
      var getHeight = headerHeight + footerHeight;
      var contentHeight = winHeight - getHeight;
      // console.log(contentHeight, headerHeight, footerHeight, getHeight);
      $('.inner_fix_height').slimscroll({
        height: contentHeight + "px",
        size: '3px',
        alwaysVisible: false,
        touchScrollStep: 50
      });
    } else {
      var theWidth = $('.payment_item').innerHeight();
      // console.log(theWidth);
      $('.inner_fix_height').slimscroll({
        height: theWidth,
        size: '3px',
        alwaysVisible: false,
        touchScrollStep: 50
      });
    }
  });
}
function loadBrowserDetection(){
  return getBrowser();
}
function loadColorPick(active,primary){
  console.log(active);
  console.log(primary);

  var color = [];
  if(active !== '' && primary !== ''){
    color[0] = active;
    color[1] = primary;
  } else {
    var colorThief = new ColorThief();
    var colorG = colorThief.getColor(document.querySelector('.client_logo img'));
    var colorP = colorThief.getPalette(document.querySelector('.client_logo img'), 8, 100);
    console.log("COLOR PICKER ", colorG, colorP);
    console.log('%c Oh my heavens! ', 'background: rgb(' + colorG.join(',') + '); color: #FFF');
    color.push(colorG.join());
    for (var i = 0; i < colorP.length; i++) {
      console.log('%c Color Pallets ', 'background: rgb(' + colorP[i].join(',') + '); color: #FFF');
      color.push(colorP[i].join());
    }
  }
  var style = '<style type="text/css">' +
    '.banking_tabs .nav-tabs li.active a, .banking_tabs .nav-tabs li a:hover, ' +
    'button.btn_next_step.next_active:hover,' +
    '.btn_full_width_active,' +
    '.banking_tabs .nav-tabs li a:focus, .banking_tabs .nav-tabs li a:visited { background: rgb('+color[0]+') !important; }' +
    'button.btn_next_step.next_active,' +
    '.payment_token .input-group .input-group-addon.emi_active select,.payment_token .input-group .input-group-addon.emi_active, .payment_token .with_link a,.banking_tabs .nav-tabs li { background: rgb('+color[1]+') !important;}' +
    ' .payment_token .back_to_card, .payment_token .text_dark a, .back_my_cards a, .top_menu + .tooltip > .tooltip-inner b, .remember_card_mobile span a, .remember_card_otp span a, .after_login_text a { color: rgb('+color[1]+') !important;}'+
    '.payment_token .with_link a:hover, .payment_token .back_to_card:hover, .payment_token .text_dark a:hover, .back_my_cards a:hover, .remember_card_mobile span a:hover, .remember_card_otp span a:hover { color: rgb('+color[0]+') !important;}'+
    '.remember_tooltip_icon svg:hover path, .remember_tooltip_icon svg:hover rect, .ssl_token_menu li .top_menu svg:hover path, .ssl_token_menu li .top_menu svg:hover rect,.st4 { fill: rgb('+color[0]+') !important;}'+
    '.payment_token .input-group .input-group-addon.emi_active select,.payment_token .input-group .input-group-addon.emi_active, .payment_token textarea.form-control:focus, .payment_token input.form-control:focus, .client_logo { border-color: rgb('+color[1]+') !important;}'+
    '</style>';
  $("head").append(style);
}

// $(function() {
//   $('.card_input_fields').on('keydown', '.input_numeric_field', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110])||(/65|67|86|88/.test(e.keyCode)&&(e.ctrlKey===true||e.metaKey===true))&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
// });

/*jQuery( document ).ready(function($) {
  if ( $(window).width() < 580) {
    var winHeight = $(window).height();
    var headerHeight = $('.modal-header').outerHeight(true);
    var footerHeight = $('#pay_button').outerHeight(true);
    var getHeight = headerHeight + footerHeight;
    var contentHeight = winHeight - getHeight;
    $('.inner_fix_height').slimscroll({
      height: contentHeight+"px",
      size: '3px',
      alwaysVisible: false,
      touchScrollStep: 50
    });
  } else {
    var theWidth = $('.payment_item').innerHeight();
    console.log(theWidth);
    $('.inner_fix_height').slimscroll({
      height: theWidth,
      size: '3px',
      alwaysVisible: false,
      touchScrollStep: 50
    });
  }
});*/

setTimeout(function(){
  var fullHeight = $(window).height();
  // $( "<style>.main_wrapper { height:" + fullHeight + "px!important; }</style>" ).appendTo( "head" );

  var theWidth = $('.payment_item').innerHeight();
  console.log(theWidth);
  // $('.inner_fix_height').slimscroll({
  //   height: theWidth,
  //   size: '3px',
  //   alwaysVisible: false,
  //   touchScrollStep: 50
  // });
},400);

// $( ".save_card_items li" ).on('click', function () {
//   $( this ).addClass( "highlight" );
// });

$(document).ready(function(){
  console.log($('.emi_tooltip').length);
  $('.emi_tooltip').tooltip({
    trigger: 'hover',
    placement: "right",
    html: true
  });
  $('[data-toggle="tooltip"]').tooltip();
  console.log($('.remember_tooltip_text').length);
  $('.remember_tooltip_text').tooltip({
    trigger: 'click',
    placement: "right",
    html: true
  }).tooltip('show');
  // Hide div which open on click
  $(".slimScrollBar").hide();
  $(".card_input_fields").hide();
  // $(".card_input_fields_2nd").hide();
  // $("#remember_card_mobile").hide();
  // $("#remember_card_otp").hide();
  // $("#remember_card_password").hide();
  // $(".mobile_bank_payment").hide();
  // $("#transaction_success").hide();
  // $("#feedback_area").hide();

  // Card item Click
  $(".card_name").on("click",function() {
    // $(".form_loader").show(1).delay(2000).hide(1);
    $(".tab-content").removeClass("middle_static_border");
    $(".payment_item").fadeOut();
    $(".card_input_fields").fadeIn();
  });
  //Back to card Click
  $(".back_to_card").on("click",function() {
    $(".tab-content").addClass("middle_static_border");
    $(".payment_item").fadeIn();
    $(".card_input_fields").fadeOut();
  });
  // Remember Me Click
  // $('#remember_check').on("click",function() {
  //   if ( $('#remember_check:checked').length > 0) {
  //     $("#remember_card_mobile").slideDown();
  //     $('.inner_fix_height').animate({scrollTop:$(document).height()}, 'slow');
  //   } else {
  //     $("#remember_card_mobile").slideUp();
  //   }
  // });
  // Input keyup function
  // $(".btn_next_step").prop("disabled", true);
  // $(".keyup_fuction").keyup(function(){
  //   // $(".btn_next_step").css("background", "#2a5da8");
  //   var len = $(this).val().length;
  //   if (len >= 1) {
  //     $(".btn_next_step").css("background", "#2a5da8");
  //     $(".btn_next_step").prop("disabled", false);
  //   }
  //   else{
  //     $(".btn_next_step").prop("disabled", true);
  //   }
  // });
  // Input mobile number next click
  // $(".mobile_next_click").on("click",function() {
  //   $("#remember_card_mobile").fadeOut();
  //   // $('.inner_fix_height').animate({scrollTop:$(document).height()}, 'slow');
  //   $("#remember_card_otp").fadeIn();
  // });
  // OTP number next click
  // $(".OTP_next_click").on("click",function() {
  //   $("#remember_card_otp").fadeOut();
  //   // $('.inner_fix_height').animate({scrollTop:$(document).height()}, 'slow');
  //   $("#remember_card_password").fadeIn();
  // });
  // Pay Input keyup function
  // $(".btn_full_width_disable").prop("disabled", true);
  // $(".final_keyup_fuction").keyup(function(){
  //   var len = $(this).val().length;
  //   if (len >= 1) {
  //     $(".btn_full_width_disable").addClass("btn_full_width_active");
  //     $(".btn_full_width_disable").prop("disabled", false);
  //   }
  //   else{
  //     $(".btn_full_width_disable").removeClass("btn_full_width_active");
  //     $(".btn_full_width_disable").prop("disabled", true);
  //   }
  // });
  // Mobile Cash item Click
  // $(".mob_bank_name").on("click",function() {
  //   // $(".form_loader").show(1).delay(2000).hide(1);
  //   $(".tab-content").removeClass("middle_static_border");
  //   // $("hr").removeClass("mt-0");
  //   $(".payment_item_mobile").fadeOut();
  //   $(".card_input_fields_2nd").fadeIn();
  //   $(".card_payments").html("VERIFY 100.00 PAYMENT <img src='images/right-arrow.png'>");
  // });
  // //Back to Mobile Cash Click
  // $(".backto_mobile_cash").on("click",function() {
  //   $(".tab-content").addClass("middle_static_border");
  //   $(".card_input_fields_2nd").fadeOut();
  //   $(".payment_item_mobile").fadeIn();
  //   $("hr").addClass("mt-0");
  // });
  // // Success Transection Click
  // $(".card_payments").on("click",function() {
  //   $(".tab-content").fadeOut();
  //   $("#remember_card_mobile").fadeOut();
  //   $("#remember_card_otp").fadeOut();
  //   $("#remember_card_password").fadeOut();
  //   $("#transaction_success").fadeIn();
  //   $(".card_payments").html("CLOSE <img src='images/cancel.svg'> ");
  //   // $("hr").addClass("mt-0");
  // });
  // // Feedback Given area Click
  // $(".give_us_rating").on("click",function() {
  //   $("#transaction_success").fadeOut();
  //   $("#feedback_area").fadeIn();
  //   $(".card_payments").html("SUBMIT <img src='images/right-arrow.png'>");
  //   // $("hr").addClass("mt-0");
  // });
  // // Mobile Transection Id Input keyup function
  // $(".mobile_trans_id").keyup(function(){
  //   var len = $(this).val().length;
  //   if (len >= 1) {
  //     $(".btn_full_width_disable").addClass("btn_full_width_active");
  //     $(".btn_full_width_disable").prop("disabled", false);
  //   }
  //   else{
  //     $(".btn_full_width_disable").removeClass("btn_full_width_active");
  //     $(".btn_full_width_disable").prop("disabled", true);
  //   }
  // });
  // Password info Show / Hide
  $(".password_strength img").on("click",function(e) {
    $("#password_text").toggleClass("password_text_show fadeIn");
  });
});



jQuery(document).ready(function($) {
});
