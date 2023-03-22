/**
 * Block: feed-item-image, edit.
 */

import classnames from 'classnames';
import { get, map } from 'lodash';

import {
	BlockControls,
	InspectorControls,
	MediaReplaceFlow,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
	__experimentalImageSizeControl as ImageSizeControl,
	__experimentalUseBorderProps as useBorderProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	Placeholder,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { isURL } from '@wordpress/url';

import CustomTagSelect from '../../common/components/custom-tag-select';

import DimensionControls from './dimension-controls';
import Overlay from './overlay';
import DOMPurify from 'dompurify';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

const instructions = (
	<p>
		{ __(
			'To edit the placeholder image, you need permission to upload media.'
		) }
	</p>
);

// Find the first src URL in a given arbitrary HTML string.
function getImgURL( html ) {
	// First, strip all except img tags.
	const strippedHTML = DOMPurify.sanitize( html, {
		ALLOWED_TAGS: [ 'img' ],
	} );
	// Then, find the first img tag's src attribute.
	const imgs = new DOMParser()
		.parseFromString( strippedHTML, 'text/html' )
		.getElementsByTagName( 'img' );
	return imgs.length ? imgs[ 0 ].src : '';
}

export default function Edit( {
	clientId,
	attributes,
	setAttributes,
	context: {
		'feed-block/item/custom': custom,
		'feed-block/item/image': image,
		'feed-block/item/url': url,
		'feed-block/rel': rel,
		'feed-block/linkTarget': linkTarget,
	},
} ) {
	const {
		customTag,
		urlFromContent,
		isLink,
		aspectRatio,
		height,
		width,
		scale,
		placeholderURL,
		placeholderId,
		placeholderSizeSlug,
	} = attributes;

	// Set up block props.
	const atts = {};
	const customTagname = customTag.length === 2 ? customTag[ 1 ] : false;
	if ( customTagname ) {
		atts[ 'data-feed-tag' ] = customTagname;
	}
	const blockProps = useBlockProps( {
		style: {
			width,
			height,
			aspectRatio,
		},
		...atts,
	} );
	const borderProps = useBorderProps( attributes );

	// Determine content (URL).
	const customContent =
		customTag.length === 2
			? custom[ customTag[ 0 ] ][ customTag[ 1 ] ]
			: false;
	const content = customContent
		? urlFromContent
			? customContent
			: getImgURL( customContent )
		: image;
	const imgURL = isURL( content ) ? content : '';

	const media = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return placeholderId ? getMedia( placeholderId ) : null;
		},
		[ placeholderId ]
	);

	const imageSizes = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().imageSizes;
	}, [] );

	const imageSizeOptions = map(
		imageSizes.filter( ( { slug } ) =>
			get( media, [ 'media_details', 'sizes', slug, 'source_url' ] )
		),
		( { name, slug } ) => ( { value: slug, label: name } )
	);

	const onUpdatePlaceholder = ( placeholder ) => {
		if ( placeholder ) {
			//const newURL = get( placeholder, [ 'media_details', 'sizes', 'full', 'source_url' ] );
			setAttributes( {
				placeholderURL: placeholder.url,
				placeholderId: placeholder.id,
			} );
		} else {
			setAttributes( {
				placeholderURL: null,
				placeholderId: null,
			} );
		}
	};

	const hasAspectRatio = aspectRatio && aspectRatio !== 'auto';

	const imageStyles = {
		...borderProps.style,
		height: ( hasAspectRatio && '100%' ) || height,
		width: hasAspectRatio && '100%',
		objectFit: !! ( height || hasAspectRatio ) && scale,
	};

	const ItemPlaceholder = ( props ) => {
		return (
			<Placeholder
				className={ classnames(
					'wp-block-feed-block-feed-item-image__placeholder',
					'block-editor-media-placeholder',
					borderProps.className,
					placeholderURL && 'has-placeholder-image'
				) }
				withIllustration={ true }
				style={ imageStyles }
				{ ...props }
			/>
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
				<PanelBody title={ __( 'Content Settings', 'feed-block' ) }>
					<CustomTagSelect
						custom={ custom }
						onChange={ ( newCustomTag ) =>
							setAttributes( { customTag: newCustomTag } )
						}
						selected={ customTag }
					/>
					<ToggleControl
						label={ __(
							'Use tag contents as image URL',
							'feed-block'
						) }
						description={ __(
							'If checked, the full text within the tag will be used as the image URL.',
							'feed-block'
						) }
						checked={ urlFromContent }
						onChange={ ( nextUrlFromContent ) => {
							setAttributes( {
								urlFromContent: nextUrlFromContent,
							} );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Link Settings', 'feed-block' ) }>
					<ToggleControl
						label={ __( 'Make image a link', 'feed-block' ) }
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

				<PanelBody title={ __( 'Placeholder Image' ) }>
					<MediaUploadCheck fallback={ instructions }>
						<MediaUpload
							title={ __( 'Placeholder Image' ) }
							onSelect={ onUpdatePlaceholder }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							value={ placeholderId }
							modalClass="editor-post-featured-image__media-modal"
							render={ ( { open } ) => (
								<div className="editor-post-featured-image__container">
									<Button
										className={
											! placeholderId
												? 'editor-post-featured-image__toggle'
												: 'editor-post-featured-image__preview'
										}
										onClick={ open }
										aria-label={
											! placeholderId
												? null
												: __(
														'Edit or update the placeholder image'
												  )
										}
										aria-describedby={
											! placeholderId
												? null
												: `editor-post-featured-image-${ placeholderId }-describedby`
										}
									>
										{ !! placeholderId &&
											placeholderURL && (
												<img
													src={ placeholderURL }
													alt=""
												/>
											) }
										{ !! placeholderId &&
											! placeholderURL && <Spinner /> }
										{ ! placeholderId &&
											__( 'Set placeholder image' ) }
									</Button>
								</div>
							) }
						/>
						{ !! placeholderId && placeholderURL && (
							<MediaUpload
								title={ __( 'Placeholder Image' ) }
								onSelect={ onUpdatePlaceholder }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								modalClass="editor-post-featured-image__media-modal"
								render={ ( { open } ) => (
									<Button onClick={ open } isSecondary>
										{ __( 'Replace placeholder image' ) }
									</Button>
								) }
							/>
						) }
						{ !! placeholderId && (
							<Button
								onClick={ () => onUpdatePlaceholder( null ) }
								isLink
								isDestructive
							>
								{ __( 'Remove placeholder image' ) }
							</Button>
						) }
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>
		</>
	);

	if ( ! imgURL || imgURL === '' ) {
		return (
			<>
				{ controls }
				<div { ...blockProps }>
					<ItemPlaceholder
						preview={
							<>
								{ placeholderURL && (
									<img
										className={ borderProps.className }
										src={ placeholderURL }
										alt=""
										style={ imageStyles }
									/>
								) }
								{ content !== '' && imgURL === '' && (
									<span className="url-not-valid">
										{ __(
											'Not a valid URL:',
											'feed-block'
										) }{ ' ' }
										{ content }
									</span>
								) }
							</>
						}
					/>
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
					src={ url }
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
