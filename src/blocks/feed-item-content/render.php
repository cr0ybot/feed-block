<?php
/**
 * Block: feed-item-content, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

if ( ! isset( $attributes['contentType'] ) || empty( $block->context[$attributes['contentType']] ) ) {
	return;
}

$content = $block->context[$attributes['contentType']];

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
