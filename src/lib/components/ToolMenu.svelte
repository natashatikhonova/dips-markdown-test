<script>
    import { noDocumentFilter, currentFilterGroup, myFilters} from '../stores/stores.js';

    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    //const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll"];
    const documentTypes = ["Epikrise", "Poliklinisk notat", "Lab", "Sykepleier notat", "Rutinekontroll", "typ1", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10"];

    let filterMenuOpen = false;

    let newFilterMode = false;

    let newFilterButtonName = "Nytt filter"

    let newFilterName ="";

    let newFilterGroup = documentTypes;

    let filter_searched_value = "";

    let filtergroup_searched_value ="";

    let allFilterMarked = true;

    let newFilterObj = null;
    
    $: searchedDocumentTypes = documentTypes.filter(item => (item.toLowerCase().includes(filter_searched_value.toLowerCase())));

    $: searchedFiltergroups = $myFilters.filter(item => (item.name.toLowerCase().includes(filtergroup_searched_value.toLowerCase())));



    $currentFilterGroup = documentTypes

    const filterMenuHandler = () => {
        filterMenuOpen = !filterMenuOpen
    }


    //Functions for adding new filtergroups
    function clickedAll(){

        if(newFilterGroup.length < documentTypes.length){
            newFilterGroup = documentTypes
        }
        else{
            newFilterGroup = []
        }
    }


    $: if(newFilterGroup.length == documentTypes.length){
        allFilterMarked = true
    }
    else if(newFilterGroup.length < documentTypes.length){
        allFilterMarked = false
    }

    function turnOffFilter(){
        $noDocumentFilter = true
        $currentFilterGroup = documentTypes
    }

    function newFilterClicked(){
        
        newFilterMode = !newFilterMode
        if(newFilterMode){
            newFilterButtonName = "Dine filter"
        }
        else{
            newFilterButtonName = "Nytt filter"
        }
    }

    function findNewId(){
        let ids = []
        $myFilters.forEach((filter)=>ids.push(filter.id))
        let num = 0;
        while(ids.includes(num)){
            num += 1;
        }
        return num;
    }

    function saveFilter(){
        if(!newFilterObj){
            newFilterObj = {id: findNewId(), name: newFilterName, filters: newFilterGroup}
            $myFilters.push(newFilterObj)
        }
        else{
            newFilterObj.name = newFilterName;
            newFilterObj.filters = newFilterGroup
        }    
        $myFilters = $myFilters
        $currentFilterGroup = newFilterObj.filters
        newFilterClicked()
    }

    function showFilter(){
        $currentFilterGroup = newFilterGroup
    }

    function editItem(group){
        newFilterObj = group
        newFilterName = group.name
        newFilterClicked()
    }

    
</script>
    <div class="filtermenu">
        <button on:click={filterMenuHandler} class:active={filterMenuOpen} class="dropdown-button" >Filter</button>

        <div class:show={filterMenuOpen} class="filtermenu-dropdown" >
            {#if newFilterMode}
            <div class="button-conteiner">
                <button on:click={newFilterClicked}>{newFilterButtonName}</button>
                <button on:click={showFilter}>Vis</button>
                <button on:click={saveFilter}>Lagre</button>
            </div>

                <input bind:value={newFilterName} type="text" placeholder="Filternavn..." name="search">
                <input bind:value={filter_searched_value} type="text" placeholder="Søk.." name="search">
                <label class="filterItem" style="border-bottom: 1px solid #666363">
                    <input type="checkbox" on:click={clickedAll} bind:checked={allFilterMarked} value="alle" >
                    Alle
                    <span class="checkmark"></span>
                </label>
                

                <div class= "filteroption-conteiner">
            {#each searchedDocumentTypes as item}    
                <label class="filterItem" >
                <input type="checkbox"  bind:group={newFilterGroup} value={item} >
                {item}
                <span class="checkmark"></span>
                </label>
            {/each}
                </div>	

            {:else}
                    <button on:click={newFilterClicked}>{newFilterButtonName}</button>
                    <h4>Dine filter:</h4>
                    <input bind:value={filtergroup_searched_value} type="text" placeholder="Søk.." name="search" style="margin-bottom: 1vh">
                    <div class="filterItem-button" class:active={$currentFilterGroup == documentTypes} on:click={() => $currentFilterGroup = documentTypes} value="alle">Vis allt</div>
                    <div class= "myFilters-conteiner">
                        {#each searchedFiltergroups as filter}
                            <div class="filterItem-button" class:active={$currentFilterGroup == filter.filters} on:click={()=> $currentFilterGroup = filter.filters} value={filter.filters}>
                                <t>{filter.name}</t>
                                <div>
                                    <button title ="Rediger" on:click={editItem(filter)}><i class="material-icons">edit</i></button>
                                    <!-- class:visible={$currentlyAddingNewNote} on:click={editItem} -->
                                    <button  on:click={()=> $myFilters = $myFilters.filter(item => (item.id != filter.id))} title="Slett" class="delete-button"><i class="material-icons">delete</i></button>
                                </div>

                            </div>
                        {/each}
                    </div>
            {/if}
        </div>
        
        {#if $currentFilterGroup.length != documentTypes.length}
          <button class="filteroff-button" on:click={turnOffFilter}>Skru av filter</button>
        {/if}	
    </div>

<style>

    .filtermenu {
    position: relative;
    display: inline-block;
    
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

    .delete-button {
        align-self: center;
        background: none;
        border:none;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
  }

  .delete-button:hover {
    color: #d43838;
  }
</style>