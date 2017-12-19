var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var path = require('path');
/**
 * 定义CUBE库文件打包配置
 */
var cubi_libs_config = {	
	entry: path.join(__dirname, '../src/pc/cubi.libs.js'), //入口模块
	output: {
		path: path.join(__dirname,'../build/pc'), //输出目录
		filename: 'cubi.libs.bundle.js', //输出文件名称
		libraryTarget: 'umd', //打包的文件类型,UMD表示导出为全局对象
	},
	plugins: [],
	module: {
		loaders: [{
			exclude: /(node_modules)/, //排除文件夹
			loaders: ['babel'], //预处理文件加载器，表示require一个模块前，先要经过babel处理
		}]
	}
};


/**
 * 定义[cubi.libs.bundle]任务
 * 打包CUBE库文件
 */
gulp.task("cubi.libs.bundle", function(callback) {

	// 将打包配置传递给webpack并打包
	webpack(cubi_libs_config, function(err, stats) {

		if (err) throw new gutil.PluginError("webpack", err);
		//输出打包过程信息
		gutil.log("[webpack]", stats.toString({
			// output options
		}));

		callback();
	});
});

/**
 * 定义CUBE自编写模块打包配置
 */
var cubi_config = {
	entry: [
		path.join(__dirname, '../src/pc/cubi.js'), //入口模块
	],
	output: {
		path: path.join(__dirname, '../build/pc'), //输出目录
		filename: 'cubi.bundle.js', //输出文件名称
		chunkFilename: 'cubi.chunk.[name].js', //代码分割文件名称
	},
	plugins: [
	],
	module: {
		loaders: [{
			exclude: /(node_modules)/, //排除文件夹
			loaders: ['babel'], //预处理文件加载器，表示require一个模块前，先要经过babel处理
		}],
	},
	/**
	 * 全局对象映射，配置后，webpack不会打包key对应的模块
	 * key：require的模块名称
	 * value：实际对象的名称
	 */
	externals: {
		'jquery': 'jQuery',
		'react': 'React',
		'react-dom': 'ReactDOM',
		'fbemitter': 'fbemitter',
		'material-ui': 'materialUI',
		'react-router': 'ReactRouter',
		'classnames': 'classnames',
		'cookie': 'cookie',
		'echarts': 'echarts',
		'moment': 'moment',
		'lodash': 'lodash',
		'react-addons-css-transition-group': 'ReactCSSTransitionGroup'
	},
	resolve: {
		alias: {
			/**
			 * 别名机制，require('app')实际模块是public/src/pc/App.js
			 */
			'app': path.join(__dirname, '../src/pc/App.js'),
		}
	}
}
/**
 * 定义[cubi.bundle]任务
 * 打包自定义模块
 */
gulp.task("cubi.bundle", function(callback) {
	
	// 将打包配置传递给webpack并打包
	webpack(cubi_config, function(err, stats) {
		if (err) throw new gutil.PluginError("webpack", err);
		//输出打包过程信息
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		callback();
	});
});
 
gulp.task("cubi.bundle:watch", function(callback) {
	//监控文件变动，运行cubi.bundle任务
	var files = "src/**/**/*.js";
	gulp.watch(files, ['cubi.bundle']);
});
/**
 * 定义CUBE自编写模块打包配置
 */
var sdk_config = {
	entry: [
		path.join(__dirname, '../src/pc/sdk.js'), //入口模块
	],
	output: {
		path: path.join(__dirname, '../build/pc'), //输出目录
		filename: 'sdk.bundle.js', //输出文件名称
	},
	plugins: [
	],
	module: {
		loaders: [{
			exclude: /(node_modules)/, //排除文件夹
			loaders: ['babel'], //预处理文件加载器，表示require一个模块前，先要经过babel处理
		}],
	},
	/**
	 * 全局对象映射，配置后，webpack不会打包key对应的模块
	 * key：require的模块名称
	 * value：实际对象的名称
	 */
	externals: {
		'jquery': 'jQuery',
		'react': 'React',
		'react-dom': 'ReactDOM',
		'fbemitter': 'fbemitter',
		'material-ui': 'materialUI',
		'react-router': 'ReactRouter',
		'classnames': 'classnames',
		'cookie': 'cookie',
		'echarts': 'echarts',
		'moment': 'moment',
		'lodash': 'lodash',
		'react-addons-css-transition-group': 'ReactCSSTransitionGroup'
	},
	resolve: {
		alias: {
			/**
			 * 别名机制，require('app')实际模块是public/src/pc/App.js
			 */
			'app': path.join(__dirname, '../src/pc/App.js'),
		}
	}
}
gulp.task("sdk.bundle", function(callback) {
	
	// 将打包配置传递给webpack并打包
	webpack(sdk_config, function(err, stats) {
		if (err) throw new gutil.PluginError("webpack", err);
		//输出打包过程信息
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		callback();
	});
});
if (process.env.NODE_ENV == "production") {
	/**
	 * 如果是生成环境，加入webpack的压缩库文件和自定义模块文件的插件
	 */
	var UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	});
	cubi_libs_config.plugins.push(UglifyJsPlugin);
	cubi_config.plugins.push(UglifyJsPlugin);
}