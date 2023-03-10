<?php
/**
 * Utilities.
 *
 * @package feed-loop
 */

namespace FeedLoop\Util;

/**
 * Generate markup for the HTML element that will be used for the overlay.
 *
 * @param array $attributes Block attributes.
 *
 * @return string HTML markup in string format.
 */
function get_block_feed_item_image_overlay_element_markup( $attributes ) {
	$has_dim_background  = isset( $attributes['dimRatio'] ) && $attributes['dimRatio'];
	$has_gradient        = isset( $attributes['gradient'] ) && $attributes['gradient'];
	$has_custom_gradient = isset( $attributes['customGradient'] ) && $attributes['customGradient'];
	$has_solid_overlay   = isset( $attributes['overlayColor'] ) && $attributes['overlayColor'];
	$has_custom_overlay  = isset( $attributes['customOverlayColor'] ) && $attributes['customOverlayColor'];
	$class_names         = array( 'wp-block-post-featured-image__overlay' );
	$styles              = array();

	if ( ! $has_dim_background ) {
		return '';
	}

	// Apply border classes and styles.
	$border_attributes = get_block_border_attributes( $attributes );

	if ( ! empty( $border_attributes['class'] ) ) {
		$class_names[] = $border_attributes['class'];
	}

	if ( ! empty( $border_attributes['style'] ) ) {
		$styles[] = $border_attributes['style'];
	}

	// Apply overlay and gradient classes.
	if ( $has_dim_background ) {
		$class_names[] = 'has-background-dim';
		$class_names[] = "has-background-dim-{$attributes['dimRatio']}";
	}

	if ( $has_solid_overlay ) {
		$class_names[] = "has-{$attributes['overlayColor']}-background-color";
	}

	if ( $has_gradient || $has_custom_gradient ) {
		$class_names[] = 'has-background-gradient';
	}

	if ( $has_gradient ) {
		$class_names[] = "has-{$attributes['gradient']}-gradient-background";
	}

	// Apply background styles.
	if ( $has_custom_gradient ) {
		$styles[] = sprintf( 'background-image: %s;', $attributes['customGradient'] );
	}

	if ( $has_custom_overlay ) {
		$styles[] = sprintf( 'background-color: %s;', $attributes['customOverlayColor'] );
	}

	return sprintf(
		'<span class="%s" style="%s" aria-hidden="true"></span>',
		esc_attr( implode( ' ', $class_names ) ),
		esc_attr( safecss_filter_attr( implode( ' ', $styles ) ) )
	);
}

/**
 * Generates class names and styles to apply the border support styles
 *
 * @param array $attributes The block attributes.
 * @return array The border-related classnames and styles for the block.
 */
function get_block_border_attributes( $attributes ) {
	$border_styles = array();
	$sides         = array( 'top', 'right', 'bottom', 'left' );

	// Border radius.
	if ( isset( $attributes['style']['border']['radius'] ) ) {
		$border_styles['radius'] = $attributes['style']['border']['radius'];
	}

	// Border style.
	if ( isset( $attributes['style']['border']['style'] ) ) {
		$border_styles['style'] = $attributes['style']['border']['style'];
	}

	// Border width.
	if ( isset( $attributes['style']['border']['width'] ) ) {
		$border_styles['width'] = $attributes['style']['border']['width'];
	}

	// Border color.
	$preset_color           = array_key_exists( 'borderColor', $attributes ) ? "var:preset|color|{$attributes['borderColor']}" : null;
	$custom_color           = _wp_array_get( $attributes, array( 'style', 'border', 'color' ), null );
	$border_styles['color'] = $preset_color ? $preset_color : $custom_color;

	// Individual border styles e.g. top, left etc.
	foreach ( $sides as $side ) {
		$border                 = _wp_array_get( $attributes, array( 'style', 'border', $side ), null );
		$border_styles[ $side ] = array(
			'color' => isset( $border['color'] ) ? $border['color'] : null,
			'style' => isset( $border['style'] ) ? $border['style'] : null,
			'width' => isset( $border['width'] ) ? $border['width'] : null,
		);
	}

	$styles     = wp_style_engine_get_styles( array( 'border' => $border_styles ) );
	$attributes = array();
	if ( ! empty( $styles['classnames'] ) ) {
		$attributes['class'] = $styles['classnames'];
	}
	if ( ! empty( $styles['css'] ) ) {
		$attributes['style'] = $styles['css'];
	}
	return $attributes;
}
