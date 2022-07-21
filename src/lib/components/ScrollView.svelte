<script>

    import {documentList, searchValue, amount_searched_words, showTitles, showFiltermenu} from '../stores/stores.js';
    import ScrollItem from "./ScrollItem.svelte";
    import Typewriter from './Typewriter.svelte';
    import {currentlyAddingNewNote, globalCurrentFilterGroup} from '../stores/stores.js';
    import { marked } from 'marked';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import FilteredByTitles from './FilteredByTitles.svelte';
    import ToolMenu from './ToolMenu.svelte';
    import FilterMenu from './FilterMenu.svelte';

    let show = false;
    let sortedData = $documentList;
    let ascendingOrder = true;
    let lengde = $documentList.length;
    
    // let selected_titles_nodes_List = []
    
    // $: filteredDocumentlist = ($documentList.filter(item => ($globalCurrentFilterGroup.includes(item.title))));

    // $: if (selected_titles_nodes_List.length>0) { //Hvis filtrert på overskrifter
    //     searchResult = nodeList_to_documentObjList(selected_titles_nodes_List)
    //     searchResult = searchResult.filter(item => (item.temp_filtered_context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    // } else {
    //     searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    // }
    
    // function nodeList_to_documentObjList(node_list) {
    //     let documentObj_list = []
    //     for (let i = 0; i <node_list.length; i++){
    //         documentObj_list[i] = node_list[i].object
    //     }
    //     return documentObj_list
    // }
    // $: console.log($selectedTitlesList)
    
    // $: console.log(selected_titles_nodes_List)

    // function make_nodes_list(obj_list){

    //     selected_titles_nodes_List = []
    //     reset_filtered_text(); //Loop through the whole documentList and sets the filtered text to empty string
    //     // console.log("\nNY laging av dokumenter")
    //     // console.log(obj_list)
    //     obj_list.forEach((item)=>{
            
    //         // console.log(item)

    //         item.nodes.forEach((node)=> {
                
    //             // console.log("\nSjekker noden: " + node.overskrift)
    //             let indeks = -1

    //             for (let i = 0; i < selected_titles_nodes_List.length; i++) { //check if document have been created
    //                 if (selected_titles_nodes_List[i].object.id == node.object.id) { //If they belong to the same object
    //                     // console.log("found object " + selected_titles_nodes_List[i].overskrift + " med samme dokumentobject" )
    //                     indeks = i;
    //                     break;
    //                 }
    //             }
    //             if (indeks != -1){ 
    //                 // console.log("Endrer context ")
    
    //                 if (!is_in_subtree(selected_titles_nodes_List[indeks], node)){ //sets node in this place instead
    //                     if (is_in_subtree(node, selected_titles_nodes_List[indeks])) { //if node is over in the tree
    //                         // console.log("noden er over")
    
    //                         node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
    
    //                         selected_titles_nodes_List[indeks] = node;

    //                     } else { //if they are in the same tree
    //                         // console.log("Samme tre")
    //                         if (node.object.temp_filtered_context == "" ){
    //                             node.object.temp_filtered_context =  selected_titles_nodes_List[indeks].object.markdownTree.get_text_under(selected_titles_nodes_List[indeks]) + "\n" + node.object.markdownTree.get_text_under(node)
    //                         } else {
    //                             node.object.temp_filtered_context +=  "\n" +  node.object.markdownTree.get_text_under(node)
                              
    //                         }
    //                         // console.log(node)
    
    //                         // console.log("\nNoder under " + node.overskrift + ":")
    //                         // console.log(node.object.markdownTree.get_nodes_in_order(node))
    
    //                         selected_titles_nodes_List[indeks] = node;
                            
    //                         // console.log(selected_titles_nodes_List[indeks])
    //                     }
    //                 } 

    //             } else { //Set the variable temp_filtered_context i objectet til teksten som skal vises
    //                 // console.log("Variabelen temp_filtered_context blir satt")
    //                 // console.log(node)
    //                 node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
    //                 selected_titles_nodes_List.push(node)
    //             }
    //         })

    //         // console.log(selected_titles_nodes_List)
    //     })
    // }
    // function reset_filtered_text(){
    //     for (let i = 0; i < $documentList.length; i++){
    //         $documentList[i].temp_filtered_context = ""
    //     }
    // }
        
    // function is_in_subtree(to_node, add_node){

    //     let subtree = to_node.object.markdownTree.get_subtree(to_node)
    //     // console.log("Subtreet til " + to_node.overskrift)
    //     // console.log(subtree)
    //     for(let i = 0; i < subtree.length; i++) {
    //         let check_node = subtree[i]
    //         if (check_node.compare(add_node)) {
    //             // console.log(add_node.overskrift + " er i subtreet til " + to_node.overskrift)
    //             return true; //add_node is in subtree of to_node
    //         }
    //     }
    //     // console.log(add_node.overskrift + " er ikke i subtreet til " + to_node.overskrift)
    //     return false; //add_node is not in subtree of to_node

    // }

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
    let scrollview_size = "125";

    function close(){
        //show_titles_button=!show_titles_button;
        current_size = "0";
        scrollview_size = "125";
        $showFiltermenu = false;
    }

    function open(){
        current_size = "25";
        scrollview_size = "100";
    }
    // function show_documents_checked_titles(event) {
    //     make_nodes_list(event.detail)
       
    // }

    $: if($showFiltermenu==true){
        open()
    }

    // $: $showTitles, console.log($showTitles)

    const line_heights = ["Velg linjeavstand", "1.0", "1.15", "1.5", "2.0", "2.5", "3.0"]
    // const text_sizes = ["Velg skriftstørrelse", "9", "10", "11", "12", "14", "16", "18", "20"]

    let selected_line_height  = "Velg linjeavstand"
    // let selected_text_size = "Velg skriftstørrelse"

    // $: if (selected_line_height != "Velg linjeavstand") {
    //     let doc = document.getElementById('documents')
    //     doc.style.line-height = selected_line_height

    // }
    let min_size = false;
    let max_size = false;
    let selected_text_size = 11
    function set_text_size(direction){
        if (direction == "bigger"){
            selected_text_size++
            if (selected_text_size == 20){
                max_size=true
            }else if (selected_text_size>7){
            min_size =false
            }
        } else if (direction == "lower"){
            selected_text_size--
            if (selected_text_size == 7){
                min_size=true
            } else if (selected_text_size<20){
            max_size =false
            }
        }
}

