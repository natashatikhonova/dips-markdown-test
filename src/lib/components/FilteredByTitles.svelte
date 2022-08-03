<script>
    import {documentList, current_doctype_filtergroup, searchResult, searchValue, checked_titles_filters, load_markdownNodes, set_filtered_text} from '../stores/stores';
    // import {set_filtered_text, load_markdownNodes} from "./filterDocumentText"

    let all_checked = true
    let searched_value = "";
    let original_titles_list_obj = []
    let show_titles_list_obj =[]
    let filteredDocumentlist = []

    let selected_documentObj_titles = set_filtered_text()
    // //Reactive tests
    // $: if (original_titles_list_obj){
    //     console.log("Original_titles_list_obj")
    // }
    // $: if (filteredDocumentlist){
    //     console.log("filteredDocumentlist")
    // }

    // $: if ($checked_titles_filters){
    //     console.log("Checked_titles_filters")
    // }
    $: filteredDocumentlist = $documentList.filter(item => ($current_doctype_filtergroup.filters.includes(item.title)));
    let prev_length = -1

    //sets list depending on what doctypes are chosen
    $: if (filteredDocumentlist.length != prev_length){
        //load documents when new doctype filter is chosen
        original_titles_list_obj = load_markdownNodes(filteredDocumentlist, original_titles_list_obj, $checked_titles_filters)
        show_titles_list_obj = original_titles_list_obj

        //updates $checked_titles_filter with the same values as in original_titles_list_obj:
        for (let i = 0; i < $checked_titles_filters.length; i++){
            let obj = original_titles_list_obj.find(item => item.title == $checked_titles_filters[i].title)
            if (obj == null){
                //Only checked titles wich belonged the old doctype filter, therefor the list is now empty
                $checked_titles_filters[i].nodes = []
            } else {
                //transfered the checked titles to the new doctype filter
                $checked_titles_filters[i].nodes = obj.nodes
            }
            $checked_titles_filters = $checked_titles_filters
        } 
        prev_length = filteredDocumentlist.length
    }

    //sets filtered text in documentObject
    $: if(original_titles_list_obj){

        //checks if all items are checked whenever the original list is updated
        check_if_all_checked()
        selected_documentObj_titles = set_filtered_text()
        
    }
    // $: original_titles_list_obj, check_if_all_checked()

    // function copy_obj_array(list_obj){
    //     let copy_list = []
    //     for (let i= 0; i < list_obj.length; i++){
    //         copy_list[i] = {title: list_obj[i].title, nodes: list_obj[i].nodes, checked: list_obj[i].checked} 
    //     }
    //     return copy_list
    // }

    // $: if (filteredDocumentlist){
    //     original_titles_list_obj = load_markdownNodes(filteredDocumentlist, original_titles_list_obj, $checked_titles_filters)
    // }

    //happens when an item is checked
    function updateCheckedList(item){
        if (item.checked){
            //remove 
            for(let i = 0; i < $checked_titles_filters.length; i++){
                if ($checked_titles_filters[i].title == item.title){
                    $checked_titles_filters.splice(i, 1)
                }
            }
            
        }else if(!item.checked){
            // add
            $checked_titles_filters.push(item)
            // $checked_titles_filters.push({title: item.title, nodes: item.nodes.slice(), checked: true})
        }
        item.checked = !item.checked

        $checked_titles_filters = $checked_titles_filters
    }

    //Updates the shown titles with search on titles
    $: if (searched_value.length >= 0){ 
         if (searched_value != ""){
             show_titles_list_obj = original_titles_list_obj.filter(item => (item.title.toLowerCase().includes(searched_value.toLowerCase())));
             let startsWithSearch = []
             for(let i = 0; i<show_titles_list_obj.length; i++){
                 if (show_titles_list_obj[i].title.toLowerCase().startsWith(searched_value)){
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


    $: if(selected_documentObj_titles.length == 0){
        $searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    } else{
        $searchResult = selected_documentObj_titles.filter(item => (item.temp_filtered_context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    }
 
    

    

    //unchecks all items
    function removeChecked(){
        $checked_titles_filters = []
        for(let i=0; i<original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
        } 
    }

    //checks all items
    function check_all(){
        all_checked = !all_checked
        $checked_titles_filters = []
        for (let i = 0; i < original_titles_list_obj.length; i++) {

            original_titles_list_obj[i].checked = all_checked
            if (all_checked){
                // add

                $checked_titles_filters.push(original_titles_list_obj[i])
            }
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

<h2>titleer</h2>
<div class="main">

    <div class="filter-panel">
        <div class="meta">
            <h3>Alle overskrifter:</h3>
            <input class="search-input" bind:value={searched_value} type="text" placeholder="Søk.." name="search">
            <div>
                {#if show_titles_list_obj.length > 0}
                    {#if all_checked} 
                        <button class="secundary-button" on:click={removeChecked}>Nullstill</button>
                        
                    {:else}
                        <button class="secundary-button" on:click={check_all}>Vis alle</button>
                    {/if}

                {/if}

            </div>
        </div>
    
        {#if show_titles_list_obj.length == 0}
            <div class = "no-titles">Ingen overskrifter</div>
        {:else}
            <div class="filters">
                {#each show_titles_list_obj as elementObj}
                    <label class = "filterItem">
                        <input type="checkbox" bind:checked={elementObj.checked} on:click={()=>updateCheckedList(elementObj)}>
                        {elementObj.title}
                        
                    </label>   
                {/each} 
            </div>
            
        {/if}
        {#if $checked_titles_filters.length == 0}
            <div class = "shows-all-documents"> *Viser alle dokumenter*</div>
        {/if}


 </div>
</div>

<style>
    .main{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-left: 2vw;
        padding-right: 2vw;
    }
    .filter-panel{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .shows-all-documents{
        margin-top: 5%;
        color: red;
    }
    h2{
        align-self: center;
    }

    .no-titles{
        margin-top: 2vh;
    }
    .meta{
        display: flex;
        flex-direction: column;
        height:25%;
    }

    .filterItem:hover{
        color:#d43838;
    }

    .filters{
        display: flex;
        margin-top: 10%;
        flex-direction: column;
        height: 50%;
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