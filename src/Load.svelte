<script lang="ts">
    
    import { navigate} from 'svelte-navigator';
    import { DocumentObject, documentList } from './lib/stores/stores';
    import { ParseMarkdown } from './lib/utils/markdown/ParseMarkdown';
    import {openEHR} from "./openehrStore";
    
    let aql = `
        SELECT
        c/uid/value as "CID",
        c/context/start_time/value as 'Hendelsestidspunkt',
        e/data[at0001]/items[at0002]/value/value AS 'Sammendrag',
        e/protocol[at0003]/items[openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1]/items[at0001]/value/value AS 'Informasjonstype',
        
        FROM
        COMPOSITION c[openEHR-EHR-COMPOSITION.report.v1]
            CONTAINS EVALUATION e[openEHR-EHR-EVALUATION.clinical_synopsis.v1]
        WHERE
        -- local::at0006|Funn og undersøkelser|
        e/protocol[at0003]/items[openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1]/items[at0001]/value/defining_code/code_string = 'at0006' OR
        -- local::at0016|Aktuell problemstilling|
        e/protocol[at0003]/items[openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1]/items[at0001]/value/defining_code/code_string = 'at0016' OR
        --local::at0007|Vurdering|
        e/protocol[at0003]/items[openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1]/items[at0001]/value/defining_code/code_string = 'at0007' OR
        --local::at0009|Planer for videre oppfølging|
        e/protocol[at0003]/items[openEHR-EHR-CLUSTER.epicrisis_result_metadata_dips.v1]/items[at0001]/value/defining_code/code_string = 'at0009'
        ORDER BY c/context/start_time/value DESC
        LIMIT 25
        `;

    function groupBy(xs, f) {
        return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }
    function randomTeperature(){
        return Math.floor(Math.random()*(41 - 36 +1) + 36)
    }

    async function getDocuments() {
        var data = await $openEHR.query(aql, {});
        var sorted = groupBy(data.rows, (r) => r.documentMetadata.documentId);
        Object.values(sorted).forEach(document => {

            console.log(document);
            let markdownText = "";
            Object.values(document).forEach(heading => {
                markdownText += "## " + heading.items[3] + "\n\n " + heading.items[2] + "\n";
            })
          
            let newDocObj = new DocumentObject(document[0].documentMetadata.documentId, document[0].items[1], markdownText, "Epikrise", true, document[0].documentMetadata.authorId.toString());
            newDocObj.add_temp(randomTeperature().toString());

            //Makes a tree structur for all markdown formated titles:
            let parse = new ParseMarkdown()
            let tree = parse.parseAndSetIntoTree(newDocObj) 
            newDocObj.markdownTree = tree;

            $documentList.push(newDocObj);
            $documentList = $documentList;
            // console.log(newDocObj);
        });
        return sorted;
    }

    $: if ($openEHR){
        //Load documents to store
        getDocuments();

        navigate("/dokumentliste") //Redirecter directly to out standard view,
    }
</script>

{#if $openEHR}
    Loading documents.default..
{:else}
    Loading client
{/if}