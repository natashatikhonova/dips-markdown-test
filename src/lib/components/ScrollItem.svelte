<script>
    import {currentDocumentObject, currentlyAddingNewNote, currentlyEditingNote} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';
    import { marked } from 'marked';

    export let document;
    export let date;
    export let title;
    export let author;
    export let deactivate = false; 
    export let htmlText;


    const dispatch = createEventDispatcher();

    function editItem(){
        currentDocumentObject.set(document);
        dispatch('editItem');
        $currentlyEditingNote = true;
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
            {#if document.readable}
                {#if deactivate}
                    <button title ="Rediger" disabled><i class="material-icons">edit</i></button>
                {:else}
                    <button title ="Rediger" class:visible={$currentlyAddingNewNote} on:click={editItem}><i class="material-icons">edit</i></button>
                {/if}
            {/if}
        </div>
    </div>
    {#if document.readable}
        <!-- <div class = "table-test"> {@html marked('| H1 | H2 |  H3 |  H4 | H5 | \n |:---:|---|---|---|---| \n |  U1 | U2 | U3 | U4 | U5 | \n | K1 | K2 |  K3 | K4  |  K5 | \n | J1 |  J2 | J3 |  J4 | J5 |' )}</div> -->
        <div class = "text">{@html htmlText}</div>
    {:else}
        <div class="link"><a href={document.context} target="_blank">Klikk her for å åpne dokumentet i egen visning</a></div>
    {/if}
    
</div>

<style>
    :global(.text img){
        max-height: 50%;
        max-width: 50%
    }
    :global(.text tr) {
        height: 5vh;
    }
    :global(.text td) {
        text-align: center;

        padding: 10px;

        border:1px solid rgb(97, 96, 96);  
    }

  :global(.text tr:hover){
        background-color: #e6f5ff;
    }
  :global(.text table) {
		width: 100%;
        border-collapse: collapse;
        background-color: white;
	}
	
	:global(.text th) {
		text-transform: uppercase;
        background: rgb(253, 253, 253);
		cursor: pointer;
        text-align: center;
		padding: 10px;
        border:1.5px solid rgb(0, 0, 0);
	}

    .item-container{
        padding: 2em;
    }

    .item-container:hover{
        background-color: whitesmoke
        
    }

    :global(body.dark-mode) .item-container:hover {
        background-color: rgb(61, 61, 61);
    }

    .meta{
        display: flex;
        align-items: flex-start;
        justify-content:space-between
    }

    .date, .meta{
        font-weight: bold; 
    }

    .link{
        margin-top: 2vh;
    }

    a{
        color: #d43838;
        font-weight: bold;
        font-style: italic;
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


    :global(body.dark-mode) button{
        color:#cccccc;
    }

    :global(body.dark-mode) button:hover{
        color:#d43838;
    }


    .visible{
        visibility: hidden;
    }


</style>
