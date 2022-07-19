<script>

    import { searchValue, showTitles, globalCurrentFilterGroup, myFilters} from '../stores/stores.js';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';
    import FilterDoctypeForm from './FilterDoctypeForm.svelte';
    const modal = writable(null);

    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    let documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10"];
    
    export let hideToolBar = true;
    
    //If the compleate menu is open
    let filterMenuOpen = false;
    let customViewMode = true;


    let filter_searched_value = "";
    let filtergroup_searched_value ="";

    let nofilter = {id: 0, name: "Alle", filters: documentTypes};
    let myCurrentfilterGroup = nofilter;

    let customFilter = {id: -1, name: "", filters: nofilter.filters}
    let currentFilterobj = customFilter;

    let showAllButtonName = "Nullstill"

    $: searchedDocumentTypes = documentTypes.filter(item => (item.toLowerCase().includes(filter_searched_value.toLowerCase())));

    $: searchedFiltergroups = $myFilters.filter(item => (item.name.toLowerCase().includes(filtergroup_searched_value.toLowerCase())));

    $: $globalCurrentFilterGroup = currentFilterobj.filters


    $: if (customViewMode){
        currentFilterobj = customFilter
    }
    else{
        currentFilterobj = myCurrentfilterGroup
    }

    $: if(customFilter.filters.length == documentTypes.length){
        showAllButtonName = "Nullstill"
    }
    else if (customFilter.filters.length < documentTypes.length){
        showAllButtonName = "Vis alle"
    }
    
    const filterMenuHandler = () => {
        filterMenuOpen = !filterMenuOpen
    }
    
    function changeMode(){
        customViewMode = !customViewMode
    }


    //For the custom mode
    
    //Sorting the documentstitels alfabetic
    const sortByString = () => {
        let sortedData = documentTypes.sort((obj1, obj2) => {
            if (obj1 < obj2) {
                    return -1;
            } else if (obj1 > obj2) {
                return 1;
            }
            return 0; //string code values are equal		
        });
        documentTypes = sortedData;
    }
    sortByString()


    function turnOffFilter(){
        myCurrentfilterGroup = nofilter
        customFilter.filters = documentTypes
        filterMenuOpen = false;
        customViewMode = true;
    }

    function clickedAll(){
        myCurrentfilterGroup = nofilter
        if(customFilter.filters.length < documentTypes.length){
            customFilter.filters = documentTypes
            showAllButtonName = "Nullstill"    
        }
        else{
            customFilter.filters = []
            showAllButtonName = "Vis alle"
        }
    }

    //For stored filtergroupsview

    //User clicked on edit and program swich mode with current crop as start point
    function editItem(group){
        manageGroup = true
        modal.set(bind(FilterDoctypeForm,{edit_bool: false, newFilterObj : group}))
    }

    let manageGroup = false
    function openModel(){
        manageGroup = true
        modal.set(bind(FilterDoctypeForm,{edit_bool: false}))
    }

