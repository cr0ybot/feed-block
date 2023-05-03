/**
 * Block: feed-item-content, edit.
 */

import classnames from 'classnames';
import DOMPurify from 'dompurify';

import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

import CustomTagSelect from '../../components/custom-tag-select';

const contentTypeMap = {
	html: 'content_html',
	htmlNoImg: 'content_html_noimg',
	text: 'content_text',
};

export default function Edit( {
	attributes: { customTag, textAlign, contentType },
	setAttributes,
	context,
} ) {
	const { 'feed-block/item/custom': custom } = context;

	// Set up block props.
	const atts = {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	};
	const customTagname = customTag.length === 2 ? customTag[ 1 ] : false;
	if ( customTagname ) {
		atts[ 'data-feed-tag' ] = customTagname;
	}
	const blockProps = useBlockProps( atts );

	const customContent =
		customTag.length === 2
			? custom[ customTag[ 0 ] ][ customTag[ 1 ] ]
			: false;
	console.log( { customContent } );
	const content =
		customContent !== false
			? contentType === 'htmlNoImg'
				? customContent.replace( /<img[^>]*>/g, '' )
				: customContent
			: context[ `feed-block/item/${ contentTypeMap[ contentType ] }` ];
	let contentElement = (
		<div { ...blockProps }>
			{ __( '<Feed Item Content: %s>', 'feed-block' ).replace(
				'%s',
				customTagname ? customTag[ 1 ] : 'default'
			) }
		</div>
	);
	if ( content && content !== '' ) {
		if ( contentType === 'text' ) {
			contentElement = (
				<div { ...blockProps }>
					{ decodeEntities(
						DOMPurify.sanitize( content, {
							ALLOWED_TAGS: [],
						} )
					) }
				</div>
			);
		} else {
			contentElement = (
				<div
					{ ...blockProps }
					dangerouslySetInnerHTML={ { __html: content } }
				/>
			);
		}
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Content Settings' ) }>
					<CustomTagSelect
						custom={ custom }
						onChange={ ( newCustomTag ) =>
							setAttributes( { customTag: newCustomTag } )
						}
						selected={ customTag }
					/>
					<SelectControl
						label={ __( 'Content Type' ) }
						value={ contentType }
						options={ [
							{
								label: __( 'Plain Text' ),
								value: 'text',
							},
							{ label: __( 'HTML' ), value: 'html' },
							{
								label: __( 'HTML (images removed)' ),
								value: 'htmlNoImg',
							},
						] }
						onChange={ ( nextType ) => {
							setAttributes( { contentType: nextType } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			{ contentElement }
		</>
	);
}
