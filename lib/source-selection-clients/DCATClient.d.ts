import { DataSources, ISourceSelection, SourceSelectionQuery } from "../types/ISourceSelection";
import { QueryEngine } from '@comunica/query-sparql';
export declare class DCATClient implements ISourceSelection {
    engine: QueryEngine;
    constructor();
    getSources(query: SourceSelectionQuery, entrypoints: DataSources): Promise<DataSources>;
}
