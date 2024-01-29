import type { ExtensionContext } from 'vscode'

import { Uri, workspace, commands } from 'vscode'
import { initOpenInstructionViewCommand } from '@/commands/openInstructionView'
import { initUpdateInstructionsListCommand, updateInstructionsListCommand } from '@/commands/updateInstructionsList'
import { InstructionView } from '@/ui/instructionView'
import { initInstructionsListWebview } from '@/ui/instructionsList'


export function activate(context: ExtensionContext) {
	const webviewProvider = initInstructionsListWebview(context)
	const instructionView = new InstructionView(context)

	initUpdateInstructionsListCommand(context, webviewProvider)
	initOpenInstructionViewCommand(context, instructionView)

	// create directories /whiteout2.x86 and /whiteout2.x86/pages
	workspace.fs.createDirectory(Uri.joinPath(context.globalStorageUri, 'pages'))

	commands.executeCommand(updateInstructionsListCommand)
}
