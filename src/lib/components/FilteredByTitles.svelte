<script>
    import {documentList, globalCurrentFilterGroup, saved_filter_groups} from '../stores/stores';
    import {createEventDispatcher} from 'svelte';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';
    import FilterGroupForm from './FilterGroupForm.svelte';
    const modal = writable(null);

    // let original_filtered_groups = []
    let show_filtered_groups = []
    let selected_group = null
    let adding_new_group = false
    let all_checked = true

    let searched_value = "";
    const dispatch = createEventDispatcher();
    let all_nodes = []
    let searched_titles_nodes = []
    let original_titles_list_obj = []
    let show_titles_list_obj =[]
    let showFilterGroups = false;
    let edit_bool = false
    let edit_obj_indeks = null
    $: overskrift = showFilterGroups ? "Filtergrupper:" : "Alle overskrifter:"

    $: filteredDocumentlist = ($documentList.filter(item => ($globalCurrentFilterGroup.includes(item.title))));

    function showModal (){
        adding_new_group = true;
        load_documents($documentList) //shows all documents
        
        //Removes checked:
        for(let i=0; i<original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
        }
        modal.set(bind(FilterGroupForm, { original_titles_list_obj: original_titles_list_obj, edit_bool: edit_bool, edit_obj_indeks: edit_obj_indeks, group_name: (edit_bool) ? $saved_filter_groups[edit_obj_indeks].name : ""}))
        console.log(edit_bool)
    
    }
    
    
    
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
    
    $: original_titles_list_obj, dispatch("checked_titles", original_titles_list_obj.filter((item) => item.checked))

    $: if(selected_group != null){ 
        // console.log(selected_group.titles) 
        dispatch("checked_titles", selected_group.titles) 
    } 

    $: filteredDocumentlist, load_documents(filteredDocumentlist)

    function load_documents(chosen_documents) {
            all_nodes = []

            chosen_documents.forEach((document) => {
                let nodes_array = document.markdownTree.get_nodes_in_order() //Return the nodes in the same order as it was read from file

                // console.log("\nnodes_array: ")
                // console.log(nodes_array)

                nodes_array.forEach((node)=> {
                    all_nodes.push(node)
                })
                // console.log(document)
            }) 
            // console.log("\nALL_NODES:")
            // console.log(all_nodes)
            //All the nodes containing the searched_value
            searched_titles_nodes = all_nodes.filter(item => (item.id != 0));
            original_titles_list_obj = make_titles_obj_list(searched_titles_nodes)
            // $selectedTitlesList = original_titles_list_obj.filter((item) => (item.checked))
            sortByString()
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

    function stopAddingGroup(){
        adding_new_group = false
    }

    $: $saved_filter_groups, stopAddingGroup()
    // $: $saved_filter_groups, console.log(adding_new_group)

    $: if ((searched_value.length >= 0) && !showFilterGroups){ //Updates the shown titles with search on titles
    
        if (searched_value != ""){
            show_titles_list_obj = original_titles_list_obj.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));
        } else {
            show_titles_list_obj = original_titles_list_obj
        }
        
    }

    $: if (((searched_value.length >= 0) || (adding_new_group == false))&& showFilterGroups){ //Updates the shown groups with search on groups
        // console.log($saved_filter_groups)
        if (searched_value != ""){
            show_filtered_groups = $saved_filter_groups.filter(item => (item.name.toLowerCase().includes(searched_value.toLowerCase())))
        } else {
            show_filtered_groups = $saved_filter_groups
        }
        
    }
    



    function closeTitles(){
        removeChecked()

        dispatch("close")
    }

    function removeChecked(){
        for(let i=0; i<original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
        }
        for(let i=0; i<$saved_filter_groups.length; i++){
            $saved_filter_groups[i].checked = false
        }
        
    }
    function show_filterGroups(){
        showFilterGroups = true;
        removeChecked()
    }

    
    function set_selected_group(groupObj){
        
        if (selected_group != null && groupObj!=null) {
            for ( let i = 0; i < show_filtered_groups.length; i++){
                if (show_filtered_groups[i].checked && show_filtered_groups[i].name == selected_group.name) {
                    show_filtered_groups[i].checked = false
                } else if (groupObj.name == show_filtered_groups[i].name) {
                    show_filtered_groups[i].checked = true
                }
                
            }
        } 
        if (groupObj != null) {
            groupObj.checked = true;
        }
        selected_group = groupObj
    
        show_filtered_groups = show_filtered_groups
    }

    function deleteGroup(group_name){
        for(let i = 0; i<$saved_filter_groups.length; i++ ){
            if ($saved_filter_groups[i].name === group_name){
                if ($saved_filter_groups[i].checked) {
                    $saved_filter_groups[i].checked = false
                    set_selected_group(null)
                    dispatch("checked_titles", []) //Sets the shown documents to all the documents in $documentList
                }
                console.log(group_name)
                $saved_filter_groups.splice(i, 1)
                $saved_filter_groups = $saved_filter_groups
              
                break
            }
        }
    }
    function editGroup(group_name){
        for(let i = 0; i<$saved_filter_groups.length; i++ ){
            if ($saved_filter_groups[i].name === group_name){
                edit_bool = true;
                edit_obj_indeks = i;
                break
            }
        }
        showModal()
    }

    function closed_modal(){
        edit_bool = false
        adding_new_group = false
    }
    function check_all(){
        all_checked = !all_checked
        for (let i = 0; i < original_titles_list_obj.length; i++) {
            original_titles_list_obj[i].checked = all_checked
        }
    
    }

    $: original_titles_list_obj, check_if_all_checked()

    function check_if_all_checked(){
        let all_bool = null
        for (let i = 0; i < original_titles_list_obj.length; i++) {
            if (all_bool == null) {
                all_bool = original_titles_list_obj[i].checked

            }else if (original_titles_list_obj[i].checked != all_bool ) {
                all_bool = false
                break;
            } 
        }
        all_checked = all_bool
        

    }

    

