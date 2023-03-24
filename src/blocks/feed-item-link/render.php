<?php
/**
 * Block: feed-item-link, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

use function FeedBlock\Util\get_block_border_attributes;

$text = $attributes['text'] ?? '';

if ( empty( $text ) ) {
	return;
}

error_log(print_r($block->context, true));

$atts = get_block_border_attributes( $attributes );

$rel = ! empty( $block->context['feed-block/itemLinkRel'] ) ? 'rel="' . esc_attr( $block->context['feed-block/itemLinkRel'] ) . '"' : '';
if ( ! empty( $rel ) ) {
	$atts['rel'] = $rel;
}

$target = ! empty( $block->context['feed-block/itemLinkTarget'] ) ? 'target="' . esc_attr( $block->context['feed-block/itemLinkTarget'] ) . '"' : '';
if ( ! empty( $target ) ) {
	$atts['target'] = $target;
}

error_log(print_r($atts, true));

printf(
	'<a href="%1$s" %2$s>%3$s</a>',
	esc_url( $block->context['feed-block/item/url'] ),
	get_block_wrapper_attributes( $atts ),
	esc_html( $text )
);
