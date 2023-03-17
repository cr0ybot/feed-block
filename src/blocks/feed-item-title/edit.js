/**
 * Block: feed-item-title, edit.
 */

import classnames from 'classnames';

import { unescape } from 'lodash';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import CustomTagSelect from '../../common/components/custom-tag-select';

import HeadingLevelDropdown from './heading-level-dropdown';

export default function Edit( {
	attributes: { tag, level, textAlign, isLink },
	setAttributes,
	context: { custom, title, url, rel, linkTarget },
} ) {
	const Tag = 0 === level ? 'p' : `h${ level }`;

	// Set up block props.
	const atts = {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	};
	const tagName = tag.length === 2 ? tag[ 1 ] : '';
	if ( tagName !== '' ) {
		atts[ 'data-tag' ] = tagName;
	}
	const blockProps = useBlockProps( atts );

	// Set up title content.
	const tagContent =
		tag.length === 2 ? custom[ tag[ 0 ] ][ tag[ 1 ] ] : title;
	const content =
		tagContent && tagContent !== ''
			? unescape( tagContent )
			: __( '<Feed Item Title>' );
	let titleElement = <Tag { ...blockProps }>{ content }</Tag>;
	if ( isLink && url ) {
		titleElement = (
			<Tag { ...blockProps }>
				<a
					href={ url }
					rel={ rel }
					target={ linkTarget }
					onClick={ ( event ) => event.preventDefault() }
				>
					{ content }
				</a>
			</Tag>
		);
	}

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					selectedLevel={ level }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
				/>
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Content Settings', 'feed-block' ) }>
					<CustomTagSelect
						custom={ custom }
						onChange={ ( tag ) => setAttributes( { tag } ) }
						selected={ tag }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Link Settings', 'feed-block' ) }>
					<ToggleControl
						label={ __( 'Make title a link', 'feed-block' ) }
						description={ __(
							'Link settings can be found on the main Feed Loop block.',
							'feed-block'
						) }
						checked={ isLink }
						onChange={ ( nextIsLink ) => {
							setAttributes( { isLink: nextIsLink } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			{ titleElement }
		</>
	);
}
