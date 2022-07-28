<script>
    import {documentList, current_doctype_filtergroup, all_markdown_titles, searchResult, searchValue} from '../stores/stores';
    
    let all_checked = true
    let searched_value = "";
    let all_nodes = []
    let searched_titles_nodes = []
    let original_titles_list_obj = []
    let show_titles_list_obj =[]
    
    //sets list depending on what doctypes are chosen
    $: filteredDocumentlist = ($documentList.filter(item => ($current_doctype_filtergroup.filters.includes(item.title))));
    //sets filtered text in documentObject
    $: original_titles_list_obj, make_nodes_list(original_titles_list_obj.filter((item) => item.checked)) 
    //load documents when new doctype filter is chosen
    $: filteredDocumentlist, load_documents(filteredDocumentlist)
    //checks if all items are checked whenever the original list is updated
    $: original_titles_list_obj, check_if_all_checked()
    //Updates the shown titles with search on titles
    $: if (searched_value.length >= 0){ 
         if (searched_value != ""){
             show_titles_list_obj = original_titles_list_obj.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));
             let startsWithSearch = []
             for(let i = 0; i<show_titles_list_obj.length; i++){
                 if (show_titles_list_obj[i].overskrift.toLowerCase().startsWith(searched_value)){
                     startsWithSearch.push(show_titles_list_obj[i])
                     show_titles_list_obj.splice(i, 1)
                 }
             }
             show_titles_list_obj = startsWithSearch.concat(show_titles_list_obj)
         } else {
             //no search value
             show_titles_list_obj = original_titles_list_obj
         }     
     }

    let selected_titles_nodes_List = []
    $searchResult = $documentList

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
        //Loop through the whole documentList and sets the filtered text to empty string
        reset_filtered_text(); 

        obj_list.forEach((item)=>{

            item.nodes.forEach((node)=> {
                
                let indeks = -1

                for (let i = 0; i < selected_titles_nodes_List.length; i++) { 
                    //check if document have been created
                    if (selected_titles_nodes_List[i].object.id == node.object.id) { 
                        //If they belong to the same object
                        indeks = i;
                        break;
                    }
                }
                if (indeks != -1){ 
                    if (!is_in_subtree(selected_titles_nodes_List[indeks], node)){ //sets node in this place instead
                        if (is_in_subtree(node, selected_titles_nodes_List[indeks])) { //if node is over in the tree
                            node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
                            selected_titles_nodes_List[indeks] = node;
                        } else { 
                            //if they are in the same tree
                            if (node.object.temp_filtered_context == "" ){
                                node.object.temp_filtered_context =  selected_titles_nodes_List[indeks].object.markdownTree.get_text_under(selected_titles_nodes_List[indeks]) + "\n" + node.object.markdownTree.get_text_under(node)
                            } else {
                                node.object.temp_filtered_context +=  "\n" +  node.object.markdownTree.get_text_under(node)
                            
                            }
                            selected_titles_nodes_List[indeks] = node;
                        }
                    } 

                } else { 
                    //Set the variable temp_filtered_context i objectet til teksten som skal vises
                    node.object.temp_filtered_context = node.object.markdownTree.get_text_under(node)
                    selected_titles_nodes_List.push(node)
                }
            })
        })
    }

    function reset_filtered_text(){
        for (let i = 0; i < $documentList.length; i++){
            $documentList[i].temp_filtered_context = ""
        }
    }

    function is_in_subtree(to_node, add_node){

        let subtree = to_node.object.markdownTree.get_subtree(to_node)
        for(let i = 0; i < subtree.length; i++) {
            let check_node = subtree[i]
            if (check_node.compare(add_node)) {
                return true; //add_node is in subtree of to_node
            }
        }
        return false; //add_node is not in subtree of to_node
    }

    

    //sorts alphabetically
    const sortByString = () => {

        let sortedData = original_titles_list_obj.sort((obj1, obj2) => {
            if (obj1.overskrift < obj2.overskrift) {
                    return -1;
            } else if (obj1.overskrift > obj2.overskrift) {
                return 1;
            }
            return 0; //string code values are equal		
        });

        original_titles_list_obj = sortedData;
    }

    //load all title nodes to variables
    function load_documents(chosen_documents) {
            all_nodes = []
            chosen_documents.forEach((document) => {
                //Return the nodes in the same order as it was read from file
                let nodes_array = document.markdownTree.get_nodes_in_order() 
                nodes_array.forEach((node)=> {all_nodes.push(node)})
            }) 
            
            //All the nodes containing the searched_value
            searched_titles_nodes = all_nodes.filter(item => (item.id != 0));
            original_titles_list_obj= make_titles_obj_list(searched_titles_nodes)
            $all_markdown_titles = []
            //copy some values to the store:
            for (let i = 0 ; i<original_titles_list_obj.length; i++){
                $all_markdown_titles.push({overskrift: original_titles_list_obj[i].overskrift, nodes: original_titles_list_obj[i].nodes})
            
            }
            sortByString()
    }

    //creates a list of objects from a list of nodes
    function make_titles_obj_list(node_list){
       let obj_list = []

       for (let i = 0; i<node_list.length; i++){
           let new_element = {}
           let node = node_list[i]
           let found = false;
           for (let j= 0; j<obj_list.length; j++){
               if(obj_list[j].overskrift == node.overskrift){
                   obj_list[j].nodes.push(node)
                   found = true
                   break;
               }
           }
           if (!found){
               if (original_titles_list_obj.length == 0) { 
                    //First time
                   new_element = {overskrift: node.overskrift, nodes: [node], checked: false }
               } else { 
                    //Check if the node is checked in original_titles_obj_list
                   let found_in_list = false
                   for (let i = 0; i < original_titles_list_obj.length; i++) {
                       if (node.overskrift == original_titles_list_obj[i].overskrift) {
                           if (original_titles_list_obj[i].checked) {
                               new_element = {overskrift: node.overskrift, nodes: [node], checked: true }
                               found_in_list = true
                           } 
                           break;
                       }
                   }
                   if (!found_in_list){
                       new_element = {overskrift: node.overskrift, nodes: [node], checked: false }
                   }
               }
               obj_list.push(new_element)
           }
       }
       return obj_list
   }

    //unchecks all items
    function removeChecked(){
        for(let i=0; i<original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
        } 
    }

    //checks all items
    function check_all(){
        all_checked = !all_checked
        for (let i = 0; i < original_titles_list_obj.length; i++) {
            original_titles_list_obj[i].checked = all_checked
        }
    }

    //checks if all items are checked
    function check_if_all_checked(){
        let all_bool = null
        for (let i = 0; i < original_titles_list_obj.length; i++) {
            if (all_bool == null) {
                all_bool = original_titles_list_obj[i].checked
            }else if (original_titles_list_obj[i].checked != all_bool ) {
                all_bool = false
                break;
            } 
        }
        all_checked = all_bool    
    }

