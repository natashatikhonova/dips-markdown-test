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
                // console.log(document)
                let nodes_array = document.markdownTree.traverseBFS()
                nodes_array.forEach((node)=> {
                    all_nodes.push(node)
                })
            })
            searched_titles_nodes = all_nodes.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())) && item.id != 0);
            // console.log(searched_titles_nodes)

    }

     function make_titles_obj_list(obj_list, node_list){
        let previous_node = {};
        let element = {};

        for (let i = 0; i < node_list.length; i++){
            let node = node_list[i];
            element = {node: node, show_title: false, show_children: false};

            if(previous_node == null){
                element.show_title = true;

            } else if(previous_node.object!= node.object){
                element.show_title = true;

            } else if (previous_node.children.includes(node)){
                previous_node = node;
                continue;
            }

            obj_list.push(element)
            previous_node = node;
        }
        
        // console.log(obj_list)
        return obj_list
    }

    
    $: titles_list_obj = make_titles_obj_list([], searched_titles_nodes)
    $: console.log(titles_list_obj)

    

     function show_children(obj){
         if(obj.node.children.length > 0) {
            // console.log(titles_list_obj)

            let new_titles_list_obj = []
            for(let i = 0; i < titles_list_obj.length; i++){
                new_titles_list_obj.push(titles_list_obj[i])
    
                if(titles_list_obj[i].node.id == obj.node.id) {//Adds the node's children to the list
    
                    if(obj.show_children == false) {
                            // console.log("Legger til barn")
                            obj.node.children.forEach((node) => {
                                let newElement = {node: node, show_title: false, show_children: false}
                                new_titles_list_obj.push(newElement)
                            })
                            titles_list_obj[i].show_children = true;
    
                        } else { //Removes the node's children
                            // console.log("Fjerner barna")
                           
                            titles_list_obj[i].show_children = false;

                            let previous_node = obj;
                            i++;

                            while(i<titles_list_obj.length){ 
                                if(titles_list_obj[i].node.parent.id == obj.node.id){
                                    previous_node = titles_list_obj[i].node; 
                                    titles_list_obj[i].show_children = false;
                                    i++;
                                }else{
                                    if(titles_list_obj[i].node.parent.overskrift!="Root"){
                                        previous_node = titles_list_obj[i].node; 
                                        titles_list_obj[i].show_children = false;
                                        i++;
                                    }else{
                                        break;
                                    }
                                }
                            }
                            i--;


                            

                            

                            // let previous_node = null;
                            // i++;
                            // while(i < titles_list_obj.length){
                            //     if ((titles_list_obj[i].node.parent.id == obj.node.id) && previous_node == null){
                            //         console.log("Legger ikke til " + titles_list_obj[i].node.overskrift + " i listen")
                            //         i++;
                            //         previous_node = titles_list_obj[i].node;         
                            //     }
                            //     else if ((titles_list_obj[i].node.parent.id == obj.node.id)) { //If obj.node is parent of the node or if the previous_node is the parent of the node 
                            //         console.log("Legger ikke til " + titles_list_obj[i].node.overskrift + " i listen")
                            //         i++;
                            //         previous_node = titles_list_obj[i].node;

                            //     } else if (previous_node.id == titles_list_obj[i].node.parent.id){
                            //         console.log("Legger ikke til " + titles_list_obj[i].node.overskrift + " i listen")
                            //         i++;
                            //         previous_node = titles_list_obj[i].node;
                            //     } else {
                            //         break
                            //     }
                            // }
                            // i--
                        }
                    
                }
            }
            titles_list_obj = new_titles_list_obj
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