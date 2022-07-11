<script>
    import { documentList} from '../stores/stores';
    import {createEventDispatcher} from 'svelte';
    
    let searched_value = "";
    const dispatch = createEventDispatcher();
    let all_nodes = []
    let searched_titles_nodes = []
    let original_titles_list_obj = []
    let show_titles_list_obj =[]
    
    const sortByString = () => {

        let sortedData = original_titles_list_obj.sort((obj1, obj2) => {
            if (obj1.overskrift < obj2.overskrift) {
                    return -1;
            } else if (obj1.overskrift > obj2.overskrift) {
                return 1;
            }
            return 0; //string code values are equal		
        });

        
        original_titles_list_obj = sortedData;
    }
    $: if (original_titles_list_obj) {
        dispatch("checked_titles", original_titles_list_obj.filter((item) => item.checked))
    }
    
    $:if($documentList) {
            all_nodes = []

            $documentList.forEach((document) => {
                let nodes_array = document.markdownTree.get_nodes_in_order() //Return the nodes in the same order as it was read from file

                // console.log("\nnodes_array: ")
                // console.log(nodes_array)

                nodes_array.forEach((node)=> {
                    all_nodes.push(node)
                })
                console.log(document)
            })
            console.log("\nALL_NODES:")
            console.log(all_nodes)
            //All the nodes containing the searched_value
            searched_titles_nodes = all_nodes.filter(item => (item.id != 0));
            original_titles_list_obj = make_titles_obj_list(all_nodes)
            // $selectedTitlesList = original_titles_list_obj.filter((item) => (item.checked))
            sortByString()
            

    }
    $: if (searched_value.length >= 0){
        
        console.log("\nshow_titles_list_obj")
        console.log(show_titles_list_obj)
        if (searched_value != ""){
            show_titles_list_obj = original_titles_list_obj.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));

        } else {
            show_titles_list_obj = original_titles_list_obj
        }
        
        console.log("\norignal_titles_list_obj")
        console.log(original_titles_list_obj)
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
                if (original_titles_list_obj.length == 0) { //First time
                    new_element = {overskrift: node.overskrift, nodes: [node], checked: false }

                } else { //Check if the node is checked in original_titles_obj_list
                    let found_in_list = false
                    for (let i = 0; i < original_titles_list_obj.length; i++) {

                        if (node.overskrift == original_titles_list_obj[i].overskrift) {
                            if (original_titles_list_obj[i].checked) {
                                new_element = {overskrift: node.overskrift, nodes: [node], checked: true }
                                found_in_list = true
                            } 
                            break;
                        }
                    }
                    if (!found_in_list){
                        new_element = {overskrift: node.overskrift, nodes: [node], checked: false }
                    }
                }
                obj_list.push(new_element)
                // console.log(new_element)
            }

        }

        return obj_list
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

        {#each show_titles_list_obj as elementObj}

            <div class="title">
                <input type="checkbox" bind:checked={elementObj.checked} />

                <div class="title">

                    {elementObj.overskrift} 

                </div>
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