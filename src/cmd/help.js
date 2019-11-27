
var colors = require('colors');


var help = {
	names:['help', 'h', '?', null, undefined],
    run(argv){
		console.log('ffk i'.green, '   安装种子')
		console.log('ffk d'.green, '   开发调试')
		console.log('ffk o'.green, '   o=output，打包')
    }
}

module.exports = help