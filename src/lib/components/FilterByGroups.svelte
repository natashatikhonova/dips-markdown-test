<script>

    import {globalCurrentFilterGroup, myFilters, nofilter, allfilterOff} from '../stores/stores';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';

    //Alt fra filtergrupper 
    import FilterDoctypeForm from './FilterDoctypeForm.svelte';
    const modal = writable(null);

    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    let documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11", "typ12", "typ13", "typ14"];
    
    //If the compleate menu is open
    let filterMenuOpen = false;
    let customViewMode = true;


    let filter_searched_value = "";
    let filtergroup_searched_value ="";

    let myCurrentfilterGroup = $nofilter;

    // let customFilter = {id: -1, name: "", filters: $nofilter.filters}
    let customFilter = {id: -1, name: "", filters: $globalCurrentFilterGroup.filters};

    let currentFilterobj = $globalCurrentFilterGroup;

    let showAllButtonName = "Nullstill"

    $: searchedDocumentTypes = $nofilter.filters.filter(item => (item.toLowerCase().includes(filter_searched_value.toLowerCase())));

    $: searchedFiltergroups = $myFilters.filter(item => (item.name.toLowerCase().includes(filtergroup_searched_value.toLowerCase())));

    $: $globalCurrentFilterGroup = currentFilterobj

    $: if($allfilterOff){
        currentFilterobj = $nofilter
        customFilter.filters = $nofilter.filters
        $allfilterOff = false
    }  
    else if (customViewMode){
        currentFilterobj  = customFilter
    }
    else{
        currentFilterobj  = myCurrentfilterGroup    
    }

    $: if(customFilter.filters.length == documentTypes.length){
        showAllButtonName = "Nullstill"
    }
    else if (customFilter.filters.length < documentTypes.length){
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
            if (list[i].toLowerCase().startsWith(value)){
                startsWithSearch.push(list[i])
                list.splice(i, 1)
            }
        }
        list = startsWithSearch.concat(list)
        return list
    }


    //For the custom mode
    
    //Sorting the documentstitels alfabetic
    const sortByString = () => {
        let sortedData = documentTypes.sort((obj1, obj2) => {
            if (obj1 < obj2) {
                    return -1;
            } else if (obj1 > obj2) {
                return 1;
            }
            return 0; //string code values are equal		
        });
        documentTypes = sortedData;
    }
    sortByString()


    function clickedAll(){
        myCurrentfilterGroup = $nofilter
        if(customFilter.filters.length < documentTypes.length){
            customFilter.filters = documentTypes
            showAllButtonName = "Nullstill"    
        }
        else{
            customFilter.filters = []
            showAllButtonName = "Vis alle"
        }
    }

    //For stored filtergroupsview

    //User clicked on edit and program swich mode with current crop as start point
    function editItem(group){
        manageGroup = true
        modal.set(bind(FilterDoctypeForm,{edit_bool: false, newFilterObj : group}))
    }

    let manageGroup = false
    function openModel(){
        manageGroup = true
        modal.set(bind(FilterDoctypeForm,{edit_bool: false}))
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
            <label class="filterItem" >
                <input type="checkbox"  bind:group={customFilter.filters} value={item} >
                {item}
                <span class="checkmark"></span>
            </label>
            {/each}
        </div>
        <div class = "save-filter-button">
            {#if customFilter.filters.length>0}
                <button class="secundary-button" on:click={()=>editItem(customFilter)}>Lagre som filreringsgruppe</button>
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

        </div>

        <!-- <div class="filterItem-button" class:active={currentFilterobj == nofilter} on:click={() => currentFilterobj = nofilter} value="alle">
            Vis allt
        </div> -->
            {#each searchedFiltergroups as filter}

            <div class="group">
                <input type="radio" checked={currentFilterobj  == filter} on:change={() => currentFilterobj  = filter} value={filter.filters} />

                <div class="title">
                    {filter.name} 
                </div>

                <div class="group-buttons">
                    <button class="edit-button" title ="Rediger" on:click={()=>editItem(filter)} ><i class="material-icons">edit</i></button>
                    <button class="edit-button" title="Slett" on:click={()=> $myFilters = $myFilters.filter(item => (item.id != filter.id))}><i class="material-icons">delete</i></button>
                </div>

            </div>
            {/each}
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