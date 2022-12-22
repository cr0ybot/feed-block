<?php
/**
 * Block: feed-item-title, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

if ( ! isset( $block->context['title'] ) ) {
	return;
}

$title = $block->context['title'];
$tag   = 'h2';
if ( isset( $attributes['level'] ) ) {
	$tag = 0 === $attributes['level'] ? 'p' : 'h' . $attributes['level'];
}

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

if ( isset( $attributes['isLink'] ) && $attributes['isLink'] && isset( $block->context['url'] ) ) {
	$rel   = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
	$title = sprintf(
		'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
		esc_url( $block->context['url'] ),
		esc_attr( $attributes['linkTarget'] ),
		$rel,
		esc_html( $block->context['title'] )
	);
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	$tag, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$title // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);
