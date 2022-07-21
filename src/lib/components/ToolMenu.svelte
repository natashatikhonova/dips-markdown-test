<script>


    import { searchValue, amount_searched_words, showTitles, globalCurrentFilterGroup, myFilters, showFiltermenu} from '../stores/stores.js';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';
    import FilterDoctypeForm from './FilterDoctypeForm.svelte';

    const modal = writable(null);

    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    let documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10"];
    
    export let hideToolBar = true;
    

    // function turnOffFilter(){
    //     myCurrentfilterGroup = nofilter
    //     customFilter.filters = documentTypes
    //     filterMenuOpen = false;
    //     customViewMode = true;
    // }

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
<div class="all">
    <div class="leftmenu">
        <button class="main-button" on:click={() =>$showFiltermenu = true}>Filter</button>

        {#if $globalCurrentFilterGroup != documentTypes}
          <button class="filteroff-button" on:click={null}>Skru av filter</button>
        {/if}	
    </div><!-- leftmenu -->
    <div class = "search_field" class:hidden={hideToolBar}>
        <input on:input={()=>{$amount_searched_words = 0}} bind:value = {$searchValue} placeholder="Søk.." name="search" class="search-input searchWord-input">
        <div class="searched_words"> 
            {#if $searchValue != "" && $amount_searched_words != 0}
                {$amount_searched_words} ord
            {/if}
        </div>



    </div>
</div><!-- all -->



<style>
    .searched_words{
        align-self: center;
        width:60px;
        /* color: #d43838; */
        font-weight: bold;
    }
    .search_field{
        display: flex;
        margin-right: 2vw;
        border-bottom: solid;
        margin-bottom: 5px
        
    }

    .searchWord-input{
        position:absolute;
        right: 5vw;

    }
    .all{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: whitesmoke;
        height: 100%;
        box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
        margin-bottom: 3px;

    }

    .leftmenu{
        height: 100%;
        display: flex;
        flex-direction: row;
    }


    .filteroff-button{
        width: fit-content;
        border: none;
        background: none;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }
    .filteroff-button:hover {
        color:#666363;
    }

    .hidden{
        visibility: hidden;
    }

</style>