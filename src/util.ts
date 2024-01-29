import type { Subscriptions } from '@/types'
import type { Webview } from 'vscode'

import { Uri, commands } from 'vscode'


export const initCommand = (
    subscriptions: Subscriptions, 
    commandId: string, 
    command: (...args: any[]) => any
) => {
    subscriptions.push(
        commands.registerCommand(commandId, command)
    )
}

export const getNonce = () => {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

export const getUri = (
    webview: Webview, 
    extensionUri: Uri, 
    pathList: string[]
) => {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList))
}
