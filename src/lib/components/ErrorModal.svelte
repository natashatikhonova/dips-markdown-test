<script>
    import { getContext, setContext } from 'svelte';

    export let errMessage;
    export let type;
    
    //using modal for a popup form
    // const { close } = getContext('simple-modal');
    setContext('modal', this)

</script>
<div class = "main">
    <div class="upper">
        <i class="material-icons">
            sentiment_dissatisfied
        </i>
        
    </div>
    <div class="lower">
        <h4>{type}</h4>
        <h4>{errMessage}</h4>

    </div>

</div>

<style>
    .main{
        display: grid;
        grid-template-rows: 50% 50%;
        height: 50vh;
        outline:none;
        padding: none;
        
    }
    .upper{
        display:flex;
        align-items: center;
        justify-content: center;
    }
    .lower{
        display: flex;
        flex-direction: column;
        text-align: center;

    }
    i {
        font-size: 150px;
        color: #d43838;

    }

    
</style>