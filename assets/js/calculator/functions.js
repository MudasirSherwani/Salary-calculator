/**
 * Functionality specific to Twenty Thirteen.
 *
 * Provides helper functions to enhance the theme experience.
 */

(function ($) {
  const body = $('body');
	    const _window = $(window);

  /**
	 * Adds a top margin to the footer if the sidebar widget area is higher
	 * than the rest of the page, to help the footer always visually clear
	 * the sidebar.
	 */
  $(() => {
    if (body.is('.sidebar')) {
      const sidebar = $('#secondary .widget-area');
			    const secondary = (sidebar.length === 0) ? -40 : sidebar.height();
			    const margin = $('#tertiary .widget-area').height() - $('#content').height() - secondary;

      if (margin > 0 && _window.innerWidth() > 999) {
        // $( '#colophon' ).css( 'margin-top', margin + 'px' );
      }
    }
  });

  /**
	 * Enables menu toggle for small screens.
	 */
  (function () {
    const nav = $('#site-navigation'); let button; let
      menu;
    if (!nav) {
      return;
    }

    button = nav.find('.menu-toggle');
    if (!button) {
      return;
    }

    // Hide button if menu is missing or empty.
    menu = nav.find('.nav-menu');
    if (!menu || !menu.children().length) {
      button.hide();
      return;
    }

    button.on('click.twentythirteen', () => {
      nav.toggleClass('toggled-on');
    });

    // Better focus for hidden submenu items for accessibility.
    menu.find('a').on('focus.twentythirteen blur.twentythirteen', function () {
      $(this).parents('.menu-item, .page_item').toggleClass('focus');
    });
  }());

  /**
	 * Makes "skip to content" link work correctly in IE9 and Chrome for better
	 * accessibility.
	 *
	 * @link http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
	 */
  _window.on('hashchange.twentythirteen', () => {
    const element = document.getElementById(location.hash.substring(1));

    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1;
      }

      element.focus();
    }
  });

  /**
	 * Arranges footer widgets vertically.
	 */
  if ($.isFunction($.fn.masonry)) {
    const columnWidth = body.is('.sidebar') ? 228 : 245;

    $('#secondary .widget-area').masonry({
      itemSelector: '.widget',
      columnWidth,
      gutterWidth: 20,
      isRTL: body.is('.rtl'),
    });
  }
}(jQuery));