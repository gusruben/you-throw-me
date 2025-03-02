<script>
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import ThrowingScreen from '$lib/ThrowingScreen.svelte';
	import { processScore } from '$lib/utils';
	import { error } from '@sveltejs/kit';

	let throwScreen; // throwing screen component

	let lobbyCodeInput;
	let socket;

	let userID = Math.random().toString(36).slice(2);
	let lobbyCode = null;
	let url = 'Loading...';
	let playerOne; // true if you're creating the lobby, false if you're joining
	let inGame = false;

    let iveThrown = false;
    let oppThrown = false;
    let myScore = -1;
    let oppScore = -1;

    let waitingForRematch = false;

	// data for the throwing component
    let statusText = "Throw when you're ready!";
	let bottomStatusText = null;

	onMount(() => {
		// socket = io("wss://server.youthrow.me:443");
		socket = io("wss://bore.gus.ink:443");

		lobbyCode = new URLSearchParams(window.location.search).get('code');
		let rematchCode = new URLSearchParams(window.location.search).get('rematch');
		if (lobbyCode) {
			// if joining an existing lobby
			console.log('Joining existing lobby!', lobbyCode);
			playerOne = false;
			socket.emit('join', userID, lobbyCode);
		} else if (rematchCode) {
            console.log("Starting rematch lobby", lobbyCode);
            playerOne = true;
			socket.emit('create', userID, rematchCode);
			socket.on('session-created', (code) => {
				lobbyCode = code;
				url = window.location.origin + '/lobby?code=' + lobbyCode;
			});
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
            if (error.includes("disconnected") && waitingForRematch) return;
			alert('Received Error From Server: ' + message);
            window.location = window.location.origin + window.location.pathname; // reload without code parameter
		});
		socket.on('game-start', () => {
			inGame = true;
            document.body.style.backgroundImage = 'url("/grow.apng")';
		});
		socket.on('other-player-primed', (score) => {
			bottomStatusText = 'The other player has primed their throw!'; // TODO: rewrite
		});
		socket.on('other-player-threw', (score) => {
			console.log('Other player threw! Their score:', score);
            oppScore = score;
            oppThrown = true;
            bottomStatusText = "The other player has thrown!";
		});

        // rematch stuff
        socket.on("session-to-create", newID => {
            window.location = window.location.origin + '/lobby?rematch=' + newID;
        })
        socket.on("session-to-join", newID => {
            waitingForRematch = true;
            setTimeout(()=>{
                window.location = window.location.origin + '/lobby?code=' + newID;
            }, 1000)
        })
	});

	function throwComplete(e) {
        console.log(e)
        iveThrown = true;
        document.body.style.backgroundImage = 'url("/grid.apng")';
        myScore = processScore(e.detail.score);
		socket.emit(`player-${playerOne ? 'one' : 'two'}-throw`, lobbyCode, myScore);
	}
</script>

<div class="hero h-[90vh]">
	<div class="hero-content flex-col">
		{#if !inGame}
			<!-- lobby creation/joining ui -->
			<p class="text-4xl font-bold font-1">Who Invited You?</p>
			<div class="flex flex-row gap-2 w-full">
				<input
					type="text"
					class="bg-base-300 p-3 flex-1 [&:not(:placeholder-shown)]:uppercase font-1 text-xl"
					placeholder="Lobby Code"
					bind:this={lobbyCodeInput}
                    value=""
				/>
				<button
					class="btn btn-primary flex-1 text-xl font-1 p-6"
					on:click={() => {
						window.location = window.location.origin + '/lobby?code=' + lobbyCodeInput.value.toUpperCase();
                    }}
					>Bother them</button
				>
			</div>
			<p class="divider font-1 text-2xl">OR</p>
			<p class="text-4xl font-bold font-1 p-2">Gather the Stooges</p>
			{#if lobbyCode}
				<img
					class="w-70 h-70 bg-base-content mix-blend-lighten"
					src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${url}`}
					alt={url}
				/>
				<p class="text-4xl font-1 font-extrabold bg-base-200 w-full p-2 text-center">{lobbyCode}</p>
			{:else}
				<div class="w-70 h-70 bg-base-content animate-pulse"></div>
			{/if}
			<div class="flex flex-row gap-2 w-full text">
				<input
					type="text"
					value={url}
					class="bg-base-300 p-3 flex-1 text-right outline-none font-1 text-xl"
					readonly
				/>
				<button class="btn btn-primary flex-1 text-xl font-1 py-6" on:click={() => navigator.share({ url })}
					>Share</button
				>
			</div>
		{:else}
            {#if iveThrown && oppThrown && myScore >= oppScore}
                <div class="avatar avatar-placeholder border rounded-full relative">
                    <div class="absolute text-4xl rotate-45 top-[-20px] right-[-20px]">👑</div>
                    <div class="bg-[url('/fire.apng')] bg-cover bg-center font-1 text-white w-24 rounded-full">
                        <span class="text-3xl font-1">:)</span>
                    </div>
                </div>
                <p class="text-4xl py-8  font-1">Oh what? You won?</p>
                <p class="text-xl font-1">You scored {myScore} and your opponent scored {oppScore}. I didn't think you could do that...</p>

                <button class="btn btn-primary font-1" on:click={() => socket.emit(`player-${playerOne ? 'one' : 'two'}-rematch`, true)}>Beat 'em again?</button>
            {:else if iveThrown && oppThrown && myScore < oppScore}
                <div class="avatar avatar-placeholder border rounded-full relative">
                    <div class="absolute text-4xl top-[55px] right-[30px]">💧</div>
                    <div class="bg-neutral font-1 text-neutral-content w-24 rounded-full">
                        <span class="text-3xl  font-1">:(</span>
                    </div>
                </div>
                <p class="text-4xl pt-12 pb-2 font-1">Hahaha, you lost.</p>
                <p class="text-xl  font-1">You scored {myScore} and your opponent scored {oppScore}. What were you thinking?</p>

                <button class="btn btn-primary  font-1" on:click={() => socket.emit(`player-${playerOne ? 'one' : 'two'}-rematch`, true)}>Rematch?</button>
            {:else}
                <ThrowingScreen
                    bind:this={throwScreen}
                    turnText={statusText}
                    bottomText={bottomStatusText}
                    on:throwPrimed={() => {socket.emit(`player-${playerOne ? 'one' : 'two'}-prime`)}}
                    on:throwComplete={throwComplete}
                />
            {/if}
		{/if}
	</div>
</div>

<style>
    :global(body) {
        background-position: center;
        background-size: cover;
    }
</style>