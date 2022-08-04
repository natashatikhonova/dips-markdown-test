<script>
    import {allfilterOff, documentList, current_doctype_filtergroup, searchResult, searchValue, checked_titles_filters, load_markdownNodes, set_filtered_text, documentTypes} from '../stores/stores';

    let all_checked = true
    let searched_value = "";
    let original_titles_list_obj = []
    let show_titles_list_obj =[]
    let filteredDocumentlist = []

    let selected_documentObj_titles = set_filtered_text(original_titles_list_obj.filter(item => (item.checked)))

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
    let checked_not_shown = []
    //sets filtered text in documentObject
    $: if(original_titles_list_obj){
        checked_not_shown = find_hidden_checked_titles()
        //checks if all items are checked whenever the original list is updated
        check_if_all_checked()
        selected_documentObj_titles = set_filtered_text(original_titles_list_obj.filter(item => (item.checked)))
    }
    $: if ($checked_titles_filters.length == 0){
        for(let i = 0; i < original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
        }
    }
    //uncheckschecks all items whenever filter is turned off
    $: if($allfilterOff ){
        console.log("Reactive: $allfilterOff")
        $documentList.forEach((doc)=> (doc.temp_filtered_context = ""))
        $current_doctype_filtergroup = {id: -1, name: "", filters: documentTypes.slice()}
        for(let i = 0; i < original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
        }
        $checked_titles_filters = []
        $allfilterOff = false
    }  

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
  
        for(let i = 0; i < original_titles_list_obj.length; i++){
            original_titles_list_obj[i].checked = false
            for (let j = 0; j < $checked_titles_filters.length; j++) {
                if ($checked_titles_filters[j].title == original_titles_list_obj[i].title){
                    $checked_titles_filters.splice(j,1)
                    $checked_titles_filters = $checked_titles_filters
                }
            }
        }
        console.log("$checked_titles_filters etter nullstill:" )
        console.log($checked_titles_filters) 
    }

    //checks all items
    function check_all(){
        all_checked = !all_checked
        
        for (let i = 0; i < original_titles_list_obj.length; i++) {

            original_titles_list_obj[i].checked = all_checked
            if (all_checked){
                // add
                if ($checked_titles_filters.find(item => item.title == original_titles_list_obj[i].title) == null) {
                    $checked_titles_filters.push(original_titles_list_obj[i])
                    $checked_titles_filters = $checked_titles_filters
                }
            }
        }
        console.log("$checked_titles_filters")
        console.log($checked_titles_filters)
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
    

    //Function that returns an array of object that is checked but not showing because the wrong doctype filter is on
    function find_hidden_checked_titles(){

        let checked_not_shown = []
        for (let i = 0; i < $checked_titles_filters.length; i++){
            let found_title = original_titles_list_obj.find(obj => (obj.title == $checked_titles_filters[i].title ))
            if (found_title == null){
                //Found in $checked_titles_filters
                checked_not_shown.push($checked_titles_filters[i])
            } else {
                //Checks if there are more nodes under this element, but not curently showing
                let nodes_not_shown = []
                if (found_title.nodes.length < $checked_titles_filters[i].nodes.length){
                    for (let j = 0; j < $checked_titles_filters[i].nodes.length; j++){
                        if (found_title.nodes.find(node => (node.compare($checked_titles_filters[i]))) == null) {
                            nodes_not_shown.push($checked_titles_filters[i])

                        }
                    }
                }
            }
        }
        console.log("Checked but not shown titles:")
        console.log(checked_not_shown)
        return checked_not_shown
    }

</script>

<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<h2>Overskrifter</h2>
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
                        <button class="secundary-button" on:click={check_all}>Velg alle</button>
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
        {#each checked_not_shown as title}
            {title.title}
        {/each} 

        {#if original_titles_list_obj.filter(obj => (obj.checked)).length == 0}
            <div class = "shows-all-documents"> *Ikke filtrert på overskrifter*</div>
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