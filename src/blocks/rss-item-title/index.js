/**
 * Block: rss-item-title.
 */

import { registerBlockType } from '@wordpress/blocks';

import { title as icon } from '@wordpress/icons';

import './style.scss';
import './editor.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	icon,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
} );
