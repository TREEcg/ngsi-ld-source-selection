import { DataSources, ISourceSelection, SourceSelectionQuery } from "../types/ISourceSelection";
import * as RDF from 'rdf-js';
export declare class CSRClient implements ISourceSelection {
    quadStreamToQuadArray: (input: RDF.Stream) => Promise<RDF.Quad[]>;
    getSources(query: SourceSelectionQuery, entrypoints: DataSources): Promise<DataSources>;
}
