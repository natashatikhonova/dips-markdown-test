<script>
    import {saved_filter_groups} from '../stores/stores';
    import { getContext, setContext } from 'svelte';


    export let original_titles_list_obj =[]
    export let edit_bool;
    export let edit_obj_indeks;
    export let group_name;
   

    const { open, close } = getContext('simple-modal');
    setContext('modal', this)
    let show_titles_list_obj =[]
    let searched_value = ""
    
    $: if (searched_value != ""){
        show_titles_list_obj = original_titles_list_obj.filter(item => (item.overskrift.toLowerCase().includes(searched_value.toLowerCase())));
    }
        
  
    if (original_titles_list_obj){

        if (edit_bool == true) {

            console.log("True")

            for (let i = 0; i < $saved_filter_groups[edit_obj_indeks].titles.length; i++) {
                // console.log ($saved_filter_groups[edit_obj_indeks].titles)

                for (let j = 0; j < original_titles_list_obj.length; j++){

                    if (original_titles_list_obj[j].overskrift === $saved_filter_groups[edit_obj_indeks].titles[i].overskrift){
                        // console.log("\n\n")
                        // console.log(original_titles_list_obj[j])
                        // console.log("Setter checked til true")
                        original_titles_list_obj[j].checked = true
                        console.log($saved_filter_groups)
                    }

                }
            }
        }

        show_titles_list_obj = original_titles_list_obj
    }
        
    

    function name_used(group_name){
        for(let i = 0; i < $saved_filter_groups.length; i++){
            if ( ($saved_filter_groups[i].name == group_name) && (i != edit_obj_indeks)) return true;
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
            if (checked_titles.length == 0) {
                alert("Du må velge minst 1 overskrift")
            } else {
                if (edit_bool) { //Edited group
                    $saved_filter_groups[edit_obj_indeks] = {name: group_name, titles: checked_titles, checked: false}
                    console.log($saved_filter_groups)
                    edit_bool = false
                   
                    
                } else { //New group 
                    $saved_filter_groups.push({name: group_name, titles: checked_titles, checked: false})
                    // console.log("Lagt til ny gruppe i store")
                }
                $saved_filter_groups = $saved_filter_groups
                close()

            }


        }
    }

  
</script>
<!-- <button on:click={onClose}>Custom Close Button</button> -->
<div class = "main">
    {#if edit_bool == false}
        <h2>Opprett ny filtergruppe</h2>
        <input bind:value ={group_name} type="text" placeholder="Skriv inn gruppenavn.." name="search">
        <h3>Velg overskrifter:</h3>
        <input bind:value ={searched_value} type="text" placeholder="Søk.." name="search">
        <div class="titles">
    
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
    
        <button on:click={save}>Lagre</button>
    
    {:else}
        <h2>Rediger filtergruppe</h2>
        <input bind:value ={group_name} type="text" placeholder="Skriv inn gruppenavn.." name="search">
        <h3>Velg overskrifter:</h3>
        <input bind:value ={searched_value} type="text" placeholder="Søk.." name="search">
    
        <div class="titles">
    
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
        <button on:click={save}>Lagre</button>
    
    {/if}

</div>

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
.main {
    height: 70vh;
    overflow: hidden;
}

.titles{
    padding-right: 2vw;
    height: 50%;
    overflow-y: auto;
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