</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<div class="main">
        <h2>Overskrifter</h2>
        <h3>{overskrift}</h3>
        <button class="close" on:click={closeTitles}><i class="material-icons">close</i></button>
        <input bind:value={searched_value} type="text" placeholder="Søk.." name="search">

        {#if !showFilterGroups}
            <button class="filter-groups-button" on:click={removeChecked}>Nullstill</button>
            <button class="filter-groups-button" on:click={show_filterGroups}>Filtreringsgrupper</button>

            {#if show_titles_list_obj.length == 0}
                <div class = "no-titles">Ingen overskrifter</div>
            {:else}
                <div class="checkbox-alle">
                    <input type="checkbox" on:click={check_all} bind:checked={all_checked} /> 
                    <div style = "margin-left: 1%">
                        Velg alle
                    </div>
                        
                </div>

                {#each show_titles_list_obj as elementObj}

                    <div class="title">
                        <input type="checkbox"  bind:checked={elementObj.checked} />

                        <div class="title">

                            {elementObj.overskrift} 

                        </div>
                    </div>
                    
                {/each} 
            {/if}
        {:else} 
            <div class="buttons-group">
                <button class="filter-groups-button" on:click={showModal}>Nytt filter</button>
                <button class="filter-groups-button" on:click={()=>showFilterGroups=false}>Alle filtere</button>
            </div>

            {#if adding_new_group}
                <Modal on:closed={closed_modal} show={$modal}/>
            {/if}

            {#if show_filtered_groups.length == 0}
                <div class = "no-titles">Ingen grupper</div>
            {:else}

                {#each show_filtered_groups as groupObj}
                 
                    <div class="group">
                        <input type="radio" checked={groupObj.checked} on:change={() => set_selected_group(groupObj)} value={groupObj} />

                        <div class="title">

                            {groupObj.name} 

                        </div>
                        <div class="group-buttons">
                            <button class="edit-button" title ="Rediger" on:click={()=>editGroup(groupObj.name)} ><i class="material-icons">edit</i></button>
                            <button class="edit-button" title="Slett" on:click={()=>deleteGroup(groupObj.name)}><i class="material-icons">delete</i></button>
                        </div>

                    </div>
                
                {/each} 

            {/if}


        {/if}
    
 

</div>

<style>
    .main{
        overflow-y: auto;
        height: 100%;
        padding-left: 2vw;
        padding-right: 2vw;
    }
    .no-titles{
        margin-top: 2vh;
    }

    .group{
        display: flex;
        margin-top: 2%;
        align-items: center;
    }
    .group-buttons{
        position: absolute;
        display: flex;
        right: 10%;
    }

    .edit-button{
        margin-left: 3%;
        background: none;
        border: none;
    }
    .buttons-group{
        display: flex
    }

    .filter-groups-button{
        background: lightgray;
        display: inline-flex;
        align-items: center;
        margin: 0.5vh;
        margin-bottom: 1vh;
        margin-right: 1vh;
        width: fit-content;
        height:2vh;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        color:#000000;
        padding: 12px;
        font-size: 14px;
        justify-content: center;
        cursor: pointer;
        border: solid 0.1em rgb(255, 92, 81 ,0);
        box-shadow: 0 0 0 0.2rem rgb(255, 92, 81, 0);
    }

    .edit-button:hover{
        color:#d43838;
        cursor: pointer;
    }
    .checkbox-alle{
        cursor: pointer;
        display: flex;
        margin-left: 1%;
        margin-bottom: 2vh;
    }
    .checkbox-alle:hover{
        color:#d43838;
    }

  
    .filter-groups-button:hover {
        background: rgb(226, 226, 226);
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
        margin-left: 1%;
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