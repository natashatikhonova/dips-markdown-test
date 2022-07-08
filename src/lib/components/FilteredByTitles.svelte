<script>
    import { documentList, selectedTitlesList } from '../stores/stores';
    import {createEventDispatcher} from 'svelte';

    let searched_value = "";
    const dispatch = createEventDispatcher();
    let all_nodes = []
    let searched_titles_nodes = []

    $: if($documentList) {
            all_nodes = []

            $documentList.forEach((document) => {
                let nodes_array = document.markdownTree.get_nodes_in_order() //Return the nodes in the same order as it was read from file

                // console.log("\nnodes_array: ")
                // console.log(nodes_array)

                nodes_array.forEach((node)=> {
                    all_nodes.push(node)
                })
            })
            // console.log("\nALL_NODES:")
            // console.log(all_nodes)
            //All the nodes containing the searched_value
            searched_titles_nodes = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) && item.id != 0);

    }



     function make_titles_obj_list(node_list){
        let obj_list = []

        for (let i = 0; i<node_list.length; i++){
            let new_element = {}
            let node = node_list[i]
            let found = false;
            for (let j= 0; j<obj_list.length; j++){
                if(obj_list[j].overskrift == node.overskrift){
                    obj_list[j].nodes.push(node)
                    found = true
                    break;
                }
            }
            if (!found){
                new_element = {overskrift: node.overskrift, nodes: [node]}
                obj_list.push(new_element)
                // console.log(new_element)
            }

        }
        return obj_list
    }
    
    $: titles_list_obj = make_titles_obj_list(searched_titles_nodes)

</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<div class="main">
        <h2>Overskrifter</h2>
        <button class="close" on:click={()=>dispatch("close")}><i class="material-icons">close</i></button>
        <input bind:value={searched_value} type="text" placeholder="Søk.." name="search">
    {#if searched_titles_nodes.length == 0}
        <div>Ingen overskrifter</div>
    {:else}

        {#each titles_list_obj as elementObj}

            <div class="title">
                <input type="checkbox" bind:group={$selectedTitlesList} value={elementObj}/>

                <div class="title">

                    {elementObj.overskrift} 

                </div>
             </div>
            <!-- <div class="title" on:click={() => show_children(elementObj)}> 
                {elementObj.node.format_string()} 

                {#if elementObj.node.children.length>0}

                    {#if elementObj.show_children}
                        <i class="material-icons">expand_less</i>
                    {:else }
                        <i class="material-icons">expand_more</i>
                    {/if}

                {/if}
            </div> -->
            
        {/each} 

    {/if}
 

</div>

<style>
    .main{
        overflow-y: auto;
        height: 100%;
        padding-left: 2vw;
        padding-right: 2vw;
    }

    input[type=text] {

        padding: 6px;
        border: none;
        border-bottom: solid;
        margin-bottom: 2vh;
        font-size: 17px;
        width:90%;
     }
     i{
        font-size: large;
        margin-top:0.2em;
     }

    .title{
        cursor: pointer;
        display: flex;
    }

    .title:hover{
        color:#d43838;
    }

    .close{
        position: absolute;
        right: 2vw;
        top: 2vh;
        background: none;
        border: none;
    }
    .close:hover {
        color:#d43838; 
    }

    

</style>