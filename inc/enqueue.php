<?php
/**
 * RSS Block enqueue scripts and styles.
 *
 * @package rss-block
 */

namespace RSSBlock\Enqueue;

/**
 * Block script localizations.
 */
function localize_scripts() {
	$localize = array(
		// 'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce' => wp_create_nonce( 'rss-block' ),
	);

	wp_localize_script( 'rss-block-rss-feed-editor-script', 'rssBlock', $localize );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\localize_scripts' );
