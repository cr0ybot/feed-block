<?php
/**
 * Block: feed-item-image, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

use function FeedBlock\Util\get_block_feed_item_image_overlay_element_markup;
use function FeedBlock\Util\get_block_border_attributes;
use function FeedBlock\Util\get_img_url;

$custom_tag     = is_array( $attributes['customTag'] ) && count( $attributes['customTag'] ) === 2 ? $attributes['customTag'] : false;
$custom_tagname = $custom_tag ? $custom_tag[1] : false;
$custom_content = $custom_tag ? $block->context['feed-block/item/custom'][ $custom_tag[0] ][ $custom_tag[1] ] : false;

$img_url = '';
if ( $custom_content ) {
	if ( $attributes['urlFromContent'] ) {
		$img_url = $custom_content;
	} else {
		$img_url = get_img_url( $custom_content );
	}
} else {
	$img_url = $block->context['feed-block/item/image'];
}
// @see https://cmljnelson.blog/2018/08/31/url-validation-in-wordpress/
if ( esc_url_raw( $img_url ) !== $img_url ) {
	$img_url = '';
}

// If there is no image or placeholder, return early.
if ( empty( $img_url) && empty( $attributes['placeholderURL'] ) ) {
	return;
}

$atts = array();
if ( empty( $img_url ) ) {
	$img_url                = $attributes['placeholderURL'];
	$atts['data-placeholder'] = 'true';
}

if ( $custom_tagname ) {
	$atts['data-feed-tag'] = $custom_tagname;
}

$is_link        = isset( $attributes['isLink'] ) && $attributes['isLink'];
$size_slug      = isset( $attributes['sizeSlug'] ) ? $attributes['sizeSlug'] : 'post-thumbnail';
$img_atts       = get_block_border_attributes( $attributes );
$overlay_markup = get_block_feed_item_image_overlay_element_markup( $attributes );

if ( $is_link ) {
	$img_atts['alt'] = $block->context['feed-block/item/title'];
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
	$img_atts['style'] = empty( $img_atts['style'] ) ? $extra_styles : $img_atts['style'] . $extra_styles;
}

$img_atts      = array_map( 'esc_attr', $img_atts );
$img_atts_html = '';
foreach ( $img_atts as $name => $value ) {
	$img_atts_html .= " $name=" . '"' . $value . '"';
}

$item_image = sprintf( '<img src="%1$s" %2$s />', esc_url( $img_url ), $img_atts_html );

if ( $is_link ) {
	$rel        = ! empty( $block->context['feed-block/rel'] ) ? 'rel="' . esc_attr( $block->context['feed-block/rel'] ) . '"' : '';
	$height     = ! empty( $attributes['height'] ) ? 'style="' . esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . '"' : '';
	$item_image = sprintf(
		'<a href="%1$s" target="%2$s" %3$s %4$s>%5$s%6$s</a>',
		esc_url( $img_url ),
		esc_attr( $block->context['feed-block/linkTarget'] ),
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
	$wrapper_attributes = get_block_wrapper_attributes( $atts );
} else {
	$wrapper_attributes = get_block_wrapper_attributes( array_merge( $atts, array( 'style' => $aspect_ratio . $width . $height ) ) );
}
?>

<figure <?php echo $wrapper_attributes; ?>>
	<?php echo $item_image; ?>
</figure>
