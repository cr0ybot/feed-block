<?php
/**
 * Block: feed-item-title, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

if ( ! isset( $block->context['title'] ) ) {
	return;
}

$custom_tag     = is_array( $attributes['tag'] ) && count( $attributes['tag'] ) === 2 ? $attributes['tag'] : false;
$custom_tagname = $custom_tag ? $custom_tag[1] : false;
$custom_content = $custom_tag ? $block->context['custom'][ $custom_tag[0] ][ $custom_tag[1] ] : false;

$content = wp_strip_all_tags(
	wp_specialchars_decode( $custom_content ? $custom_content : $block->context['title'] )
);
$tagname = 'h2';
if ( isset( $attributes['level'] ) ) {
	$name = 0 === $attributes['level'] ? 'p' : 'h' . $attributes['level'];
}

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

if ( isset( $attributes['isLink'] ) && $attributes['isLink'] && isset( $block->context['url'] ) ) {
	$rel     = ! empty( $block->context['rel'] ) ? 'rel="' . esc_attr( $block->context['rel'] ) . '"' : '';
	$content = sprintf(
		'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
		esc_url( $block->context['url'] ),
		esc_attr( $block->context['linkTarget'] ?? '_blank' ),
		$rel,
		esc_html( $block->context['title'] )
	);
}

$atts = array(
	'class' => $align_class_name,
);
if ( $custom_tagname ) {
	$atts['data-tag'] = $custom_tagname;
}
$wrapper_attributes = get_block_wrapper_attributes( $atts );

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	$tagname, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	esc_html( $content )
);
