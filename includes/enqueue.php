<?php
/**
 * Feed Loop enqueue scripts and styles.
 *
 * @package feed-loop
 */

namespace FeedLoop\Enqueue;

/**
 * Block script localizations.
 */
function localize_scripts() {
	$localize = array(
		// 'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce' => wp_create_nonce( 'feed-loop' ),
	);

	wp_localize_script( 'feed-loop-feed-loop-editor-script', 'feedLoop', $localize );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\localize_scripts' );
