<script>
    import { ParseMarkdown} from '../ParseMarkdown'
    import { documentList } from '../stores/stores';
    export let searched_value = "";
    let show = false;

    let all_nodes = []
    $documentList.forEach((document) => {
        // console.log("forEach")

        //HAR LAGT TIL DET UNDER I TYPEWRITER.SVELTE SIN SAVE-FUNKSJON
        // console.log("Før parse")
        // console.log(document)
        // let tree = parse.parseAndSetIntoTree(document) //Her henger programmet!!
        // document.markdownTree = tree;
        // console.log("Etter parse")
        let nodes_array = document.markdownTree.traverseBFS()
        nodes_array.forEach((node)=> {
            all_nodes.push(node)
        })
    })

     $: searched_titles = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));

    
    // parse.parseAndSetIntoTree($documentList[1])
    // console.log("Sjekker: " + $documentList[2].id)
    // parse.parseAndSetIntoTree($documentList[2])

</script>

<div class="main">
    <h2>
        Overskrifter
    </h2>
    {#if searched_titles.length == 0}
        <div>Ingen overskrifter</div>
    {:else}
        {#each searched_titles as node}
            {#if node.overskrift != "Root"}
                <div>{@html node.overskrift}</div>
            {/if}
            
        {/each} 
    {/if}
 

</div>

<style>
    .main{
        height: 100%;
        overflow-y: scroll;
    }


</style>