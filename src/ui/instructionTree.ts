import type { ExtensionContext, TreeDataProvider } from 'vscode'
import type { ASMInstruction } from '@/types'

import * as vscode from 'vscode'
import { TreeItem, TreeItemCollapsibleState, EventEmitter, Uri } from 'vscode'
import { openInstructionViewCommand } from '@/commands/openInstructionView'


export const instructionsTreeId: string = `instructionsTree`

export const initInstructionsTree = (context: ExtensionContext) => {
    const treeDataProvider = new InstructionsTreeDataProvider(context)
    vscode.window.registerTreeDataProvider(instructionsTreeId, treeDataProvider)
    return treeDataProvider
}

export class InstructionsTreeDataProvider implements TreeDataProvider<ASMInstruction | string> {

    private _onDidChangeTreeData = new EventEmitter<null>()
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event

    private data: {
        [key: string]: ASMInstruction[]
    } | null = null

    constructor (
        private context: ExtensionContext
    ) {
        this.readData()
    }

    private readData() {
        vscode.workspace.fs.readFile(
            Uri.joinPath(this.context.globalStorageUri, 'instructionsList.json')
        ).then(
            (array) => {
                this.data = JSON.parse(Buffer.from(array).toString('utf-8')) as {
                    [key: string]: ASMInstruction[]
                }
                this._onDidChangeTreeData.fire(null)
            }, 
            (error) => {
                console.log(`InstructionsTreeDataProvider can't read data:\n${error}`)
            }
        )
    }

    refresh() {
        this.readData()
    }

    getTreeItem(instruction: ASMInstruction | string) {
        if (typeof(instruction) == 'string') {
            return new TreeItem(
                instruction, 
                TreeItemCollapsibleState.Collapsed
            )
        } else {
            const treeItem = new TreeItem(
                instruction.name, 
                TreeItemCollapsibleState.None
            )

            treeItem.command = {
                command: openInstructionViewCommand,
                title: `Open ${instruction.name}`,
                arguments: [instruction] 
            }

            treeItem.tooltip = `Open ${instruction.description}`

            return treeItem
        }
    }

    getChildren(element?: string | ASMInstruction | null) {
        if (this.data == null)
            return null
        if (element == null)
            return Object.keys(this.data)
        else
            return this.data[element as string]
    }

}
