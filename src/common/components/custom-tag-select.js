/**
 * Component: CustomTagSelect.
 */

import { TreeSelect } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export function CustomTagSelect( { custom, onChange, selected } ) {
	return (
		<TreeSelect
			label={ __( 'Custom Content Tag', 'feed-block' ) }
			description={ __(
				'Select a custom tag to display instead of the default.',
				'feed-block'
			) }
			selectedId={ selected.join( '|' ) }
			noOptionLabel={ __( 'Select a custom tag', 'feed-block' ) }
			tree={ Object.entries( custom ).map( ( [ namespace, tags ] ) => ( {
				name: namespace,
				id: '',
				children: Object.entries( tags ).map( ( [ tag ] ) => ( {
					name: tag,
					id: `${ namespace }|${ tag }`,
				} ) ),
			} ) ) }
			onChange={ ( nextTag ) => {
				if ( nextTag === '' ) {
					onChange( [] );
				} else {
					onChange( nextTag.split( '|' ) );
				}
			} }
		/>
	);
}

export default CustomTagSelect;
