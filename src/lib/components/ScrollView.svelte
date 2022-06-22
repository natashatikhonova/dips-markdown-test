<script>
    
    import {documentList, currentDocumentObject} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import toMarkdown from 'to-markdown';
    import {editor} from '../stores/stores.js';
    

    let show = false;
    function save(){ 
        $documentList[$currentDocumentObject.id].context = toMarkdown(editor.getHTML());
        show = !show;
    }
    function cancel(){
        show = !show
        
    }
   

</script>

    <div class="main">

        {#if show}
            <div class="container">
                {#each $documentList as item}
                    <ScrollItem on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                {/each}
                
            </div>
            <div class="editor">
                <Typewriter on:cancel = {cancel} on:save = {save}/>
            </div>
        {:else}
            <div class="full-container">
                {#each $documentList as item}
                    <ScrollItem on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                {/each}
                
            </div>
        {/if}

    </div>


<style>
    .main{
        width: 100%;
        justify-content: space-evenly;
    }

    .container{
        overflow-y: auto;
        display: flex; 
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 66vh;
        border: solid;
        resize: vertical;
        min-width: none;
    }

    .full-container{
        overflow-y: auto;
        display: flex; 
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        max-height: 97vh;
        border: solid;
        resize: vertical;
        min-width: none;

    }

    .editor{
        overflow: auto;
        padding: 3vh;
        padding-top: 0vh; 
        height:27.7vh;
        width: 96.9%;
        background: #ffffff;
        border: solid 1px black;
        resize: vertical;
    }
</style>