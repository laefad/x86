import type { TextField } from '@vscode/webview-ui-toolkit'
import type { VscodeTree } from '@vscode-elements/elements'
import type { TreeItem, TreeItemIconConfig } from '@vscode-elements/elements/dist/vscode-tree/vscode-tree'
import type { InstructionList, Message } from '@/types'

// Add custom html elements
import { provideVSCodeDesignSystem, vsCodeTextField } from '@vscode/webview-ui-toolkit'
provideVSCodeDesignSystem().register(vsCodeTextField())


// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi()

document.addEventListener("DOMContentLoaded", () => {

    let data: InstructionList = null
    let filter: string = ""
    
    const searchField = document.getElementById("search") as TextField
    const tree = document.getElementById('tree') as VscodeTree

    searchField?.addEventListener("input", (event) => {
        filter = searchField.value
        fillTree(tree, data, filter)
    })

    vscode.postMessage({
        type: 'loaded'
    } as Message)

    window.addEventListener('message', (event) => {
        const message: Message = event.data

        if (message.type == 'data') {
            data = message.data
            fillTree(tree, data, filter)
        }
    })

    tree.addEventListener('vsc-tree-select', (event) => {

        const { itemType, value, label } = event.detail

        if (itemType == 'leaf') {
            vscode.postMessage({
                type: 'selected',
                data: {
                    url: value,
                    name: label
                }
            } as Message)
        }

    })
})

const fillTree = (tree: VscodeTree, data: InstructionList, filter: string) => {

    const icons: TreeItemIconConfig = {
        branch: 'chevron-down',
        open: 'chevron-up',
        leaf: 'dash'
    }

    if (!data) {
        tree.data = []
        return ;
    }

    const oldData = tree.data

    tree.data = Object.entries(data).reduce((treeData, [instructionsDirName, instructions]) => {

        const prevState = oldData.find((item) => item.label == instructionsDirName)

        const subItems = instructions
            .filter((instruction) => 
                instruction.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((instruction) => ({
                icons,
                label: instruction.name,
                value: instruction.url,
            } as TreeItem))

        treeData.push({
            // save previous state
            ...prevState,
            icons,
            label: instructionsDirName,
            decorations: [
                {
                    content: subItems.length.toString()
                }
            ],
            subItems,
        })

        return treeData
    }, [] as TreeItem[])

    tree.render()
}
