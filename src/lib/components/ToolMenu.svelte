<script>


    import { searchValue, amount_searched_words, showTitles, globalCurrentFilterGroup, myFilters, showFiltermenu, nofilter, allfilterOff} from '../stores/stores.js';

    export let hideToolBar = true;

    function turnOffFilters(){
        $allfilterOff = true
        $globalCurrentFilterGroup = $nofilter
    }
</script>



<header class="tool-menu">
    <div class="leftmenu">
        <button class="main-button" on:click={() =>$showFiltermenu = true}>Filter</button>
        <!-- alternative løsninger på filteroff -->
        <!-- <button class="main-button" on:click={() =>$showFiltermenu = true}  class:filterOn={$globalCurrentFilterGroup.filters.length != $nofilter.filters.length}>Filter</button> -->
        <!-- {#if $globalCurrentFilterGroup.length != documentTypes.length}
            <button class="close" on:click={null}><i class="material-icons" >close</i></button>
        {/if} -->
        
        {#if $globalCurrentFilterGroup.filters.length != $nofilter.filters.length}
          <button class="filteroff-button" on:click={turnOffFilters}>Skru av filter</button>
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
    /* Alternative løsninger */
    /* .main-button.filterOn{
        border: solid 1px;
        box-shadow: 0 0 0 0.2rem #6ac2fd;
    }

    .main-button:hover {
        border: solid 1px;
        box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
    }
    .close{
        background: none;
        border: none;
        width: 40px;
        height: 40px;
    }
    .close:hover {
        color:#d43838; 
    } */
    
</style>