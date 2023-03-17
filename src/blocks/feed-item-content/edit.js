/**
 * Block: feed-item-content, edit.
 */

import classnames from 'classnames';

import { unescape } from 'lodash';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( {
	attributes: { textAlign, contentType },
	setAttributes,
	context,
} ) {
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );
	const content =
		context[ contentType ] !== ''
			? context[ contentType ]
			: __( '(Feed Item Content)' );
	let contentElement = (
		<div { ...blockProps }>
			{ __( '(Feed Item Content)', 'feed-block' ) }
		</div>
	);
	if ( content && content !== '' ) {
		if ( contentType === 'content_text' ) {
			contentElement = (
				<div { ...blockProps }>{ unescape( content ) }</div>
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
					<SelectControl
						label={ __( 'Content Type' ) }
						value={ contentType }
						options={ [
							{ label: __( 'HTML' ), value: 'content_html' },
							{
								label: __( 'HTML (images removed)' ),
								value: 'content_html_noimg',
							},
							{
								label: __( 'Plain Text' ),
								value: 'content_text',
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
