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

    .meta{
        display: flex;
        align-items: flex-start;
        justify-content:space-between
        
    }

    .date, .meta{
        font-weight: bold;
    }

</style>
