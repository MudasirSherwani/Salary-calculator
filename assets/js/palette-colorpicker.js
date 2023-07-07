/**
 * Script for our custom colorpicker control.
 *
 * This is copied from wp-admin/js/customize-controls.js
 * with a few tweaks:
 * 		Removed the hue picker script because we don't use it here
 * 		Added the "palettes" argument in wpColorPicker().
 *
 * @since Twenty Twenty-One 1.0
 */
wp.customize.controlConstructor['twenty-twenty-one-color'] = wp.customize.Control.extend({
  ready() {
    const control = this;
    let updating = false;
    let picker;

    picker = this.container.find('.color-picker-hex');
    picker.val(control.setting()).wpColorPicker({
      palettes: control.params.palette,
      change() {
        updating = true;
        control.setting.set(picker.wpColorPicker('color'));
        updating = false;
      },
      clear() {
        updating = true;
        control.setting.set('');
        updating = false;
      },
    });

    control.setting.bind((value) => {
      // Bail if the update came from the control itself.
      if (updating) {
        return;
      }
      picker.val(value);
      picker.wpColorPicker('color', value);
    });

    // Collapse color picker when hitting Esc instead of collapsing the current section.
    control.container.on('keydown', (event) => {
      let pickerContainer;
      if (event.which !== 27) { // Esc.
        return;
      }
      pickerContainer = control.container.find('.wp-picker-container');
      if (pickerContainer.hasClass('wp-picker-active')) {
        picker.wpColorPicker('close');
        control.container.find('.wp-color-result').focus();
        event.stopPropagation(); // Prevent section from being collapsed.
      }
    });
  },
});
