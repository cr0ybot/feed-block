/**
 * Block: feed-item-date, edit.
 */

import classnames from 'classnames';
import DateFormatter from 'php-date-formatter';

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
import { useEntityProp } from '@wordpress/core-data';
import { format } from '@wordpress/date';
import { __ } from '@wordpress/i18n';

import CustomTagSelect from '../../common/components/custom-tag-select';

const fmt = new DateFormatter();

const rssFormat = 'D, d M Y H:i:s O'; // RFC 822 / PHP DateTime::RSS

const dateTypes = {
	datetime: __( 'Date and Time', 'feed-block' ),
	date: __( 'Date only', 'feed-block' ),
	time: __( 'Time only', 'feed-block' ),
};

const datetimeFormat = {
	datetime: 'c',
	date: 'Y-m-d',
	time: 'H:i:s',
};

function dateFormatter( dateString, inputFormat, outputFormat = '' ) {
	console.log( {
		dateString,
		inputFormat,
		outputFormat,
	} );

	if ( outputFormat === '' ) {
		return dateString;
	}

	const date = fmt.parseDate( dateString, inputFormat );
	return format( outputFormat, date );
}

export default function Edit( { attributes, setAttributes, context } ) {
	const {
		textAlign,
		customTag,
		isLink,
		inputFormat: providedInputFormat,
		displayFormat: providedDisplayFormat,
		dateType,
	} = attributes;
	const { custom } = context;

	const [ siteDateFormat ] = useEntityProp( 'root', 'site', 'date_format' );
	const [ siteTimeFormat ] = useEntityProp( 'root', 'site', 'time_format' );

	const customTagname =
		customTag.length === 2
			? customTag[ 1 ]
			: customTag.length === 1
			? customTag[ 0 ]
			: false;
	const content =
		customTag.length === 2
			? custom[ customTag[ 0 ] ][ customTag[ 1 ] ]
			: context?.[ customTagname || 'date_published' ];

	// Set up block props.
	const borderProps = useBorderProps( attributes );
	const atts = {
		className: classnames(
			{
				[ `has-text-align-${ textAlign }` ]: textAlign,
			},
			borderProps.className
		),
		style: borderProps.style,
	};
	if ( customTagname ) {
		atts[ 'data-feed-tag' ] = customTagname;
	}
	const blockProps = useBlockProps( atts );

	// Note: when using default date_published/date_modified, input date has already been parsed.
	const defaultInputFormat =
		dateType === 'datetime'
			? `${ datetimeFormat[ 'date' ] } ${ datetimeFormat[ 'time' ] }`
			: datetimeFormat[ dateType ];

	const defaultDisplayFormat =
		dateType === 'time'
			? siteTimeFormat
			: dateType === 'date'
			? siteDateFormat
			: `${ siteDateFormat } ${ siteTimeFormat }`; // datetime (default)

	const inputFormat =
		providedInputFormat && providedInputFormat !== ''
			? providedInputFormat
			: defaultInputFormat;

	const displayFormat =
		providedDisplayFormat && providedDisplayFormat !== ''
			? providedDisplayFormat
			: defaultDisplayFormat;

	let contentElement = (
		<div { ...blockProps }>{ `${ customTagname } ${ __(
			'<Feed Item Date>',
			'feed-block'
		) }` }</div>
	);
	if ( content && content !== '' ) {
		contentElement = (
			<time
				{ ...blockProps }
				dateTime={ dateFormatter(
					content,
					inputFormat,
					datetimeFormat[ dateType ]
				) }
			>
				{ dateFormatter( content, inputFormat, displayFormat ) }
			</time>
		);
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
				<PanelBody title={ __( 'Content Settings', 'feed-block' ) }>
					<CustomTagSelect
						custom={ custom }
						additional={ [ 'date_published', 'date_modified' ] }
						noOption={ false }
						onChange={ ( newCustomTag ) =>
							setAttributes( { customTag: newCustomTag } )
						}
						selected={ customTag }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Date Format Settings', 'feed-block' ) }>
					<p className="components-base-control__help">
						{ __(
							'Date and time formats use PHP date format strings. See: ',
							'feed-block'
						) }
						<a href="https://www.php.net/manual/en/function.date.php">
							{ __(
								'PHP datetime format documentation',
								'feed-block'
							) }
						</a>
					</p>
					<SelectControl
						label={ __( 'Date Type', 'feed-block' ) }
						help={ __(
							'This setting will improve the accessibility of the output and determine the default input/output formats.',
							'feed-block'
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
					{ customTag.length === 2 && (
						<TextControl
							label={ __( 'Date Input Format', 'feed-block' ) }
							help={ __(
								'If your custom content uses a format other than Y-m-d and/or H:i:s, set that here until your date shows up properly.',
								'feed-block'
							) }
							placeholder={ defaultInputFormat }
							value={ providedInputFormat }
							onChange={ ( nextFormat ) => {
								setAttributes( {
									inputFormat: nextFormat,
								} );
							} }
						/>
					) }
					<TextControl
						label={ __( 'Date Display Format', 'feed-block' ) }
						help={ __(
							'The default display format is the site date and/or time format in Settings > General.',
							'feed-block'
						) }
						placeholder={ defaultDisplayFormat }
						value={ providedDisplayFormat }
						onChange={ ( nextFormat ) => {
							setAttributes( {
								displayFormat: nextFormat,
							} );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			{ contentElement }
		</>
	);
}
