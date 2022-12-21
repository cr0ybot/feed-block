<?php
/**
 * RSS Block AJAX endpoints.
 *
 * @package rss-block
 */

namespace RSSBlock\AJAX;

use function RSSBlock\Feed\get_feed;

/**
 * Fetches an RSS feed contents. Admin only.
 */
function get_feed_action() {
	check_ajax_referer( 'rss-block' );

	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error( 'Unauthorized' );
	}

	$url = filter_input( INPUT_POST, 'url', FILTER_SANITIZE_URL );

	if ( ! $url ) {
		wp_send_json_error( 'Invalid URL' );
	}

	$json = get_feed( $url );

	if ( is_wp_error( $json ) ) {
		wp_send_json_error( $json->get_error_message() );
	}

	wp_send_json_success( $json );
}
add_action( 'wp_ajax_rss_block_get_feed', __NAMESPACE__ . '\\get_feed_action' );
