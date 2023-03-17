/**
 * Block: feed-item-summary, edit.
 */

import classnames from 'classnames';

import { unescape } from 'lodash';
import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { trimWords } from '../../common/utils';

export default function Edit( {
	attributes: {
		textAlign,
		constrainLength,
		summaryLength,
		moreText,
		showMore,
		showMoreOnNewLine,
	},
	setAttributes,
	context: { summary },
} ) {
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const readMoreLink = (
		<RichText
			tagName="a"
			className="wp-block-feed-block-feed-item-summary__more-link"
			value={ moreText }
			onChange={ ( nextMoreText ) => {
				setAttributes( { moreText: nextMoreText } );
			} }
			aria-label={ __( '"Read more" link text', 'feed-block' ) }
			placeholder={ __( 'Add "read more" link text', 'feed-block' ) }
			withoutInteractiveFormatting={ true }
		/>
	);

	const content = constrainLength
		? trimWords( summary, summaryLength )
		: summary;
	let summaryContent = __( '(Feed Item Summary)', 'feed-block' );
	if ( content && content !== '' ) {
		summaryContent = unescape( content );
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Summary Settings' ) }>
					<ToggleControl
						label={ __( 'Show read more link' ) }
						description={ __(
							'Link settings can be found on the main Feed Loop block.',
							'feed-block'
						) }
						checked={ showMore }
						onChange={ () =>
							setAttributes( { showMore: ! showMore } )
						}
					/>
					{ showMore && (
						<ToggleControl
							label={ __( 'Show read more link on new line' ) }
							checked={ showMoreOnNewLine }
							onChange={ () =>
								setAttributes( {
									showMoreOnNewLine: ! showMoreOnNewLine,
								} )
							}
						/>
					) }
					<ToggleControl
						label={ __( 'Constrain summaryLength' ) }
						checked={ constrainLength }
						onChange={ () =>
							setAttributes( {
								constrainLength: ! constrainLength,
							} )
						}
					/>
					{ constrainLength && (
						// Note: had to save as string for the control to work???
						<RangeControl
							label={ __( 'Length' ) }
							value={ summaryLength }
							initialPosition={ 55 }
							onChange={ ( nextLength ) => {
								setAttributes( {
									summaryLength: nextLength,
								} );
							} }
							min={ 1 }
							max={ 100 }
							step={ 1 }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ showMore ? (
					showMoreOnNewLine ? (
						<>
							<p>{ summaryContent }</p>
							<p>{ readMoreLink }</p>
						</>
					) : (
						<>
							{ summaryContent } { readMoreLink }
						</>
					)
				) : (
					summaryContent
				) }
			</div>
		</>
	);
}
