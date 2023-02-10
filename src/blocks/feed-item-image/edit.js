/**
 * Block: feed-item-image, edit.
 */

import classnames from 'classnames';

import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Placeholder,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import DimensionControls from './dimension-controls';
import Overlay from './overlay';

function ImageDisplay( {
	clientId,
	attributes,
	setAttributes,
	context: { image, url, rel, linkTarget },
} ) {
	const { isLink, height, width, scale } = attributes;
	const blockProps = useBlockProps( {
		style: {
			width,
			height,
		},
	} );
	const borderProps = useBorderProps( attributes );

	const placeholder = ( content ) => {
		return (
			<Placeholder
				className={ classnames(
					'block-editor-media-placeholder',
					borderProps.className
				) }
				withIllustration={ true }
				style={ borderProps.style }
			>
				{ content }
			</Placeholder>
		);
	};

	const controls = (
		<>
			<DimensionControls
				clientId={ clientId }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<InspectorControls>
				<PanelBody title={ __( 'Link Settings', 'feed-loop' ) }>
					<ToggleControl
						label={ __( 'Make image a link', 'feed-loop' ) }
						description={ __(
							'Link settings can be found on the main Feed Loop block.',
							'feed-loop'
						) }
						checked={ isLink }
						onChange={ ( nextIsLink ) => {
							setAttributes( { isLink: nextIsLink } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);

	const imageStyles = {
		...borderProps.style,
		height,
		objectFit: height && scale,
	};

	if ( ! image || image === '' ) {
		return (
			<>
				{ controls }
				<div { ...blockProps }>
					{ placeholder() }
					<Overlay
						attributes={ attributes }
						setAttributes={ setAttributes }
						clientId={ clientId }
					/>
				</div>
			</>
		);
	}

	return (
		<>
			{ controls }
			<figure { ...blockProps }>
				<img
					className={ borderProps.className }
					src={ image }
					alt=""
					style={ imageStyles }
				/>
				<Overlay
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</figure>
		</>
	);
}

export default function Edit( props ) {
	const {
		clientId,
		attributes,
		setAttributes,
		context: { image },
	} = props;
	const blockProps = useBlockProps();
	const borderProps = useBorderProps( attributes );

	if ( ! image || image === '' ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					className={ classnames(
						'block-editor-media-placeholder',
						borderProps.className
					) }
					withIllustration={ true }
					style={ borderProps.style }
				/>
				<Overlay
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</div>
		);
	}

	return <ImageDisplay { ...props } />;
}