</script>
<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>




    <div class="with-toolbar-conteiner">
        <header class="tool-menu">
            <ToolMenu hideToolBar={false}/>
        </header>  
        <div class="scroll-container">
            <Splitpanes >
                
                <Pane minSize="20px" size={current_size} maxSize="50">
                    <FilterMenu on:close={close}/>
                    <!-- <div class="searched-titles">
                        <FilteredByTitles on:checked_titles={show_documents_checked_titles} on:close={close}/>
                    </div> -->
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
        
                                {#if $searchResult.length > 0}
                                <select  class="line-button" bind:value={selected_line_height}>
                                    {#each line_heights as value}
                                    <option {value}>
                                        {value}
                                    </option>
                                {/each}
                            </select>
                                                        <div class="extra-functions">
                                <button
                                title="Zoom out"
                                class="toolbar-button"
                                disabled={min_size}
                                on:click={() => {set_text_size("lower")}}><i class="material-icons">text_decrease</i></button>
                                <button
                                title="Zoom in"
                                class="toolbar-button"
                                disabled={max_size}
                                on:click={() => {set_text_size("bigger")}}><i class="material-icons">text_increase</i></button>
                              </div>
                                    <div class = "dokumenter" id="documents" style="line-height:{selected_line_height}; font-size: {selected_text_size}pt">
                                        {#each $searchResult as item}
                                            
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


    .tool-menu{
        align-items: stretch;
        background-color: #eeeeee;
        height: 100%;

.toolbar-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin-top: 0.5vh;
    width: 2.3rem;
    height: 2.3rem;
    margin-right: 0.4rem;
    border-radius: 4px;
    border: 1px solid #ced4da;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
  }

  .toolbar-button:hover {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

    .extra-functions{
        display: flex;
        position: absolute;
        right: 2vw;
        top:2vh
    }

    .line-button{
        position: absolute;
        right:8.5vw;
        top: 4vh
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



    .visible{
        visibility: hidden;
    }

</style>