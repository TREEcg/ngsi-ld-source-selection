import { useState, useEffect } from "react";
import { Sources } from './Sources';
import {InitSourceSelection} from "../../lib";

function SourceSelectionForm() {
    const [timeForSourceSelection, setTimeForSourceSelection] = useState(0); // ms

    const [typeOfEntityOptions, setTypeOfEntityOptions] = useState([
        "https://purl.eu/ns/mobility/passenger-transport-hubs#ResourceReport",
        "http://schema.mobivoc.org/#BicycleParkingStation"
    ]);
    const typeOfEntityOptionsHtml = [];
    for (const t of typeOfEntityOptions) {
        typeOfEntityOptionsHtml.push(<option key={t} value={t}>{t}</option>);
    }

    const [propertyOptions, setPropertyOptions] = useState([
        "http://schema.mobivoc.org/#capacity",
        "http://www.w3.org/ns/locn#geometry",
        "https://uri.etsi.org/ngsi-ld/location",
        "https://purl.eu/ns/mobility/passenger-transport-hubs#propulsion",
        "http://purl.org/dc/terms/spatial",
        "https://purl.eu/ns/mobility/passenger-transport-hubs#Mobiliteitsdienst.vervoermiddel",
        "https://purl.eu/ns/mobility/passenger-transport-hubs#number",
        "http://purl.org/dc/elements/1.1/date",
        "https://purl.eu/ns/mobility/passenger-transport-hubs#service",
        "https://purl.eu/ns/mobility/passenger-transport-hubs#status",
        "http://purl.org/dc/terms/type"
    ]);
    const propertyOptionsHtml = [];
    for (const p of propertyOptions) {
        propertyOptionsHtml.push(<option key={p} value={p}>{p}</option>);
    }

    const [csrEntrypoints, setCsrEntrypoints] = useState([]);
    const [dcatEntrypoints, setDcatEntrypoints] = useState([]);

    const [csrOptions, setCsrOptions] = useState([
        "http://localhost:8080/ngsi-ld/v1/csourceRegistrations"
    ]);
    const csrOptionsHtml = [];
    for (const c of csrOptions) {
        csrOptionsHtml.push(<option key={c} value={c}>{c}</option>);
    }

    const [dcatOptions, setDcatOptions] = useState([
        "http://localhost:8081"
    ]);
    const dcatOptionsHtml = [];
    for (const d of dcatOptions) {
        dcatOptionsHtml.push(<option key={d} value={d}>{d}</option>);
    }

    const [sourceSelectionQuery, setSourceSelectionQuery] = useState({
        typeOfEntity: "https://purl.eu/ns/mobility/passenger-transport-hubs#ResourceReport"
    });
    const [sources, setSources] = useState([]);

    useEffect(() => {
        runSourceSelection()
    }, [sourceSelectionQuery, csrEntrypoints, dcatEntrypoints]);

    function updateTypeOfEntity(e) {
        setSourceSelectionQuery({
            typeOfEntity: e.target.value
        });
    }

    function updatePropertiesOfEntity(e) {
        let selected = Array.from(e.target.options)
            .filter(o => o.selected)
            .map(o => o.value);
        console.log("Options: " + selected);

        if (sourceSelectionQuery.typeOfEntity) {
            setSourceSelectionQuery({
                typeOfEntity: sourceSelectionQuery.typeOfEntity,
                properties: selected
            });
        } else {
            setSourceSelectionQuery({
                properties: selected
            });
        }
    }

    function updateCsr(e) {
        let selected = Array.from(e.target.options)
            .filter(o => o.selected)
            .map(o => o.value);

        setCsrEntrypoints(selected);
    }

    function updateDcat(e) {
        let selected = Array.from(e.target.options)
            .filter(o => o.selected)
            .map(o => o.value);

        setDcatEntrypoints(selected);
    }

    async function runSourceSelection() {
        const sourceSelectionClient = new InitSourceSelection();
        const entrypoints = [];
        for (const d of dcatEntrypoints) entrypoints.push({"type": "DCAT", "value": d});
        for (const c of csrEntrypoints) entrypoints.push({"type": "CSR", "value": c});

        const start = new Date();
        const sources = await sourceSelectionClient.getSources(sourceSelectionQuery, entrypoints);
        const stop = new Date();
        setTimeForSourceSelection(stop.getTime() - start.getTime());

        console.log("sources: " + sources);
        setSources(sources);
    }

    return (
        <div>
            <h1>Source selection demo</h1>

            <label htmlFor="typeOfEntity">Type of entity:     </label>
            <select onChange={updateTypeOfEntity} name="typeOfEntity" id="typeOfEntity">
                {typeOfEntityOptionsHtml}
            </select>

            <br></br>
            <br></br>

            <label htmlFor="propertyOptions">Properties of entity:     </label>
            <select multiple={true} onChange={updatePropertiesOfEntity} name="propertiesOfEntity" id="propertiesOfEntity">
                {propertyOptionsHtml}
            </select>

            <br></br>
            <br></br>

            <label htmlFor="csrOptions">Context Source Registries to contact:     </label>
            <select multiple={true} onChange={updateCsr} name="csr" id="csr">
                {csrOptionsHtml}
            </select>

            <br></br>
            <br></br>

            <label htmlFor="dcatOptions">DCAT catalogs to contact:     </label>
            <select multiple={true} onChange={updateDcat} name="dcat" id="dcat">
                {dcatOptionsHtml}
            </select>

            <div>
                <Sources
                    sources={sources}
                />
            </div>

            <br></br>
            <br></br>

            <label htmlFor="timeForSourceSelection">Time it took in ms: {timeForSourceSelection} </label>
        </div>
    );
}

export default SourceSelectionForm;
