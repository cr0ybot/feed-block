<?php
/**
 * Block: feed-item-image, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

use function FeedLoop\Util\get_block_feed_item_image_overlay_element_markup;
use function FeedLoop\Util\get_block_border_attributes;

if ( ( ! isset( $block->context['image'] ) || empty( $block->context['image'] ) && ( empty( $attributes['placeholderURL'] ) ) ) ) {
	return;
}

$image_url          = $block->context['image'];
$wrapper_attributes = array();
if ( empty( $image_url ) ) {
	$image_url                              = $attributes['placeholderURL'];
	$wrapper_attributes['data-placeholder'] = 'true';
}

$is_link        = isset( $attributes['isLink'] ) && $attributes['isLink'];
$size_slug      = isset( $attributes['sizeSlug'] ) ? $attributes['sizeSlug'] : 'post-thumbnail';
$attr           = get_block_border_attributes( $attributes );
$overlay_markup = get_block_feed_item_image_overlay_element_markup( $attributes );

if ( $is_link ) {
	$attr['alt'] = $block->context['title'];
}

$extra_styles = '';

// Aspect ratio with a height set needs to override the default width/height.
if ( ! empty( $attributes['aspectRatio'] ) ) {
	$extra_styles .= 'width:100%;height:100%;';
} elseif ( ! empty( $attributes['height'] ) ) {
	$extra_styles .= "height:{$attributes['height']};";
}

if ( ! empty( $attributes['scale'] ) ) {
	$extra_styles .= "object-fit:{$attributes['scale']};";
}

if ( ! empty( $extra_styles ) ) {
	$attr['style'] = empty( $attr['style'] ) ? $extra_styles : $attr['style'] . $extra_styles;
}

$attr      = array_map( 'esc_attr', $attr );
$attr_html = '';
foreach ( $attr as $name => $value ) {
	$attr_html .= " $name=" . '"' . $value . '"';
}

$item_image = sprintf( '<img src="%1$s" %2$s />', esc_url( $image_url ), $attr_html );

if ( $is_link ) {
	$rel        = ! empty( $block->context['rel'] ) ? 'rel="' . esc_attr( $block->context['rel'] ) . '"' : '';
	$height     = ! empty( $attributes['height'] ) ? 'style="' . esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . '"' : '';
	$item_image = sprintf(
		'<a href="%1$s" target="%2$s" %3$s %4$s>%5$s%6$s</a>',
		esc_url( $image_url ),
		esc_attr( $block->context['linkTarget'] ),
		$rel,
		$height,
		$item_image,
		$overlay_markup
	);
} else {
	$item_image = $item_image . $overlay_markup;
}

// TODO: aspect-ratio is not yet supported by safecss_filter_attr().
$aspect_ratio = ! empty( $attributes['aspectRatio'] )
	? esc_attr( 'aspect-ratio:' . $attributes['aspectRatio'] . ';' )
	: '';
$width        = ! empty( $attributes['width'] )
	? esc_attr( safecss_filter_attr( 'width:' . $attributes['width'] ) . ';' )
	: '';
$height       = ! empty( $attributes['height'] )
	? esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) . ';' )
	: '';

if ( ! $height && ! $width && ! $aspect_ratio ) {
	$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attributes );
} else {
	$wrapper_attributes = get_block_wrapper_attributes( array_merge( $wrapper_attributes, array( 'style' => $aspect_ratio . $width . $height ) ) );
}
?>

<figure <?php echo $wrapper_attributes; ?>>
	<?php echo $item_image; ?>
</figure>
