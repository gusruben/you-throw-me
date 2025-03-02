<script>
	import Navbar from '$lib/Navbar.svelte';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import { PUBLIC_SOCKETIO_SERVER } from '$env/static/public';
	import ThrowingScreen from '$lib/ThrowingScreen.svelte';

	let throwScreen; // throwing screen component

	let lobbyCodeInput;
	let socket;

	let userID = Math.random().toString(36).slice(2);
	let lobbyCode = null;
	let url = 'Loading...';
	let playerOne; // true if you're creating the lobby, false if you're joining
	let inGame = false;

	// data for the throwing component
	let bottomStatusText = null;

	onMount(() => {
		socket = io(PUBLIC_SOCKETIO_SERVER);

		lobbyCode = new URLSearchParams(window.location.search).get('code');
		if (lobbyCode) {
			// if joining an existing lobby
			console.log('Joining existing lobby!', lobbyCode);
			playerOne = false;
			socket.emit('join', userID, lobbyCode);
		} else {
			// otherwise, create a new lobby
			playerOne = true;
			socket.emit('create', userID);
			socket.on('session-created', (code) => {
				lobbyCode = code;
				url = window.location.origin + '/lobby?code=' + lobbyCode;
			});
		}

		socket.on('error', (message) => {
			alert('Received Error From Server: ' + message);
            window.location = window.location.origin + window.location.pathname; // reload without code parameter
		});
		socket.on('game-start', () => {
			inGame = true;
		});
		socket.on('other-player-primed', (score) => {
			bottomStatusText = 'The other player has primed their throw!'; // TODO: rewrite
		});
		socket.on('other-player-threw', (score) => {
			console.log('Other player threw! Their score:', score);
            bottomStatusText = "The other player has thrown!";
		});
	});

	function throwComplete(e) {
        console.log(e)
		socket.emit(`player-${playerOne ? 'one' : 'two'}-throw`, lobbyCode, e.detail.score);
	}
</script>

<Navbar />

<div class="hero h-[90vh]">
	<div class="hero-content flex-col">
		{#if !inGame}
			<!-- lobby creation/joining ui -->
			<p class="text-4xl font-bold font-1">Join a Lobby</p>
			<div class="flex flex-row gap-2 w-full">
				<input
					type="text"
					class="bg-base-300 p-3 flex-1 [&:not(:placeholder-shown)]:uppercase"
					placeholder="Lobby Code"
					bind:this={lobbyCodeInput}
                    value=""
				/>
				<button
					class="btn btn-primary flex-1"
					on:click={() => {
						window.location = window.location.origin + '/lobby?code=' + lobbyCodeInput.value.toUpperCase();
                    }}
					>Join</button
				>
			</div>
			<p class="divider font-1">OR</p>
			<p class="text-4xl font-bold font-1 p-2">Create a Lobby</p>
			{#if lobbyCode}
				<img
					class="w-70 h-70 bg-base-content mix-blend-lighten"
					src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${url}`}
					alt={url}
				/>
				<p class="text-2xl font-mono bg-base-200 w-full p-2 text-center">{lobbyCode}</p>
			{:else}
				<div class="w-70 h-70 bg-base-content animate-pulse"></div>
			{/if}
			<div class="flex flex-row gap-2 w-full">
				<input
					type="text"
					value={url}
					class="bg-base-300 p-3 flex-1 text-right outline-none"
					readonly
				/>
				<button class="btn btn-primary flex-1" on:click={() => navigator.share({ url })}
					>Share</button
				>
			</div>
		{:else}
			<ThrowingScreen
				bind:this={throwScreen}
				turnText="turn text here"
				bottomText={bottomStatusText}
				on:throwPrimed={() => {socket.emit(`player-${playerOne ? 'one' : 'two'}-prime`)}}
				on:throwComplete={throwComplete}
			/>
		{/if}
	</div>
</div>
