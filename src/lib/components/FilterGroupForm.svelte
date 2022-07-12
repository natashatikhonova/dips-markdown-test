<script>
    import {saved_filter_group} from '../stores/stores';
    import { getContext, setContext } from 'svelte';
    export let original_titles_list_obj =[]
    export let all_groups = []

    const { open, close } = getContext('simple-modal');
    setContext('modal', this)
    let show_titles_list_obj =[]
    let searched_value = ""
    let group_name = ""

    $: if (searched_value.length >= 0){
        
        // console.log("\nshow_titles_list_obj")
        // console.log(show_titles_list_obj)
        if (searched_value != ""){
            show_titles_list_obj = original_titles_list_obj.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));

        } else {
            show_titles_list_obj = original_titles_list_obj
        }
        
        // console.log("\norignal_titles_list_obj")
        // console.log(original_titles_list_obj)
    }

    $: original_titles_list_obj, console.log(original_titles_list_obj)

    function name_used(group_name){
        for(let i = 0; i < all_groups.length; i++){
            if (all_groups[i].name == group_name) return true;
        }
        return false
    }

    function save(){
        if (group_name == "") {
            alert("Vennligst skriv inn gruppenavn!")
        } else if (name_used(group_name)) {
            alert("Gruppenavnet finnes fra før!")
            
        }else {
            let checked_titles = []
            for (let i =0; i<original_titles_list_obj.length; i++){
                if(original_titles_list_obj[i].checked){

                    original_titles_list_obj[i].checked = false
                    checked_titles.push(original_titles_list_obj[i])
                }
            }
            $saved_filter_group = {name: group_name, titles: checked_titles, checked: false}
            close()

        }
    }
</script>
<!-- <button on:click={onClose}>Custom Close Button</button> -->
<h2>Opprett ny filtergruppe</h2>
<input bind:value ={searched_value} type="text" placeholder="Søk.." name="search">
<div class="main">

    {#if show_titles_list_obj.length == 0}
        <div class = "no-titles">Ingen overskrifter</div>
    {:else}
    
        {#each show_titles_list_obj as elementObj}
    
            <div class="title">
                <input type="checkbox" bind:checked={elementObj.checked} />
    
                <div class="title">
    
                    {elementObj.overskrift} 
    
                </div>
            </div>
                        
        {/each} 
    {/if}
</div>
<input bind:value ={group_name} type="text" placeholder="Skriv inn gruppenavn.." name="search">
<button on:click={save}>Lagre</button>

<style>

button {
    position: absolute;
    right: 2vw;
    bottom: 2vh;
    background-color: #d43838;
    color: white;
    width: 6vw;
    height: 4vh;
    border: none;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
}

button:hover{
    border: solid 0.1em;
    box-shadow: 0 0 0 0.2rem rgb(255, 92, 81);
}

.main{
        overflow-y: auto;
        height: 100%;
        padding-right: 2vw;
}
input[type=text] {

    padding: 6px;
    border: none;
    border-bottom: solid;
    margin-bottom: 2vh;
    font-size: 17px;
    width:90%;
}

.title{
    cursor: pointer;
    display: flex;
}

.title:hover{
    color:#d43838;
}

.no-titles{
    margin-top: 2vh;
}

</style>