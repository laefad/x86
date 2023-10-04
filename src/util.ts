import type { Subscriptions } from '@/types'

import * as vscode from 'vscode'


export const initCommand = (
    subscriptions: Subscriptions, 
    commandId: string, 
    command: (...args: any[]) => any
) => {
    subscriptions.push(
        vscode.commands.registerCommand(commandId, command)
    )
}
