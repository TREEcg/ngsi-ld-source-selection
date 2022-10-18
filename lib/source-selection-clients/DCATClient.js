"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCATClient = void 0;
const query_sparql_1 = require("@comunica/query-sparql");
class DCATClient {
    constructor() {
        this.engine = new query_sparql_1.QueryEngine();
    }
    async getSources(query, entrypoints) {
        let sourceSelectionQueryInSparql = `
            PREFIX tree: <https://w3id.org/tree#>
            PREFIX dcat: <http://www.w3.org/ns/dcat#>
            PREFIX sh: <https://www.w3.org/ns/shacl#>
            select DISTINCT ?source
            where {
                ?dataset a dcat:Dataset .
                ?service dcat:servesdataset ?dataset ;
                         dcat:endpointURL ?source .
                ?dataset tree:shape ?shape .      
                          
            `;
        if (query.typeOfEntity)
            sourceSelectionQueryInSparql += `?shape sh:targetClass <${query.typeOfEntity}> .`;
        if (query.properties && query.properties.length) {
            sourceSelectionQueryInSparql += `?shape a sh:NodeShape;`;
            for (const p of query.properties) {
                sourceSelectionQueryInSparql += `sh:property [
                                    sh:path <${p}>
                                ];`;
            }
        }
        sourceSelectionQueryInSparql += `}`;
        console.log(sourceSelectionQueryInSparql);
        // Only use value of a source
        const sources = entrypoints.map(value => { return { value: value.value }; });
        const bindingsStream = await this.engine.queryBindings(sourceSelectionQueryInSparql, {
            sources: sources
        });
        // Consume results as an array (easier)
        const result = await bindingsStream.toArray();
        const relevantDatasources = [];
        for (const r of result) {
            // @ts-ignore
            if (r.get('source') != undefined && r.get('source').value) {
                // @ts-ignore
                console.log(r.get('source').value);
                relevantDatasources.push({
                    // @ts-ignore
                    value: r.get('source').value
                });
            }
        }
        return relevantDatasources;
    }
}
exports.DCATClient = DCATClient;
//# sourceMappingURL=DCATClient.js.map