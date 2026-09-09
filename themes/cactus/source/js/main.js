/**
 * Sets up Justified Gallery (only for galleries without captions).
 */
if (!!$.prototype.justifiedGallery) {
  var options = {
    rowHeight: 140,
    margins: 4,
    lastRow: "justify",
    imgSelector: "> img, > picture > img, > a > img, > a > picture > img"
  };
  $(".article-gallery:not(.with-captions)").justifiedGallery(options);
}

$(document).ready(function() {

  // Open inline article images in a lightweight full-screen preview.
  var lightbox = document.getElementById("image-lightbox");
  var lightboxImage = lightbox && lightbox.querySelector(".image-lightbox__image");

  if (lightbox && lightboxImage) {
    $(".content img").css("cursor", "zoom-in").on("click", function(event) {
      event.preventDefault();
      lightboxImage.src = this.dataset.fullSrc || this.currentSrc || this.src;
      lightboxImage.alt = this.alt || "";
      lightbox.hidden = false;
      document.body.classList.add("image-lightbox-open");
    });

    $(lightbox).on("click", function(event) {
      if (event.target === lightbox || event.target.classList.contains("image-lightbox__close")) {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        document.body.classList.remove("image-lightbox-open");
      }
    });

    $(document).on("keydown", function(event) {
      if (event.key === "Escape" && !lightbox.hidden) {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        document.body.classList.remove("image-lightbox-open");
      }
    });
  }

  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header > #nav > ul > .icon").click(function() {
    $("#header > #nav > ul").toggleClass("responsive");
  });

  /**
   * Controls the different versions of  the menu in blog post articles 
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    var menu = $("#menu");
    var nav = $("#menu > #nav");
    var menuIcon = $("#menu-icon, #menu-icon-tablet");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if ($(document).width() >= 1440) {
      menu.show();
      menuIcon.addClass("active");
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.click(function() {
      if (menu.is(":hidden")) {
        menu.show();
        menuIcon.addClass("active");
      } else {
        menu.hide();
        menuIcon.removeClass("active");
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (menu.length) {
      $(window).on("scroll", function() {
        var topDistance = menu.offset().top;

        // hide only the navigation links on desktop
        if (!nav.is(":visible") && topDistance < 50) {
          nav.show();
        } else if (nav.is(":visible") && topDistance > 100) {
          nav.hide();
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top
        // icon" instead
        if ( ! $( "#menu-icon" ).is(":visible") && topDistance < 50 ) {
          $("#menu-icon-tablet").show();
          $("#top-icon-tablet").hide();
        } else if (! $( "#menu-icon" ).is(":visible") && topDistance > 100) {
          $("#menu-icon-tablet").hide();
          $("#top-icon-tablet").show();
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($( "#footer-post").length) {
      var lastScrollTop = 0;
      $(window).on("scroll", function() {
        var topDistance = $(window).scrollTop();

        if (topDistance > lastScrollTop){
          // downscroll -> show menu
          $("#footer-post").hide();
        } else {
          // upscroll -> hide menu
          $("#footer-post").show();
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        $("#nav-footer").hide();
        $("#toc-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
  }
});
