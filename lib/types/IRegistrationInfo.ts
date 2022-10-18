export type IRegistrationInfo = {
    entities?: EntityInfo[],
    propertyNames?: string[],
    relationshipNames?: string[]
}

export type EntityInfo = {
    id?: string,
    idPattern?: string,
    type: string | string[]
}
