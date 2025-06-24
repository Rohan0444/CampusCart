$(document).ready(function () {
  const $navbar = $('#mainNavbar');
  const $smallLogo = $('.small-logo-container');

  $(window).on('scroll', function () {
    const scrollY = $(window).scrollTop();

    // Toggle navbar background
    if (scrollY > 50) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }

    // Animate small logo appearance
    const pad = Math.max(0, 60 - scrollY * 0.6);
    $smallLogo.css('padding-top', pad + 'px');
  });
});
