import type { Webview, WebviewViewProvider, WebviewView,ExtensionContext } from 'vscode'
import type { InstructionList, Message } from '@/types'
import type { Parser } from '@/parser'

import { window, commands } from 'vscode'
import { getUri, getNonce } from '@/util'
import { openInstructionViewCommand } from '@/commands/openInstructionView'


export const instructionsListWebviewId: string = `instructionsList`

export const initInstructionsListWebview = (
    context: ExtensionContext,
    parser: Parser
) => {
    const webviewProvider = new InstructionsListWebview(context, parser)
    window.registerWebviewViewProvider(instructionsListWebviewId, webviewProvider)
    return webviewProvider
}

export class InstructionsListWebview implements WebviewViewProvider {

    private data: InstructionList = null

    private view: WebviewView | null = null

    constructor (
        private context: ExtensionContext,
        private parser: Parser
    ) {
        
    }

    public async refresh() {
        this.data = await this.parser.getInstructionsList()
        this.sendDataMessage()
    }

    public async resolveWebviewView (
        webviewView: WebviewView
    ) {
        this.view = webviewView
        
		webviewView.webview.options = {
			enableScripts: true
		}

		webviewView.webview.html = await this.getWebviewContent(webviewView.webview)
        this.setWebviewMessageListener(webviewView.webview)
    }

    private async getWebviewContent(
        webview: Webview
    ) {
        const scriptUri = getUri(webview, this.context.extensionUri, ['dist', 'webview.js'])
        const vscodeUIUrl = getUri(webview, this.context.extensionUri, ['dist', 'vscodeUI.js'])

        const codiconsUri = getUri(webview, this.context.extensionUri, ['dist', 'codicon.css'])
        const styleUri = getUri(webview, this.context.extensionUri, ['media', 'instructionsList.css'])
        
        const nonce = getNonce()

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta 
                http-equiv="Content-Security-Policy" 
                content="
                    default-src 'none'; 
                    img-src ${webview.cspSource};
                    script-src ${webview.cspSource} 'nonce-${nonce}'; 
                    style-src 'unsafe-inline' ${webview.cspSource};
                    style-src-elem 'unsafe-inline' ${webview.cspSource};
                    font-src ${webview.cspSource};
                "
            >

            <link rel="stylesheet" nonce="${nonce}" href="${codiconsUri}" id="vscode-codicon-stylesheet">
            <link rel="stylesheet" nonce="${nonce}" href="${styleUri}">

            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
            <script type="module" nonce="${nonce}" src="${vscodeUIUrl}"></script>

            <title>Instructions List</title>
        </head>
        <body>
            <vscode-text-field 
                id="search"
                placeholder="Search"
                autofocus
                size="90"
            ></vscode-text-field>

            <vscode-tree
                id="tree"
            ></vscode-tree>
        </body>
        </html>
        `
    }

    private setWebviewMessageListener(
        webview: Webview
    ) {
        webview.onDidReceiveMessage(
            (message: Message) => {
                const { type } = message 

                if (type == 'loaded')
                    this.sendDataMessage()
                else if (type == 'selected')
                    commands.executeCommand(openInstructionViewCommand, message.data)
                
            }
        )
    }

    private sendDataMessage () {
        this.view?.webview.postMessage({
            type: 'data',
            data: this.data
        } as Message)
    }

}
