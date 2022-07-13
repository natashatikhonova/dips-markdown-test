<script>
    import {saved_filter_groups} from '../stores/stores';
    import { getContext, setContext } from 'svelte';

    export let edit_bool;
   

    const { open, close } = getContext('simple-modal');
    setContext('modal', this)


        
    



  
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