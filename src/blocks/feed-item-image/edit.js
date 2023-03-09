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

import DimensionControls from './dimension-controls';
import Overlay from './overlay';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

const instructions = (
	<p>
		{ __(
			'To edit the placeholder image, you need permission to upload media.'
		) }
	</p>
);

function ImageDisplay( {
	clientId,
	attributes,
	setAttributes,
	context: { image, url, rel, linkTarget },
} ) {
	const {
		isLink,
		aspectRatio,
		height,
		width,
		scale,
		placeholderURL,
		placeholderId,
		placeholderSizeSlug,
	} = attributes;
	const blockProps = useBlockProps( {
		style: {
			width,
			height,
			aspectRatio,
		},
	} );
	const borderProps = useBorderProps( attributes );

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

	const onUpdatePlaceholder = ( image ) => {
		if ( image ) {
			//const newURL = get( image, [ 'media_details', 'sizes', 'full', 'source_url' ] );
			setAttributes( {
				placeholderURL: image.url,
				placeholderId: image.id,
			} );
		} else {
			setAttributes( {
				placeholderURL: null,
				placeholderId: null,
			} );
		}
	};

	const imageStyles = {
		...borderProps.style,
		height: ( !! aspectRatio && '100%' ) || height,
		width: !! aspectRatio && '100%',
		objectFit: !! ( height || aspectRatio ) && scale,
	};

	const ItemPlaceholder = ( props ) => {
		return (
			<Placeholder
				className={ classnames(
					'wp-block-feed-loop-feed-item-image__placeholder',
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

	if ( ! image || image === '' ) {
		return (
			<>
				{ controls }
				<div { ...blockProps }>
					<ItemPlaceholder
						preview={
							placeholderURL ? (
								<img
									className={ borderProps.className }
									src={ placeholderURL }
									alt=""
									style={ imageStyles }
								/>
							) : undefined
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

	const { placeholderURL, placeholderId } = attributes;

	/*
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
	*/

	return <ImageDisplay { ...props } />;
}
