<script>
    import {current_doctype_filtergroup, doctype_filter_groups, nofilter, allfilterOff, documentTypes, searchResult, searchValue, documentList, checked_titles_filters, all_markdown_titles, set_filtered_text} from '../stores/stores';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';
    import FilterForm from './FilterForm.svelte';
    

    const modal = writable(null);
    let customViewMode = true;
    let filter_searched_value = "";
    let filtergroup_searched_value ="";
    let manageGroup = false
    let showAllButtonName = "Nullstill"
    let original_doctypes = []

    let selected_documentObj_titles = []
    //make a list with all doctypes with a correct checked value
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
    
    //updates list whenever the group is changed
    $: if($current_doctype_filtergroup.filters){
        make_obj_list()
        console.log($all_markdown_titles)
        for (let i = 0; i<$all_markdown_titles.length; i++){
            for (let j =0; j<$checked_titles_filters.length; j++){
                if ($checked_titles_filters[j].overskrift== $all_markdown_titles[i].overskrift){
                    $checked_titles_filters[j].nodes = $all_markdown_titles[i].nodes
                    console.log($all_markdown_titles[i].nodes)
                    console.log($checked_titles_filters[j].nodes)
                }
            }
        }
    }
        

    //filters doctypes and groups by search
    $: searchedDocumentTypes = original_doctypes.filter(item => (item.name.toLowerCase().includes(filter_searched_value.toLowerCase())));

    $: searchedFiltergroups = $doctype_filter_groups.filter(item => (item.name.toLowerCase().includes(filtergroup_searched_value.toLowerCase())));

    //checks all items whenever filter is turned off
    $: if($allfilterOff){
        $current_doctype_filtergroup = $nofilter
   
        for (let i = 0; i<original_doctypes.length; i++){
            original_doctypes[i].checked = true
        }
        $allfilterOff = false
    }  

    //switches button name depending on amount of chosen items
    $: if($current_doctype_filtergroup.filters.length == documentTypes.length){
        showAllButtonName = "Nullstill"
    }
    else if ($current_doctype_filtergroup.filters.length < documentTypes.length){
        showAllButtonName = "Vis alle"
    }

    //sorts by first letter whenever search value is changed
    $: if (filter_searched_value!=""){
        searchedDocumentTypes = relevantSort(searchedDocumentTypes, filter_searched_value)
    }
    $: if (filtergroup_searched_value !=""){
        searchedFiltergroups = relevantSort(searchedFiltergroups, filtergroup_searched_value)
    }
    
    $: if ($checked_titles_filters.length == 0){
        //sets list depending on what doctypes are chosen
        let filteredDocumentlist = ($documentList.filter(item => ($current_doctype_filtergroup.filters.includes(item.title))));
        //show documents depending on main search field
        $searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));

    } else {
        selected_documentObj_titles = set_filtered_text()
        let filteredDocumentlist = (selected_documentObj_titles.filter(item => ($current_doctype_filtergroup.filters.includes(item.title))));
        //show documents depending on main search field
        $searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    }

    //changes between doctype mode and group mode
    function changeMode(){
        customViewMode = !customViewMode
    }

    //sorts by the first letter
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

    //checks/unchecks all items and switches button
    function clickedAll(){
      
        if($current_doctype_filtergroup.filters.length < documentTypes.length){
            //checks all items
            $current_doctype_filtergroup.filters = documentTypes.slice()
            $current_doctype_filtergroup = $current_doctype_filtergroup
            showAllButtonName = "Nullstill"   
            for (let i = 0; i< original_doctypes.length; i++){
                original_doctypes[i].checked = true 
            } 
        }
        else{
            //unchecks all items
            $current_doctype_filtergroup.filters = []
            $current_doctype_filtergroup = $current_doctype_filtergroup
            showAllButtonName = "Vis alle"
            for (let i = 0; i< original_doctypes.length; i++){
                original_doctypes[i].checked = false
            } 
        }
    }

    //finds an index of the group
    function find_index(filterGroup){
        for(let i = 0; $doctype_filter_groups.length; i++){
            if ($doctype_filter_groups[i].id == filterGroup.id) {
                return i
            }
        }
        return -1
    }

    //open popup window for a new/editable group
    function openModal(group){
        for(let i=0; i<original_doctypes.length; i++){
            original_doctypes[i].checked = false
        }
        manageGroup = true
        if (group){
            //edit group
            modal.set(bind(FilterForm,{edit_bool: true, typeOfForm: "doc", edit_obj_indeks: find_index(group), original_list_obj: original_doctypes}))
        } else {
            //add new group
            modal.set(bind(FilterForm,{edit_bool: false, typeOfForm: "doc", edit_obj_indeks: -1, original_list_obj: original_doctypes}))
        }
    }

    //happens when an item is checked
    function updateCheckedList(item){
        //update current group to a new object so it wont be overwritten
        if ($current_doctype_filtergroup.name !=""){
            $current_doctype_filtergroup = {id: -1, name:"",filters: $current_doctype_filtergroup.filters.slice()}
            $current_doctype_filtergroup = $current_doctype_filtergroup
        }
        if (item.checked){
            //remove from current group list
            $current_doctype_filtergroup.filters.splice($current_doctype_filtergroup.filters.indexOf(item.name), 1)
            
        }else if(!item.checked){
            // add to  current group listlist
            $current_doctype_filtergroup.filters.push(item.name)
        }

        $current_doctype_filtergroup = $current_doctype_filtergroup
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
                <button class="secundary-button" on:click={()=>openModal($current_doctype_filtergroup)}>Lagre som filreringsgruppe</button>
            {/if}
    
        </div>
    </div>
    {:else}    
        <h3>Filtergrupper:</h3>
        <input class="search-input" bind:value={filter_searched_value} type="text" placeholder="Søk.." name="search">

        <div>
            <button class="secundary-button" on:click={changeMode}>Alle filtere</button>
            <button class="secundary-button" on:click={()=>{openModal(null)}}>Nytt filter</button>
        </div>
        <div class="filtermenu-button-conteiner">
            {#each searchedFiltergroups as filter}
            
            <div class="group">
                <input type="radio"  checked={$current_doctype_filtergroup  == filter} on:change={() => $current_doctype_filtergroup = filter}  />
                
                <div class="title">
                    {filter.name} 
                </div>
                
                <div class="group-buttons">
                    <button class="edit-button" title ="Rediger" on:click={()=>openModal(filter)} ><i class="material-icons">edit</i></button>
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