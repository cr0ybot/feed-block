<?php
/**
 * Block: feed-item-date, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

use function FeedBlock\Util\get_block_border_attributes;

$datetime_format = array(
	'datetime' => 'c',
	'date'     => 'Y-m-d',
	'time'     => 'H:i:s',
);

$is_custom_tag = false;
$custom_tag = false;
$custom_tagname = false;
$custom_content = false;
if ( is_array( $attributes['customTag'] ) && ! empty( $attributes['customTag'] ) ) {
	$is_custom_tag = count( $attributes['customTag'] ) === 2;
	$custom_tag = $attributes['customTag'];
	$custom_tagname = $is_custom_tag ? $attributes['customTag'][1] : $attributes['customTag'][0];
	$custom_content = $is_custom_tag ? $block->context['custom'][ $custom_tag[0] ][ $custom_tag[1] ] : $block->context[ $custom_tag[0] ];
}

$default_input_format = $attributes['dateType'] === 'datetime' ? $datetime_format['date'] . ' ' . $datetime_format['time'] : $datetime_format[ $attributes['dateType'] ];

$default_display_format = $attributes['dateType'] === 'time'
	? get_option( 'time_format' )
	: ( $attributes['dateType'] === 'date'
		? get_option( 'date_format' )
		: get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) );

$custom_input_format = $attributes['inputFormat'] ?: $default_input_format;
// Note: when using default date_published/date_modified, input is ATOM format.
$input_format = $is_custom_tag ? $custom_input_format : DateTIme::ATOM;
$display_format = $attributes['displayFormat'] ?: $default_display_format;

$atts          = get_block_border_attributes( $attributes );
$atts['class'] = implode(
	' ',
	array(
		$atts['class'] ?? null,
		empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}",
	)
);
if ( $custom_tagname ) {
	$atts['data-feed-tag'] = $custom_tagname;
}

// Handle datetime formatting with inputFormat, displayFormat, and dateType.
$content  = '';
$datetime = DateTime::createFromFormat( $input_format, $custom_content );
if ( $datetime ) {
	$atts['datetime'] = $datetime->format( $datetime_format[ $attributes['dateType'] ] );
	$content          = $is_custom_tag
		? $datetime->format( $display_format ) // Date without timezone info.
		: wp_date( $display_format, $datetime->getTimestamp() ); // Localized date.
}
else {
	$content = $custom_content;
}

if ( $content === '' ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( $atts );

printf(
	'<time %1$s>%2$s</time>',
	$wrapper_attributes,
	esc_html( $content )
);
