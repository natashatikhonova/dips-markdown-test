<script>

    import { searchValue, showTitles, globalCurrentFilterGroup, myFilters, showFiltermenu} from '../stores/stores.js';
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

    <input bind:value = {$searchValue} class:hidden={hideToolBar} placeholder="Søk.." name="search" class="search-input">

</div><!-- all -->



<style>

    .all{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

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