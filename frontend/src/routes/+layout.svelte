<script>
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<svelte:head>
	<meta property="og:title" content="YOU THROW ME">
	<meta property="og:description" content="A mobile game about destroying expensive technology ">
	<meta property="og:image" content="/logoanim.gif">
	<meta property="og:url" content="https://youthrow.me">
	<meta property="og:type" content="website">	

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</svelte:head>