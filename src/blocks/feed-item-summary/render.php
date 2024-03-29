<?php
/**
 * Block: feed-item-summary, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

$custom_tag     = is_array( $attributes['customTag'] ) && count( $attributes['customTag'] ) === 2 ? $attributes['customTag'] : false;
$custom_tagname = $custom_tag ? $custom_tag[1] : false;
$custom_content = $custom_tag ? $block->context['feed-block/item/custom'][ $custom_tag[0] ][ $custom_tag[1] ] : false;

$content = wp_strip_all_tags( $custom_content ? $custom_content : $block->context['feed-block/item/summary'] );
if ( $attributes['constrainLength'] ) {
	$content = wp_trim_words( $content, $attributes['summaryLength'] );
}

$readMoreLink = '';
if ( $attributes['showMore'] && ! empty( $attributes['moreText'] ) ) {
	$rel          = ! empty( $block->context['feed-block/itemLinkRel'] ) ? 'rel="' . esc_attr( $block->context['feed-block/itemLinkRel'] ) . '"' : '';
	$readMoreLink = sprintf(
		'<a href="%1$s" class="wp-block-feed-block-feed-item-summary__more-link" target="%2$s" %3$s>%4$s</a>',
		esc_url( $block->context['feed-block/item/url'] ),
		esc_attr( $block->context['feed-block/itemLinkTarget'] ?? '_blank' ),
		$rel,
		esc_html( $attributes['moreText'] )
	);
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
<?php
if ( ! $attributes['showMore'] ) :
	echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
else :
	if ( $attributes['showMoreOnNewLine'] ) :
		?>
	<p><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
	<p><?php echo $readMoreLink; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
		<?php
	else :
		?>
	<p><?php echo esc_html( $content ); ?> <?php echo $readMoreLink; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
		<?php
	endif;
endif;
?>
</div>
