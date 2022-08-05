<script>
    import {documentList, searchValue, amount_searched_words, searchedDocuments, showFiltermenu, selected_line_height, selected_text_size, smallDevice} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import {currentlyAddingNewNote, showSideView, currentlyEditingNote} from '../stores/stores.js';
    import { marked } from 'marked';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import ToolMenu from './ToolMenu.svelte';
    import FilterMenu from './FilterMenu.svelte';

    let show = $currentlyAddingNewNote;
    let sortedData = $documentList;
    let ascendingOrder = true;
    let lengde = $documentList.length;
    let current_size= "0";
    let maxSize_filter = "0"
    let scrollview_size = "125";
    
    $: if($showFiltermenu){
        open()
    } else{
        close()
    }

    function save(){ 
        show = false;
        ascendingOrder= true;
        sortByString("date")
    }

    function cancel(){
        show = false;
    }
    
    function addNote(){
        $currentlyAddingNewNote = true;
        show =true;
    }
    
    const sortByString = (colHeader) => {
        sortedData = sortedData.sort((obj1, obj2) => {
            if (obj1[colHeader] < obj2[colHeader]) {
                return -1;
			} else if (obj1[colHeader] > obj2[colHeader]) {
				return 1;
			}
			return 0; //string code values are equal		
		});

		if (!ascendingOrder) {
            sortedData = sortedData.reverse()
		}
        $documentList = sortedData;
        ascendingOrder = !ascendingOrder;
	}
    
    $: if ($documentList.length>lengde) {
        ascendingOrder = true;
        sortByString("date");
    }
    //sorting by default
    sortByString("date");

    //markes all the "word" in "el" with a color style
    function wrapWord(el, word){
        var expr = new RegExp(word, "gi");
        var nodes = [].slice.call(el.childNodes, 0);
        for (var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];
            if (node.nodeType == 3) // textNode
            {
                var matches = node.nodeValue.match(expr);
                if (matches)
                {
                    var parts = node.nodeValue.split(expr);
                    for (var n = 0; n < parts.length; n++)
                    {
                        if (n)
                        {
                            var span = el.insertBefore(document.createElement("span"), node);
                            span.appendChild(document.createTextNode(matches[n - 1]));
                            span.style = "color:#d43838; border-bottom: 3px solid #d43838"
                            
                        }
                        if (parts[n])
                        {
                            el.insertBefore(document.createTextNode(parts[n]), node);
                        }
                    }
                    $amount_searched_words++
                    el.removeChild(node);
                }
            }
            else
            {
                wrapWord(node, word);
            }
        }
    }

    //Highlight all the words searched on in htmlText
    function highlightWord(htmlText) {
        if ($searchValue!== "") {
            let container
            container = document.createElement("div")
            container.innerHTML = htmlText
            wrapWord(container, $searchValue)
            return container.innerHTML
        } else{
            return htmlText
        }
    }

    function close(){
        //sets pane sizes
        current_size = "0";
        maxSize_filter = "0"
        scrollview_size = "125";
        $showFiltermenu = false;
    }

    function open(){
        //sets pane sizes
        if($smallDevice){
            //mobile
            current_size = "100"
            maxSize_filter = "100"
            scrollview_size="0"
        }else{
            current_size = "25";
            maxSize_filter = "50"
            scrollview_size = "100";
        }
    }




</script>
<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
    <div class="with-toolbar-conteiner">
        {#if ($currentlyAddingNewNote || $currentlyEditingNote) &&show && $smallDevice}
            <ToolMenu hideToolBar={true}/>
        {:else}
            <ToolMenu hideToolBar={false}/>
        {/if}
        <div class="scroll-container">
            <Splitpanes theme="modern-theme">
                <Pane minSize="20" size={current_size} maxSize={maxSize_filter}>
                    <FilterMenu on:close={close}/>
                </Pane>
                <Pane size={scrollview_size} >
                    <Splitpanes theme="modern-theme" horizontal={true} >
                        <Pane size=100> 
                            <div class:container={show} class:full-container={!show} >
                                {#if $searchedDocuments.length > 0}
                                    <div class = "dokumenter" id="documents" style="line-height:{$selected_line_height}; font-size: {$selected_text_size}pt">
                                        {#each $searchedDocuments as item}
                                            <ScrollItem htmlText = {(item.temp_filtered_context == "") ? highlightWord(marked(item.context)) : highlightWord(marked(item.temp_filtered_context))} date = {highlightWord(item.date.toDateString())} title = {highlightWord(item.title)} author = {highlightWord(item.author)} on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                                        {/each}
                                    </div>
                                {:else}
                                    <div class = "no-result"> Ingen Søkeresultater</div>
                                {/if}
                    
                                {#if !show}
                                    <button title="Ny notat"class="add-button" class:visible={$currentlyAddingNewNote|| $currentlyEditingNote} on:click = {addNote}>+</button>
                                {/if}
                            </div>
                        </Pane>
                        {#if show && ((!$showSideView && !$smallDevice) || $smallDevice)}
                            <Pane size={$smallDevice ? "100" : typewriterWiewSize.toString()}>
                                <div class="editor">
                                    <Typewriter on:save = {save} on:cancel = {cancel} />
                                </div>
                            </Pane>
                        {/if}
                    </Splitpanes>
                    {#if $smallDevice && ($currentlyAddingNewNote || $currentlyEditingNote)&&!show}
                        <button class="arrow-up-button" on:click={()=>{show=true}}>Vis <i class="material-icons">keyboard_arrow_up</i></button>
                    {/if}
                </Pane>
            </Splitpanes>
        </div>
    </div>


<style>
    .arrow-up-button{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 1%;
        background: rgb(255, 255, 255);
        border:none;
        font-weight: bold;
        font-size: medium;
    }

    :global(body.dark-mode) .arrow-up-button{
        background: rgb(49, 49, 49);
        color:#cccccc;
    }
    .no-result{
        display:flex;
        font-size: xx-large;
        align-self: center;
        justify-self: center;
        position: absolute;
        top: 40%;
    }
    .dokumenter {
        margin-top: 4vh;
        line-height: normal;
        font-size:11pt
    }

    .scroll-container{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
    }

    :global(body.dark-mode) .full-container{
        background-color: rgb(49, 49, 49);
    }

    :global(body.dark-mode) .container{
        background-color: rgb(49, 49, 49);
    }

    .full-container{
        flex-grow: 1;
        overflow-y: auto;
        display: flex; 
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 100%;
    }

    .container{
        overflow-y: auto; 
        display:flex;
        flex-direction: column-reverse;
        background-color: white;
        width: 100%;
        height: 100%;
        min-width: 17%;
    }

    .editor{
        display:flex;
        flex-direction: column;
        /* overflow-y: auto; */
        width: 100%;
        height: 100%;
        background: #ffffff;
        border: solid 1px black;
        background-color: white;
    }

    :global(body.dark-mode) .editor{
        background-color: rgb(49, 49, 49);
    }
    .visible{
        visibility: hidden;
    }
</style>