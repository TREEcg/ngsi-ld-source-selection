import { IRegistrationInfo } from "./IRegistrationInfo";
import { TimeInterval } from "./TimeInterval";
import { GeoJSON } from "geojson";
import { IKeyValuePair } from "./IKeyValuePair";
import { IRegistrationManagementInfo } from "./IRegistrationManagementInfo";
export declare type IContextSourceRegistration = {
    id?: string;
    type: string;
    registrationName?: string;
    description?: string;
    information: IRegistrationInfo[];
    tenant?: string;
    observationInterval?: TimeInterval;
    managementInterval?: TimeInterval;
    location?: GeoJSON;
    observationSpace?: GeoJSON;
    operationSpace?: GeoJSON;
    expiresAt?: string;
    endpoint: string;
    contextSourceInfo: IKeyValuePair[];
    scope?: string | string[];
    mode?: string;
    operations: string[];
    refreshRate?: string;
    management?: IRegistrationManagementInfo;
};
