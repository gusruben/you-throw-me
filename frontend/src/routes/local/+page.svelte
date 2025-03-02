<script>
    import { onMount } from 'svelte';
    import ThrowingScreen from '$lib/ThrowingScreen.svelte';
	import Navbar from '$lib/Navbar.svelte';

    let gameStats = {
        playerOne: 0,
        playerTwo: 0,
        currentTurn: 1
    };

    let askForName = false;
    let name = '';
    let throwScreen; 

    async function modifyLeaderboard() {
        let maxNum = gameStats.playerOne;
        if (gameStats.playerOne < gameStats.playerTwo) {
            maxNum = gameStats.playerTwo;
        }

        await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                score: maxNum
            })
        });

        askForName = false;
    }

    const resetTurn = () => {
        gameStats.currentTurn = 2;
        throwScreen.reset();
    };

    const handleThrowComplete = async (event) => {
        const score = event.detail.score;
        
        if (gameStats.currentTurn === 1) {
            gameStats.playerOne = score;
        } else {
            gameStats.playerTwo = score;
        }

        // Check if game is complete
        if (gameStats.playerOne !== 0 && gameStats.playerTwo !== 0) {
            let highestNum = gameStats.playerOne;
            if (gameStats.playerOne < gameStats.playerTwo) {
                highestNum = gameStats.playerTwo;
            }

            try {
                const request = await fetch('/api/leaderboard');
                const response = await request.json();
                
                let shouldAddToLeaderboard = false;
                if (response.length < 10) {
                    shouldAddToLeaderboard = true;
                } else {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].score < highestNum) {
                            shouldAddToLeaderboard = true;
                            break;
                        }
                    }
                }

                if (shouldAddToLeaderboard) {
                    askForName = true;
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        }
    };
</script>

<Navbar />

<div class="fixed top-0 w-full left-0 bg-base-300">
    <div class="text-center font-1 mx-auto w-fit items-center p-2 bg-base-300 flex flex-row gap-4">
        <div class="flex flex-row items-center gap-2 align-center">
            <p class="">Player One</p>
            <div class="badge">{gameStats.playerOne.toFixed(2)}</div>
        </div>
        <p class="font-extrabold">vs</p>
        <div class="flex flex-row items-center gap-2 align-center">
            <p class="">Player Two</p>
            <div class="badge">{gameStats.playerTwo.toFixed(2)}</div>
        </div>
    </div>
</div>

<div class="hero h-[90vh]">
    <div class="hero-content flex-col">
        {#if gameStats.playerOne > gameStats.playerTwo && gameStats.playerTwo !== 0}
            <div class="avatar avatar-placeholder border rounded-full relative">
                <div class="absolute text-4xl rotate-45 top-[-20px] right-[-20px]">👑</div>
                <div class="bg-neutral font-1 text-neutral-content w-24 rounded-full">
                    <span class="text-3xl">1</span>
                </div>
            </div>
        {/if}
        {#if gameStats.playerOne < gameStats.playerTwo && gameStats.playerTwo !== 0}
            <div class="avatar avatar-placeholder border rounded-full relative">
                <div class="absolute text-4xl rotate-45 top-[-20px] right-[-20px]">👑</div>
                <div class="bg-neutral font-1 text-neutral-content w-24 rounded-full">
                    <span class="text-3xl">2</span>
                </div>
            </div>
        {/if}
        
        <ThrowingScreen 
            bind:this={throwScreen}
            turnText={`Player ${gameStats.currentTurn}`} 
            on:throwComplete={handleThrowComplete} 
        />

        {#if gameStats.playerOne !== 0 && gameStats.currentTurn === 1}
            <button class="btn btn-primary mt-2 font-1" on:click={resetTurn}>
                <p>Next Turn</p>
            </button>
        {/if}

        {#if gameStats.playerOne !== 0 && gameStats.playerTwo !== 0}
            <div>
                {#if gameStats.playerOne > gameStats.playerTwo}
                    <p class="text-xl font-bold text-center">Player 1 has won</p>
                {/if}
                {#if gameStats.playerOne < gameStats.playerTwo}
                    <p class="text-xl font-bold text-center">Player 2 has won</p>
                {/if}
                {#if gameStats.playerOne === gameStats.playerTwo}
                    <p class="text-xl font-bold text-center">It's a tie!</p>
                {/if}

                {#if askForName}
                    <div class="px-8 py-4 bg-base-300 flex flex-col gap-2 w-full text-center rounded-box">
                        <p class="font-2">
                            <span class="text-xl font-bold">Congrats!</span><br />You're on the leaderboard
                        </p>
                        <input
                            bind:value={name}
                            class="input font-1 text-center w-fit"
                            placeholder="Your Name"
                        />

                        <button class="btn btn-secondary font-1 w-fit mx-auto" on:click={modifyLeaderboard}
                            >Submit Name</button
                        >
                        <p class="text-xs">Embrace this moment</p>
                    </div>
                {/if}
                <div class="w-fit mx-auto">
                    <a href="/local" class="btn btn-accent mt-2 btn-lg w-full font-1">
                        Again?<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="size-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        {/if}
    </div>
</div>