<script>



    import { documentList } from '../stores/stores';
    export let searched_value = "";
    let show = false;

    let all_nodes = []
    $documentList.forEach((document) => {
        let nodes_array = document.markdownTree.traverseBFS()
        nodes_array.forEach((node)=> {
            all_nodes.push(node)
        })
    })
    
     $: searched_titles = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));

     let last_printed_object = null;

</script>

<div class="main">
    <h2>
        Overskrifter
    </h2>
    {#if searched_titles.length == 0}
        <div>Ingen overskrifter</div>
    {:else}
    
        {#each searched_titles as node}
            <!-- {console.log(node)} -->
            {#if last_printed_object != null}
                <!-- {console.log(last_printed_node)}
                {console.log(node)} -->
                {#if last_printed_object.id === node.object.id}
                    <div style="font-weight: bold">{ node.object.date.toDateString() + ": " + node.object.title}</div> 
                {/if}
            {:else}
                <div style="font-weight: bold">{ node.object.date.toDateString() + ": " + node.object.title}</div>
            {/if}

            <div>{ node.format_string()}</div> 
            {last_printed_object = node.object}
            
        {/each} 
    {/if}
 

</div>

<style>
    .main{
        height: 100%;
        overflow-y: scroll;
    }


</style>