/**
 * Block: rss-feed, edit.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Placeholder, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { rss } from '@wordpress/icons';
import { prependHTTP } from '@wordpress/url';

import RSSContent from './rss-content';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	const { clientId, attributes, setAttributes } = props;
	const { feedURL } = attributes;

	const [ isEditing, setIsEditing ] = useState( ! attributes.feedURL );
	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlocks( clientId ).length,
		[ clientId ]
	);
	const blockProps = useBlockProps();

	const onSubmitFeedURL = ( event ) => {
		event.preventDefault();

		if ( feedURL ) {
			setAttributes( { feedURL: prependHTTP( feedURL ) } );
			setIsEditing( false );
		}
	};

	if ( isEditing ) {
		return (
			<div { ...blockProps }>
				<Placeholder icon={ rss } label="RSS Feed">
					<form
						onSubmit={ onSubmitFeedURL }
						className="rss-block-rss-feed__placeholder-form"
					>
						<TextControl
							className="rss-block-rss-feed__placeholder-input"
							label={ __( 'RSS Feed URL', 'rss-block' ) }
							value={ feedURL }
							onChange={ ( value ) =>
								setAttributes( { feedURL: value } )
							}
							placeholder={ __(
								'https://example.com/feed',
								'rss-block'
							) }
						/>
						<Button variant="primary" type="submit">
							{ __( 'Use URL', 'rss-block' ) }
						</Button>
					</form>
				</Placeholder>
			</div>
		);
	}

	return <RSSContent { ...props } setIsEditing={ setIsEditing } />;
}
