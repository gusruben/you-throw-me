<script>
    import Navbar from "$lib/Navbar.svelte";
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { io } from "socket.io-client";


    let lobbyCodeInput;
    let socket;

    let userID = Date.now().toString(36);

    let lobbyCode = null;
    let waiting = true;
    
    let url = "Loading...";

    onMount(() => {
        socket = io("wss://bore.gus.ink:443");

        lobbyCode = (new URLSearchParams(window.location.search)).get("lobby")
        if (lobbyCode) { // if joining an existing lobby

        } else { // otherwise, create a new lobby
            socket.emit("create", userID);
            socket.on("session-created", code => {
                lobbyCode = code;
                url = window.location.origin + "/lobby?code=" + lobbyCode;
        });
        }
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
        {#if lobbyCode}
            <img class="w-70 h-70 bg-base-content mix-blend-lighten" src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=url`} alt={`url`}>
        {:else}
            <div class="w-70 h-70 bg-base-content animate-pulse"></div> 
        {/if}
        <div class="flex flex-row gap-2 w-full">
            <input type="text" value={url} class="bg-base-300 p-3 flex-1" readonly>
            <button class="btn btn-primary flex-1" on:click={() => navigator.share({ url })}>Share</button>
        </div>
    </div>
</div>