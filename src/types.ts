export type Subscriptions = { dispose(): any }[]

export interface Command {
    name: string
    command: string
}

export interface Instruction {
    name: string
    url: string
    description?: string
}

export type InstructionList = {
    [architectureType: string]: Instruction[]
} | null

export type Message = {
    type: 'data',
    data: InstructionList
} | {
    type: 'loaded'
} | {
    type: 'selected',
    data: Instruction
}
