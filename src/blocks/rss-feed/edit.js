/**
 * Block: rss-feed, edit.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit() {
	return (
		<p { ...useBlockProps() }>
			{ __( 'Rss Block – hello from the editor!', 'rss-block' ) }
		</p>
	);
}
