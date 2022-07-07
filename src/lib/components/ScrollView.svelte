<script>
    import {documentList} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import {currentlyAddingNewNote, noDocumentFilter, filterGroup} from '../stores/stores.js';
    import { marked } from 'marked';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import FilteredByTitles from './FilteredByTitles.svelte';

    $: not_empty_search = (searchValue != "") && (searchResult.length>0);
    $: show_titles_button = not_empty_search? false: false; //sets to false when when searchbar is empty
    let show = false;
    let sortedData = $documentList;
    let ascendingOrder = true;
    let lengde = $documentList.length;
    let searchValue = "";
    let searchResult = $documentList;

    $: filteredDocumentlist = $noDocumentFilter ? $documentList :($documentList.filter(item => ($filterGroup.includes(item.title))));

    $: searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes(searchValue.toLowerCase()))  || (item.author.toLowerCase().includes(searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes(searchValue.toLowerCase()))|| (item.title.toLowerCase().includes(searchValue.toLowerCase())));
    
    function save(){ 
        show = false;
        ascendingOrder= true;
        sortByString("date")
    }

    function cancel(){
        show = false;
        console.log("tester cancel")
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
        if (searchValue!== "") {
            let container
            container = document.createElement("div")
            container.innerHTML = htmlText
            wrapWord(container, searchValue)
            let after = document.createTextNode(container.innerHTML)
            return container.innerHTML
        } else{
            return htmlText
        }
    }
    

</script>
<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>




    <div class="scroll-container">
        <Splitpanes>
            <Pane size="100">
                <Splitpanes horizontal={true}>
                    <Pane size="100"> 
                        <div class:container={show} class:full-container={!show} >
                            <input bind:value={searchValue} type="text" placeholder="Søk.." name="search">
    
                            {#if searchResult.length > 0}
                                <div class = "dokumenter">
                                    {#each searchResult as item}
                                        <ScrollItem htmlText = {highlightWord(marked(item.context))} date = {highlightWord(item.date.toDateString())} title = {highlightWord(item.title)} author = {highlightWord(item.author)} on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
                                    {/each}
                                </div>
                            {:else}
                                <div class = "no-result"> Ingen Søkeresultater</div>
                            {/if}
                  
                            {#if !show}
                                <button title="Ny notat"class="add-button" class:visible={$currentlyAddingNewNote} on:click = {addNote}>+</button>
                            {/if}
                        </div>
                    </Pane>
                    {#if show}
                        <Pane >
                            <div class="editor">
                                <Typewriter on:save = {save} on:cancel = {cancel} />
            
                            </div>
                        </Pane>
    
                    {/if}
                </Splitpanes>
            </Pane>

            
            {#if not_empty_search}
                {#if !show_titles_button}
                    <button class = "searched-titles-button" on:click={() => {show_titles_button = true}}>
                        <i class="material-icons">read_more</i>
                    </button>
    
                {:else}
                <Pane size="10" maxSize="40">
                    <div class="searched-titles">
                        <FilteredByTitles searched_value = {searchValue}/>
                    </div>
                </Pane>
                {/if}
            {/if}

        </Splitpanes>

    </div>

<style>
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
    }
    
    .scroll-container{
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
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

    .add-button{
        position: absolute;
        margin-bottom: 4vh;
        font-size:xx-large;
        color:#ffffff;
        right:5vh;
        width:8vh;
        height: 8vh;
        align-items: center;
        justify-content: center;
        background: #d43838;
        border-radius: 50%;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }

    .add-button:hover{
        border: solid 0.1em;
        box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
    }

    .visible{
        visibility: hidden;
    }

</style>