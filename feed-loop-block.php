<?php
/**
 * Plugin Name:       Feed Loop Block
 * Plugin URI:        https://github.com/cr0ybot/feed-loop
 * Description:       Advanced RSS & Atom feed block with configurable child blocks, similar to the Query Loop block.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Cory Hughart
 * Author URI:        https://coryhughart.com
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       feed-loop
 *
 * @package           feed-loop
 */

namespace FeedLoop;

// Import includes.
require_once __DIR__ . '/inc/feed.php';
require_once __DIR__ . '/inc/ajax.php';
require_once __DIR__ . '/inc/enqueue.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function register_blocks() {
	foreach ( glob( plugin_dir_path( __FILE__ ) . 'build/blocks/*', GLOB_ONLYDIR ) as $block_dir ) {
		// Extra args for specific blocks.
		$block_args = array(
			'feed-item-template' => array(
				'skip_inner_blocks' => true,
			),
		);
		$args       = array();
		if ( isset( $block_args[ basename( $block_dir ) ] ) ) {
			$args = $block_args[ basename( $block_dir ) ];
		}
		register_block_type( $block_dir, $args );
	}
}
add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
