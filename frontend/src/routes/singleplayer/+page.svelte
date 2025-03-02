<script>
    import { onMount } from 'svelte';
    import ThrowingScreen from '$lib/ThrowingScreen.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import { processScore } from '$lib/utils';


    let askForName = false;
    let name = '';
    let throwScreen; 
    let throwDone = false;
    let score = -1;

    async function modifyLeaderboard() {

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

    const handleThrowComplete = async (event) => {
        throwDone = true;
        score = event.detail.score;

        try {
            const request = await fetch('/api/leaderboard');
            const response = await request.json();
            
            let shouldAddToLeaderboard = false;
            if (response.length < 10) {
                shouldAddToLeaderboard = true;
            } else {
                for (let i = 0; i < response.length; i++) {
                    if (response[i].score < score) {
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
    };
</script>


<div class="hero h-[90vh]">
    <div class="hero-content flex-col">
        {#if throwDone}
            <div class="avatar avatar-placeholder border rounded-full relative">
                {#if askForName}
                <div class="bg-[url('/fire.apng')] bg-cover bg-center font-1 text-neutral-content w-24 rounded-full">
                    <span class="text-3xl">:)</span>
                </div>
                {:else}
                <div class="bg-neutral font-1 text-neutral-content w-24 rounded-full">
                    <span class="text-3xl">:)</span>
                </div>
                {/if}
            </div>
        {/if}
        
        <ThrowingScreen 
            bind:this={throwScreen}
            turnText="Try For a New High Score" 
            on:throwComplete={handleThrowComplete} 
        />

        {#if throwDone}
            <div>
                <!-- <p class="text-xl font-bold text-center font-1">fscored {processScore(score, 1, 1, 1)}!</p> -->
                {#if askForName}
                    <div class="px-8 py-4 bg-base-300 flex flex-col gap-2 w-full text-center rounded-box">
                        <p class="font-2">
                            <span class="text-xl font-bold">Holy Shit.</span><br />You're on the leaderboard. Bring out the fine wine.
                        </p>
                        <input
                            bind:value={name}
                            class="input font-1 text-center w-fit text-xl mx-auto"
                            placeholder="Your Name"
                        />

                        <button class="btn btn-secondary font-1 w-fit mx-auto text-xl" on:click={modifyLeaderboard}
                            >Submit Name</button
                        >
                        <p>Embrace this moment</p>
                    </div>
                {/if}
                <div class="w-fit mx-auto">
                    <a href="/leaderboard" class="btn btn-accent mt-2 btn-lg w-full font-1">
                        View the Leaderboard<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                          </svg>
                          
                    </a>
                </div>
                <div class="w-fit mx-auto">
                    <a href="/singleplayer" class="btn btn-accent mt-2 btn-lg w-full font-1" on:click={() => window.location = window.location}>
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