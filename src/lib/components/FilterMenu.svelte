<script>
    import {createEventDispatcher} from 'svelte';
    import FilterByDoctype from './FilterByDoctype.svelte';
    import FilteredByTitles from './FilteredByTitles.svelte';
    import {showFiltermenu} from "../stores/stores"

    export let showFilterByTitles = true;
    
    let groupFilterView = true

    //sends a message when a panel is to be closed
    function close(){
        $showFiltermenu = false
    }
</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<div class="main">
    <div class="top-bar">
        <div class="filter-options">
            <button class:current-filter = {groupFilterView} on:click={()=>{groupFilterView = true}} >Dokumenttyper</button>
            {#if showFilterByTitles}
            <button class:current-filter = {!groupFilterView} on:click={()=>{groupFilterView = false}} >Overskrifter</button>
            {/if}
        </div>
        <button class="close" on:click={close}><i class="material-icons" >close</i></button>
    </div>
    {#if groupFilterView}
        <FilterByDoctype/>
    {:else if showFilterByTitles}
        <FilteredByTitles />  
    {/if}

</div>

<style>
    .main{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: whitesmoke;
    }

    :global(body.dark-mode) .main{
        background: rgb(49, 49, 49);
    }

    .top-bar{
        display: flex;
        flex-direction:row;
        background-color: #fff;
    }

    :global(body.dark-mode) .top-bar{
        background: rgb(62, 62, 62);
    }

    .filter-options{
        display: flex;
        flex-direction:row;
        flex-grow: 1;
    }

    .filter-options button{
        width: 100%;
        height: 40px;
        text-align: center;
        background-color: #fff;
        border: none;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .filter-options .current-filter{
        background: whitesmoke;
        font-weight: bold;
    }

    /* Filter buttons - darkmode */
    :global(body.dark-mode) .filter-options button{
        background: rgb(62, 62, 62);
        color: #cccccc;
    }

    :global(body.dark-mode) .filter-options .current-filter{
        background: rgb(49, 49, 49);
    }

    /* Close button */
    .close{
        background: none;
        border: none;
        width: 40px;
        height: 40px;
    }
    .close:hover {
        color:#d43838; 
    }

    :global(body.dark-mode) .close{
        color: #cccccc;
    }

    :global(body.dark-mode) .close:hover{
        color:#d43838; 
    }
</style>