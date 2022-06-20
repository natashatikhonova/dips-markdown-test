<script>
    import {marked} from 'marked';
    export let document;


</script>

<div class="main">
    <div class="date">{document.date.toDateString()}</div>

    <div class="meta">
        <div class="title">
            {document.title}
        </div>
        <div class="author">
            {document.author}
            <button>Rediger</button>
        </div>
    </div>
    

    <div class="content">
        {@html  marked(document.context)}
    </div>
</div>

<style>
    .main{
        padding: 2em;
    }
    .main:hover{
        background-color: whitesmoke
    }

    .meta{
        display: flex;
        align-items: flex-start;
        justify-content:space-between
        
    }

    .date, .meta{
        font-weight: bold;
        
    }

    button{
        margin-left: 2em;
        border: solid 0.1em;
        border-radius: 10%;
    }

    button:hover{
        border: solid 0.1em;
        border-color: red;
        border-radius: 20%;
    }

</style>
