<?php
/**
 * Block: feed-item-title, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

$custom_tag     = is_array( $attributes['customTag'] ) && count( $attributes['customTag'] ) === 2 ? $attributes['customTag'] : false;
$custom_tagname = $custom_tag ? $custom_tag[1] : false;
$custom_content = $custom_tag ? $block->context['feed-block/item/custom'][ $custom_tag[0] ][ $custom_tag[1] ] : false;

$content = wp_strip_all_tags(
	wp_specialchars_decode( $custom_content ? $custom_content : $block->context['feed-block/item/title'] )
);
$tagname = 'h2';
if ( isset( $attributes['level'] ) ) {
	$tagname = 0 === $attributes['level'] ? 'p' : 'h' . $attributes['level'];
}

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

if ( isset( $attributes['isLink'] ) && $attributes['isLink'] && isset( $block->context['feed-block/item/url'] ) ) {
	$rel     = ! empty( $block->context['feed-block/itemLinkRel'] ) ? 'rel="' . esc_attr( $block->context['feed-block/itemLinkRel'] ) . '"' : '';
	$content = sprintf(
		'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
		esc_url( $block->context['feed-block/item/url'] ),
		esc_attr( $block->context['feed-block/itemLinkTarget'] ?? '_blank' ),
		$rel,
		esc_html( $block->context['feed-block/item/title'] )
	);
}

$atts = array(
	'class' => $align_class_name,
);
if ( $custom_tagname ) {
	$atts['data-feed-tag'] = $custom_tagname;
}
$wrapper_attributes = get_block_wrapper_attributes( $atts );

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	esc_html( $tagname ),
	$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);
