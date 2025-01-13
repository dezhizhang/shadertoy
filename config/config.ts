/*
 * :file description: 
 * :name: /shadertoy/config/config.ts
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-07 23:28:13
 * :last editor: 张德志
 * :date last edited: 2025-01-13 23:07:18
 */
import path from 'path';
import { defineConfig } from 'umi';
import { OSS_CONFIG } from  './oss';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
const isProduction = process.env.NODE_ENV === 'production';
const WebpackAliyunOssPlugin = require('webpack-aliyun-oss-plugin');
//获取package.json中的version变量,需要根据项目目录结构确认
const PKG = require(path.resolve(process.cwd(), 'package.json'));
// 版本号
const VERSION = `v${PKG.version}`;

// 静态文件路径前缀
const VER_PATH =
  REACT_APP_ENV === 'prod' ? `https://cdn.shuqin.cc/${PKG.name}/` : `/`; // 获取编译环境配置

const publicPath = isProduction ? VER_PATH : `/`;

export default defineConfig({
  // todo
  favicon: 'https://www.xiaozhi.shop/public/image/favicon.ico',
  hash: true,
  antd: {
    config: {
      prefixCls: 'sungent-ant', // 修改HTML里面的类名前缀
    },
  },

  dva: {
    hmr: true,
  },
  // dynamicImport: {
  //   loading: '@/components/PageLoading',
  // },
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'sungent-ant',
    },
    javascriptEnabled: true,
  },
  chainWebpack(memo: any) {
    memo.module.rule('less').exclude.add(/@ui/);
    memo.output
      .filename(`${VERSION}/js/[name].[hash:8].js`)
      .chunkFilename(`${VERSION}/js/[name].[contenthash:8].chunk.js`);

    // 修改css输出目录
    memo.plugin('extract-css').tap(() => [
      {
        filename: `${VERSION}/css/[name].[contenthash:8].css`,
        chunkFilename: `${VERSION}/css/[name].[contenthash:8].chunk.css`,
        ignoreOrder: true,
      },
    ]);

    memo.plugin('WebpackAliyunOssPlugin').use(WebpackAliyunOssPlugin, [
      {
        ...OSS_CONFIG,
        filter: function (build:any) {
          return !/\.html$/.test(build);
        },
      },
    ]);
  
    memo.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use('url-loader')
      .loader(require.resolve('url-loader'))
      .tap((options: any) => {
        const newOptions = {
          ...options,
          limit: 1000,
          publicPath,
          name: `${VERSION}/img/[name].[hash:8].[ext]`,
          fallback: {
            ...options.fallback,
            options: {
              name: `${VERSION}/img/[name].[hash:8].[ext]`,
              esModule: false,
            },
          },
        };
        return newOptions;
      });

    // 修改svg输出目录
    memo.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options: any) => ({
        ...options,
        limit: 100000,
        name: `${VERSION}/img/[name].[hash:8].[ext]`,
      }));

    // 修改fonts输出目录
    memo.module
      .rule('fonts')
      .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options: any) => ({
        ...options,
        name: `${VERSION}/fonts/[name].[hash:8].[ext]`,
        fallback: {
          ...options.fallback,
          options: {
            name: `${VERSION}/fonts/[name].[hash:8].[ext]`,
            esModule: false,
          },
        },
      }));

    memo.module.rule('less').exclude.add(/@ui/);
    memo.module
      .rule('lessInUi')
      .test(/\.less$/)
      .include.add(/@ui/)
      .end()
      .use('style-loader')
      .loader('style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .options({ modules: true })
      .end()
      .use('less-loader')
      .loader('less-loader')
      .options({
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: { prefixCls: 'sungent-ant' },
        },
      })
      .end();

    memo.module
      .rule('antdImportInUi')
      .test(/\.(js)$/)
      .include.add(/@ui/)
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        plugins: [
          [
            'import',
            { libraryName: 'antd', libraryDirectory: 'es', style: true },
          ],
        ],
      });
  },
  

  targets: {
    ie: 11,
  },
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'root-entry-name': 'variable',
  },

  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  // title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  outputPath: 'build',
  base: '/',
  define: {
    PROJECT_VERSION: VERSION,
    REACT_APP_ENV,
  },
  publicPath: publicPath,
  // Fast Refresh 热更新
  fastRefresh: {},
  webpack5: {},
  nodeModulesTransform: {
    type: 'none',
  },
  extraBabelPlugins: [
    // // 生产环境移除console
    // isProduction && REACT_APP_ENV === 'prod' ? 'transform-remove-console' : '',
  ],
});
