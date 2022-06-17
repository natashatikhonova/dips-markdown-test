<script>
    
    import {documentList} from './stores.js';
    import ScrollItem from "./ScrollItem.svelte";

    let visibleInput = false;

    function manageInput(){
        visibleInput = !visibleInput;

    }


</script>

    <div class="main">
        <div class="container">
            {#if visibleInput}
                <button on:click={manageInput}>Lagre</button>
                <button on:click={manageInput}>Avbryt</button>
                <textarea>
                </textarea>
            {:else}
                <button on:click={manageInput}>Ny notat</button>
            {/if}
            {#each $documentList as item}
                <ScrollItem document = {item}/>
                
            {/each}
            
        </div>

    </div>






<style>
    .container{
        overflow-y: auto;
        display: flex; 
        flex-direction: column-reverse;
        background-color: bisque;
        width: 70%;
        max-height: 88vh;
        position:sticky;
        margin-left: 15%;
        margin-right: 15%;
    }
    
    button {
        width:10vh;
        margin:2vh;
        align-self: flex-end;
        position: fixed;
    }

    textarea{
        width:100vh;
        align-self: center;
        min-height:30vh;
        margin-bottom: 5vh;
        position: sticky;
    }
</style>