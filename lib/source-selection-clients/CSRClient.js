"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSRClient = void 0;
const jsonld_streaming_parser_1 = require("jsonld-streaming-parser");
const utils_1 = require("../utils/utils");
const streamifyString = require('streamify-string');
const rdf_data_factory_1 = require("rdf-data-factory");
const DF = new rdf_data_factory_1.DataFactory();
class CSRClient {
    constructor() {
        this.quadStreamToQuadArray = async (input) => {
            return new Promise((resolve, reject) => {
                const quads = [];
                input
                    .on('data', (quad) => { quads.push(quad); })
                    .on('error', (error) => reject(new Error(`Error parsing notification body.\n${error.message}`)))
                    .on('end', () => resolve(quads));
            });
        };
    }
    async getSources(query, entrypoints) {
        const relevantSources = [];
        let store = [];
        for (const cat of entrypoints) {
            const csrEndpoint = (0, utils_1.makeSureTrailingSlash)(cat.value);
            let csrRequest = csrEndpoint;
            if (query.typeOfEntity)
                csrRequest += '?type=' + encodeURIComponent(query.typeOfEntity);
            csrRequest += '&attrs=';
            if (query.properties?.length) {
                for (const p of query.properties) {
                    csrRequest += encodeURIComponent(p) + ",";
                }
            }
            console.log(csrRequest);
            try {
                const res = await fetch(csrRequest, {
                    headers: {
                        'Accept': 'application/ld+json'
                    }
                });
                const resJsonLd = await res.json();
                console.log(resJsonLd);
                const myParser = jsonld_streaming_parser_1.JsonLdParser.fromHttpResponse(csrRequest, 'application/ld+json');
                console.log(myParser);
                const data = myParser.import(streamifyString(JSON.stringify(resJsonLd)));
                console.log(data);
                const quads = await this.quadStreamToQuadArray(data);
                console.log(quads);
                const endpoints = quads
                    .filter((quad) => quad.predicate.value === 'https://uri.etsi.org/ngsi-ld/endpoint')
                    .map((quad) => { return { value: quad.object.value }; });
                console.log("Endpoints: " + JSON.stringify(endpoints));
                for (const e of endpoints) {
                    // @ts-ignore
                    if (e.value) {
                        relevantSources.push({
                            // @ts-ignore
                            value: e.value
                        });
                    }
                }
            }
            catch (e) {
                console.error('Failed to retrieve from CSR endpoint: ' + csrRequest);
                console.error(e);
            }
        }
        return relevantSources;
    }
}
exports.CSRClient = CSRClient;
//# sourceMappingURL=CSRClient.js.map