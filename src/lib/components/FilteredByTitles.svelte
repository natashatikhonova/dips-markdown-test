<script>
    import {documentList, current_doctype_filtergroup, searchResult, searchValue, checked_titles_filters, load_markdownNodes, set_filtered_text} from '../stores/stores';
    // import {set_filtered_text, load_markdownNodes} from "./filterDocumentText"

    let all_checked = true
    let searched_value = "";
    let original_titles_list_obj = []
    let show_titles_list_obj =[]
    
    let selected_documentObj_titles = set_filtered_text()
    
    //sets list depending on what doctypes are chosen
    $: filteredDocumentlist = ($documentList.filter(item => ($current_doctype_filtergroup.filters.includes(item.title))));
    //sets filtered text in documentObject
    $: if(original_titles_list_obj.length != 0){
        reset_filtered_text()
        let checked_titles = original_titles_list_obj.filter((item) => item.checked).slice()
        $checked_titles_filters = checked_titles
        console.log("FilteredByTitles if")
        selected_documentObj_titles = set_filtered_text()
    }

    //load documents when new doctype filter is chosen
    $: if (filteredDocumentlist){
        original_titles_list_obj = load_markdownNodes(filteredDocumentlist, original_titles_list_obj)
    }
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


    $: if(selected_documentObj_titles.length == 0){
        $searchResult = filteredDocumentlist.filter(item => (item.context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    } else{
        $searchResult = selected_documentObj_titles.filter(item => (item.temp_filtered_context.toLowerCase().includes($searchValue.toLowerCase()))  || (item.author.toLowerCase().includes($searchValue.toLowerCase()))|| (item.date.toDateString().toLowerCase().includes($searchValue.toLowerCase()))|| (item.title.toLowerCase().includes($searchValue.toLowerCase())));
    }
 
    
    function reset_filtered_text(){
        for (let i = 0; i < $documentList.length; i++){
            $documentList[i].temp_filtered_context = ""
        }
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