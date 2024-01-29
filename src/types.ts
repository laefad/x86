export type Subscriptions = { dispose(): any }[]

export interface Command {
    name: string
    command: string
}

export interface ASMInstruction {
    name: string
    url: string
    description: string
}

export type Message = {
    type: 'data',
    data: {
        [name: string]: ASMInstruction[]
    } | null
} | {
    type: 'loaded'
}
