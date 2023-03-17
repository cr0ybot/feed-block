<?php
/**
 * Feed Block enqueue scripts and styles.
 *
 * @package feed-block
 */

namespace FeedBlock\Enqueue;

/**
 * Block script localizations.
 */
function localize_scripts() {
	$localize = array(
		// 'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce' => wp_create_nonce( 'feed-block' ),
	);

	wp_localize_script( 'feed-block-feed-editor-script', 'feedBlock', $localize );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\localize_scripts' );
