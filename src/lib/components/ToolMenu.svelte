<script>


    import { searchValue, amount_searched_words, showTitles, globalCurrentFilterGroup, myFilters, showFiltermenu} from '../stores/stores.js';
    import { writable } from 'svelte/store';

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


</script>

<header class="tool-menu">
    <div class="leftmenu">
        <button class="main-button" on:click={() =>$showFiltermenu = true}>Filter</button>

        <!-- {#if $globalCurrentFilterGroup != documentTypes}
          <button class="filteroff-button" on:click={null}>Skru av filter</button>
        {/if}	 -->

    </div><!-- leftmenu -->

    <div class = "search_field" class:hidden={hideToolBar}>
        <input on:input={()=>{$amount_searched_words = 0}} bind:value = {$searchValue} placeholder="Søk.." name="search" class="search-input searchWord-input">
        <div class="searched_words"> 
            {#if $searchValue != "" && $amount_searched_words != 0}
            {$amount_searched_words} ord
            {/if}
        </div>
    </div>

</header>

<style>
    .searched_words{
        width:60px;
        background: none;
        border: none;
        border-bottom: solid;
        margin: 2px;
        min-height: 30px;
        margin-left: 0;
    }
    .search_field{
        height: 100%;
        display: flex;
        flex-direction: row;
        margin-right: 20px;
    }

    .searchWord-input{
        margin-right: 0;
    }


    .leftmenu{
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .tool-menu{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: whitesmoke;
        box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
        margin-bottom: 3px;
}




    /* .filteroff-button{
        width: fit-content;
        border: none;
        background: none;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }
    .filteroff-button:hover {
        color:#666363;
    } */

    .hidden{
        visibility: hidden;
    }

</style>