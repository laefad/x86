import type { ExtensionContext, Webview } from 'vscode'
import type { ASMInstruction } from '@/types'

import { Uri, ViewColumn, window, workspace } from 'vscode'
import { JSDOM } from 'jsdom'

export class InstructionView {

	constructor (
		private context: ExtensionContext
	) {

	}

	public async openPanel (
		instruction: ASMInstruction
	) {
		// NOTE: Some html files have : in their names. 
		// Mac turns them to /. Windows refuses to write them.
		// SOLUTION: Change all : into _
		const fileName = instruction.url.replace(/:/gi, '_').concat('.html')

		const panel = window.createWebviewPanel(
			'x86.instructionView',
			`${instruction.name}`,
			ViewColumn.One
		)

		panel.iconPath = Uri.joinPath(this.context.extensionUri, 'media/icons/x86_white_128.png')

		panel.webview.html = '<html>TODO Dowloading template html</html>'
		
		let html = await this.openFile(fileName)
		if (!html)
			html = await this.downloadFile(instruction.url, fileName)

		panel.webview.html = this.prepareHtmlForWebView(html, panel.webview)
	}

	private async openFile (
		fileName: string
	) {
		try {
			const fileUri = Uri.joinPath(this.context.globalStorageUri, 'pages', fileName)
			const file = await workspace.fs.readFile(fileUri)
			return Buffer.from(file).toString('utf-8')
		} catch (err) {
			console.log(`File ${fileName} doesn't exists in cache`)
			return null
		}
	}

	private async downloadFile (
		sourceUrl: string,
		fileName: string
	) {
		// TODO catch error if dowload failed 
		const response = await fetch(`https://www.felixcloutier.com/${sourceUrl}`)
		const jsdom = new JSDOM(await response.text())

		// Remove original site navigation 
		jsdom.window.document.querySelector('header')?.remove()
		jsdom.window.document.querySelector('footer')?.remove()

		// Remove strange attributes from <html>
		const htmlELement = jsdom.window.document.querySelector('html')
		htmlELement?.removeAttribute('xmlns:svg')
		htmlELement?.removeAttribute('xmlns:x86')

		const html = jsdom.serialize()

		await workspace.fs.writeFile(
			Uri.joinPath(this.context.globalStorageUri, 'pages', fileName),
			Buffer.from(html)
		)

		return html
	}

	private prepareHtmlForWebView (
		html: string,
		webview: Webview
	) {
		const jsdom = new JSDOM(html)

		// Use a content security policy to only allow loading styles from our extension directory
		const metaElement = jsdom.window.document.createElement('meta')
		metaElement.httpEquiv = "Content-Security-Policy"
		metaElement.content = `default-src 'none'; style-src ${webview.cspSource};`
		jsdom.window.document.head.appendChild(metaElement) 

		// Get the path to the local stylesheet, then replace the original stylesheet
		const styleUri = Uri.joinPath(this.context.extensionUri, '/media/felixcloutier.com_x86_style.css')
		const styleWebviewUri = webview.asWebviewUri(styleUri)
		const linkElement = jsdom.window.document.querySelector<HTMLLinkElement>('head > link')!
		linkElement.href = styleWebviewUri.toString(true) 

		return jsdom.serialize()
	}
}
