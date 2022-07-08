<script>
    import { documentList } from '../stores/stores';
    import {createEventDispatcher} from 'svelte';

    let searched_value = "";
    let show = false;
    const dispatch = createEventDispatcher();
    let all_nodes = []
    let searched_titles_nodes
    
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
            // console.log("\n all_nodes: ")
            // console.log(all_nodes)
            //searched_titles_nodes = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) && item.id != 0); //***************Denne må endres til å filtrere+ at bare parentNodene som inneholder teksten legges i listen, ikke alle childNodene også!*****************************************
            // console.log("\n searched_titles_nodes: ")
            // console.log(searched_titles_nodes)

            //tester ny filtrering
            searched_titles_nodes = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) && item.id != 0 && !foundParent(all_nodes, item));
            
    }

    function foundParent(nodes, child){
        return nodes.some(item => item.id === child.parent.id)
    }

     function make_titles_obj_list(obj_list, node_list){
        let previous_node = null;
        let element = {};

        for (let i = 0; i < node_list.length; i++){
            let node = node_list[i];
            
            element = {node: node, show_title: false, show_children: false};

            if(previous_node == null){
                element.show_title = true;

            } else if(previous_node.object != node.object){
                element.show_title = true;

            } else if ( (obj_list[obj_list.length-1].node.is_parent_of(node)) || (previous_node.id == node.parent.id)) { //If the last added element is parent of the current
                    // console.log(previous_node.overskrift + " er parent til " + node.overskrift)
                    previous_node = node;
                    continue;

            }else if (previous_node.id == node.parent.id){
                // console.log(previous_node.overskrift + " er parent til " + node.overskrift)
                previous_node = node;
                continue;
            }

            obj_list.push(element)
            previous_node = node;
        }
        // console.log("\n titles_list_obj: ")
        // console.log(obj_list)
        return obj_list
    }
    
    $: titles_list_obj = make_titles_obj_list([], searched_titles_nodes)

     function show_children(obj){
         if(obj.node.children.length > 0) {

            let new_titles_list_obj = []

            for(let i = 0; i < titles_list_obj.length; i++){
                new_titles_list_obj.push(titles_list_obj[i])
    
                if(titles_list_obj[i].node.id == obj.node.id) {//Adds the node's children to the list
    
                    if(obj.show_children == false) {
                            // console.log("Legger til barn")
                            obj.node.children.forEach((node) => {
                                let newElement = {node: node, show_title: false, show_children: false}
                                new_titles_list_obj.push(newElement)
                                // console.log("\n new_titles_list_obj:")
                                // console.log(new_titles_list_obj)
                            })
                            titles_list_obj[i].show_children = true;
    
                    } else { //Removes the node's children
                        // console.log("Fjerner barna")
                        
                        titles_list_obj[i].show_children = false;
                        let previous_obj = titles_list_obj[i];

                        i++;
                        while(i<titles_list_obj.length){ 

                            if( (previous_obj.show_children == false) && (previous_obj.node.is_parent_of(titles_list_obj[i].node)) ) {
                                // console.log("Hopper over " + titles_list_obj[i].node.overskrift)
                                titles_list_obj[i].show_children = false;
                                previous_obj = titles_list_obj[i]; 
                                i++;
                            } 
                            else if (obj.node.is_parent_of(titles_list_obj[i].node)){
                                // console.log("Hopper over " + titles_list_obj[i].node.overskrift)
                                titles_list_obj[i].show_children = false;
                                previous_obj = titles_list_obj[i]; 
                                i++;
                            
                            } 
                            else{
                                break;
                            }
                        }
                        i--; //It is i-- here because the for-loop does i++ at the end, therefor we must compensate by doing i--. If not, one element get surpassed. 
                    }
                            
                }
                    
            }

            titles_list_obj = new_titles_list_obj
            // console.log("\n NEW titles_list_obj: ")
            // console.log(titles_list_obj)
        }
    }

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

            {#if elementObj.show_title}
                <div style="font-weight: bold">{(elementObj.node.object.date.toDateString() + ": " + elementObj.node.object.title)} </div>
            {/if}

            <div class="title" on:click={() => show_children(elementObj)}> 
                {elementObj.node.format_string()} 

                {#if elementObj.node.children.length>0}

                    {#if elementObj.show_children}
                        <i class="material-icons">expand_less</i>
                    {:else }
                        <i class="material-icons">expand_more</i>
                    {/if}

                {/if}
            </div>
            
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