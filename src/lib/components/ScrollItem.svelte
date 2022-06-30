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


<div class="item-container">
    <div class="date">{@html date}</div>
    <div class="meta">
        <div class="title">{@html title}</div>
        <div class="author">
            {@html author}
            {#if deactivate}
                <button disabled>Rediger</button>
            {:else}
                <button class:visible={$currentlyAddingNewNote} on:click={editItem}>Rediger</button>
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
        right:10vh;
        width:12vh;
        margin-left: 2vh;
        height: 40px;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }

    button:hover{
        border: solid 0.1em;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
    .visible{
        visibility: hidden;
    }


</style>
