/**
 * Block: feed-item-link, edit.
 */

import {
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { text } = attributes;
	const borderProps = useBorderProps( attributes );
	const blockProps = useBlockProps( {
		className: borderProps.className,
		style: borderProps.style,
	} );

	return (
		<div { ...blockProps }>
			<RichText
				tagName="a"
				className="wp-block-feed-block-feed-item-link__link"
				value={ text }
				onChange={ ( nextText ) => {
					setAttributes( { text: nextText } );
				} }
				aria-label={ __( 'Feed item link text', 'feed-block' ) }
				placeholder={ __( 'Add feed item link text', 'feed-block' ) }
				withoutInteractiveFormatting={ true }
			/>
		</div>
	);
}
