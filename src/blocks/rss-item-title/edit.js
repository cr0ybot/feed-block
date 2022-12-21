/**
 * Block: rss-item-title, edit.
 */

import classnames from 'classnames';

import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	PlainText,
} from '@wordpress/block-editor';
import { ToggleControl, TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

import HeadingLevelDropdown from './heading-level-dropdown';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( {
	attributes: { level, textAlign, isLink, rel, linkTarget },
	setAttributes,
	context: { title, url },
} ) {
	const Tag = 0 === level ? 'p' : `h${ level }`;
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );
	const titleContent = title && title !== '' ? title : __( 'RSS Item Title' );
	let titleElement = <Tag { ...blockProps }>{ titleContent }</Tag>;
	if ( isLink && url ) {
		titleElement = (
			<Tag { ...blockProps }>
				<a
					href={ url }
					rel={ rel }
					target={ linkTarget }
					onClick={ ( event ) => event.preventDefault() }
				>
					{ titleContent }
				</a>
			</Tag>
		);
	}

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					selectedLevel={ level }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
				/>
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Link Settings' ) }>
					<ToggleControl
						label={ __( 'Make title a link' ) }
						checked={ isLink }
						onChange={ ( nextIsLink ) => {
							setAttributes( { isLink: nextIsLink } );
						} }
					/>
					{ isLink && (
						<>
							<ToggleControl
								label={ __( 'Open in new tab' ) }
								checked={ linkTarget === '_blank' }
								onChange={ ( nextIsNewTab ) => {
									setAttributes( {
										linkTarget: nextIsNewTab
											? '_blank'
											: '_self',
									} );
								} }
							/>
							<TextControl
								label={ __( 'Link rel' ) }
								value={ rel }
								onChange={ ( nextRel ) => {
									setAttributes( { rel: nextRel } );
								} }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			{ titleElement }
		</>
	);
}
