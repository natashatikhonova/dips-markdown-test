<script>
    import { currentDocumentObject } from './stores.js';
    import {marked} from 'marked';
    
</script>


{#if $currentDocumentObject!=null}
    <p>{@html  marked($currentDocumentObject.context)}</p>
{/if}

    