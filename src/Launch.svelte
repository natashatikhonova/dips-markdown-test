<script>
    import {authorize} from "openehr-client-js";
	import {onMount} from 'svelte';
    import { writable } from 'svelte/store';
    import {SyncLoader} from "svelte-loading-spinners";
    import Modal, { bind } from 'svelte-simple-modal';
    import ErrorModal from "./lib/components/ErrorModal.svelte";

    const modal = writable(null);
    let error = false

    onMount(async () => {

        authorize(
        {
            clientId: "dips-simplest-smart-app",
            redirectUri: "http://localhost:8080/app",	
            //iss: "https://vt-selecta-b.dips.local/DIPS-WebAPI/HL7/FHIR-R4",	
            //iss: "https://vt-bc-dev04-sr.dips.local/Arena-SmartEHR",
            //iss: "https://localhost:44311",
            //iss: "https://vt-fi-a-app.dips.local/DIPS-SmartEHR",
            //iss: "https://foi-tst.smud.dev.dips.no/smartehr",
            iss: "https://foi-tst.smud.dev.dips.no/smartehr",
            //iss: "https://localhost:44311/dips-smartehr-service",
            scope: "launch",
            launch: "2008905:encounter:resource",
        }).catch(createError);
           
	});

    function createError(message){
        error = true
        modal.set(bind(ErrorModal,{errMessage: message, type:"Server Error"}))
    }
</script>

<div class="main">
    {#if !error}
        Loading  
        <SyncLoader size="60" color="#d43838" unit="px"/>
    {:else}
        <Modal show={$modal} closeButton ={false} />
    {/if}
</div>

<style>
    .main{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: larger;
        margin-top: 30%;
    }
</style>
