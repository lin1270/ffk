
require('./globalInfo') ()
const cmds = require('./cmd/index')

var main = {
    exec (argv) {
		const cmdName = argv[0]
        const foundCmd = cmds.find((cmd)=>{
			for (let i = 0; i < cmd.names.length; ++i){
				if (cmd.names[i] === cmdName) {
					return cmd
				}
			}
			return null
		})
		if (foundCmd) {
			foundCmd.run(argv)
		}
    }
}

module.exports = main