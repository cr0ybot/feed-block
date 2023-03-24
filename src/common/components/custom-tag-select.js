/**
 * Component: CustomTagSelect.
 */

import { TreeSelect } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export function CustomTagSelect( {
	custom,
	additional,
	onChange,
	selected,
	noOption = __( 'Use default content', 'feed-block' ),
} ) {
	const tree = Object.entries( custom ).map( ( [ namespace, tags ] ) => ( {
		name: namespace,
		id: '',
		children: Object.entries( tags ).map( ( [ tag ] ) => ( {
			name: tag,
			id: `${ namespace }|${ tag }`,
		} ) ),
	} ) );

	// If there are additional options, add them to the top of the tree.
	if ( Array.isArray( additional ) ) {
		tree.unshift(
			...additional.map( ( item ) => ( {
				name: item,
				id: item,
			} ) )
		);
	}

	return (
		<>
			<p className="description">
				{ __(
					'Select a custom feed tag to display instead of the default.',
					'feed-block'
				) }
			</p>
			<TreeSelect
				label={ __( 'Custom Content Tag', 'feed-block' ) }
				selectedId={ selected.join( '|' ) }
				noOptionLabel={ noOption }
				tree={ tree }
				onChange={ ( nextTag ) => {
					if ( nextTag === '' ) {
						onChange( [] );
					} else {
						onChange( nextTag.split( '|' ) );
					}
				} }
			/>
		</>
	);
}

export default CustomTagSelect;
