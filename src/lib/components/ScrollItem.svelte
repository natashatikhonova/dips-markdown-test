<script>
    import {marked} from 'marked';
    export let document;
    import { Editor } from 'typewriter-editor';
    import asRoot from 'typewriter-editor/lib/asRoot';
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';

    const editor = new Editor();
    let edit = false;
    function changeEdit(){
        edit = !edit;
    }
    function save(){
        console.log("lagret");
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
            <button on:click={changeEdit}>Rediger</button>
        </div>
    </div>
    

    {#if edit}
        <button class = "cancel" on:click={changeEdit} >Avbryt</button>
        <button class="save" on:click={save}>Lagre</button>
        <Toolbar {editor} let:active let:commands>
            <div class="toolbar">
            <button
                class="toolbar-button"
                class:active={active.header === 1}
                on:click={commands.header1}>H1</button>
        
            <button
                class="toolbar-button"
                class:active={active.header === 2}
                on:click={commands.header2}>H2</button>
        
            <button
                class="toolbar-button"
                class:active={active.bold}
                on:click={commands.bold}>B</button>
        
            <button
                class="toolbar-button"
                class:active={active.italic}
                on:click={commands.italic}>I</button>
        
            <button
                class="toolbar-button"
                disabled={!active.undo}
                on:click={commands.undo}>←</button>
        
            <button
                class="toolbar-button"
                disabled={!active.redo}
                on:click={commands.redo}>→</button>
            </div>
        </Toolbar>
        <div use:asRoot = {editor} >
            <div class="content">
                {@html  marked(document.context)}
            </div></div>
    {:else}
        <div class="content">
            {@html  marked(document.context)}
        </div>
    {/if}
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
