<?php
/**
 * Block: feed-item-date, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

use function FeedBlock\Util\get_block_border_attributes;

if ( ! isset( $attributes['contentType'] ) || empty( $block->context['custom'] ) ) {
	return;
}

$datetime_format = array(
	'datetime' => 'c',
	'date'     => 'Y-m-d',
	'time'     => 'H:i:s',
);

$el       = 'div';
$feed_tag = is_array( $attributes['tag'] ) && count( $attributes['tag'] ) === 2 ? $attributes['tag'] : false;
$content  = $feed_tag ? $block->context['custom'][ $feed_tag[0] ][ $feed_tag[1] ] : '';

$attr          = get_block_border_attributes( $attributes );
$attr['class'] = implode(
	' ',
	array(
		$attr['class'] ?? null,
		empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}",
	)
);

switch ( $attributes['contentType'] ) {
	case 'text':
		$content = wp_specialchars_decode( wp_strip_all_tags( $content ) );
		// Handle contentLength.
		if ( $attributes['constrainLength'] && ! empty( $attributes['textLength'] ) ) {
			$content = wp_trim_words( $content, $attributes['textLength'] );
		}
		break;
	case 'html_noimg':
		$content = preg_replace( '/<img[^>]+\>/i', '', $content );
		break;
	case 'datetime':
		$el = 'time';
		// Handle datetime formatting with dateInputFormat, dateDisplayFormat, and dateType.
		$datetime         = DateTime::createFromFormat( $attributes['dateInputFormat'], $content );
		$attr['datetime'] = $datetime->format( $datetime_format[ $attributes['dateType'] ] );
		$content          = $datetime->format( $attributes['dateDisplayFormat'] );
		break;
}

$wrapper_attributes = get_block_wrapper_attributes( $attr );

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	$el,
	$wrapper_attributes,
	$content
);
