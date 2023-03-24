/**
 * Block: feed-item-template, edit.
 */

import classnames from 'classnames';

import {
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	BlockContextProvider,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Placeholder, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { memo, useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	[ 'feed-block/feed-item-title' ],
	[ 'feed-block/feed-item-content' ],
];

function FeedItemTemplateInnerBlocks() {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-feed-block-feed-item' },
		{ template: TEMPLATE }
	);
	return <li { ...innerBlocksProps } />;
}

function FeedItemTemplateBlockPreview( {
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: 'wp-block-feed-block-feed-item',
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedFeedItemTemplateBlockPreview = memo(
	FeedItemTemplateBlockPreview
);

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( {
	clientId,
	context: {
		'feed-block/feedURL': feedURL,
		'feed-block/itemsToShow': itemsToShow,
		'feed-block/displayLayout': {
			type: layoutType = 'flex',
			columns = 1,
		} = {},
	},
} ) {
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const [ feed, setFeed ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	const { blocks } = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return {
				blocks: getBlocks( clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		// Fetch feed JSON from AJAX endpoint.
		const fetchFeed = async () => {
			const response = await fetch( ajaxurl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'feed_block_get_feed',
					url: feedURL,
					_ajax_nonce: feedBlock.nonce,
				} ),
			} );
			const data = await response.json();
			console.log( data );
			setFeed( data?.data );
			setIsLoading( false );
		};

		fetchFeed();
	}, [ feedURL ] );

	const itemContexts = useMemo( () => {
		const items = feed?.items?.slice( 0, itemsToShow );
		if ( ! items?.length ) {
			return [];
		}

		// Namespace each item's properties with `feed-block/item/`.
		return items.map( ( item ) => {
			const result = Object.fromEntries(
				Object.entries( item ).map( ( [ key, value ] ) => [
					`feed-block/item/${ key }`,
					value,
				] )
			);
			// We need the item's ID for the key prop.
			result.id = item.id;
			return result;
		} );
	}, [ feed, itemsToShow ] );
	const hasLayoutFlex = layoutType === 'flex' && columns > 1;
	const blockProps = useBlockProps( {
		className: classnames( {
			'is-flex-container': hasLayoutFlex,
			[ `columns-${ columns }` ]: hasLayoutFlex,
		} ),
	} );

	if ( ! isLoading && ! feed?.items?.length ) {
		return <p { ...blockProps }>{ __( 'No items found.' ) }</p>;
	}

	return isLoading ? (
		<Placeholder>
			<Spinner />
		</Placeholder>
	) : (
		<ul { ...blockProps }>
			{ itemContexts &&
				itemContexts.map( ( item ) => (
					<BlockContextProvider key={ item.id } value={ item }>
						{ item.id ===
						( activeBlockContextId || itemContexts[ 0 ]?.id ) ? (
							<FeedItemTemplateInnerBlocks />
						) : null }
						<MemoizedFeedItemTemplateBlockPreview
							blocks={ blocks }
							blockContextId={ item.id }
							setActiveBlockContextId={ setActiveBlockContextId }
							isHidden={
								item.id ===
								( activeBlockContextId ||
									itemContexts[ 0 ]?.id )
							}
						/>
					</BlockContextProvider>
				) ) }
		</ul>
	);
}
