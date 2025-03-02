<script>
    import Navbar from "$lib/Navbar.svelte";
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let lobbyCodeInput;

    let lobbyCode = "LA3N9";
    let waiting = true;
    
    let url = "https://youthrow.me/lobby?code=" + lobbyCode // temporary URL until the page loads

    onMount(() => {
        url = window.location.origin + "/lobby?code=" + lobbyCode
    })
</script>

<Navbar />

<div class="hero h-[90vh]">
	<div class="hero-content flex-col">
        <p class="text-4xl font-bold font-1">Join a Lobby</p>
        <div class="flex flex-row gap-2 w-full">
            <input type="text" class="bg-base-300 p-3 flex-1" placeholder="Lobby Code" bind:this={lobbyCodeInput}>
            <button class="btn btn-primary flex-1" on:click={() => goto(window.location.origin + "/lobby?code=" + lobbyCodeInput.value)}>Join</button>
        </div>
        <p class="divider font-1">OR</p>
        <p class="text-4xl font-bold font-1 p-2">Create a Lobby</p>
        <img class="w-70 h-70 bg-base-content mix-blend-lighten" src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=url`} alt={`url`}>
        <div class="flex flex-row gap-2 w-full">
            <input type="text" value={url} class="bg-base-300 p-3 flex-1" readonly>
            <button class="btn btn-primary flex-1" on:click={() => navigator.share({ url })}>Share</button>
        </div>
    </div>
</div>