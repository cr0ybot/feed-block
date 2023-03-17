/**
 * Block: feed-item-title, edit.
 */

import classnames from 'classnames';
import DOMPurify from 'dompurify';

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
	attributes: { customTag, level, textAlign, isLink },
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
	const customTagname = customTag.length === 2 ? customTag[ 1 ] : false;
	if ( customTagname ) {
		atts[ 'data-tag' ] = customTagname;
	}
	const blockProps = useBlockProps( atts );

	// Set up title content.
	const customContent =
		customTag.length === 2
			? custom[ customTag[ 0 ] ][ customTag[ 1 ] ]
			: title;
	const content =
		customContent && customContent !== ''
			? DOMPurify.sanitize( unescape( customContent ), {
					ALLOWED_TAGS: [],
			  } )
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
						selected={ customTag }
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
