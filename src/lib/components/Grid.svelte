<script>
	export let x, y;
</script>

<svelte:options namespace="svg" />

<rect
	x=0
	y=0
	width=1400
	height=1800
	stroke=#ccc
	style="opacity: 0.5"
	fill=none
	stroke-width=2
/>

{#each { length: 8 } as _, i}
	{#if i < 6}
		<path
			d="M{(i+1) * 200} 0 L{(i+1)*200} 1802"
			class="grid-line"
		/>
	{/if}
	<path
		d="M0 {(i+1) * 200} L1400 {(i+1)*200} "
		class="grid-line"
	/>
{/each}

<path
	style="transform: translateX({x+200}px)"
	d="M0 0 L0 1800"
	class="grid-line-xy"
/>
<path
	style="transform: translateY({y}px)"
	d="M0 400 L1400 400"
	class="grid-line-xy"
/>



<style>
	.grid-line {
		stroke:#ccc;
		opacity: 0.5;
		stroke-width: 2;
	}

	.grid-line-xy {
		stroke: #d43838;
		stroke-width: 5;
	}
</style>
