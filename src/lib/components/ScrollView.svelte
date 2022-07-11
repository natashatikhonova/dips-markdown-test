<script>
    import {documentList, searchValue, showTitles} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import {currentlyAddingNewNote, noDocumentFilter, filterGroup} from '../stores/stores.js';
    import { marked } from 'marked';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import FilteredByTitles from './FilteredByTitles.svelte';

    $: not_empty_search = ($searchValue != "") && (searchResult.length>0);
    $: show_titles_button = not_empty_search? false: false; //sets to false when when searchbar is empty
    let show = false;
    let sortedData = $documentList;
    let ascendingOrder = true;
    let lengde = $documentList.length;
    let searchResult = $documentList;
    
    let selected_titles_nodes_List = []
    
    $: filteredDocumentlist = $noDocumentFilter ? $documentList :($documentList.filter(item => ($filterGroup.includes(item.title))));

    $: if (selected_titles_nodes_List.length>0) { //Hvis filtrert på overskrifter
        searchResult = nodeList_to_documentObjList(selected_titles_nodes_List)
        searchResult = searchResult.filter(item => (item.temp_filtered_context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    } else {
        searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));

    }
    
    function nodeList_to_documentObjList(node_list) {
        let documentObj_list = []
        for (let i = 0; i <node_list.length; i++){
            documentObj_list[i] = node_list[i].object
        }
        return documentObj_list
    }
    // $: console.log($selectedTitlesList)
    
    // $: console.log(selected_titles_nodes_List)

    function make_nodes_list(obj_list){

        selected_titles_nodes_List = []
        reset_filtered_text(); //Loop through the whole documentList and sets the filtered text to empty string
        // console.log("\nNY laging av dokumenter")
        // console.log(obj_list)
        obj_list.forEach((item)=>{
            
            // console.log(item)

            item.nodes.forEach((node)=> {
                // console.log("\nSjekker noden: " + node.overskrift)
                let indeks = -1

                for (let i = 0; i < selected_titles_nodes_List.length; i++) { //check if document have been created
                    if (selected_titles_nodes_List[i].object.id == node.object.id) { //If they belong to the same object
                        // console.log("found object " + selected_titles_nodes_List[i].overskrift + " med samme dokumentobject" )
                        indeks = i;
                        break;
                    }
                }
                if (indeks != -1){ 
                    // console.log("Endrer context ")
    
                    if (!is_in_subtree(selected_titles_nodes_List[indeks], node)){ //sets node in this place instead
                        if (is_in_subtree(node, selected_titles_nodes_List[indeks])) { //if node is over in the tree
                            // console.log("noden er over")
    
                            node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
    
                            selected_titles_nodes_List[indeks] = node;

                        } else { //if they are in the same tree
                            // console.log("Samme tre")
                            if (node.object.temp_filtered_context == "" ){
                                node.object.temp_filtered_context =  selected_titles_nodes_List[indeks].object.markdownTree.get_text_under(selected_titles_nodes_List[indeks]) + "\n" + node.object.markdownTree.get_text_under(node)
                            } else {
                                node.object.temp_filtered_context +=  "\n" +  node.object.markdownTree.get_text_under(node)
                              
                            }
                            // console.log(node)
    
                            // console.log("\nNoder under " + node.overskrift + ":")
                            // console.log(node.object.markdownTree.get_nodes_in_order(node))
    
                            selected_titles_nodes_List[indeks] = node;
                            
                            // console.log(selected_titles_nodes_List[indeks])
                        }
                    } 

                } else { //Set the variable temp_filtered_context i objectet til teksten som skal vises
                    // console.log("Variabelen temp_filtered_context blir satt")

                    node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
                    selected_titles_nodes_List.push(node)
                }
            })

            // console.log(selected_titles_nodes_List)
        })
    }
    function reset_filtered_text(){
        for (let i = 0; i < $documentList.length; i++){
            $documentList[i].temp_filtered_context = ""
        }
    }
        
    function is_in_subtree(to_node, add_node){

        let subtree = to_node.object.markdownTree.get_subtree(to_node)
        // console.log("Subtreet til " + to_node.overskrift)
        // console.log(subtree)
        for(let i = 0; i < subtree.length; i++) {
            let check_node = subtree[i]
            if (check_node.compare(add_node)) {
                // console.log(add_node.overskrift + " er i subtreet til " + to_node.overskrift)
                return true; //add_node is in subtree of to_node
            }
        }
        // console.log(add_node.overskrift + " er ikke i subtreet til " + to_node.overskrift)
        return false; //add_node is not in subtree of to_node

    }

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
    let scrollview_size = "125";

    function close(){
        //show_titles_button=!show_titles_button;
        current_size = "0";
        scrollview_size = "125";
        $showTitles = false;
    }

    function open(){
        current_size = "25";
        scrollview_size = "100";
    }
    function show_documents_checked_titles(event) {
        // console.log(event.detail)
        make_nodes_list(event.detail)
       
    }

    $: if($showTitles==true){
        console.log("test")
        open()
    }

    $: $showTitles, console.log($showTitles)
    

</script>
<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>




    <div class="scroll-container">
        <Splitpanes >
            
            <Pane minSize="15" size={current_size} maxSize="50">
                <div class="searched-titles">
                    <FilteredByTitles on:checked_titles={show_documents_checked_titles} on:close={close}/>
                </div>
            </Pane>
            <Pane size={scrollview_size} >
                <Splitpanes horizontal={true} >
                    <Pane size="100"> 
                        <div class:container={show} class:full-container={!show} >
                            <!-- <input bind:value={searchValue} type="text" placeholder="Søk.." name="search"> -->
                            <!-- {#if !show_titles_button}
                                <button class = "searched-titles-button" on:click={open}>
                                    <i class="material-icons">read_more</i>
                                </button>
                            {/if} -->
    
                            {#if searchResult.length > 0}
                                <div class = "dokumenter">
                                    {#each searchResult as item}
                                        <ScrollItem htmlText = {(item.temp_filtered_context == "") ? highlightWord(marked(item.context)) : highlightWord(marked(item.temp_filtered_context))} date = {highlightWord(item.date.toDateString())} title = {highlightWord(item.title)} author = {highlightWord(item.author)} on:editItem = {()=>show=!show} document = {item} deactivate ={show}/>
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