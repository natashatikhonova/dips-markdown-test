<script>
    import {marked} from 'marked';
    import {currentDocumentObject, currentlyAddingNewNote} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';
    export let document;

    export let deactivate = false; 
    
    const dispatch = createEventDispatcher();

    function editItem(){
        currentDocumentObject.set(document);
        console.log($currentDocumentObject);
        dispatch('editItem');
    }

    
</script>

<div class="main">
    <div class="date">{document.date.toDateString()}</div>

    <div class="meta">
        <div class="title">
            {document.title}
        </div>
        <div class="author">
            {document.author}
            {#if deactivate}
                <button disabled>Rediger</button>
            {:else}
                <button class:visible={$currentlyAddingNewNote} on:click={editItem}>Rediger</button>
            {/if}
        </div>
    </div>
    <div class="content">
        {@html  marked(document.context)}
    </div>
</div>

<style>
    .main{
        padding: 2em;
    }
    .main:hover{
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

    .visible{
        visibility: hidden;
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
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

</style>
