import {DataSources, ISourceSelection, SourceSelectionQuery} from "../types/ISourceSelection";
import {JsonLdParser} from "jsonld-streaming-parser";
import {makeSureTrailingSlash} from "../utils/utils";
import * as RDF from 'rdf-js';
const streamifyString = require('streamify-string');
import {DataFactory} from "rdf-data-factory";
const DF = new DataFactory<RDF.BaseQuad>();


export class CSRClient implements ISourceSelection {
    quadStreamToQuadArray = async (input: RDF.Stream) : Promise<RDF.Quad[]> => {
        return new Promise((resolve, reject) => {
            const quads : RDF.Quad[] = []
            input
                .on('data', (quad) => {quads.push(quad)})
                .on('error', (error) => reject(new Error(`Error parsing notification body.\n${error.message}`)))
                .on('end', () => resolve(quads));
        })
    }

    async getSources(query: SourceSelectionQuery, entrypoints: DataSources): Promise<DataSources> {
        const relevantSources: DataSources = [];
        let store: RDF.Quad[] = [];
        for (const cat of entrypoints) {
            const csrEndpoint = makeSureTrailingSlash(cat.value);
            let csrRequest = csrEndpoint;
            if (query.typeOfEntity) csrRequest += '?type=' + encodeURIComponent(query.typeOfEntity);
            csrRequest += '&attrs=';

            if (query.properties?.length) {
                for (const p of query.properties) {
                    csrRequest += encodeURIComponent(p) + ",";
                }
            }
            console.log(csrRequest);
            try {
               const res = await fetch(csrRequest!, {
                   headers: {
                       'Accept': 'application/ld+json'
                   }
                });
               const resJsonLd = await res.json();
               console.log(resJsonLd)
                const myParser = JsonLdParser.fromHttpResponse(
                    csrRequest!,
                    'application/ld+json'
                );
                const data = myParser.import(streamifyString(JSON.stringify(resJsonLd)));
                const quads : RDF.Quad[] = await this.quadStreamToQuadArray(data);
                const endpoints = quads
                    .filter((quad) => quad.predicate.value === 'https://uri.etsi.org/ngsi-ld/endpoint')
                    .map((quad) => { return { value: quad.object.value } });
                for (const e of endpoints) {
                    // @ts-ignore
                    if (e.value) {
                        relevantSources.push({
                            // @ts-ignore
                            value: e.value
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to retrieve from CSR endpoint: ' + csrRequest);
                console.error(e);
            }
        }
        return relevantSources;
    }
}

