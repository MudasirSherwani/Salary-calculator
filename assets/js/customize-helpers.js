/**
 * Get luminance from a HEX color.
 *
 * @since Twenty Twenty-One 1.0
 *
 * @param {string} hex - The hex color.
 *
 * @return {number} - Returns the luminance, number between 0 and 255.
 */
function twentytwentyoneGetHexLum(hex) { // jshint ignore:line
  const rgb = twentytwentyoneGetRgbFromHex(hex);
  return Math.round((0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b));
}

/**
 * Get RGB from HEX.
 *
 * @since Twenty Twenty-One 1.0
 *
 * @param {string} hex - The hex color.
 *
 * @return {Object} - Returns an object {r, g, b}
 */
function twentytwentyoneGetRgbFromHex(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  let result;

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF").
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r.toString() + r.toString() + g.toString() + g.toString() + b.toString() + b.toString());

  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}
