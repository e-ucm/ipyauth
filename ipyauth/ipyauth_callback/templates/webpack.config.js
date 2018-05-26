
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
	target: 'web',
	entry: {
		app: './src/index.js',
		vendor: ['auth0-js', 'query-string'],
	},
	output: {
		path: path.resolve(__dirname, 'dist', 'assets'),
		publicPath: '/assets-callback/',
		filename: '[name].js' //[hash].[name]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(woff|woff2|ttf|eot|svg)?(\?v=[0–9]\.[0–9]\.[0–9])?$/,
				loader: 'file-loader',
				options: {
					name: 'font/[name].[ext]?[hash]'
				}
			},
			{
				test: /\.(png|jpe?g|gif)?(\?v=[0–9]\.[0–9]\.[0–9])?$/,
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]?[hash]'
				}
			},
		],
	},
	plugins: [
	],
	// devServer: {
	// 	historyApiFallback: true,
	// 	noInfo: true
	// },
	optimization: {
		minimize: true,
	}
};

if (process.env.NODE_ENV === 'development') {
	console.log('development mode');

	module.exports.devtool = 'eval-source-map';
}


if (process.env.NODE_ENV === 'production') {
	console.log('production mode');

	module.exports.devtool = 'source-map';
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}),
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				['js', 'css'].join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, './dist/index.html'),
			template: './src/top.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
	]);
}

