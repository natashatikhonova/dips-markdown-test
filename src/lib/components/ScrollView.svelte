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

        <div class="box">
            <div id="container" class:container={show} class:full-container={!show}> 

                {#each $documentList as item}
                        <ScrollItem on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                {/each}
            </div>
            {#if show}
                <div class="editor">
                    <Typewriter on:cancel = {cancel} on:save = {save}/>
                </div>
            {/if}
        </div>


<style>
    .box{
        display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .container{
        overflow-y: auto; 
        display:flex;
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 100%;
        border: solid;
        resize: vertical;

    }

    .full-container{
        flex-grow: 1;
        overflow-y: auto;
        display: flex; 
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 100%;
        border: solid;
        min-width: none;

    }

    .editor{
        display:flex;
        flex-direction: column;
        overflow-y:auto;
        width: 100%;
        background: #ffffff;
        border: solid 1px black;
        flex-grow: 1;
    }
</style>