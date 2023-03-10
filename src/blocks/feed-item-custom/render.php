<?php
/**
 * Block: feed-item-custom, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

if ( ! isset( $attributes['contentType'] ) || empty( $block->context['custom'] ) ) {
	return;
}

$feed_tag = is_array( $attributes['tag'] ) && count( $attributes['tag'] ) === 2 ? $attributes['tag'] : false;
$content  = $feed_tag ? $block->context['custom'][ $feed_tag[0] ][ $feed_tag[1] ] : '';

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
