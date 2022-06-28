<script>
    import {currentDocumentObject} from '../stores/stores.js';
    export let document;
    export let chosen = false;

    let color = '';

    $: if (chosen) {
        color = ' #ccebff';
    } else {
        color = '#fff';
    }

    function handleClick(){
        currentDocumentObject.set(document);
    }

</script>

<tr class:selected = {chosen} class:notSelected = {!chosen} on:click={handleClick} >
    <td>{document.title}</td>
    <td>{document.date.toDateString()}</td>
    <td>{document.author}</td>
</tr>

<style>
    .selected{
        background-color: #ccebff;
    }
    .notSelected:hover{
        background-color: #e6f2ff;
    }
    tr {
     height: 5vh;
    }
    td {
		text-align: left;
		padding-top: 1%;
		padding-bottom: 1%;
        padding-right: 16px;
        padding-left: 1%;
        border-bottom:1px solid rgb(97, 96, 96);  
	}

    tr:hover{
        background-color: #e6f5ff;
    }
    
</style>