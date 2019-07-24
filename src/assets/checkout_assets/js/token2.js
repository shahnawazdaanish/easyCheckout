/**************************************************************************
* Common js
**************************************************************************/
jQuery(document).ready(function($) {
  $('.emi_tooltip').tooltip({
    trigger: 'hover',
    placement: "right",
    html: true
  });
  $('[data-toggle="tooltip"]').tooltip();
  $('.remember_tooltip_text').tooltip({
    trigger: 'click',
    placement: "right",
    html: true
  }).tooltip('show');
  // Hide div which open on click
  $(".slimScrollBar").hide();
  $(".card_input_fields").hide();
  $(".card_input_fields_2nd").hide();
  // $("#remember_card_mobile").hide();
  // $(".payment_item").hide();
  $(".card_input_fields").hide();
  $("#saved_card").hide();
  $("#remember_card_otp").hide();
  $("#remember_card_otp_2nd_time").hide();
  $("#remember_card_password").hide();
  $(".mobile_bank_payment").hide();
  $("#transaction_success").hide();
  $("#feedback_area").hide();
  $(".remember_tooltip_icon").hide();
  $("#help_section").hide();
  $("#available_offers").hide();
  // Card item Click
  $(".card_name").on("click",function() {
    // $(".form_loader").show(1).delay(2000).hide(1);
    $(".tab-content").removeClass("middle_static_border");
    $(".payment_item").hide();
    $(".card_input_fields").show();
  });
  //Back to card Click
  $(".back_to_card").on("click",function() {
    $(".tab-content").addClass("middle_static_border");
    $(".nav-tabs li.all_cards").addClass("active");
    $("#menu1").addClass("in");
    $("#menu1").addClass("active");
    $(".payment_item").show();
    $(".card_input_fields").hide();
  });
  // Remember Me Click
  $('#remember_check').on("click",function() {
    if ( $('#remember_check:checked').length > 0) {
      $("#remember_card_otp_2nd_time").slideDown();
      $('.inner_fix_height').animate({scrollTop:$(document).height()}, 'slow');
      $(".remember_tooltip_icon").show();
    } else {
      $("#remember_card_otp_2nd_time").slideUp();
      $(".remember_tooltip_icon").hide();
    }
  });
  // Mobile Edit
  $(".mobile_edit_click").on("click",function() {
    $('#remember_card_mobile input').prop('readonly', false);
    $('button.btn_next_step').removeClass('next_active');
    $('#remember_card_mobile input').val('');
    $(".mobile_edit_click_after").show();
    $(".mobile_edit_click").hide();
  });
  // Appear Mobile Next Button
  $("#remember_card_mobile input").on("keyup",function() {
    var maxLength = $(this).attr("maxlength");
    if(maxLength == $(this).val().length) {
      $('button.btn_next_step').addClass('next_active');
    } else {
      $('button.btn_next_step').removeClass('next_active');
    }
  });
  // Mobile confirm
  $(".mobile_confirm_click").on("click",function() {
    $("#remember_card_mobile").hide();
    $('.inner_fix_height').animate({scrollTop:$(document).height()}, 'slow');
    $("#remember_card_otp").show();
  });
  // Back to My Cards
  $(".back_my_cards").on("click",function() {
    $(".card_input_fields").slideUp();
    $("#saved_card").slideDown();
  });
  // Pay Input keyup function
  $(".btn_full_width_disable").prop("disabled", true);
  $(".final_keyup_fuction").on("keyup",function() {
    var maxLength = $(this).attr("maxlength");
    if(maxLength == $(this).val().length) {
      $('.btn_full_width_disable').addClass('btn_full_width_active');
      $(".btn_full_width_disable").prop("disabled", false);
    } else {
      $('.btn_full_width_disable').removeClass('btn_full_width_active');
      $(".btn_full_width_disable").prop("disabled", true);
    }
  });
  // OTP Last Input keyup function 2nd Time
  $(".keyup_fuction_2nd_time").on("keyup",function() {
    var maxLength = $(this).attr("maxlength");
    if(maxLength == $(this).val().length) {
      $('.btn_full_width_disable').addClass('btn_full_width_active');
      $(".btn_full_width_disable").prop("disabled", false);
    } else {
      $('.btn_full_width_disable').removeClass('btn_full_width_active');
      $(".btn_full_width_disable").prop("disabled", true);
    }
  });
  // OTP Last Input keyup function
  $(".keyup_fuction_last").on("keyup",function() {
    var len = $(this).val().length;
    if (len >= 1) {
      $("#remember_card_otp").hide();
      $("#saved_card").show();
    }
    else{
      $("#saved_card").hide();
    }
  });
  // Card Input Area Again
  $(".back_top_card_input_area").on("click",function() {
    $("#saved_card").slideUp();
    $(".card_input_fields").slideDown();
  });
  // Mobile Screen Again
  $(".previous_mobile_number_edit").on("click",function() {
    $("#remember_card_otp").hide();
    $("#remember_card_mobile").show();
    $('#remember_card_mobile input').prop('readonly', false);
    $('button.btn_next_step').removeClass('next_active');
    $('#remember_card_mobile input').val('');
    $(".mobile_edit_click_after").show();
    $(".mobile_edit_click").hide();
  });
  // Saved Card CVV
  $( ".save_card_items li" ).on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $( this ).toggleClass( "highlight" );
  });
  // Faq Page Show
  $(".faq_page_link").on("click",function() {
    $(this).addClass('top_menu_active');
    $("#help_section").slideDown();
    $(".slimScrollBar").slideUp();
    $(".card_input_fields").slideUp();
    $(".card_input_fields_2nd").slideUp();
    $("#remember_card_mobile").slideUp();
    $(".payment_item").slideUp();
    $(".card_input_fields").slideUp();
    $("#saved_card").slideUp();
    $("#remember_card_otp").slideUp();
    $("#remember_card_otp_2nd_time").slideUp();
    $("#remember_card_password").slideUp();
    $(".mobile_bank_payment").slideUp();
    $("#transaction_success").slideUp();
    $("#feedback_area").slideUp();
    $(".remember_tooltip_icon").slideUp();
    $("#available_offers").slideUp();
  });
  // Offers Page Show
  $(".offers_page_link").on("click",function() {
    $(this).addClass('top_menu_active');
    $("#available_offers").slideDown();
    $(".slimScrollBar").slideUp();
    $(".card_input_fields").slideUp();
    $(".card_input_fields_2nd").slideUp();
    $("#remember_card_mobile").slideUp();
    $(".payment_item").slideUp();
    $(".card_input_fields").slideUp();
    $("#saved_card").slideUp();
    $("#remember_card_otp").slideUp();
    $("#remember_card_otp_2nd_time").slideUp();
    $("#remember_card_password").slideUp();
    $(".mobile_bank_payment").slideUp();
    $("#transaction_success").slideUp();
    $("#feedback_area").slideUp();
    $(".remember_tooltip_icon").slideUp();
    $("#help_section").slideUp();
  });
  // Home Page Show
  $(".home_page").on("click",function() {
    $(this).addClass('top_menu_active');
    $("#saved_card").slideDown();
    $("#remember_card_mobile").slideUp();
    $(".card_input_fields").slideUp();
    $("#available_offers").slideUp();
    $(".slimScrollBar").slideUp();
    $(".card_input_fields_2nd").slideUp();
    $(".payment_item").slideUp();
    $("#remember_card_otp").slideUp();
    $("#remember_card_otp_2nd_time").slideUp();
    $("#remember_card_password").slideUp();
    $(".mobile_bank_payment").slideUp();
    $("#transaction_success").slideUp();
    $("#feedback_area").slideUp();
    $(".remember_tooltip_icon").slideUp();
    $("#help_section").slideUp();
  });
});
