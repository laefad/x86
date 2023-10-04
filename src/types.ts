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
