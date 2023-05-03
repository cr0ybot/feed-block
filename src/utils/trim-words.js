/**
 * Utils.
 */

import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Trims a string to a specified number of words, similar to wp_trim_words().
 *
 * @since 1.0.0
 *
 * @param {string} originalText Text string to trim.
 * @param {number} numWords Number of words to trim to.
 * @param {string} more Text to append to the trimmed summary, defaults to '…'.
 * @returns {string} Trimmed summary.
 */
export function trimWords( originalText, numWords = 55, more = null ) {
	if ( null === more ) {
		more = __( '…' );
	}
	// Split string on whitespace, add `more` if limit is reached (ie cut off).
	const trimmed = originalText.split( /[\n\r\t ]+/, numWords );

	let text = trimmed.join( ' ' );
	if ( trimmed.length === numWords ) {
		text += more;
	}

	/**
	 * Filters the trimmed summary.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} text           The trimmed summary.
	 * @param {string} originalText   The original summary before trimming.
	 * @param {number} numWords       The number of words to trim to.
	 * @param {string} more           The string to append to the trimmed summary.
	 */
	return applyFilters(
		'feedBlock.trimWords',
		text,
		originalText,
		numWords,
		more
	);
}
