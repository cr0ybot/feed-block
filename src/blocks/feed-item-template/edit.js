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

const TEMPLATE = [ [ 'feed-loop/feed-item-title' ] ];

function FeedItemTemplateInnerBlocks() {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-post' },
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
			className: 'wp-block-feed-loop-feed-item',
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
		feedURL,
		itemsToShow,
		displayLayout: { type: layoutType = 'flex', columns = 1 } = {},
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
					action: 'feed_loop_get_feed',
					url: feedURL,
					_ajax_nonce: feedLoop.nonce,
				} ),
			} );
			const data = await response.json();
			console.log( data );
			setFeed( data?.data );
			setIsLoading( false );
		};

		fetchFeed();
	}, [ feedURL ] );

	const itemContexts = useMemo(
		() => feed?.items?.slice( 0, itemsToShow ),
		[ feed, itemsToShow ]
	);
	const hasLayoutFlex = layoutType === 'flex' && columns > 1;
	const blockProps = useBlockProps( {
		className: classnames( {
			'is-flex-container': hasLayoutFlex,
			[ `columns-${ columns }` ]: hasLayoutFlex,
		} ),
	} );

	if ( ! feed?.items?.length ) {
		return <p { ...blockProps }>{ __( 'No items found.' ) }</p>;
	}

	return isLoading ? (
		<Placeholder>
			<Spinner />
		</Placeholder>
	) : (
		<ul { ...blockProps }>
			{ itemContexts.map( ( item, index ) => (
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
							( activeBlockContextId || itemContexts[ 0 ]?.id )
						}
					/>
				</BlockContextProvider>
			) ) }
		</ul>
	);
}
