const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: '/src/client/game.ts',
	mode: 'development', 
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	resolve: {
		extensions: ['.ts']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.m?js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'], // ensure compatibility with older browsers
						plugins: ['@babel/plugin-transform-object-assign'], // ensure compatibility with IE 11
					},
				},
			},
			{
				test: /\.js$/,
				loader: 'webpack-remove-debug',
			},
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{ from: './src/client/index.html', to: 'index.html' },
				{ from: './src/client/sprites', to: 'sprites' }
			]
		})
	]
};