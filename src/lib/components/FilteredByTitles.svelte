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

     let last_printed_node = null;
     function set_last_printed(node){
        console.log("Setter last_printed")
        last_printed_node = node
        return ""

     }

</script>

<div class="main">
    <h2>
        Overskrifter
    </h2>
    {#if searched_titles.length == 0}
        <div>Ingen overskrifter</div>
    {:else}
    
        {#each searched_titles as node}

            <!-- {console.log(last_printed_node)}
            {console.log(node)} -->

            {#if last_printed_node == null}
                <!-- {console.log("første")} -->
                {set_last_printed(node)}
                <div style="font-weight: bold">{ node.object.date.toDateString() + ": " + node.object.title}</div>
            {:else }

                {#if last_printed_node.object!= node.object}
                    <!-- {console.log("IKKE FRA SAMME DOK")} -->
                    {set_last_printed(node)}
                    <div style="font-weight: bold">{ node.object.date.toDateString() + ": " + node.object.title}</div> 
                {/if}
            {/if}

            <div>{ node.format_string()}</div> 
            
            
        {/each} 
    {/if}
 

</div>

<style>
    .main{
        height: 100%;
        overflow-y: scroll;
    }


</style>