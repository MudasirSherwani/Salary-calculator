/* global twentytwentyoneGetHexLum */

(function () {
  // Wait until the customizer has finished loading.
  wp.customize.bind('ready', () => {
    // Hide the "respect_user_color_preference" setting if the background-color is dark.
    if (twentytwentyoneGetHexLum(wp.customize('background_color').get()) < 127) {
      wp.customize.control('respect_user_color_preference').deactivate();
      wp.customize.control('respect_user_color_preference_notice').deactivate();
    }

    // Handle changes to the background-color.
    wp.customize('background_color', (setting) => {
      setting.bind((value) => {
        if (twentytwentyoneGetHexLum(value) < 127) {
          wp.customize.control('respect_user_color_preference').deactivate();
          wp.customize.control('respect_user_color_preference_notice').activate();
        } else {
          wp.customize.control('respect_user_color_preference').activate();
          wp.customize.control('respect_user_color_preference_notice').deactivate();
        }
      });
    });
  });
}());
