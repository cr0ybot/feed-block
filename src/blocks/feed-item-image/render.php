<?php
/**
 * Block: feed-item-image, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

if ( ( ! isset( $block->context['image'] ) || empty( $block->context['image'] ) && ( empty( $attributes['placeholderURL'] ) ) ) ) {
	return;
}

$image_url        = $block->context['image'];
$placeholder_attr = '';
if ( empty( $image_url ) ) {
	$image_url        = $attributes['placeholderURL'];
	$placeholder_attr = 'data-placeholder="true"';
}

$wrapper_attributes = get_block_wrapper_attributes();
?>

<figure <?php echo $wrapper_attributes; ?>>
	<img src="<?php echo esc_url( $image_url ); ?>" alt="" <?php echo $placeholder_attr; ?> />
</figure>
