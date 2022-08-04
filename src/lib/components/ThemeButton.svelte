<script>
	let darkmodeOff = true
	
	toggle()

    function toggle(){
        window.document.body.classList.toggle('dark-mode')
		darkmodeOff = !darkmodeOff
    }
</script>

{#if darkmodeOff}
	<button on:click={toggle}><i class="material-icons" id="icon">dark_mode</i></button>
{:else}
	<button on:click={toggle}><i class="material-icons" id="icon">light_mode</i></button>
{/if}

<style>
	button {
		background:none;
		color: black;
		border: none;
	}

	button:hover{
		color:#d43838;
	}

	:global(body.dark-mode) button {
		color: #cccccc;
	}

	:global(body.dark-mode) button:hover{
		color:#d43838;
	}

	i{
		font-size: xx-large;
	}
</style>