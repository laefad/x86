import type { ExtensionContext } from 'vscode'
import type { InstructionView } from '@/ui/instructionView'

import { initCommand } from '@/util'


export const openInstructionViewCommand: string = `openInstructionView`

export const initOpenInstructionViewCommand = (
	context: ExtensionContext,
	instructionView: InstructionView
) => {
    initCommand(
		context.subscriptions, 
		openInstructionViewCommand, 
		instructionView.openPanel.bind(instructionView)
	)
}
