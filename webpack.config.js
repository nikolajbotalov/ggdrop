const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

const filename = (ext) =>
	isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
	context: path.resolve(__dirname, "./"),
	mode: "development",
	entry: "./index.js",
	output: {
		filename: `./js/${filename("js")}`,
		path: path.resolve(__dirname, "app"),
		publicPath: "/",
	},
	devServer: {
		open: true,
		compress: true,
		hot: true,
		port: 3000,
	},
	resolve: {
		extensions: [".js"],
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, "index.html"),
			filename: "index.html",
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: `./css/${filename("css")}`,
		}),
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev,
						},
					},
					"css-loader",
				],
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => {
								return path.relative(path.dirname(resourcePath), context) + "/";
							},
						},
					},
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
};
