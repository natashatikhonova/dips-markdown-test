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

    <div id="main" class="main">
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

    </div>


<style>
    .box{
        display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
    .main{
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
        flex-grow: 1;
        overflow: auto;
        display:flexbox;
        flex-direction: column;
        padding: 3vh;
        height:100%;
        padding-top: 0vh; 
        background: #ffffff;
        border: solid 1px black;
    }
</style>