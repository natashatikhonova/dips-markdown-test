<script>
    import { checked_titles_filters, searchValue, amount_searched_words, current_doctype_filtergroup, showFiltermenu, selected_line_height, selected_text_size, allfilterOff, currentDocumentObject, documentTypes} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';

    export let hideToolBar = true;

    let showTextSettings = false
    let showLineHeights =false;
    let min_size = false;
    let max_size = false;

    const line_heights = ["1.0", "1.15", "1.5", "2.0", "2.5", "3.0"]
    const dispatch = createEventDispatcher()

    window.addEventListener("click", function(event) {
        if(event.target.id != "line-height" && event.target.id !="icon"){
            showLineHeights = false
        }else{
            showLineHeights = !showLineHeights
        }
    });

    function set_text_size(direction){
        if (direction == "bigger"){
            $selected_text_size++
            if ($selected_text_size == 20){
                max_size=true
            }else if ($selected_text_size>7){
            min_size =false
            }
        } else if (direction == "lower"){
            $selected_text_size--
            if ($selected_text_size == 7){
                min_size=true
            } else if ($selected_text_size<20){
            max_size =false
            }
        }
    }

    function turnOffFilters(){
        $allfilterOff = true
        $current_doctype_filtergroup = {id: -1, name: "", filters: documentTypes.slice()}
        $checked_titles_filters = []
    }
    function open_filtermenu(){
        $showFiltermenu = true
    }

    function showContent(){
      dispatch("set_content_view_size", 100)
    }
</script>



<header class="tool-menu">
    <div class="leftmenu">
        <button class="main-button" on:click={open_filtermenu}>Filter</button>

        {#if ($current_doctype_filtergroup.filters.length != documentTypes.length) || ($checked_titles_filters.length > 0)}
          <button class="filteroff-button" on:click={turnOffFilters}>Skru av filter</button>
        {/if}	
    </div>

    <div class="right-menu">
        {#if !hideToolBar}
            <button class="settings-button" class:active={showTextSettings} on:click={()=>{showTextSettings=!showTextSettings}}><i class="material-icons">settings</i></button>
            {#if showTextSettings}
                <div class="text-settings">
                    <div class="extra-functions">
                        <button
                        title="Zoom out"
                        class="toolbar-button"
                        disabled={min_size}
                        on:click={() => {set_text_size("lower")}}><i class="material-icons">zoom_out</i></button>
                        <button
                        title="Zoom in"
                        class="toolbar-button"
                        disabled={max_size}
                        on:click={() => {set_text_size("bigger")}}><i class="material-icons">zoom_in</i></button>
                    </div>
                    
                    <div class="line-button">
                        <button title="Linjeavstand" class="toolbar-button" id="line-height"  class:active={showLineHeights} ><i class="material-icons" id="icon">format_line_spacing</i></button>
                        <div class:hidden={!showLineHeights} on:blur={()=>{showLineHeights=false}} class="dropdownContent">

                            {#each line_heights as value}
                                <button class="line-height-item" class:selected = {$selected_line_height==value} on:click={()=>{$selected_line_height=value}}>{value}</button>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
            <div class = "search_field" class:hidden={hideToolBar}>
                <input on:input={()=>{$amount_searched_words = 0}} bind:value = {$searchValue} placeholder="Søk.." name="search" class="search-input searchWord-input"/>
                <div class="searched_words"> 
                    {#if $searchValue != "" && $amount_searched_words != 0}
                    {$amount_searched_words} ord
                    {/if}
                </div>
            </div>
        {:else if $currentDocumentObject}
            <button title = "tilbake" class="arrow-keys" on:click={showContent}><i class="material-icons">arrow_back</i></button>
        {/if}
    </div>

</header>

<style>

    /* Search field */
    .searched_words{
        line-height: 2.2rem;
        width:60px;
        background: none;
        text-align:center;
        border: none;
        border-bottom: solid;
        margin: 2px;
        min-height: 30px;
        margin-left: 0;
        font-weight: bold;
    }
    .search_field{
        height: 100%;
        display: flex;
        flex-direction: row;
        margin-right: 10px;
    }

    .searchWord-input{
        margin-right: 0;
    }

    /* Search field - darkmode */
    :global(body.dark-mode) input{
        border-bottom: 1px solid #cccccc;
        color:#cccccc;
        
    }

    :global(body.dark-mode) .searched_words{
        border-bottom: 1px solid #cccccc;
    }

    :global(body.dark-mode) ::placeholder {
        color: #cccccc;   
    }

    .leftmenu{
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .right-menu{
        display: flex;
        height: 100%;
        flex-direction: row-reverse;
        align-items: center;
    }

    .tool-menu{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: whitesmoke;
        box-shadow: 0 3px 5px -2px rgba(57, 63, 72, 0.3);
        margin-bottom: 3px;
    }

    :global(body.dark-mode) .tool-menu{
        background-color: rgb(43, 43, 43);
        color: white;
    }
    
    .filteroff-button{
        width: fit-content;
        border: none;
        background: none;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }
    .filteroff-button:hover {
        color:#666363;
    }

    :global(body.dark-mode) .filteroff-button{
        color:#cccccc;
    }

    :global(body.dark-mode) .filteroff-button:hover{
        color:#d43838;
    }

    .hidden{
        visibility: hidden;
    }

    .selected{
        background-color: white;
    }

    .text-settings{
        display: flex;
        position: absolute;
        flex-direction: row-reverse;
        align-items: center;
        top:80px;
        width: 8.7rem;
        background-color: #f1f1f1;
        border: 1px rgb(191, 190, 190) solid;
        border-radius: 4px;
        margin-right: 1.15rem;
        z-index: 1;
        align-items: center;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    :global(body.dark-mode) .text-settings{
        background-color: rgb(49, 49, 49);
        border: 0.5px #cccccc solid;
    }

    .dropdownContent{
        position: absolute;
        top:2.8rem;
        background-color: #f1f1f1;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        width: 2.3rem;
        z-index: 1;
        align-items: center;
    }

    .line-height-item{
        border:none;
        width: 100%;
        text-align: center;
        font-size: 11pt;
    }

    .line-height-item:hover{
        background-color: white;
    }

    .toolbar-button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        width: 2.3rem;
        height: 2.3rem;
        margin: 0.3rem;
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

    :global(body.dark-mode) .toolbar-button{
        background-color: #424242;
        color: #cccccc;
        border: none;
    }

    :global(body.dark-mode) .toolbar-button:hover{
        border-color: #b7daff;
        box-shadow: 0 0 0 0.2rem rgba(104, 177, 255, 0.5);
    }

    .extra-functions{
        display: flex;
    }

    .toolbar-button.active {
        border: solid 2px;
        border-color: #80bdff;
    }

    /* Text settings button */
    .settings-button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        width: 2.3rem;
        height: 2.3rem;
        margin-right: 0.8rem;
        border: none;
        cursor: pointer;
    }

    :global(body.dark-mode) .settings-button{
        color: #cccccc;
    }

    .settings-button :hover {
        color:#d43838;
    }

    .settings-button.active{
        color:#d43838;
    }

    :global(body.dark-mode) .arrow-keys {
        color: #cccccc;
    }
    :global(body.dark-mode) .arrow-keys:hover{
        color: #d43838;
    }

    :global(body.dark-mode) .arrow-keys:disabled{
        color:#585858;
    }

</style>