/**
 * Block: feed-item-image.
 */

import { registerBlockType } from '@wordpress/blocks';

import { postFeaturedImage as icon } from '@wordpress/icons';

import './style.scss';
import './editor.scss';

import metadata from './block.json';
import edit from './edit';

registerBlockType( metadata.name, {
	icon,
	/**
	 * @see ./edit.js
	 */
	edit,
} );
