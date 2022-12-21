/**
 * Custom webpack config for multiple blocks.
 */

const { basename, dirname, parse } = require( 'path' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	optimization: {
		...( defaultConfig?.optimization || {} ),
		splitChunks: {
			...( defaultConfig?.optimization?.splitChunks || {} ),
			cacheGroups: {
				...( defaultConfig?.optimization?.splitChunks?.cacheGroups ||
					{} ),
				// Output individual CSS files.
				style: {
					type: 'css/mini-extract',
					test: /\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
					name( module, chunks, cacheGroupKey ) {
						console.log( module, chunks, cacheGroupKey );
						const chunkName = chunks[ 0 ].name;
						const fileName = parse( module._identifier ).name;
						return `${ dirname( chunkName ) }/${ basename(
							chunkName
						) }/${ fileName }`;
					},
				},
				default: false,
			},
		},
	},
	entry: {
		'blocks/rss-feed': './src/blocks/rss-feed',
		'blocks/rss-item-template': './src/blocks/rss-item-template',
		'blocks/rss-item-title': './src/blocks/rss-item-title',
	},
	output: {
		...defaultConfig.output,
		filename: '[name]/index.js',
	},
	resolve: {
		...defaultConfig.resolve,
		fallback: {
			...defaultConfig.resolve.fallback,
			http: require.resolve( 'stream-http' ),
			https: require.resolve( 'https-browserify' ),
			stream: require.resolve( 'stream-browserify' ),
			url: require.resolve( 'url/' ),
			timers: require.resolve( 'timers-browserify' ),
		},
	},
};
