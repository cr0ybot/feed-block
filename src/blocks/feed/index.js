/**
 * Block: feed.
 */

import { registerBlockType } from '@wordpress/blocks';

import icon from '../../icons/feed-block';

import './style.scss';
import './editor.scss';

import metadata from './block.json';
import edit from './edit';
import save from './save';

registerBlockType( metadata, {
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
