const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/dnd-constructor/'
        : '/',
    outputDir: 'public_html',
    filenameHashing: true,
    runtimeCompiler: true,
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude
            .add(path.resolve(__dirname, './src/assets/icons/svg'))
            .end();

        config.module
            .rule('svg-icon')
            .test(/\.svg$/)
            .include
            .add(path.resolve(__dirname, './src/assets/icons/svg'))
            .end()
            .exclude
            .add(path.resolve(__dirname, './src/assets/icons/svg/journal'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: '[name]' })
            .end()
            .use('svgo-loader')
            .loader('svgo-loader')
            .options({
                plugins: [{
                    name: 'preset-default',
                    params: {
                        overrides: { removeViewBox: false },
                    },
                }, {
                    name: 'removeAttrs',
                    params: {
                        attrs: '(width|height|style|color|fill)',
                    },
                }]
            })
            .end();

        config.module
            .rule('svg-page')
            .test(/\.svg$/)
            .include
            .add(path.resolve(__dirname, './src/assets/icons/svg/journal'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: '[name]-page' })
            .end()
            .use('svgo-loader')
            .loader('svgo-loader')
            .options({
                plugins: [{
                    name: 'preset-default',
                    params: {
                        overrides: { removeViewBox: false },
                    },
                }, {
                    name: 'removeAttrs',
                    params: {
                        attrs: '(style|color)',
                    },
                }]
            })
            .end();
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "@/assets/styles/_variables.scss";',
                sassOptions: {
                    includePaths: ['./node_modules']
                }
            },
        },
        sourceMap: process.env.NODE_ENV !== 'production',
    },
}
