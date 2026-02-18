// @ts-nocheck
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LegacyLogic() {
    const pathname = usePathname();

    useEffect(() => {
        // Function to initialize legacy scripts
        const initLegacyScripts = () => {
            // @ts-ignore
            if (typeof window === "undefined" || !window.jQuery) return;

            // @ts-ignore
            const $ = window.jQuery;

            // Sticky Header
            try {
                // @ts-ignore
                $(window).on('scroll', function () {
                    // @ts-ignore
                    if ($(this).scrollTop() > 100) {
                        $('.header').addClass("sticky");
                    } else {
                        $('.header').removeClass("sticky");
                    }
                });
            } catch (e) { console.error("Sticky Header Init Error", e); }

            // Mobile Menu
            try {
                if ($('.slicknav_menu').length === 0) {
                    $('.menu').slicknav({
                        prependTo: ".mobile-nav",
                        duration: 300,
                        closeOnClick: true,
                    });
                }
            } catch (e) { console.error("Slicknav Init Error", e); }

            // Hero Slider Removed (Static Content Now)


            // Testimonial Slider
            try {
                $('.testimonial-slider').owlCarousel({
                    items: 3,
                    autoplay: true,
                    autoplayTimeout: 4500,
                    smartSpeed: 300,
                    autoplayHoverPause: true,
                    loop: true,
                    merge: true,
                    nav: false,
                    dots: true,
                    responsive: {
                        1: { items: 1 },
                        300: { items: 1 },
                        480: { items: 1 },
                        768: { items: 2 },
                        1170: { items: 3 },
                    }
                });
            } catch (e) { console.error("Testimonial Slider Init Error", e); }

            // Portfolio Slider
            try {
                $('.portfolio-slider').owlCarousel({
                    autoplay: true,
                    autoplayTimeout: 4000,
                    margin: 15,
                    smartSpeed: 300,
                    autoplayHoverPause: true,
                    loop: true,
                    nav: true,
                    dots: false,
                    responsive: {
                        300: { items: 1 },
                        480: { items: 2 },
                        768: { items: 2 },
                        1170: { items: 4 },
                    }
                });
            } catch (e) { console.error("Portfolio Slider Init Error", e); }

            // Counter Up
            try {
                if ($.fn.counterUp) {
                    $('.counter').counterUp({
                        delay: 20,
                        time: 2000
                    });
                }
            } catch (e) { console.error("CounterUp Init Error", e); }

            // Clients Slider
            try {
                $('.clients-slider').owlCarousel({
                    items: 5,
                    autoplay: true,
                    autoplayTimeout: 3500,
                    margin: 15,
                    smartSpeed: 400,
                    autoplayHoverPause: true,
                    loop: true,
                    nav: false,
                    dots: false,
                    responsive: {
                        300: { items: 1 },
                        480: { items: 2 },
                        768: { items: 3 },
                        1170: { items: 5 },
                    }
                });
            } catch (e) { console.error("Clients Slider Init Error", e); }

            // Nice Select
            try {
                // Check if any select exists before init to avoid errors
                if ($('select').length > 0) {
                    $('select').niceSelect();
                }
            } catch (e) { console.error("NiceSelect Init Error", e); }

            // Date Picker
            try {
                if ($.fn.datepicker && $("#datepicker").length > 0) {
                    $("#datepicker").datepicker();
                }
            } catch (e) { console.error("Datepicker Init Error", e); }

            // Video Popup
            try {
                if ($.fn.magnificPopup) {
                    $('.video-popup').magnificPopup({
                        type: 'video',
                    });
                }
            } catch (e) { console.error("MagnificPopup Init Error", e); }

            // Scroll Up
            try {
                if ($.fn.scrollUp) {
                    $.scrollUp({
                        scrollText: '<span><i class="fa fa-angle-up"></i></span>',
                        easingType: 'easeInOutExpo',
                        scrollSpeed: 900,
                        animation: 'fade'
                    });
                }
            } catch (e) { console.error("ScrollUp Init Error", e); }

            // Preloader
            try {
                $('.preloader').addClass('preloader-deactivate');
            } catch (e) { console.error("Preloader Error", e); }
        };

        // Run initialization
        // We need to wait a small amount of time to ensure external scripts (jQuery, Owl) are loaded
        // In a real app, strict dependency management via next/script onLoad is better, 
        // but for this legacy migration, a timeout or check interval is often the pragmatic fix.

        const timer = setTimeout(() => {
            initLegacyScripts();
        }, 500); // 500ms delay to allow jQuery/plugins to load

        return () => clearTimeout(timer);
    }, [pathname]); // Re-run on route change

    return null;
}
