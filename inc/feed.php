<?php
/**
 * Feed Loop feed utilities.
 *
 * @package feed-loop
 */

namespace FeedLoop\Feed;

/**
 * Fetches an Feed Loop contents and returns a JSONFeed-compatible array.
 *
 * @param string $url The feed URL.
 * @return array
 */
function get_feed( $url ) {
	$feed = fetch_feed( $url );

	if ( is_wp_error( $feed ) ) {
		// Return the error object.
		return $feed;
	}

	/**
	 * Build an array in the format of JSONFeed v1.1.
	 *
	 * @link https://www.jsonfeed.org/version/1.1/
	 */
	$json = array(
		'version'       => 'https://jsonfeed.org/version/1.1',
		'title'         => $feed->get_title(),
		'description'   => $feed->get_description(),
		'feed_url'      => $feed->get_permalink(),
		'home_page_url' => $feed->get_base(),
		'icon'          => $feed->get_image_url(),
		'authors'       => array(),
		'language'      => $feed->get_language(),
		'items'         => array(),
	);

	// Populate authors, if any.
	$authors = $feed->get_authors();
	if ( ! empty( $authors ) ) {
		foreach ( $authors as $author ) {
			$json['authors'][] = array(
				'name'  => $author->get_name(),
				'url'   => $author->get_link(),
				'email' => $author->get_email(),
			);
		}
	}

	// Populate items.
	$items = $feed->get_items();
	if ( ! empty( $items ) ) {
		foreach ( $items as $feed_item ) {
			$item = array(
				'id'                 => $feed_item->get_id(),
				'url'                => $feed_item->get_permalink(),
				// 'external_url' => $item->get_permalink(), // Doesn't really have an RSS equivalent.
				'title'              => wp_strip_all_tags(
					wp_specialchars_decode(
						$feed_item->get_title()
					)
				),
				'content_html'       => $feed_item->get_content(),
				'content_html_noimg' => $feed_item->get_content(),
				'content_text'       => wp_specialchars_decode( wp_strip_all_tags( $feed_item->get_content() ) ),
				'summary'            => wp_specialchars_decode( wp_strip_all_tags( $feed_item->get_description() ) ),
				'image'              => '',
				'date_published'     => $feed_item->get_date( 'c' ),
				'date_modified'      => $feed_item->get_updated_date( 'c' ),
				'authors'            => array(),
				'tags'               => array(),
			);

			// Populate authors.
			$item_authors = $feed_item->get_authors();
			if ( ! empty( $item_authors ) ) {
				foreach ( $item_authors as $author ) {
					$item['authors'][] = array(
						'name'  => $author->get_name(),
						'url'   => $author->get_link(),
						'email' => $author->get_email(),
					);
				}
			}

			// Populate tags.
			$item_categories = $feed_item->get_categories();
			if ( ! empty( $item_categories ) ) {
				foreach ( $item_categories as $category ) {
					$item['tags'][] = $category->get_label();
				}
			}

			// Find the first image in the content.
			// TODO: handle enclosures?
			$image = false;
			$dom   = new \DOMDocument();
			// Must convert encoding, or otherwise will be interpreted as ISO-8859-1 https://stackoverflow.com/a/28502287/900971
			$dom->loadHTML( mb_convert_encoding( $feed_item->get_content(), 'HTML-ENTITIES', $feed->get_encoding() ?? 'UTF-8' ) );
			$images = $dom->getElementsByTagName( 'img' );
			if ( $images->length ) {
				$image = $images->item( 0 )->getAttribute( 'src' );
			}
			if ( $image ) {
				// Save img URL.
				$item['image'] = $image;

				// If an image is found, remove all img tags.
				while ( $images->length > 0 ) {
					$img = $images->item( 0 );
					$img->parentNode->removeChild( $img );
				}

				// Add noimg value.
				$item['content_html_noimg'] = preg_replace( '/<img[^>]+\>/i', '', $dom->saveHTML() );
			}

			/**
			 * Filters the feed item array.
			 *
			 * @since 0.1.0
			 *
			 * @param array $item The feed item array.
			 * @param \SimplePie_Item $feed_item The feed item object.
			 * @return array
			 */
			$json['items'][] = apply_filters( 'feed_loop_feed_item', $item, $feed_item );
		}
	}

	/**
	 * Filters the feed array.
	 *
	 * @since 0.1.0
	 *
	 * @param array $json The feed array.
	 * @param \SimplePie $feed The feed object.
	 * @return array
	 */
	return apply_filters( 'feed_loop_feed', $json, $feed );
}
