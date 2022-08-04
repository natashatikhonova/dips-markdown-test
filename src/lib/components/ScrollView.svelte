<script>

    import {documentList, searchValue, amount_searched_words, searchResult, showFiltermenu, selected_line_height, selected_text_size} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import {currentlyAddingNewNote, showSideView, current_doctype_filtergroup, currentlyEditingNote} from '../stores/stores.js';
    import { marked } from 'marked';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import FilteredByTitles from './FilteredByTitles.svelte';
    import ToolMenu from './ToolMenu.svelte';
    import FilterMenu from './FilterMenu.svelte';
    let s
    let show = $currentlyAddingNewNote;
    let sortedData = $documentList;
    let ascendingOrder = true;
    let lengde = $documentList.length;

    let typewritersize = "50"

    let w
    let h
    $: w = window.innerWidth;
    $: h = window.innerHeight;

    function save(){ 
        show = false;
        ascendingOrder= true;
        sortByString("date")
    }

    function cancel(){
        show = false;
        // console.log("tester cancel")
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
    let current_size= "0";
    let maxSize_filter = "0"
    let scrollview_size = "125";

    function close(){
        //show_titles_button=!show_titles_button;
        current_size = "0";
        maxSize_filter = "0"
        scrollview_size = "125";
        $showFiltermenu = false;
    }

    function open(){
        if(w<600){
            current_size = "100"
            maxSize_filter = "100"
            scrollview_size="0"
        }else{

            current_size = "25";
            maxSize_filter = "50"
            scrollview_size = "100";
        }
    }
    // function show_documents_checked_titles(event) {
    //     make_nodes_list(event.detail)
       
    // }

    $: if($showFiltermenu==true){
        open()
    }

    // $: $showTitles, console.log($showTitles)


</script>
<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>




    <div class="with-toolbar-conteiner">
        {#if ($currentlyAddingNewNote || $currentlyEditingNote) &&show && w<600}
            <ToolMenu hideToolBar={true}/>
        {:else}
            <ToolMenu hideToolBar={false}/>
        {/if}
        <div class="scroll-container">
            <Splitpanes theme="modern-theme">
                
                <Pane minSize="20" size={current_size} maxSize={maxSize_filter}>
                    <FilterMenu on:close={close}/>
                    <!-- <div class="searched-titles">
                        <FilteredByTitles on:checked_titles={show_documents_checked_titles} on:close={close}/>
                    </div> -->
                </Pane>
                <Pane size={scrollview_size} >
                    <Splitpanes theme="modern-theme" horizontal={true} >
                        <Pane size=100> 
                            <div class:container={show} class:full-container={!show} >
                                <!-- <input bind:value={searchValue} type="text" placeholder="Søk.." name="search"> -->
                                <!-- {#if !show_titles_button}
                                    <button class = "searched-titles-button" on:click={open}>
                                        <i class="material-icons">read_more</i>
                                    </button>
                                {/if} -->
        
                                {#if $searchResult.length > 0}
                                
                                    <div class = "dokumenter" id="documents" style="line-height:{$selected_line_height}; font-size: {$selected_text_size}pt">
                                        {#each $searchResult as item}
                                            
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
                        {#if show && ((!$showSideView && w>600) || w<600)}
                            <Pane size={w<600 ? "100" : "50"}>
                                <div class="editor">
                                    <Typewriter on:save = {save} on:cancel = {cancel} />
                                </div>
                            </Pane>
                        {/if}
                    </Splitpanes>
                    {#if w<600 && ($currentlyAddingNewNote || $currentlyEditingNote)&&!show}
                        <button class="arrow-up-button" on:click={()=>{show=true}}>Vis <i class="material-icons">keyboard_arrow_up</i></button>
                    {/if}
                </Pane>
            </Splitpanes>
        </div>
    </div>


<style>

header{
    max-height: 40px;
    min-height: 40px;
    align-items: center;
    background-color: #dadada;
    display: flex;
    justify-content:space-between;
    
  }

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

    .searched-titles-button{
        background: none;
        border:none;
        position: absolute;
        right: 2vw;
        top: 10vh;
    }
    .searched-titles-button:hover{
        color: #d43838;
    }
    .searched-titles{
        background-color: white;
        height: 100%;
        width: 100%;
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

    input[type=text] {
        position: absolute;
        top: 2vh;
        right:3.2vw;
        padding: 6px;
        border: none;
        border-bottom: solid;
        font-size: 17px;
        width:20%;
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