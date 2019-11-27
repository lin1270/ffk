const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pagesDir = path.join(process.cwd(), 'src/pages/')

module.exports = {
    init() {
        const configStream = fs.readFileSync(path.join(process.cwd(), 'ffk.config.json'))
        let cfgInfo = {}
        if (configStream) {
            try {
                cfgInfo = JSON.parse(configStream)
            } catch(e) {
                cfgInfo = {}
            }
        }
        this.project = cfgInfo
    },
    entries() {
        let result = {}
        const dirs = fs.readdirSync(pagesDir)
        dirs.forEach((dir)=>{
            if (dir !== '.' && dir !== '..') {
                var fullDir = path.join(pagesDir, dir);  
                const state = fs.statSync(fullDir)
                if (state && state.isDirectory()) {
                    result[dir] = [path.join(fullDir, './index.js')]
                    if (global.IS_DEV) {
                        result[dir].unshift(
                            ...['webpack/hot/dev-server',
                            `webpack-dev-server/client?http://localhost:${global.port}`])
                    }
                }
            }
        })
        return result
    },

    htmlPlugins() {
        let result = []
        const dirs = fs.readdirSync(pagesDir)
        dirs.forEach((dir)=>{
            if (dir !== '.' && dir !== '..') {
                var fullDir = path.join(pagesDir, dir);  
                const state = fs.statSync(fullDir)
                if (state && state.isDirectory()) {
                    const configStream = fs.readFileSync(path.join(pagesDir, dir, 'index.config.json'))
                    let cfgInfo = {}
                    if (configStream) {
                        try {
                            cfgInfo = JSON.parse(configStream)
                        } catch(e) {
                            cfgInfo = {}
                        }
                    }


                    const item = {
                        filename: `${dir}.html`,
                        template: `!!ejs-loader!${fullDir}\\index.ejs`,
                        chunks: [dir],
                        inject: true,
                        isdev: !!global.IS_DEV,
                        title: cfgInfo.title || '--',
                        px2rem: this.project.px2rem,
                        keywords: cfgInfo.keywords,
                        useVconsole: cfgInfo.useVconsole,
                    }

                    if (!global.IS_DEV) {
                        item.minify = {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeAttributeQuotes: true
                            // more options:
                            // https://github.com/kangax/html-minifier#options-quick-reference
                        }
                        item.chunksSortMode = 'dependency'
                    }

                    result.push(new HtmlWebpackPlugin(item))
                }
            }
        })
        return result
    },

    project: {}
}