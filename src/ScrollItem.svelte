<script>
    import {marked} from 'marked';
    export let document;


</script>

<div>
    <div class="date">
        {document.date.toDateString()}
    </div>
    <div class="title">
        {document.title}
    </div>

    <div class="author">
        {document.author}
    </div>

    <div class="content">
        {@html  marked(document.context)}
    </div>


</div>

