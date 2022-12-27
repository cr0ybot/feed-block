<?php
/**
 * Block: feed-item-template, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-loop
 */

use function FeedLoop\Feed\get_feed;

$feed = get_feed( $block->context['feedURL'] );

if ( is_wp_error( $feed ) ) {
	if ( WP_DEBUG ) {
		error_log( 'Feed Loop: ' . $feed->get_error_message() . " ({$block->context['feedURL']})" ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}
	return;
}

$classnames = '';
if ( isset( $block->context['displayLayout'] ) ) {
	if ( isset( $block->context['displayLayout']['type'] ) && 'flex' === $block->context['displayLayout']['type'] ) {
		$classnames = "is-flex-container columns-{$block->context['displayLayout']['columns']}";
	}
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classnames ) );
?>

<ul <?php echo $wrapper_attributes; ?>>
<?php
for ( $i = 0; $i < $block->context['itemsToShow']; $i++ ) :
	$item = $feed['items'][ $i ];

	error_log( print_r( $item, true ) );

	// Get an instance of the current Feed Item Template block.
	$block_instance = $block->parsed_block;

	// Set the block name to one that does not correspond to an existing registered block.
	// This ensures that for the inner instances of the Feed Item Template block, we do not render any block supports.
	$block_instance['blockName'] = 'core/null';

	// Render the inner blocks of the Feed Item Template block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = (
		new WP_Block(
			$block_instance,
			$item,
		)
	)->render( array( 'dynamic' => false ) );

	// Wrap the render inner blocks in a `li` element with the appropriate post classes.
	$item_classes = 'wp-block-feed-loop-feed-item';
	?>
	<li class="<?php echo esc_attr( $item_classes ); ?>">
		<?php echo $block_content; ?>
	</li>
	<?php
endfor;
?>
</ul>
