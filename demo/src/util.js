const QueryEngine = require('@comunica/query-sparql').QueryEngine;

export async function fetch3namesWithComunica(name) {
    const myEngine = new QueryEngine();

    const bindingsStream = await myEngine.queryBindings(`
            PREFIX prov: <http://www.w3.org/ns/prov#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      SELECT DISTINCT ?name
            WHERE {
        		?artist a prov:Agent ;
        			rdfs:label ?name .
            FILTER regex(?name, '${name}', "i")
      }
      LIMIT 3`, {
        sources: ['https://stad.gent/sparql'],
    });
    // Consume results as an array (easier)
    return await bindingsStream.toArray();
}
