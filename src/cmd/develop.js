
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../config/webpack.config.dev.js');
const fs = require('fs')
const path = require('path')
const config = require('../config/config')

var develop = {
	names:['d', 'dev', 'develop'],
    run(argv){
        if (!fs.existsSync(path.join(process.cwd(), 'src'))) {
            console.log('~src folder.'.red)
            return
        }

        config.init()

        global.IS_DEV = true
        webpackConfig().then((cfg)=>{
            const compiler = Webpack(cfg);
            const devServerOptions = {
                stats: {
                    colors: true,
                },
                hot: true,
                open: true,
            };
            const server = new WebpackDevServer(compiler, devServerOptions);

            server.listen(global.port, '0.0.0.0', (err) => {
                console.log(`Starting server on http://localhost:${global.port}`);
            });
        })
    }
}

module.exports = develop
