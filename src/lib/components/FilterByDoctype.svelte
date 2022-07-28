<script>

    import {current_doctype_filtergroup, doctype_filter_groups, nofilter, allfilterOff, documentTypes} from '../stores/stores';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';

    //Alt fra filtergrupper 
    import FilterForm from './FilterForm.svelte';
    const modal = writable(null);

    //If the compleate menu is open
    // let filterMenuOpen = false;
    let customViewMode = true;

    let filter_searched_value = "";
    let filtergroup_searched_value ="";

    

    let showAllButtonName = "Nullstill"
    let original_doctypes = []
    $: $current_doctype_filtergroup, make_obj_list()

    function make_obj_list(){
        let obj_list =  []
        for (let i = 0; i < documentTypes.length; i++) {
            if($current_doctype_filtergroup.filters.includes(documentTypes[i])){

                obj_list.push({name: documentTypes[i], checked: true})
            } else{
                obj_list.push({name: documentTypes[i], checked: false})
            }
        }
        original_doctypes = obj_list
    
    }

    $: searchedDocumentTypes = original_doctypes.filter(item => (item.name.toLowerCase().includes(filter_searched_value.toLowerCase())));

    // $: if (original_doctypes){ //When searcheddocumentTypes have changed
    //     console.log("fornadret")
    //     let newFilters = []
    //     for (let i = 0; i < original_doctypes.length;i++){
    //         if (original_doctypes[i].checked){
    //             newFilters.push(original_doctypes[i].name)
    //         }
    //     }
    //     console.log(newFilters)
    //     customFilter.filters = newFilters
    // }

    $: searchedFiltergroups = $doctype_filter_groups.filter(item => (item.name.toLowerCase().includes(filtergroup_searched_value.toLowerCase())));

  
    $: if($allfilterOff){
        console.log("no filter")
        $current_doctype_filtergroup = $nofilter
   
        for (let i = 0; i<original_doctypes.length; i++){
            original_doctypes[i].checked = true
        }
        $allfilterOff = false
    }  
    $: console.log($current_doctype_filtergroup)
    // $: console.log(documentTypes)

    $: if($current_doctype_filtergroup.filters.length == documentTypes.length){
        showAllButtonName = "Nullstill"
    }
    else if ($current_doctype_filtergroup.filters.length < documentTypes.length){
        showAllButtonName = "Vis alle"
    }

    $: if (filter_searched_value!=""){
        searchedDocumentTypes = relevantSort(searchedDocumentTypes, filter_searched_value)
    }

    $: if (filtergroup_searched_value !=""){
        searchedFiltergroups = relevantSort(searchedFiltergroups, filtergroup_searched_value)

    }

    
    function changeMode(){
        customViewMode = !customViewMode
    }

    function relevantSort(list, value){
        let startsWithSearch = []
        for(let i = 0; i<list.length; i++){
            if (list[i].name.toLowerCase().startsWith(value)){
                startsWithSearch.push(list[i])
                list.splice(i, 1)
            }
        }
        list = startsWithSearch.concat(list)
        return list
    }


    // // For the custom mode
    
    // // Sorting the documentstitels alfabetic
    // const sortByString = () => {
    //     let sortedData = documentTypes.sort((obj1, obj2) => {
    //         if (obj1 < obj2) {
    //                 return -1;
    //         } else if (obj1 > obj2) {
    //             return 1;
    //         }
    //         return 0; //string code values are equal		
    //     });
    //     documentTypes = sortedData;
    // }
    // sortByString()


    function clickedAll(){
      
        if($current_doctype_filtergroup.filters.length < documentTypes.length){
            $current_doctype_filtergroup.filters = documentTypes.slice()
            // console.log(documentTypes)
            $current_doctype_filtergroup = $current_doctype_filtergroup
            showAllButtonName = "Nullstill"   
            for (let i = 0; i< original_doctypes.length; i++){
                original_doctypes[i].checked = true
            } 
        }
        else{
            $current_doctype_filtergroup.filters = []
            $current_doctype_filtergroup = $current_doctype_filtergroup
            showAllButtonName = "Vis alle"
            for (let i = 0; i< original_doctypes.length; i++){
                original_doctypes[i].checked = false
            } 
        }
    }

    //For stored filtergroupsview
    function find_index(filterGroup){
      
        for(let i = 0; $doctype_filter_groups.length; i++){
            if ($doctype_filter_groups[i].id == filterGroup.id) {
                return i
            }

        }
        return -1
    }
    //User clicked on edit and program swich mode with current crop as start point
    function editItem(group){
        manageGroup = true
        for(let i=0; i<original_doctypes.length; i++){
            original_doctypes[i].checked = false
        }
        modal.set(bind(FilterForm,{edit_bool: true, typeOfForm: "doc", edit_obj_indeks: find_index(group), original_list_obj: original_doctypes}))
    }

    let manageGroup = false
    function openModel(){
        manageGroup = true
        for(let i=0; i<original_doctypes.length; i++){
            original_doctypes[i].checked = false
        }
        modal.set(bind(FilterForm,{edit_bool: false, typeOfForm: "doc", edit_obj_indeks: -1, original_list_obj: original_doctypes}))
    }

    function updateCheckedList(item){
        if (item.checked){
            //remove from list
            // for(let i =0; i<$current_doctype_filtergroup.filters.length; i++){
            //     if($current_doctype_filtergroup.filters[i] == item.name){

            //         $current_doctype_filtergroup.filters.splice(i, 1)
            //         $current_doctype_filtergroup = $current_doctype_filtergroup
            //     }
            // }
        
            $current_doctype_filtergroup.filters.splice($current_doctype_filtergroup.filters.indexOf(item.name), 1)
            
        }else if(!item.checked){
            // add to list
            $current_doctype_filtergroup.filters.push(item.name)

        }

        $current_doctype_filtergroup = $current_doctype_filtergroup
        // console.log("update")
        // console.log($current_doctype_filtergroup.filters)
    }

    

