/**
 * Block: feed, edit.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Placeholder, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { prependHTTP } from '@wordpress/url';

import icon from '../../../icons/feed-block';

import FeedContent from './feed-content';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { feedURL } = attributes;

	const [ isEditing, setIsEditing ] = useState( ! attributes.feedURL );
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
				<Placeholder icon={ icon } label="Feed Loop">
					<form
						onSubmit={ onSubmitFeedURL }
						className="wp-block-feed-block-feed__placeholder-form"
					>
						<TextControl
							className="wp-block-feed-block-feed__placeholder-input"
							label={ __( 'Feed URL (RSS/Atom)', 'feed-block' ) }
							value={ feedURL }
							onChange={ ( value ) =>
								setAttributes( { feedURL: value } )
							}
							placeholder={ __(
								'https://example.com/feed',
								'feed-block'
							) }
						/>
						<Button variant="primary" type="submit">
							{ __( 'Use URL', 'feed-block' ) }
						</Button>
					</form>
				</Placeholder>
			</div>
		);
	}

	return <FeedContent { ...props } setIsEditing={ setIsEditing } />;
}
