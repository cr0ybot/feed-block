<?php
/**
 * Block: feed-no-results, render.
 *
 * Displays blocks when no feed items are found.
 *
 * @package feed-block
 */

namespace FeedBlock\Blocks\FeedNoResults;

use function FeedBlock\Feed\get_feed;


$feed = get_feed( $block->context['feedURL'] );

// If there are feed items, do not render this block.
if ( ( ! is_wp_error( $feed ) && ! empty( $feed['items'] ) ) ) {
	return '';
}

// If no content is available, do not render this block.
if ( empty( $content ) ) {
	return '';
}

$classes            = ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) ? 'has-link-color' : '';
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );
return sprintf(
	'<div %1$s>%2$s</div>',
	$wrapper_attributes,
	$content
);