</script>


<h2>Filter dokumenttyper</h2>
<div class="content">
    {#if customViewMode}
    <div class="filter-panel">
        <div class="meta">
            <h3>Alle filtere:</h3>
            <input class="search-input" bind:value={filter_searched_value} type="text" placeholder="Søk.." name="search">
            <div>
                <button class="secundary-button" on:click={clickedAll}>{showAllButtonName}</button>
                <button class="secundary-button" on:click={changeMode}>Filtreringsgrupper</button>
            </div>
    
        </div>
        <div class="document-types">
    
            {#each searchedDocumentTypes as item}    
            <label class="filterItem" on:click={()=>updateCheckedList(item)}>
                <!-- <input type="checkbox"  bind:group={$current_doctype_filtergroup.filters} value={item} > -->
                <input type="checkbox"  bind:checked={item.checked} >
                {item.name}
                <span class="checkmark"></span>
            </label>
            {/each}
        </div>
        <div class = "save-filter-button">
            {#if $current_doctype_filtergroup.filters.length>0}
                <button class="secundary-button" on:click={()=>editItem($current_doctype_filtergroup)}>Lagre som filreringsgruppe</button>
            {/if}
    
        </div>
    </div>
    {:else}    
        <h3>Filtergrupper:</h3>
        <input class="search-input" bind:value={filter_searched_value} type="text" placeholder="Søk.." name="search">

        <div>
            <button class="secundary-button" on:click={changeMode}>Alle filtere</button>
            <button class="secundary-button" on:click={openModel}>Nytt filter</button>
        </div>
        <div class="filtermenu-button-conteiner">

            
            <!-- <div class="filterItem-button" class:active={currentFilterobj == nofilter} on:click={() => currentFilterobj = nofilter} value="alle">
                Vis allt
            </div> -->
            {#each searchedFiltergroups as filter}
            
            <div class="group">
                <input type="radio"  checked={$current_doctype_filtergroup  == filter} on:change={() => $current_doctype_filtergroup = filter}  />
                
                <div class="title">
                    {filter.name} 
                </div>
                
                <div class="group-buttons">
                    <button class="edit-button" title ="Rediger" on:click={()=>editItem(filter)} ><i class="material-icons">edit</i></button>
                    <button class="edit-button" title="Slett" on:click={()=> $doctype_filter_groups = $doctype_filter_groups.filter(item => (item.id != filter.id))}><i class="material-icons">delete</i></button>
                </div>
                
            </div>
            {/each}
        </div>
    {/if}

    {#if manageGroup}
    <Modal on:closed={() => manageGroup = false } show={$modal}/>
    {/if}
</div>

<style>
    h2{
        align-self: center;
    }
    .save-filter-button{
           margin-top: 10px;
    
    }
    .content{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-left: 2vw;
        padding-right: 2vw;
    }

    .filter-panel{
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .meta{
        display: flex;
        flex-direction: column;
        height:25%;
    }


    .document-types{
        display: flex;
        flex-direction: column;
        margin-top:20%;
        height: 45%;
        overflow-y: auto;
        
    }
    .group{
        display: flex;
        margin-top: 10px;
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
    
    .edit-button:hover{
        color:#d43838;
        cursor: pointer;
    }

    
    /* Darkmode */

    /* Edit button - darkmode */

    :global(body.dark-mode) .edit-button{
        color:#cccccc;
    }

    :global(body.dark-mode) .edit-button:hover{
        color:#d43838;
    }

    /* Search field - darkmode */

    :global(body.dark-mode) input{
        border-bottom: 1px solid #cccccc;
        color:#cccccc;
        
    }

    :global(body.dark-mode) ::placeholder {
        color: #cccccc;   
    }



</style>