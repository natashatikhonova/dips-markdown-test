<script>
    import {marked} from 'marked';
    export let document;
    import {currentDocumentObject} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';

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
                <button on:click={editItem}>Rediger</button>
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

    button{
        margin-left: 2em;
        border: solid 0.1em;
        border-radius: 10%;
    }

    button:hover{
        border: solid 0.1em;
        border-color: red;
        border-radius: 20%;
    }

</style>
