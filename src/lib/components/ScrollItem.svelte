<script>
    import {currentDocumentObject, currentlyAddingNewNote} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';

    export let document;
    export let date;
    export let title;
    export let author;
    export let deactivate = false; 
    export let htmlText

    const dispatch = createEventDispatcher();

    function editItem(){
        currentDocumentObject.set(document);
        dispatch('editItem');
    }
 
</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<div class="item-container">
    <div class="date">{@html date}</div>
    <div class="meta">
        <div class="title">{@html title}</div>
        <div class="author">
            {@html author}
            {#if deactivate}
                <button title ="Rediger" disabled><i class="material-icons">edit</i></button>
            {:else}
                <button title ="Rediger" class:visible={$currentlyAddingNewNote} on:click={editItem}><i class="material-icons">edit</i></button>
            {/if}
        </div>
    </div>
    <div>
        {@html htmlText}
    </div>
</div>

<style>

    .item-container{
        padding: 2em;
    }

    .item-container:hover{
        background-color: whitesmoke
        
    }

    .meta{
        display: flex;
        align-items: flex-start;
        justify-content:space-between
    }

    .date, .meta{
        font-weight: bold; 
    }
    
    button{
        right:10vw;
        width:2vw;
        margin-left: 2vw;
        padding: 0;
        height: 4vh;
        align-items: center;
        justify-content: center;
        background: #fff;
        border:none;
        cursor: pointer;
        background: none;
    }

    button:hover{
        color: #d43838;
    }
    .visible{
        visibility: hidden;
    }


</style>
