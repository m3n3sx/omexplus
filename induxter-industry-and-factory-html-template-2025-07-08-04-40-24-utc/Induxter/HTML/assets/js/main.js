
$(function($) {

    "use strict";

    //===== 01. Main Menu
    function mainMenu() {
        // Variables
        var var_window = $(window),
            navContainer = $('.nav-container'),
            pushedWrap = $('.nav-pushed-item'),
            pushItem = $('.nav-push-item'),
            pushedHtml = pushItem.html(),
            pushBlank = '',
            navbarToggler = $('.navbar-toggler'),
            navMenu = $('.nav-menu'),
            navMenuLi = $('.nav-menu ul li ul li'),
            closeIcon = $('.navbar-close');
        // navbar toggler
        navbarToggler.on('click', function() {
            navbarToggler.toggleClass('active');
            navMenu.toggleClass('menu-on');
        });
        // close icon
        closeIcon.on('click', function() {
            navMenu.removeClass('menu-on');
            navbarToggler.removeClass('active');
        });

        // adds toggle button to li items that have children
        navMenu.find('li a').each(function() {
            if ($(this).next().length > 0) {
                $(this)
                    .parent('li')
                    .append(
                        '<span class="dd-trigger"><i class="flaticon-down-arrow"></i></span>'
                    );
            }
        });
        // expands the dropdown menu on each click
        navMenu.find('li .dd-trigger').on('click', function(e) {
            e.preventDefault();
            $(this)
                .parent('li')
                .children('ul')
                .stop(true, true)
                .slideToggle(350);
            $(this).parent('li').toggleClass('active');
        });

        // check browser width in real-time
        function breakpointCheck() {
            var windoWidth = window.innerWidth;
            if (windoWidth <= 1199) {
                navContainer.addClass('breakpoint-on');

                pushedWrap.html(pushedHtml);
                pushItem.hide();
            } else {
                navContainer.removeClass('breakpoint-on');

                pushedWrap.html(pushBlank);
                pushItem.show();
            }
        }

        breakpointCheck();
        var_window.on('resize', function() {
            breakpointCheck();
        });
    };
    // Document Ready
    $(document).ready(function() {
        mainMenu();
    });

    //===== Prealoder
    $(window).on('load', function(event) {
        $('.preloader').delay(500).fadeOut('500');
    })

    //===== Sticky
    $(window).on('scroll', function(event) {
        var scroll = $(window).scrollTop();
        if (scroll < 190) {
            $(".header-navigation").removeClass("sticky");
        } else {
            $(".header-navigation").addClass("sticky");
        }
    });

    //====== Magnific Popup
    $('.video-popup').magnificPopup({
        type: 'iframe'
        // other options
    });
    $('.img-popup').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });
    //===== Back to top
    $(window).on('scroll', function(event) {
        if ($(this).scrollTop() > 600) {
            $('.back-to-top').fadeIn(200)
        } else {
            $('.back-to-top').fadeOut(200)
        }
    });

    //===== counter up

     $('.counter').counterUp({
        delay: 80,
        time: 4000
    });


    //Animate the scroll to top
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });

    // jquery nice select js
    $('select').niceSelect();
    
    //=====  Slick Slider js
    var sliderArrows = $('.hero-arrows');
    $('.hero-slider-one').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        fade: true,
        Speed: 1000,
        appendArrows: sliderArrows,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    $('.hero-slider-three').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        fade: true,
        Speed: 1000,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    $('.hero-slider-two').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        fade: true,
        Speed: 700,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1700,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    $('.project-slide-one').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        Speed: 2500,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    arrows: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.project-slide-two').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        Speed: 2500,
        prevArrow: '<div class="prev"><i class="fal fa-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="fal fa-arrow-right"></i></div>',
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    arrows: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.project-slide-three').slick({
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        Speed: 2500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.project-slide-four').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        Speed: 2500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.project-slide-five').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        Speed: 2500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.service-slider-one').slick({
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        Speed: 2500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    var sliderArrows = $('.testimonial-arrows-one');
    $('.testimonial-slider-one').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        appendArrows: sliderArrows,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        Speed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    $('.testimonial-slider-two').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        Speed: 2500,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.testimonial-slider-three').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        Speed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    var sliderArrows = $('.team-arrows');
    $('.team-slide-one').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        Speed: 2500,
        appendArrows: sliderArrows,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    arrows: false,
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    arrows: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.blog-slider-one').slick({
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        Speed: 2500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    var sliderArrows = $('.blog-arrows-two');
    $('.blog-slider-two').slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: true,
        appendArrows: sliderArrows,
        prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        Speed: 2500,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.blog-slider-three').slick({
        dots: false,
        arrows: false,
        autoplay: false,
        Speed: 1500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.related-post-slide').slick({
        dots: false,
        arrows: false,
        autoplay: true,
        Speed: 1500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.awards-slide').slick({
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        Speed: 1500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.shop-big-slider').slick({
		dots: false,
		arrows: true,
		infinite: true,
		autoplaySpeed: 1500,
		asNavFor: '.shop-thumb-slider',
        fade: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: '<div class="prev"><i class="icofont-arrow-left"></i></div>',
        nextArrow: '<div class="next"><i class="icofont-arrow-right"></i></div>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            }
        ]
    });
    $('.shop-thumb-slider').slick({
		dots: false,
		arrows: false,
		autoplaySpeed: 1500,
		focusOnSelect: true,
        vertical: true,
		asNavFor: '.shop-big-slider',
		slidesToShow: 3,
		slidesToScroll: 1
    });
    // Isotope js
    $('#project-filter').imagesLoaded( function() {
        // items on button click
        $('.filter-btn').on('click', 'li', function () {
            var filterValue = $(this).attr('data-filter');
            items.isotope({
                filter: filterValue
            });
        });
        // menu active class
        $('.filter-btn li').on('click', function (e) {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        var items = $('.products-grid').isotope();
    });
    // Quantity js
    $('.quantity-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });
    $('.quantity-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });
    // page_scroll JS
    $("a.page_scroll").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            scrollToPosition(hash);
        } 
    });
    function scrollToPosition(hash){
        //Initialize Active Class
        $('body,html').animate({
            start: function(){},
            scrollTop: $(hash).offset().top,
        },1000,function(){
            window.location.hash = hash;
        });
    }
});