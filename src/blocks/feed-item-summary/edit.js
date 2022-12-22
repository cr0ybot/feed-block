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
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

function trimWords( originalText, numWords = 55, more = null ) {
	if ( null === more ) {
		more = __( '…' );
	}
	// Split string on whitespace, add `more` if limit is reached (ie cut off).
	const trimmed = originalText.split( /[\n\r\t ]+/, numWords );

	let text = trimmed.join( ' ' );
	if ( trimmed.length === numWords ) {
		text += more;
	}

	/**
	 * Filters the trimmed summary.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} text           The trimmed summary.
	 * @param {number} numWords       The number of words to trim to.
	 * @param {string} more           The string to append to the trimmed summary.
	 * @param {string} originalText   The original summary before trimming.
	 */
	return applyFilters(
		'feedLoop.trimWords',
		text,
		numWords,
		more,
		originalText
	);
}

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
			className="wp-block-feed-loop-feed-item-summary__more-link"
			value={ moreText }
			onChange={ ( nextMoreText ) => {
				setAttributes( { moreText: nextMoreText } );
			} }
			aria-label={ __( '"Read more" link text', 'feed-loop' ) }
			placeholder={ __( 'Add "read more" link text', 'feed-loop' ) }
			withoutInteractiveFormatting={ true }
		/>
	);

	const content = constrainLength
		? trimWords( summary, summaryLength )
		: summary;
	let summaryContent = __( '(Feed Item Summary)', 'feed-loop' );
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
