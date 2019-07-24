var payform = $.payform;

function loadPayForm() {
  $("#cvc").payform('formatCardCVC');
}

function loadCleaveInput() {
  var cleave = new Cleave('#ccnum', {
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
  jQuery(document).ready(function ($) {
    setTimeout(function () {
      if ($(window).width() < 580) {
        var winHeight = $(window).height();
        // console.log(winHeight);
        // console.log($('.modal-header').length, $('#pay_button').length);
        var headerHeight = $('.modal-header').outerHeight(true);
        // console.log("Modal header height", $('.modal-header').height());
        var footerHeight = $('#pay_button').outerHeight(true);
        var getHeight = headerHeight + footerHeight;
        var contentHeight = winHeight - getHeight;
        console.log(headerHeight);
        $('.mobile_device .payment_token').css("margin-top", headerHeight);
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
    }, 50);

    // $('.scroll-window').slimscroll({
    //   height: $(this).innerHeight(),
    //   size: '3px',
    //   alwaysVisible: false,
    //   touchScrollStep: 50
    // });

    $(document).on('show.bs.tab', 'a[data-toggle="tab"]', function (event) {
      event.preventDefault();
    });
    $(document).on('hide.bs.tab', 'a[data-toggle="tab"]', function (event) {
      event.preventDefault();
    });

    // $('.nav-tabs').on('show.bs.tab', 'a', function(event) {
    //   event.preventDefault();
    // });
    // $('.nav-tabs').on('hide.bs.tab', 'a', function(event) {
    //   event.preventDefault();
    // });
  });
}

function loadBrowserDetection() {
  return getBrowser();
}

function initVirtualKeyboardDetector() {

  jQuery(document).ready(function ($) {
    setTimeout(function () {
      if ($(window).width() < 580) {
        window.payment_token_margin = 0;
        // Start listening for virtual keyboard (dis)appearences
        virtualKeyboardDetector.init({recentlyFocusedTimeoutDuration: 3000});
        // Handle the appearing of the virtual keyboard
        virtualKeyboardDetector.on('virtualKeyboardVisible', function() {
          console.log("Keyboard visible");

          // window.payment_token_margin = $('.payment_token').css('marginTop');
          $('.payment_token').addClass('mt0');
          $('.modal-header').hide().animate("slow");
          $('#pay_button').hide().animate("slow");
        });
        // Handle the disappearing of the virtual keyboard
        virtualKeyboardDetector.on('virtualKeyboardHidden', function() {
          console.log("Keyboard invisible");
          $('.payment_token').removeClass('mt0');
          // $('.payment_token').css('margin-top', window.payment_token_margin);
          $('.modal-header').show().animate("slow");
          $('#pay_button').show().animate("slow");
        });

      }
    }, 50);
  });

}

function loadColorPick(active, primary) {
  console.log(active);
  console.log(primary);

  var color = [];
  if (active !== '' && primary !== '') {
    color[0] = active;
    color[1] = primary;
  } else {
    var colorThief = new ColorThief();

    if (document.querySelector('.client_logo img')) {
      var colorG = colorThief.getColor(document.querySelector('.client_logo img'));
      var colorP = colorThief.getPalette(document.querySelector('.client_logo img'), 8, 100);
      console.log("COLOR PICKER ", colorG, colorP);
      console.log('%c Oh my heavens! ', 'background: rgb(' + colorG.join(',') + '); color: #FFF');

      var colorGSum = colorG.reduce((a, b) => a + b, 0);
      if (colorGSum >= 100 && colorGSum <= 550) {
        color.push(colorG.join());
      }

      for (var i = 0; i < colorP.length; i++) {
        var colorPSum = colorP[i].reduce((a, b) => a + b, 0);
        console.log(colorPSum);
        if (colorPSum >= 100 && colorPSum <= 550) {
          console.log('%c Color Pallets ', 'background: rgb(' + colorP[i].join(',') + '); color: #FFF');
          color.push(colorP[i].join());
        }
      }
    }
    // color[1] = color[3] != undefined ? color[3] : color[1];
  }
  var style = '<style type="text/css">' +
    '.banking_tabs .nav-tabs li.active a, .banking_tabs .nav-tabs li a:hover, ' +
    'button.btn_next_step.next_active:hover,' +
    '.btn_full_width_active,' +
    '.banking_tabs .nav-tabs li a:focus, .banking_tabs .nav-tabs li a:visited { background: rgb(' + color[0] + ') !important; }' +
    'button.btn_next_step.next_active,' +
    '.payment_token .input-group .input-group-addon.emi_active select,.payment_token .input-group .input-group-addon.emi_active, .payment_token .with_link a,.banking_tabs .nav-tabs li { background: rgb(' + color[1] + ') !important;}' +
    ' .payment_token .back_to_card, .payment_token .text_dark a, .back_my_cards a, .top_menu + .tooltip > .tooltip-inner b, .remember_card_mobile span a, .remember_card_otp span a, .after_login_text a { color: rgb(' + color[1] + ') !important;}' +
    '.payment_token .with_link a:hover, .payment_token .back_to_card:hover, .payment_token .text_dark a:hover, .back_my_cards a:hover, .remember_card_mobile span a:hover, .remember_card_otp span a:hover { color: rgb(' + color[0] + ') !important;}' +
    '.remember_tooltip_icon svg:hover path, .remember_tooltip_icon svg:hover rect, .ssl_token_menu li .top_menu svg:hover path, .ssl_token_menu li .top_menu svg:hover rect { fill: rgb(' + color[0] + ') !important;}' +
    '.payment_token .input-group .input-group-addon.emi_active select,.payment_token .input-group .input-group-addon.emi_active, .payment_token textarea.form-control:focus, .payment_token input.form-control:focus, .client_logo { border-color: rgb(' + color[1] + ') !important;}' +
    '.top_menu_active span {color: rgb(' + color[0] + ') !important;}' +
    '</style>';
  $("head").append(style);
}

jQuery(document).ready(function ($) {

  // Disable scroll when focused on a number input.
  $('form').on('focus', 'input[type=number]', function (e) {
    $(this).on('wheel', function (e) {
      e.preventDefault();
    });
  });

  // Restore scroll on number inputs.
  $('form').on('blur', 'input[type=number]', function (e) {
    $(this).off('wheel');
  });

  // Disable up and down keys.
  $('form').on('keydown', 'input[type=number]', function (e) {
    if (e.which == 38 || e.which == 40)
      e.preventDefault();
  });

  if (/Android [4-9]/.test(navigator.appVersion)) {
    window.addEventListener("resize", function () {
      if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
    })
  }

  var rect = $(".mobile_device #pay_button").position();

  $(document).on('focus', 'input, textarea', function () {
    var rect = $(".mobile_device #pay_button").position();
  });

  $(document).on('blur', 'input, textarea', function () {
    $(".mobile_device #pay_button").show();
  });

});
