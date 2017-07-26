var glob = require('glob')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
const resolve = dir => path.join(__dirname, '..', dir)
const controllerPath = 'src/controllers/'
const pagePath = 'src/pages/'


var entries = getEntry(controllerPath + '**/*.js', controllerPath)
var chunks = Object.keys(entries)

const devWebpackConfig = merge(baseWebpackConfig, {
  entry: entries,
  output: {
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/',
    filename: controllerPath + '[name].js',
    chunkFilename: controllerPath + '[id].chunk.js?[chunkhash]'
  },
  module: {
    // rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CommonsChunkPlugin({
      name: 'vendors', 
      chunks: chunks,
      minChunks: 3
    }),
    new FriendlyErrorsPlugin()
  ]
})

var pages = Object.keys(getEntry(pagePath + '**/*.html', pagePath))
pages.forEach(function (pathname) {
  var conf = {
    filename: resolve('dist/'+ pagePath + pathname + '.html'), // 生成的html存放路径，相对于path
    template: resolve( pagePath + pathname + '.html'), // html模板路径
    inject: false // js插入的位置，true/'head'/'body'/false
    /*
        * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
        * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
        * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
        * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
    // minify: { //压缩HTML文件
    //     removeComments: true, //移除HTML中的注释
    //     collapseWhitespace: false //删除空白符与换行符
    // }
  }
  if (pathname in devWebpackConfig.entry) {
    // conf.favicon = '../src/imgs/favicon.ico'
    conf.inject = 'body'
    conf.chunks = ['vendors', pathname]
    conf.hash = true
  }
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
})

function getEntry (globPath, pathDir) {
  var files = glob.sync(globPath)
  var entries = {}, entry, dirname, basename, pathname, extname

  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    // var split = filepath.split('/');
    //  var name = split[split.length - 2];
    dirname = path.dirname(entry)
    extname = path.extname(entry)
    basename = path.basename(entry, extname)
    pathname = path.join(dirname, basename)
    pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir.replace(/\//g, '\\\\')), '') : pathname
    entries[pathname] = resolve(entry)
  }
  console.log(JSON.stringify(entries))
  return entries
}
console.log(JSON.stringify(devWebpackConfig.output))
// webpack(devWebpackConfig)
module.exports = devWebpackConfig
