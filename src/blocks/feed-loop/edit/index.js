/**
 * Block: feed-loop, edit.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Placeholder, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { rss } from '@wordpress/icons';
import { prependHTTP } from '@wordpress/url';

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
				<Placeholder icon={ rss } label="Feed Loop">
					<form
						onSubmit={ onSubmitFeedURL }
						className="wp-block-feed-loop-feed-loop__placeholder-form"
					>
						<TextControl
							className="wp-block-feed-loop-feed-loop__placeholder-input"
							label={ __( 'Feed URL (RSS/Atom)', 'feed-loop' ) }
							value={ feedURL }
							onChange={ ( value ) =>
								setAttributes( { feedURL: value } )
							}
							placeholder={ __(
								'https://example.com/feed',
								'feed-loop'
							) }
						/>
						<Button variant="primary" type="submit">
							{ __( 'Use URL', 'feed-loop' ) }
						</Button>
					</form>
				</Placeholder>
			</div>
		);
	}

	return <FeedContent { ...props } setIsEditing={ setIsEditing } />;
}
