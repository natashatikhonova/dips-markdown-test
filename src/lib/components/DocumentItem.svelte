<script>
import { current_component, onDestroy } from 'svelte/internal';

    //import { DocumentObject } from './document.js';
    import {currentDocumentObject} from '../stores/stores.js';
    export let document;

    $: color = '';
    const unsubscribe = currentDocumentObject.subscribe((value)=> {
        if(value){
            if (value === document){
                color = ' #ccebff';
            }else{
                color = '#fff';
            }
        } else{
            color = '#fff';
        }
    }

    )
    function handleClick(){

        if($currentDocumentObject){
            if ($currentDocumentObject === document){
            }else{
                currentDocumentObject.set(document);
            }
        } else{
            currentDocumentObject.set(document);
        }
    }

    onDestroy(unsubscribe);
</script>

<tr style="background-color: {color}; :hover background-color: #e6f5ff" on:click={handleClick}>
    <td>{document.title}</td>
    <td>{document.date.toDateString()}</td>
    <td>{document.author}</td>
</tr>


<style>
    td {
		text-align: left;
		padding: 16px;
        border-bottom:1px solid rgb(97, 96, 96);
	}

    tr:hover{
        background-color: #e6f5ff;
    }
    
</style>