"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSourceSelection = void 0;
const CSRClient_1 = require("../source-selection-clients/CSRClient");
const DCATClient_1 = require("../source-selection-clients/DCATClient");
class InitSourceSelection {
    async getSources(query, entrypoints) {
        let relevantSources = [];
        const dcatSources = entrypoints.filter((value) => value.type?.toLowerCase() === "dcat");
        const csrSources = entrypoints.filter((value => value.type?.toLowerCase() === "csr"));
        if (csrSources.length) {
            for (let ds of csrSources) {
                const csrClient = new CSRClient_1.CSRClient();
                const sources = await csrClient.getSources(query, [ds]);
                relevantSources = relevantSources.concat(sources);
            }
        }
        if (dcatSources.length) {
            // All dcatSources are federated queried
            const dcatClient = new DCATClient_1.DCATClient();
            const sources = await dcatClient.getSources(query, dcatSources);
            relevantSources = relevantSources.concat(sources);
        }
        return relevantSources;
    }
}
exports.InitSourceSelection = InitSourceSelection;
//# sourceMappingURL=init-source-selection.js.map