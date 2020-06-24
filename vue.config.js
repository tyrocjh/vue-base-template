'use strict'

const path = require('path')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || 8080

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false, // 生产环境不需要source map
  css: {
    extract: {
      filename: 'styles/[name].[contenthash:8].css',
      chunkFilename: 'styles/[name].[contenthash:8].css'
    }
  },
  configureWebpack(config) {
    if (process.env.NODE_ENV !== 'development') {
      config.output.filename = 'scripts/[name].[contenthash:8].js'
      config.output.chunkFilename = 'scripts/[name].[contenthash:8].js'
    } else {
      config.output.filename = 'scripts/[name].[hash:8].js'
      config.output.chunkFilename = 'scripts/[name].[hash:8].js'
    }
  },
  chainWebpack(config) {
    // 别名
    config.resolve.alias
      .set('@', resolve('src'))

    // 骨架屏配置
    config
      .plugin('SkeletonWebpackPlugin')
      .use(new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: resolve('src/skeleton.js'),
          }
        },
        minimize: true,
        quiet: true,
        router: {
          mode: 'history',
          routes: [{
            path: '/',
            skeletonId: 'skeleton1'
          }, {
            path: '/about',
            skeletonId: 'skeleton2'
          }]
        }
      }))

    // 去掉元素间的空格，减少文件体积
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    // 修改图片打包路径
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('file-loader')
      .options({
        name: 'images/[name].[hash:8].[ext]'
      })

    // svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  devServer: {
    port: port,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'https://api.it120.cc/justcook/',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
}
