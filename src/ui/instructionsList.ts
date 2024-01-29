import type {
    Webview, 
    WebviewViewProvider, 
    WebviewView, 
    WebviewViewResolveContext, 
    CancellationToken,
    ExtensionContext
} from 'vscode'

import { window, Uri, workspace } from 'vscode'
import { getUri, getNonce } from '@/util'
import { ASMInstruction, Message } from '@/types'


export const instructionsListWebviewId: string = `instructionsList`

export const initInstructionsListWebview = (context: ExtensionContext) => {
    const webviewProvider = new InstructionsListWebview(context)
    window.registerWebviewViewProvider(instructionsListWebviewId, webviewProvider)
    return webviewProvider
}

export class InstructionsListWebview implements WebviewViewProvider {

    private data: {
        [key: string]: ASMInstruction[]
    } | null = null

    private readData() {
        workspace.fs.readFile(
            Uri.joinPath(this.context.globalStorageUri, 'instructionsList.json')
        ).then(
            (array) => {
                this.data = JSON.parse(Buffer.from(array).toString('utf-8')) as {
                    [name: string]: ASMInstruction[]
                }
                this.sendDataMessage()
            }, 
            (error) => {
                console.log(`InstructionsListWebview can't read data:\n${error}`)
            }
        )
    }

    refresh() {
        this.readData()
    }

    private view: WebviewView | null = null

    constructor (
        private context: ExtensionContext
    ) {
        
    }

    public async resolveWebviewView (
        webviewView: WebviewView,
        context: WebviewViewResolveContext,
        token: CancellationToken
    ) {
        this.view = webviewView
        
		webviewView.webview.options = {
			enableScripts: true,
            localResourceRoots: [getUri(webviewView.webview, this.context.extensionUri, ['dist'])]
		}

		webviewView.webview.html = await this.getWebviewContent(webviewView.webview)
        this.setWebviewMessageListener(webviewView.webview)
    }

    private async getWebviewContent(
        webview: Webview
    ) {
        const scriptUri = getUri(webview, this.context.extensionUri, ['webview.js'])
        const vscodeUIUrl = getUri(webview, this.context.extensionUri, ['vscodeUI.js'])

        const codiconsUri = getUri(webview, this.context.extensionUri, ['codeicon.css'])
        const styleUri = getUri(webview, this.context.extensionUri, ['instructionsList.css'])
        
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