</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<h2>Overskrifter</h2>
<h3>Alle overskrifter:</h3>

<div class="main">
        <input class="search-input" bind:value={searched_value} type="text" placeholder="Søk.." name="search">

        <div class="filter-buttons">
            <button class="secundary-button" on:click={removeChecked}>Nullstill</button>
        </div>

        {#if show_titles_list_obj.length == 0}
            <div class = "no-titles">Ingen overskrifter</div>
        {:else}
            <div class="checkbox-alle">
                <input type="checkbox" on:click={check_all} bind:checked={all_checked} /> 
                <div style = "margin-left: 1%">Velg alle</div>
            </div>

            <div class="titles-list">
                {#each show_titles_list_obj as elementObj}
                    <label class="title">
                        <input type="checkbox"  bind:checked={elementObj.checked} >
                        <div class="title"> {elementObj.overskrift} </div>
                    </label>   
                {/each} 
            </div>
        {/if}
</div>

<style>
    .main{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-left: 2vw;
        padding-right: 2vw;
    }
    h2, h3{
        padding-left: 2vw;
        padding-right: 2vw;
    }

    .no-titles{
        margin-top: 2vh;
    }
    .checkbox-alle{
        cursor: pointer;
        display: flex;
        margin-left: 1%;
        margin-bottom: 2vh;
        height:5%;
    }
    .checkbox-alle:hover{
        color:#d43838;
    }

    input[type=text] {

        padding: 6px;
        border: none;
        border-bottom: solid;
        margin-bottom: 2vh;
        font-size: 17px;
        width:90%;
        height:5%;
     }

    .title{
        cursor: pointer;
        display: flex;
        margin-left: 1%;
    }

    .title:hover{
        color:#d43838;
    }

    .titles-list{
        display: flex;
        flex-direction: column;
        height: 40%;
        overflow-y: auto;
    }

    /* Darkmode */

    /* Search field - darkmode */

    :global(body.dark-mode) input{
        border-bottom: 1px solid #cccccc;
        color:#cccccc;
        
    }

    :global(body.dark-mode) ::placeholder {
        color: #cccccc;   
    }

</style>