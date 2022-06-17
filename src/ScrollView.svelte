<script>
    
    import {documentList} from './stores.js';
    import ScrollItem from "./ScrollItem.svelte";


</script>

<div>
    {#each $documentList as item}
        <ScrollItem document = {item}/>
        
    {/each}
</div>

<style>

</style>