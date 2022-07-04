<script>
    import { ParseMarkdown} from '../ParseMarkdown'
    import { documentList } from '../stores/stores';

    let parse = new ParseMarkdown();

 
    parse.parseAndSetIntoTree($documentList[0])
    parse.parseAndSetIntoTree($documentList[1])
    parse.parseAndSetIntoTree($documentList[2])

</script>

<div></div>