/**
 * Block: rss-item-template.
 */

import { registerBlockType } from '@wordpress/blocks';

import { layout as icon } from '@wordpress/icons';

import './style.scss';
import './editor.scss';

import metadata from './block.json';
import edit from './edit';
import save from './save';

registerBlockType( metadata.name, {
	icon,
	/**
	 * @see ./edit.js
	 */
	edit,
	/**
	 * @see ./save.js
	 */
	save,
} );
