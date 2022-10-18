import {GeoJSON} from "geojson";

export interface ISourceSelection {
    /**
     * @param query - to retrieve data sources that contain a type of entity with certain properties in a certain location
     * @param entrypoints - context source registries or DCAT endpoint
     */
    getSources(query: SourceSelectionQuery, entrypoints: DataSources): Promise<DataSources>
}

export type DataSource = {
    type?: string;
    value: string;
};

export type DataSources = DataSource[];

export type SourceSelectionQuery = {
    typeOfEntity?: string,
    properties?: string[],
    locationInWkt?: string,
    locationInGeoJSON?: GeoJSON
}
