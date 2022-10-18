export declare type IRegistrationInfo = {
    entities?: EntityInfo[];
    propertyNames?: string[];
    relationshipNames?: string[];
};
export declare type EntityInfo = {
    id?: string;
    idPattern?: string;
    type: string | string[];
};
