<script>
    import { ParseMarkdown} from '../ParseMarkdown'
    import { documentList } from '../stores/stores';
    let show = false;
    let parse = new ParseMarkdown();

    $documentList.forEach((document) => {
        let tree = parse.parseAndSetIntoTree(document)
        document.markdownTree = tree;
    })

    // let nodes_array = tree.traverseBFS()

    // nodes_array.forEach((node)=> {
    //     console.log(node);

    // })
    

    // parse.parseAndSetIntoTree($documentList[1])
    // console.log("Sjekker: " + $documentList[2].id)
    // parse.parseAndSetIntoTree($documentList[2])

</script>

<div class="main">
    Titler

</div>

<style>
    .main{

    }


</style>