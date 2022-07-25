<script>
    import {currentDocumentObject} from '../stores/stores.js';
    export let document;
    export let chosen = false;

    function handleClick(){
        $currentDocumentObject = document
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

    :global(body.dark-mode) .selected{
        background-color: rgb(211, 211, 211);
        color: black;
    }

    .notSelected:hover{
        background-color: #e6f2ff;
    }

    :global(body.dark-mode) .notSelected:hover{
        background-color: rgb(211, 211, 211);
        color: black;
    }
    tr {
     height: 5vh;
    }
    td {
		text-align: left;
		padding-top: 10px;
		padding-bottom: 10px;
        padding-right: 16px;
        padding-left: 10px;
        border-bottom:1px solid rgb(97, 96, 96);  
	}

    
</style>