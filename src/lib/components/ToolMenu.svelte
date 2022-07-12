<script>

    import { noDocumentFilter, searchValue, showTitles, currentFilterGroup, myFilters} from '../stores/stores.js';
    import {createEventDispatcher} from 'svelte';

    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Røntgen bilde", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10"];
    
    export let hideToolBar = true;
    const dispatch = createEventDispatcher();
    
    //If the compleate menu is open
    let filterMenuOpen = false;


    //editmode make new edits and make new filter groups
    let editMode = false;

    let modeButtonName = "Nytt filter"

    let filter_searched_value = "";
    let filtergroup_searched_value ="";

    let allFilterMarked = true;

    let nofilter = {id: 0, name: "Alle", filters: documentTypes};

    let currentFilterobj = nofilter;
    let newFilterObj = nofilter;
    


    $currentFilterGroup = documentTypes


    $: searchedDocumentTypes = documentTypes.filter(item => (item.toLowerCase().includes(filter_searched_value.toLowerCase())));

    $: searchedFiltergroups = $myFilters.filter(item => (item.name.toLowerCase().includes(filtergroup_searched_value.toLowerCase())));

    $: $currentFilterGroup = currentFilterobj.filters


    const filterMenuHandler = () => {
        filterMenuOpen = !filterMenuOpen
    }

    //Turns off all filters
    function turnOffFilter(){
        $noDocumentFilter = true
        currentFilterobj = nofilter
        }

    
    function modeChanger(){
        
        editMode = !editMode
        if(editMode){
            modeButtonName = "Dine filter"
        }
        else{
            modeButtonName = "Nytt filter"
        }
    }

    //User clicked on edit and program swich mode with current crop as start point
    function editItem(group){
        newFilterObj = group
        newFilterObj.name = group.name
        newFilterObj.filters = group.filters
        modeChanger()
    }

    function addNewFilteMode(){
        newFilterObj = {id: findNewId(), name: "", filters: searchedDocumentTypes}
        modeChanger()
    }

    //shows current choosen filters in editmode
    function showFilter(){
        currentFilterobj = newFilterObj
    }

    //Functions for adding new filtergroups
    function findNewId(){
        let ids = []
        $myFilters.forEach((filter)=>ids.push(filter.id))
        let num = 1;
        while(ids.includes(num)){
            num += 1;
        }
        return num;
    }

    function open(){
        $showTitles = true
    }

 

    //If all button in editmode is clicked
    function clickedAll(){
        if(newFilterObj.filters.length < documentTypes.length){
            newFilterObj.filters = documentTypes
        }
        else{
            newFilterObj.filters = []
        }
    }

    function saveFilter(){
        if(!$myFilters.includes(newFilterObj)){
            $myFilters.push(newFilterObj)
        }
        $myFilters = $myFilters
        currentFilterobj = newFilterObj
        modeChanger()
    }

    $: if(newFilterObj.filters.length == documentTypes.length){
        allFilterMarked = true
    }
    else if(newFilterObj.filters.length < documentTypes.length){
        allFilterMarked = false
    }


</script>
    <div class="filtermenu">

        <button on:click={filterMenuHandler} class:active={filterMenuOpen} class="dropdown-button" >Filter</button>

        <div class:show={filterMenuOpen} class="filtermenu-dropdown" >
            
        {#if editMode}
        <div class="button-conteiner">
            <button on:click={addNewFilteMode}>{modeButtonName}</button>
            <button on:click={showFilter}>Vis</button>
            <button on:click={saveFilter}>Lagre</button>
        </div>

            <input bind:value={newFilterObj.name} type="text" placeholder="Filternavn..." name="search">
            <input bind:value={filter_searched_value} type="text" placeholder="Søk.." name="search">

        <label class="filterItem" style="border-bottom: 1px solid #666363">
            <input type="checkbox" on:click={clickedAll} bind:checked={allFilterMarked} value="alle" >
            Alle
            <span class="checkmark"></span>
        </label>

        <div class= "filteroption-conteiner">
        {#each searchedDocumentTypes as item}    
            <label class="filterItem" >
                <input type="checkbox"  bind:group={newFilterObj.filters} value={item} >
                {item}
                <span class="checkmark"></span>
            </label>
        {/each}
        </div>
        	
        {:else}
            <button on:click={addNewFilteMode}>{modeButtonName}</button>
            <h4>Dine filter:</h4>
            <input bind:value={filtergroup_searched_value} type="text" placeholder="Søk.." name="search" style="margin-bottom: 1vh">
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
        
        {#if currentFilterobj != nofilter}
          <button class="filteroff-button" on:click={turnOffFilter}>Skru av filter</button>
        {/if}	

        <button class="dropdown-button" class:hidden={hideToolBar} on:click={open} >Overskrifter</button>
    </div>

    <div class="search-bar" class:hidden={hideToolBar}>
        <input bind:value = {$searchValue} type="text" placeholder="Søk.." name="search">

    </div>

    

<style>

.filtermenu {
    position: relative;
    display: inline-block;
}
    

    .hidden{
        visibility: hidden;
    }

    .search-bar{
        margin: 2vw;
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
        max-height: 85vh;
        height: fit-content;
}

/* for filtermenu */
.show {
    display:flex;
    flex-direction: column;
}

.dropdown-button {
    display: inline-flex;
    align-items: center;
    margin: 0.5vh;
    margin-bottom: 0vh;
    margin-right: 2vh;
    height:4vh;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    background: #d43838;
    color:#ffffff;
    padding: 16px;
    font-size: 16px;
    cursor: pointer;
    border: solid 0.1em rgb(255, 92, 81 ,0);
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81, 0);
}
    
.dropdown-button:hover, .dropdown-button.active {
    color:#ffffff;
    border: solid 0.1em;
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
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
    max-height:60vh;
    overflow-y: auto;

}
.filteroption-conteiner{
    max-height: 60vh;
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