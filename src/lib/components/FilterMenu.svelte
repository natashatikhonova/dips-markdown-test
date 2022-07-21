<script>
    import {documentList, globalCurrentFilterGroup, myFilters, searchValue, searchResult} from '../stores/stores';
    import {createEventDispatcher} from 'svelte';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';
    import FilterByGroups from './FilterByGroups.svelte';
    import FilteredByTitles from './FilteredByTitles.svelte';


    let hideToolBar = true;


    const dispatch = createEventDispatcher();
    function closeTitles(){
        dispatch("close")
    }

    let selected_titles_nodes_List = []

    
     
    $searchResult = $documentList

    $: filteredDocumentlist = ($documentList.filter(item => ($globalCurrentFilterGroup.includes(item.title))));

    $: if (selected_titles_nodes_List.length>0) { //Hvis filtrert på overskrifter
        $searchResult = nodeList_to_documentObjList(selected_titles_nodes_List)
        $searchResult = $searchResult.filter(item => (item.temp_filtered_context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    } else {
        $searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    }

    function nodeList_to_documentObjList(node_list) {
        let documentObj_list = []
        for (let i = 0; i <node_list.length; i++){
            documentObj_list[i] = node_list[i].object
        }
        return documentObj_list
    }

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
                    // console.log(node)
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


    //Alt dette kommer fra scrollview, burde endres..
    function show_documents_checked_titles(event) {
        make_nodes_list(event.detail)
       
    }

    let groupFilterView = true

    function changeToGroupFilterview(){
        groupFilterView = true
    }

    function changeToTiltelsFilterview(){
        groupFilterView = false
    }


</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<div class="main">
    <header>
        <button on:click={changeToGroupFilterview} class="main-button" >Grupper</button>
        <button on:click={changeToTiltelsFilterview} class="main-button" >Overskrifter</button>
        <button class="close" on:click={closeTitles}><i class="material-icons">close</i></button>
    </header>
    {#if groupFilterView}
        <FilterByGroups/>
    {:else}
        <FilteredByTitles on:checked_titles={show_documents_checked_titles}/>  
    {/if}

</div>

<style>
    .main{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    header{
    width: 100%;
    max-height: 40px;
    min-height: 40px;
    align-items: center;
    background-color: #dadada;
    display: flex;
    justify-content:space-between;
    
  }

</style>