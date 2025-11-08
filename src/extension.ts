import type { ExtensionContext } from 'vscode'

import { Uri, workspace, commands } from 'vscode'
import { initOpenInstructionViewCommand } from '@/commands/openInstructionView'
import { initUpdateInstructionsListCommand, updateInstructionsListCommand } from '@/commands/updateInstructionsList'
import { InstructionView } from '@/ui/instructionView'
import { initInstructionsListWebview } from '@/ui/instructionsList'
import { Parser } from '@/parser'


export function activate(context: ExtensionContext) {

	const parser = new Parser(context)
	const webviewProvider = initInstructionsListWebview(context, parser)
	const instructionView = new InstructionView(context)

	initUpdateInstructionsListCommand(context, parser, webviewProvider)
	initOpenInstructionViewCommand(context, instructionView)

	// create directories /laefad.x86 and /laefad.x86/pages
	workspace.fs.createDirectory(Uri.joinPath(context.globalStorageUri, 'pages'))

	commands.executeCommand(updateInstructionsListCommand)
}
