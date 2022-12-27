<?php
/**
 * Block: feed-item-summary, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

if ( ! isset( $block->context['summary'] ) || empty( $block->context['summary'] ) ) {
	return;
}

$content = $block->context['summary'];
if ( $attributes['constrainLength'] ) {
	$content = wp_trim_words( $content, $attributes['summaryLength'] );
}

$readMoreLink = '';
if ( $attributes['showMore'] && ! empty( $attributes['moreText'] ) ) {
	$rel   = ! empty( $block->context['rel'] ) ? 'rel="' . esc_attr( $block->context['rel'] ) . '"' : '';
	$readMoreLink = sprintf(
		'<a href="%1$s" class="wp-block-feed-loop-feed-item-summary__more-link" target="%2$s" %3$s>%4$s</a>',
		esc_url( $block->context['url'] ),
		esc_attr( $block->context['linkTarget'] ?? '_blank' ),
		$rel,
		esc_html( $attributes['moreText'] )
	);
}

$align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );
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
	<p><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php echo $readMoreLink; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
<?php
	endif;
endif;
?>
</div>
