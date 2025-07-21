import type { ExtensionContext } from 'vscode'
import type { Instruction, InstructionList } from '@/types'

import { Uri, workspace } from 'vscode'
import { JSDOM } from 'jsdom'

export class Parser {

    private listPath: Uri

    constructor (
        private context: ExtensionContext,
    ) {
        this.listPath = Uri.joinPath(this.context.globalStorageUri, 'instructionsList.json')
    }

    public async getInstructionsList(forceUpdate = false) {

        let instructionsList: InstructionList | null = null

        try {
            const file = await workspace.fs.readFile(this.listPath)
            instructionsList = JSON.parse(Buffer.from(file).toString('utf-8')) as InstructionList
        } catch {
            console.log(`Can't read a saved list of instructions from a file ${this.listPath.toString()}`)
        }

        if (forceUpdate || instructionsList == null) {
            // TODO check error from parse
            instructionsList = await this.parseInstructionsList()
            workspace.fs.writeFile(this.listPath, Buffer.from(JSON.stringify(instructionsList)))
        }

        return instructionsList
    }

    private async parseInstructionsList() {
        return fetch('https://www.felixcloutier.com/x86/index.html')
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
                        } as Instruction)
                    ))

                return headers.reduce((obj, header, i) => {
                    obj![header] = instructions[i]
                    return obj
                }, {} as InstructionList)
            })
    }
}
