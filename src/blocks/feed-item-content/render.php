<?php
/**
 * Block: feed-item-content, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

$contentTypeMap = array(
	'text' => 'content_text',
	'html' => 'content_html',
	'htmlNoImg' => 'content_html_noimg',
);

$custom_tag     = is_array( $attributes['customTag'] ) && count( $attributes['customTag'] ) === 2 ? $attributes['customTag'] : false;
$custom_tagname = $custom_tag ? $custom_tag[1] : false;
$custom_content = $custom_tag ? $block->context['feed-block/item/custom'][ $custom_tag[0] ][ $custom_tag[1] ] : false;

$content = $custom_content
	? (
		'htmlNoImg' === $attributes['contentType']
			? preg_replace( '/<img[^>]*>/g', '', $custom_content )
			: $custom_content
	) : $block->context[ 'feed-block/item/' . $contentTypeMap[ $attributes['contentType'] ] ];
if ( 'text' === $attributes['contentType'] ) {
	$content = wp_strip_all_tags( $content );
}

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

$atts = array(
	'class' => $align_class_name,
);
if ( $custom_tagname ) {
	$atts['data-feed-tag'] = $custom_tagname;
}
$wrapper_attributes = get_block_wrapper_attributes( $atts );
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php echo wp_kses_post( $content ); ?>
</div>
