import {DataSources, ISourceSelection, SourceSelectionQuery} from "../types/ISourceSelection";
import {CSRClient} from "../source-selection-clients/CSRClient";
import {DCATClient} from "../source-selection-clients/DCATClient";

export class InitSourceSelection implements ISourceSelection {
    async getSources(query: SourceSelectionQuery, entrypoints: DataSources): Promise<DataSources> {
        let relevantSources: DataSources = [];
        const dcatSources: DataSources = entrypoints.filter((value) => value.type?.toLowerCase() === "dcat");
        const csrSources: DataSources = entrypoints.filter((value => value.type?.toLowerCase() === "csr"));
        if (csrSources.length) {
            for (let ds of csrSources) {
                const csrClient = new CSRClient();
                const sources = await csrClient.getSources(query, [ds]);
                relevantSources = relevantSources.concat(sources);
            }
        }
        if (dcatSources.length) {
            // All dcatSources are federated queried
            const dcatClient = new DCATClient();
            const sources = await dcatClient.getSources(query, dcatSources);
            relevantSources = relevantSources.concat(sources);
        }

        return relevantSources;
    }
}
