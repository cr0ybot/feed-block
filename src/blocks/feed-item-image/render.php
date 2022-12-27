<?php
/**
 * Block: feed-item-image, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

if ( ! isset( $block->context['image'] ) || empty( $block->context['image'] ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes();
?>

<figure <?php echo $wrapper_attributes; ?>>
	<img src="<?php echo esc_url( $block->context['image'] ); ?>" alt="" />
</figure>
