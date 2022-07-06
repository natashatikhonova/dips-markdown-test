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
    
     $: searched_titles = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) || item.overskrift != "Root");

     let last_printed_node = null;
     function set_last_printed(node){
        if(last_printed_node == null){
            last_printed_node = node
            return "<div style=\"font-weight: bold\">" + node.object.date.toDateString() + ": " + node.object.title +"</div><div>" + node.format_string() +"</div>"
        }
        if(last_printed_node.object!= node.object){
            last_printed_node = node
            return "<div style=\"font-weight: bold\">" + node.object.date.toDateString() + ": " + node.object.title +"</div><div>" + node.format_string() +"</div>"
            
        }
        else{
            return "<div>" + node.format_string() +"</div>"
        }
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
            {@html set_last_printed(node)}    
        {/each} 
    {/if}
 

</div>

<style>
    .main{
        height: 100%;
        overflow-y: scroll;
    }


</style>