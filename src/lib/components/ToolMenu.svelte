<script lang="ts">

    import { searchValue, showTitles, globalCurrentFilterGroup, myFilters} from '../stores/stores.js';
    import { writable } from 'svelte/store';
    import Modal, { bind } from 'svelte-simple-modal';
    import FilterDoctypeForm from './FilterDoctypeForm.svelte';
    import Button, { Label } from '@smui/button';
    import type { MenuSurfaceComponentDev } from '@smui/menu-surface';
    import MenuSurface from '@smui/menu-surface';
    import Textfield from '@smui/textfield';
    import List, { Item, Text, Meta } from '@smui/list';
    import Checkbox from '@smui/checkbox';
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';
    import { SelectionGroup, SelectionGroupIcon } from '@smui/menu';

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

    let nofilter = {id: 0, name: "Alle", filters: documentTypes.slice(0,documentTypes.length)};
    let myCurrentfilterGroup = nofilter;

    let customFilter = {id: -1, name: "", filters: nofilter.filters.slice(0,nofilter.filters.length)}
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

    let checked_all

    $: if(customFilter.filters.length == documentTypes.length){
        checked_all = true
    }
    else if (customFilter.filters.length < documentTypes.length){
        checked_all = false
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
    
    let manageGroup = false
    //User clicked on edit and program swich mode with current crop as start point
    function editItem(group){
        manageGroup = true
        modal.set(bind(FilterDoctypeForm,{edit_bool: false, newFilterObj : group}))
    }

    let surface: MenuSurfaceComponentDev;


</script>

    <div class="filtermenu">
        
        <div  style="min-width: 100px;">
            <Button on:click={() => surface.setOpen(true)}  variant="raised">Filter</Button>
            
            <MenuSurface class="filter-dropdown" bind:this={surface} anchorCorner="BOTTOM_LEFT">
                
            {#if customViewMode}
                <div style="margin: 1em;">
                    <Textfield bind:value={filter_searched_value} label="Søk.."/>

                    <div style="margin-top: 1em; ">

                        <FormField align="end">
                        
                            {#if filter_searched_value == ""}
                                <Switch bind:checked={checked_all} on:click={clickedAll}/>
                            {/if}
                            <Button on:click={changeMode} variant="raised" class="button-shaped-round"  style="border-radius: 50px;">
                                <Label>Grupper</Label>
                            </Button>

                        </FormField>
                    </div>

                </div>

                <div class="checkList-customfilter">

                    {#if searchedDocumentTypes.length == 0} 
                        <p> Ingen filtere </p>
                    {:else}
                        <List  checkList>
                            {#each searchedDocumentTypes as item}
                            <Item>
                                <Label>{item}</Label>
                                <Meta>
                                <Checkbox bind:group={customFilter.filters} value={item} />
                                </Meta>
                            </Item>    
                            {/each}
                        </List>
                    {/if}
                  </div>
                  {:else}

                  
                  <div style="margin: 1em;">
                    <Textfield bind:value={filter_searched_value} label="Søk.."/>

                    <div style="margin-top: 1em; ">


                        <FormField align="end">
                            <Button on:click={changeMode} variant="raised" class="button-shaped-round"  style="border-radius: 50px;">
                                <Label>Filtere</Label>
                            </Button>

                        </FormField>
                    </div>

                </div>

                <List>

                <SelectionGroup> 
            
                {#each searchedFiltergroups as filter}

                        <Item on:SMUI:action={()=> currentFilterobj = filter} selected={currentFilterobj === filter}>
                            
                            <SelectionGroupIcon>
                                <i class="material-icons">check</i>
                            </SelectionGroupIcon>
    
                            <Text>
                                {filter.name}
                                <!-- <SecondaryText> Eventuelt dato? </SecondaryText> -->
                            </Text>
    
                            <div class="filteritem-buttons-conteiner">
                                <button class="edit-buttons" title ="Rediger" on:click={() => editItem(filter)}><i class="material-icons">edit</i></button>
                                <button class="edit-buttons" on:click={()=> $myFilters = $myFilters.filter(item => (item.id != filter.id))} title="Slett"><i class="material-icons">delete</i></button>
                            </div> 
            
                        </Item>

                    {/each}
                </SelectionGroup>
                </List>
              {/if}
            </MenuSurface>
          </div>
          
        {#if $globalCurrentFilterGroup != documentTypes}
          <button class="filteroff-button" on:click={turnOffFilter}>Skru av filter</button>
        {/if}	

        <button class="dropdown-button" class:hidden={hideToolBar} on:click={() =>$showTitles = true}>Overskrifter</button>

    </div>

    <div class="search-bar" class:hidden={hideToolBar}>
        <input bind:value = {$searchValue} type="text" placeholder="Søk.." name="search">
    </div>

    {#if manageGroup}
        <Modal on:closed={() => manageGroup = false } show={$modal}/>
    {/if}
<style>

    .checkList-customfilter{
        display: flex;
        flex-direction: column;
        max-height:60vh;
        overflow-y: auto;
        text-align: center;

    }

    .filtermenu {
        display: flex;
        align-items: center;
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
    
.dropdown-button:hover {
    color:#ffffff;
    border: solid 0.1em;
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
}

input{
    margin: 3px;
}



.edit-buttons {
    position: relative;
    right: 0px;
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