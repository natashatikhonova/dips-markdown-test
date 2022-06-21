<script>
    import { currentDocumentObject } from '../stores/stores.js';
    import {marked} from 'marked';
    
</script>


{#if $currentDocumentObject!=null}
    <button>Rediger</button>
    <p>{@html  marked($currentDocumentObject.context)}</p>
{/if}

<style>
    button{
        position: absolute;
        top:0;
        right:0;
        margin:2vh
    }
</style>


    