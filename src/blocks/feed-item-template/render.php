<?php
/**
 * Block: feed-item-template, render.
 *
 * Global vars: $attributes, $content, $block.
 *
 * @package feed-block
 */

namespace FeedBlock\Blocks\FeedItemTemplate;

use function FeedBlock\Feed\get_feed;

$feed = get_feed( $block->context['feed-block/feedURL'] );

if ( is_wp_error( $feed ) ) {
	if ( WP_DEBUG ) {
		error_log( 'Feed Loop: ' . $feed->get_error_message() . " ({$block->context['feed-block/feedURL']})" ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}
	return;
}

if ( empty( $feed['items'] ) ) {
	if ( WP_DEBUG ) {
		error_log( 'Feed Loop: No items found in feed ' . " ({$block->context['feed-block/feedURL']})" ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}
	return;
}

$classnames = '';
if ( isset( $block->context['feed-block/displayLayout'] ) ) {
	if ( isset( $block->context['feed-block/displayLayout']['type'] ) && 'flex' === $block->context['feed-block/displayLayout']['type'] ) {
		$classnames = "is-flex-container columns-{$block->context['feed-block/displayLayout']['columns']}";
	}
}

$wrapper_attributes = \get_block_wrapper_attributes( array( 'class' => $classnames ) );
?>

<ul <?php echo $wrapper_attributes; ?>>
<?php
// Get the number of items available.
$item_count = count( $feed['items'] );

// Loop through the items to be displayed.
for ( $i = 0; $i < $block->context['feed-block/itemsToShow'] && $i < $item_count; $i++ ) :
	$item = $feed['items'][ $i ];

	// Namespace each property of the item with `feed-block/item/`.
	$item = array_combine(
		array_map(
			function( $key ) {
				return 'feed-block/item/' . $key;
			},
			array_keys( $item )
		),
		$item
	);

	// Provide all additional context from parent block.
	$item = array_merge(
		$item,
		array(
			'feed-block/feedURL' => $block->context['feed-block/feedURL'],
			'feed-block/itemLinkRel' => $block->context['feed-block/itemLinkRel'],
			'feed-block/itemLinkTarget' => $block->context['feed-block/itemLinkTarget'],
		)
	);

	// Get an instance of the current Feed Item Template block.
	$block_instance = $block->parsed_block;

	// Set the block name to one that does not correspond to an existing registered block.
	// This ensures that for the inner instances of the Feed Item Template block, we do not render any block supports.
	$block_instance['blockName'] = 'core/null';

	// Render the inner blocks of the Feed Item Template block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = (
		new \WP_Block( $block_instance, $item )
	)->render( array( 'dynamic' => false ) );

	// Wrap the render inner blocks in a `li` element with the appropriate post classes.
	$item_classes = 'wp-block-feed-block-feed-item';
	?>
	<li class="<?php echo esc_attr( $item_classes ); ?>">
		<?php echo $block_content; ?>
	</li>
	<?php
endfor;
?>
</ul>
