/**
 * Block: feed-loop, edit.feed-content.
 */

import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	InspectorControls,
	useSetting,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	ToolbarGroup,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { edit, list, grid } from '@wordpress/icons';

const TEMPLATE = [ [ 'feed-loop/feed-item-template' ] ];
const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_MAX_ITEMS = 20;

export default function FeedContent( {
	attributes,
	setAttributes,
	setIsEditing,
} ) {
	const {
		itemsToShow,
		displayLayout,
		tagName: Tag = 'div',
		layout = {},
		rel,
		linkTarget,
	} = attributes;

	const { themeSupportsLayout } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return { themeSupportsLayout: getSettings()?.supportsLayout };
	}, [] );
	const defaultLayout = useSetting( 'layout' ) || {};
	const usedLayout = ! layout?.type
		? { ...defaultLayout, ...layout, type: 'default' }
		: { ...defaultLayout, ...layout };
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		__experimentalLayout: themeSupportsLayout ? usedLayout : undefined,
	} );

	const showColumnsControl = displayLayout?.type === 'flex';

	const updateDisplayLayout = ( newDisplayLayout ) => {
		setAttributes( {
			displayLayout: { ...displayLayout, ...newDisplayLayout },
		} );
	};

	const toolbarControls = [
		{
			icon: edit,
			title: __( 'Edit Feed URL' ),
			onClick: () => setIsEditing( true ),
		},
		{
			icon: list,
			title: __( 'List view' ),
			onClick: () => updateDisplayLayout( { type: 'list' } ),
			isActive: displayLayout?.type === 'list',
		},
		{
			icon: grid,
			title: __( 'Grid view' ),
			onClick: () =>
				updateDisplayLayout( {
					type: 'flex',
					columns: displayLayout?.columns || 3,
				} ),
			isActive: displayLayout?.type === 'flex',
		},
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Feed Loop Settings', 'feed-loop' ) }>
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Number of items' ) }
						value={ itemsToShow }
						onChange={ ( value ) =>
							setAttributes( { itemsToShow: value } )
						}
						min={ DEFAULT_MIN_ITEMS }
						max={ DEFAULT_MAX_ITEMS }
						required
					/>
					{ showColumnsControl && (
						<>
							<RangeControl
								__nextHasNoMarginBottom
								label={ __( 'Columns' ) }
								value={ displayLayout.columns }
								onChange={ ( value ) =>
									updateDisplayLayout( { columns: value } )
								}
								min={ 2 }
								max={ Math.max( 6, displayLayout.columns ) }
							/>
							{ displayLayout.columns > 6 && (
								<Notice
									status="warning"
									isDismissible={ false }
								>
									{ __(
										'This column count exceeds the recommended amount and may cause visual breakage.'
									) }
								</Notice>
							) }
						</>
					) }
				</PanelBody>
				<PanelBody title={ __( 'Link Settings' ) }>
					<p className="description">
						These link settings apply to any feed-specific link
						elements within the Feed Loop.
					</p>
					<ToggleControl
						label={ __( 'Open in new tab' ) }
						checked={ linkTarget === '_blank' }
						onChange={ ( nextIsNewTab ) => {
							setAttributes( {
								linkTarget: nextIsNewTab ? '_blank' : '_self',
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
				</PanelBody>
			</InspectorControls>
			<InspectorControls __experimentalGroup="advanced">
				<SelectControl
					label={ __( 'HTML element' ) }
					options={ [
						{ label: __( 'Default (<div>)' ), value: 'div' },
						{ label: '<main>', value: 'main' },
						{ label: '<section>', value: 'section' },
						{ label: '<aside>', value: 'aside' },
					] }
					value={ Tag }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
				/>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup controls={ toolbarControls } />
			</BlockControls>
			<Tag { ...innerBlocksProps } />
		</>
	);
}
