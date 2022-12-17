/**
 * Block: rss-feed, edit.rss-content.
 */

import { useSelect, useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
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
	ToolbarGroup,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { edit, list, grid } from '@wordpress/icons';

const TEMPLATE = [ [ 'rss-block/rss-item-template' ] ];
const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_MAX_ITEMS = 20;

export default function RSSContent( {
	attributes,
	setAttributes,
	setIsEditing,
	name,
	clientId,
} ) {
	const {
		feedURL,
		itemsToShow,
		displayLayout,
		tagName: Tag = 'div',
		layout = {},
	} = attributes;

	const instanceId = useInstanceId( RSSContent );
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
			title: __( 'Edit RSS URL' ),
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
				<PanelBody title={ __( 'RSS Feed Settings', 'rss-block' ) }>
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
