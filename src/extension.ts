import type { ExtensionContext } from 'vscode'

import * as vscode from 'vscode'

import { initOpenInstructionViewCommand } from '@/commands/openInstructionView'
import { initUpdateInstructionsListCommand, updateInstructionsListCommand } from '@/commands/updateInstructionsList'
import { initInstructionsTree } from '@/ui/instructionTree'
import { InstructionView } from './ui/instructionView'

export function activate(context: ExtensionContext) {
	const instructionsTree = initInstructionsTree(context)
	const instructionView = new InstructionView(context)

	initUpdateInstructionsListCommand(context, instructionsTree)
	initOpenInstructionViewCommand(context, instructionView)

	// create directories /whiteout2.x86 and /whiteout2.x86/pages
	vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(context.globalStorageUri, 'pages'))

	vscode.commands.executeCommand(updateInstructionsListCommand)
}
