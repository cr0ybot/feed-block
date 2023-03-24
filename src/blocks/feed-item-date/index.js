/**
 * Block: feed-item-date.
 */

import { registerBlockType } from '@wordpress/blocks';

import { postDate as icon } from '@wordpress/icons';

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
