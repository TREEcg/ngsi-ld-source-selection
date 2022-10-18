import { DataSources, ISourceSelection, SourceSelectionQuery } from "../types/ISourceSelection";
export declare class InitSourceSelection implements ISourceSelection {
    getSources(query: SourceSelectionQuery, entrypoints: DataSources): Promise<DataSources>;
}
