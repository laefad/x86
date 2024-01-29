import type { ExtensionContext } from 'vscode'
import type { ASMInstruction } from '@/types'
import type { InstructionsListWebview } from '@/ui/instructionsList'

import { Uri } from 'vscode'
import * as vscode from 'vscode'
import { JSDOM } from 'jsdom'
import { initCommand } from '@/util'


export const updateInstructionsListCommand: string = `updateInstructionsList`

export const initUpdateInstructionsListCommand = (
    context: ExtensionContext,
    instructionTree: InstructionsListWebview
) => {
    initCommand(
		context.subscriptions, 
		updateInstructionsListCommand, 
		updateInstructionsList.bind(null, context, instructionTree)
	)
}

const updateInstructionsList = async (
    context: ExtensionContext,
    instructionTree: InstructionsListWebview
) => {
    const data = await fetch('https://www.felixcloutier.com/x86/index.html')
        .then(response => response.text())
        .then(text => {
            return new JSDOM(text)
        })
        .then(jsdom => {
            // parse tables and headers 
            const headers = Array.from(jsdom.window.document.querySelectorAll('h2'))
                .map(header => header.textContent!)

            const instructions = Array.from(jsdom.window.document.querySelectorAll('table > tbody'))
                .map(tbody => Array.from(tbody.children).splice(1)) // skip header row
                .map(rows => rows.map(
                    row => ({
                        name: row.children[0].children[0].textContent, // tr -> td -> a 
                        url: (row.children[0].children[0] as HTMLAnchorElement).href, // tr -> td -> a -> href
                        description: row.children[1].textContent // tr -> td2
                    } as ASMInstruction)
                ))

            return headers.reduce((obj, header, i) => {
                obj[header] = instructions[i]
                return obj
            }, {} as {
                [key: string]: ASMInstruction[]
            })
        })

    vscode.workspace.fs.writeFile(
        Uri.joinPath(context.globalStorageUri, 'instructionsList.json'),
        Buffer.from(JSON.stringify(data))
    ).then(() => {
        instructionTree.refresh()
    })

}
