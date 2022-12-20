<?php
/**
 * RSS Block AJAX endpoints.
 *
 * @package rss-block
 */

namespace RSSBlock\AJAX;

/**
 * Fetches an RSS feed contents. Admin only.
 */
function get_feed_action() {
	check_ajax_referer( 'rss-block' );

	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error( 'Unauthorized' );
	}

	$url = filter_input( INPUT_POST, 'url', FILTER_SANITIZE_URL );

	if ( ! $url ) {
		wp_send_json_error( 'Invalid URL' );
	}

	$feed = fetch_feed( $url );

	if ( is_wp_error( $feed ) ) {
		wp_send_json_error( $feed->get_error_message() );
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
				// 'external_url' => $item->get_permalink(),
				'title'              => $feed_item->get_title(),
				'content_html'       => $feed_item->get_content(),
				'content_html_noimg' => $feed_item->get_content(),
				'content_text'       => wp_strip_all_tags( $feed_item->get_content() ),
				'summary'            => wp_strip_all_tags( $feed_item->get_description() ),
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
			$dom->loadHTML( $feed_item->get_content() );
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

			$json['items'][] = $item;
		}
	}

	wp_send_json_success( $json );
}
add_action( 'wp_ajax_rss_block_get_feed', __NAMESPACE__ . '\\get_feed_action' );
