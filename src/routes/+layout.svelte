<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head><title>Pokémon Score Chart!</title></svelte:head>

{@render children()}
