import type { ExtensionContext } from 'vscode'
import type { InstructionsListWebview } from '@/ui/instructionsList'

import { initCommand } from '@/util'
import { Parser } from '@/parser'


export const updateInstructionsListCommand: string = `updateInstructionsList`

export const initUpdateInstructionsListCommand = (
    context: ExtensionContext,
    parser: Parser,
    instructionTree: InstructionsListWebview
) => {
    initCommand(
		context.subscriptions, 
		updateInstructionsListCommand, 
		updateInstructionsList.bind(null, context, parser, instructionTree)
	)
}

const updateInstructionsList = async (
    context: ExtensionContext,
    parser: Parser,
    instructionTree: InstructionsListWebview
) => {
    // TODO rework
    instructionTree.refresh()
}
