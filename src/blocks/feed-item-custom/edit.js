/**
 * Block: feed-item-custom, edit.
 */

import classnames from 'classnames';
import fmt from 'php-date-formatter';

import { unescape } from 'lodash';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	TreeSelect,
} from '@wordpress/components';
import { format } from '@wordpress/date';
import { __ } from '@wordpress/i18n';

import { trimWords } from '../../common/utils';

const contentTypes = {
	text: __( 'Plain Text', 'feed-loop' ),
	html: __( 'HTML', 'feed-loop' ),
	html_noimg: __( 'HTML (remove images)', 'feed-loop' ),
	datetime: __( 'Date and/or Time', 'feed-loop' ),
	//image: __( 'Image', 'feed-loop' ),
	//link: __( 'Link', 'feed-loop' ),
};

const dateTypes = {
	datetime: __( 'Date and Time', 'feed-loop' ),
	date: __( 'Date only', 'feed-loop' ),
	time: __( 'Time only', 'feed-loop' ),
};

const datetimeFormat = {
	datetime: 'c',
	date: 'Y-m-d',
	time: 'H:i:s',
};

function dateFormatter( dateString, inputFormat, outputFormat ) {
	const date = fmt( dateString, inputFormat );
	return format( outputFormat, date );
}

export default function Edit( { attributes, setAttributes, context } ) {
	const {
		textAlign,
		contentType,
		tag,
		constrainLength,
		textLength,
		dateInputFormat,
		dateDisplayFormat,
		dateType,
	} = attributes;
	const borderProps = useBorderProps( attributes );
	const blockProps = useBlockProps( {
		className: classnames(
			{
				[ `has-text-align-${ textAlign }` ]: textAlign,
			},
			borderProps.className
		),
		style: borderProps.style,
	} );
	const tagName = tag.length === 2 ? tag[ 1 ] : '';
	const content =
		tag.length === 2 ? context[ 'custom' ][ tag[ 0 ] ][ tag[ 1 ] ] : '';
	let contentElement = (
		<div { ...blockProps }>{ `${ tagName } ${ __(
			'(Custom Feed Item)',
			'feed-loop'
		) }` }</div>
	);
	if ( content && content !== '' ) {
		switch ( contentType ) {
			case 'text':
				const text = content.replace( /(<([^>]+)>)/gi, '' );
				contentElement = (
					<div { ...blockProps }>
						{ unescape(
							constrainLength
								? trimWords( text, textLength )
								: text
						) }
					</div>
				);
				break;
			case 'html':
				contentElement = (
					<div
						{ ...blockProps }
						dangerouslySetInnerHTML={ { __html: content } }
					/>
				);
				break;
			case 'html_noimg':
				contentElement = (
					<div
						{ ...blockProps }
						dangerouslySetInnerHTML={ {
							__html: content.replace( /<img[^>]*>/g, '' ),
						} }
					/>
				);
				break;
			case 'datetime':
				contentElement = (
					<time
						{ ...blockProps }
						dateTime={ dateFormatter(
							content,
							dateInputFormat,
							datetimeFormat[ dateType ]
						) }
					>
						{ dateFormatter(
							content,
							dateInputFormat,
							dateDisplayFormat
						) }
					</time>
				);
				break;
			/*
			case 'image':
				contentElement = (
					<div { ...blockProps }>
						<img src={ content } alt="" />
					</div>
				);
				break;
			case 'link':
				contentElement = (
					<div { ...blockProps }>
						<a href={ content }>{ content }</a>
					</div>
				);
				break;
			*/
		}
	}

	function ContentFormat() {
		switch ( contentType ) {
			case 'text':
				return (
					<>
						<ToggleControl
							label={ __( 'Constrain Length', 'feed-loop' ) }
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
								label={ __( 'Length', 'feed-loop' ) }
								value={ textLength }
								initialPosition={ 55 }
								onChange={ ( nextLength ) => {
									setAttributes( {
										textLength: nextLength,
									} );
								} }
								min={ 1 }
								max={ 100 }
								step={ 1 }
							/>
						) }
					</>
				);
			case 'datetime':
				return (
					<>
						<p className="components-base-control__help">
							{ __(
								'Date and time formats use PHP date format strings. See: ',
								'feed-loop'
							) }
							<a href="https://www.php.net/manual/en/function.date.php">
								{ __(
									'PHP datetime format documentation',
									'feed-loop'
								) }
							</a>
						</p>
						<TextControl
							label={ __( 'Date Input Format', 'feed-loop' ) }
							placeholder="Y-m-d H:i:s"
							value={ dateInputFormat }
							onChange={ ( nextFormat ) => {
								setAttributes( {
									dateInputFormat: nextFormat,
								} );
							} }
						/>
						<TextControl
							label={ __( 'Date Display Format', 'feed-loop' ) }
							placeholder="F j, Y"
							value={ dateDisplayFormat }
							onChange={ ( nextFormat ) => {
								setAttributes( {
									dateDisplayFormat: nextFormat,
								} );
							} }
						/>
						<SelectControl
							label={ __( 'Date Type', 'feed-loop' ) }
							help={ __(
								'This setting will improve the accessibility of the output.',
								'feed-loop'
							) }
							value={ dateType }
							options={ Object.entries( dateTypes ).map(
								( [ value, label ] ) => ( {
									value,
									label,
								} )
							) }
							onChange={ ( nextType ) => {
								setAttributes( { dateType: nextType } );
							} }
						/>
					</>
				);
			default:
				return null;
		}
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Content Settings', 'feed-loop' ) }>
					<TreeSelect
						label={ __( 'Content Tag', 'feed-loop' ) }
						selectedId={ tag.join( '|' ) }
						noOptionLabel={ __( 'Select a tag', 'feed-loop' ) }
						tree={ Object.entries( context[ 'custom' ] ).map(
							( [ namespace, tags ] ) => ( {
								name: namespace,
								id: '',
								children: Object.entries( tags ).map(
									( [ tag ] ) => ( {
										name: tag,
										id: `${ namespace }|${ tag }`,
									} )
								),
							} )
						) }
						onChange={ ( nextTag ) => {
							if ( nextTag === '' ) {
								setAttributes( { tag: [] } );
							} else {
								setAttributes( {
									tag: nextTag.split( '|' ),
								} );
							}
						} }
					/>
					<SelectControl
						label={ __( 'Content Type', 'feed-loop' ) }
						value={ contentType }
						options={ Object.entries( contentTypes ).map(
							( [ value, label ] ) => ( {
								value,
								label,
							} )
						) }
						onChange={ ( nextType ) => {
							setAttributes( { contentType: nextType } );
						} }
					/>
					<ContentFormat />
				</PanelBody>
			</InspectorControls>
			{ contentElement }
		</>
	);
}
