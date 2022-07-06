<script>
import { DocumentObject } from '../document';




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
    
     $: searched_titles = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) && item.id != 0);

     function make_titles_string_list(titles_list, node_list){
        let previous_node = null;
        let element = null;
        for (let i = 0; i < node_list.length; i++){
            let node = node_list[i];
            element = node;
            if(previous_node == null){
                element.isTitle()

            } else if(previous_node.object!= node.object){
                element.isTitle()
            } 

           
            titles_list.push(element)
            previous_node = node;
        }
        
        console.log(titles_list)
        return titles_list
    }

    
     $: titles_list = make_titles_string_list([], searched_titles)

     function show_children(node){
        console.log(titles_list)
        let new_titles_list = []
        for(let i = 0; i < titles_list.length; i++){
            new_titles_list.push(titles_list[i])

            if(titles_list[i] == node) {
                console.log(node)
                node.children.forEach((node) => {
                    new_titles_list.push(node)
                })
            }
        }
        titles_list = new_titles_list
        console.log(titles_list)
    }

</script>

<div class="main">
    <h2>
        Overskrifter
    </h2>
    {#if searched_titles.length == 0}
        <div>Ingen overskrifter</div>
    {:else}
    
        {#each titles_list as node}
            {#if node.show_Title}
                <div style="font-weight: bold">{(node.object.date.toDateString() + ": " + node.object.title)} </div>
            {/if}
            <div on:click={() => show_children(node)}> {node.format_string()} </div>
            
        {/each} 
    {/if}
 

</div>

<style>
    .main{
        height: 100%;
        overflow-y: scroll;
    }


</style>