</script>
<div class="all">
    <div class="leftmenu">
    <div class="filtermenu">
        <button on:click={filterMenuHandler} class:active={filterMenuOpen} class="dropdown-button" >Filter</button>

        <div class:show={filterMenuOpen} class="filtermenu-dropdown" >
            
            {#if customViewMode}
                <h3>Filter</h3>
                <input bind:value={filter_searched_value} type="text" placeholder="Søk.." name="search">
                <div class="button-conteiner">
                    <button on:click={clickedAll}>{showAllButtonName}</button>
                    <button on:click={changeMode}>Filteringsgrupper</button>
                </div>

                <div class= "filteroption-conteiner">
            {#each searchedDocumentTypes as item}    
                <label class="filterItem" >
                    <input type="checkbox"  bind:group={customFilter.filters} value={item} >
                    {item}
                    <span class="checkmark"></span>
                </label>
            {/each}
            </div>

            {:else}
                
                <h4>Dine filter:</h4>
                <input bind:value={filtergroup_searched_value} type="text" placeholder="Søk.." name="search" style="margin-bottom: 1vh">
                <div class="button-conteiner">
                    <button on:click={changeMode}>Alle filtere</button>
                    <button on:click={openModel}>Nytt filter</button>
                </div>

                <div class="filterItem-button" class:active={currentFilterobj == nofilter} on:click={() => currentFilterobj = nofilter} value="alle">Vis allt</div>
                <div class= "myFilters-conteiner">
                    {#each searchedFiltergroups as filter}
                        <div class="filterItem-button" class:active={currentFilterobj == filter} on:click={()=> currentFilterobj = filter} value={filter.filters}>
                            <t>{filter.name}</t>
                            <div class="filteritem-buttons-conteiner">
                                <button class="edit-buttons" title ="Rediger" on:click={() => editItem(filter)}><i class="material-icons">edit</i></button>
                                <button class="edit-buttons" on:click={()=> $myFilters = $myFilters.filter(item => (item.id != filter.id))} title="Slett"><i class="material-icons">delete</i></button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            </div>
        </div>
        {#if $globalCurrentFilterGroup != documentTypes}
          <button class="filteroff-button" on:click={turnOffFilter}>Skru av filter</button>
        {/if}	

        <button class="dropdown-button" class:hidden={hideToolBar} on:click={() =>$showTitles = true}>Overskrifter</button>

    </div>

    <div class="search-bar" class:hidden={hideToolBar}>
        <input bind:value = {$searchValue} type="text" placeholder="Søk.." name="search">
    </div>
</div>
    {#if manageGroup}
        <Modal on:closed={() => manageGroup = false } show={$modal}/>
    {/if}

<style>

.all{
    display: grid;
    grid-template-rows: 50px, 50px, ;
}

.filtermenu {
    display: block;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 50px;
    background-color: #d43838;
}
    

    .hidden{
        visibility: hidden;
    }

    .search-bar{
        margin: 20px;
    }

    input[type=text] {
        background: none;
        padding: 6px;
        border: none;
        border-bottom: solid;
        font-size: 17px;
     }
        
    .filtermenu-dropdown {
        display: none;
        position: absolute;
        background-color: #f6f6f6;
        min-width: 230px;
        border: 3px solid rgb(147, 147, 147);
        z-index: 2;
        max-height: 500px;
        height: fit-content;
}

/* for filtermenu */
.show {
    display:flex;
    flex-direction: column;
}

.dropdown-button {
    height: 100%;
    width: 80px;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    background: #d43838;
    color:#ffffff;
    cursor: pointer;
    border: none;
    /* border: solid 1px rgb(255, 92, 81 ,1);
    box-shadow: 0 0 0 2px rgb(255, 92, 81, 1); */
}
    
.dropdown-button:hover, .dropdown-button.active {
    color:#ffffff;
    /* border: solid 1px;
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81); */
}

.button-conteiner{
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    margin: 3px;
}

.button-conteiner button{
    width: 100%;
    margin: 1px;
}

input{
    margin: 3px;
}

.filterItem {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}	
    
.filterItem:hover {
    background-color: #ddd
}

.filterItem-button{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    border-bottom:  1px solid #666363;
}

.filterItem-button:hover {
    background-color: #e6f2ff;
}

.filterItem-button.active{
    background-color: #ccebff;
}

.filteritem-buttons-conteiner{
    display: flex;
    flex-direction: row;
}

.myFilters-conteiner{
    display: flex;
    flex-direction: column;
    max-height:600px;
    overflow-y: auto;

}
.filteroption-conteiner{
    max-height: 600px;
    overflow-y: auto;
}

.edit-buttons {
    align-self: center;
    background: none;
    border:none;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;
}

.edit-buttons:hover {
    color: #d43838;
}

.filteroff-button{
    display: inline-flex;
    align-items: center;
    border: none;
    background: none;
    height:4vh;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    cursor: pointer;

}
.filteroff-button:hover {
    color:#666363;
}

</style>