<script>
    import { Route, Router } from "svelte-navigator";
    import Home from "./Home.svelte";
    import Launch from "./Launch.svelte";
console.log("APP")
</script>


<Router>
    <Route path="/">
        <Launch/>
    </Route>
    
    <Route path="/app/*">
        <Home/>
    </Route>

</Router>