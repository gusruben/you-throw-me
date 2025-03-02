<script>
	// import { leaderboard } from 'leaderboard.json';
	import { onMount } from 'svelte';
	import KalmanFilter from 'kalmanjs';
	// import GameDash from '$lib/GameDash.svelte';
	import Navbar from '$lib/Navbar.svelte';
	let x = 0;
	let y = 0;
	let z = 0;

	let xData = [];
	let yData = [];
	let gameStats = {
		playerOne: 0,
		playerTwo: 0,
		currentTurn: 1
	};
	let lastUpdateTime;

	let totalDisplacement = 0;
	let storedErrorX = 0;
	let storedErrorY = 0;
	let startCounting = false;

	let highestDisplacement = 0;
	let isOnGround = false;
	let marginCheck = 0;
	let initialTime = Date.now();
	let timeElapsed = 0;

	let askForName = false;

	let name = "";
	let buttonClicked = false;

	let time = 4;

	function LRAM(listX, listY, totalTime) {
		let velocityData = [];
		let velocityX = 0;
		let velocityY = 0;

		const timeStep = totalTime / listX.length;
		for (let i = 0; i < listX.length; i++) {
			const accelX = Math.abs(listX[i]) > 1 ? listX[i] : 0;
			const accelY = Math.abs(listY[i]) > 1 ? listY[i] : 0;
			velocityX += accelX * timeStep;
			velocityY += accelY * timeStep;

			const angle = Math.atan(velocityY / velocityX);
			const hypo = velocityX / Math.cos(angle);

			if (!isNaN(hypo)) {
				velocityData.push(hypo);
			}
		}

		return velocityData;
	}

	async function modifyLeaderboard() {
		

		let maxNum = gameStats.playerOne;
		if (gameStats.playerOne < gameStats.playerTwo) {
			maxNum = gameStats.playerTwo
		}


		await fetch("/api/leaderboard", {
			method: "POST",
			headers: {
        "Content-Type": "application/json"
    },
			body: JSON.stringify({
				name: name,
				score: maxNum
			})
		})
		
	
		askForName = false;

	}

	function getDistance(list, totalTime) {
		let totalDistance = 0;
		const timeStep = totalTime / list.length;

		// Push the velocity magnitude
		for (let i = 0; i < list.length; i++) {
			totalDistance += list[i] * timeStep; // Convert ms to seconds
		}

		return totalDistance;
	}

	function pleaseHelp(listX, listY, totalTime) {
		let total = 0;
		for (let i = 0; i < listX.length; i++) {
			total += (Math.sqrt(listX[i] ** 2 + listY[i] ** 2) * totalTime ** 2) / 4;
		}
		return total;
	}
	

	onMount(async () => {
		

		window.addEventListener('devicemotion', async(event) => {
			x = event.acceleration.x.toFixed(2) + storedErrorX;
			y = event.acceleration.y.toFixed(2) + storedErrorY;
			xData.push(x);
			yData.push(y);

			z = event.acceleration.z;

			const marginOfError = 0.2;

			if (marginCheck > 4 && !isOnGround && startCounting) {
				isOnGround = true;

				timeElapsed = (Date.now() - initialTime) / 1000;

				const velocityData = LRAM(xData, yData, timeElapsed);

				totalDisplacement = Math.abs(getDistance(velocityData, timeElapsed));

				if (highestDisplacement === 0) {
					highestDisplacement = totalDisplacement;
					if (gameStats.currentTurn === 1) {
						gameStats.playerOne = highestDisplacement;
					} else {
						gameStats.playerTwo = highestDisplacement;
					}


					// End game thingies


					if ((gameStats.playerOne != 0 ) && (gameStats.playerTwo != 0)) {

						let highestNum = gameStats.playerOne;
						if (gameStats.playerOne<gameStats.playerTwo) {
							highestNum = gameStats.playerTwo
						}

						const request = await fetch("/api/leaderboard");
						const response = request.json()
						console.log(response);
						let i=response.length-1;
						for (i=response.length-1;0>i; i--) {
							if (response[i].score > highestNum) {
								break;
								
								
							}


						}

						if (i===9) {
							// do nothing
						} else {
							askForName = true;
						}
 					




					}


					startCounting = false;
				}
			}

			if (Math.abs(z) < marginOfError) {
				marginCheck++;
			} else {
				marginCheck = 0;
				isOnGround = false;
			}
		});
	});

	const startTimer = () => {
		
		buttonClicked = true;
		let interval = setInterval(() => {
			time -= 1;
			if (time <= 0) {
				startCounting = true;
				clearInterval(interval);
			}
		}, 1000);
		setTimeout(() => {
			
			xData = [];
			yData = [];
			initialTime = Date.now();
			highestDisplacement = 0;
		}, 3000);
	};
	
	const resetTurn = () => {
		time = 4;
		highestDisplacement = 0;
		gameStats.currentTurn = 2;
		xData = [];
		yData = [];
		buttonClicked = false;

	};
</script>

<Navbar />

<div class="fixed top-0 w-full left-0 bg-base-300">
	

    <div class="text-center font-1 mx-auto w-fit items-center  p-2 bg-base-300 flex flex-row gap-4">
		
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

<div class="hero h-[70vh]">
	<div class="hero-content flex-col">
		{#if ((gameStats.playerOne > gameStats.playerTwo) && (gameStats.playerTwo !== 0))}
			<div class="avatar avatar-placeholder border rounded-full relative">
				<div class="absolute text-4xl rotate-45 top-[-20px] right-[-20px]">
					👑

				</div>
				<div class="bg-neutral font-1 text-neutral-content w-24 rounded-full">
					<span class="text-3xl">1</span>

				</div>

			</div>
		{/if}
		{#if (gameStats.playerOne < gameStats.playerTwo)}
		<div class="avatar avatar-placeholder border rounded-full relative">
			<div class="absolute text-4xl rotate-45 top-[-20px] right-[-20px]">
				👑

			</div>
			<div class="bg-neutral font-1 text-neutral-content w-24 rounded-full">
				<span class="text-3xl">2</span>

			</div>

		</div>
		
		{/if}
		<p class="font-1 font-bold text-6xl">Player {gameStats.currentTurn}</p>
		{#if time === 4}
			<p class="font-1 text-lg">Get ready to throw...</p>
			{#if !buttonClicked}
			<button class="btn btn-primary font-2 btn-lg animate-bounce" onclick={startTimer}>
				Start throw<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-6"
				>
					<path
						fillRule="evenodd"
						d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
			{/if}
			{#if buttonClicked}
			<button class="btn btn-primary btn-disabled font-2 btn-lg" aria-disabled="true" onclick={startTimer}>
				Start throw<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-6"
				>
					<path
						fillRule="evenodd"
						d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
						clipRule="evenodd"
					/>
				</svg>
			</button>

			{/if}
		{/if}

		{#if time <= 3 && time !== 0}
			<div>
				<p class="font-1 text-6xl font-extrabold">{time}</p>
			</div>
		{/if}

		{#if time === 0 && highestDisplacement === 0}
			<div class="fixed top-0 left-0 bg-error opacity-95 animate-pulse h-screen w-full"></div>
			<div class="">
				<p class="text-center font-1 font-bold text-4xl text-error">Throw now</p>

				<div class="rounded-box bg-base-200 p-4 mt-4 text-lg font-medium text-base-content">
					<div class="font-2">
						<p>Height Acceleration: <span class="font-extrabold">{z}</span></p>
					</div>
				</div>
			</div>
		{/if}

		{#if highestDisplacement !== 0}
			<div class="text-center">
				<p class="font-1 text-xl">
					You're an ape. You got <span>{highestDisplacement.toFixed(2)}</span> points
				</p>
				{#if gameStats.currentTurn === 1}
					<button class="btn btn-primary mt-2 font-1" onclick={resetTurn}>
						<p>Next Turn</p>
					</button>
				{/if}
			</div>
		{/if}
		
		
		{#if gameStats.playerOne != 0 && gameStats.playerTwo != 0}
			<div>
				<!-- {#if gameStats.playerOne > gameStats.playerTwo}
					<p class="text-xl font-bold text-center">Player 1 has won</p>
				{/if}
				{#if gameStats.playerOne < gameStats.playerTwo}
					<p class="text-xl font-bold text-center">Player 2 has won</p>
				{/if} -->

				{#if askForName}
					<div class="px-8 py-4 bg-base-300 flex flex-col gap-2 w-full text-center rounded-box">
			<p class='font-2'><span class='text-xl font-bold'>Congrats!</span><br/>You're on the leaderboard</p>
			<input bind:value={name} class='input font-1 text-center w-fit' placeholder="Your Name" />

			<button class='btn btn-secondary font-1 w-fit mx-auto' onclick={modifyLeaderboard}>Submit Name</button>
			<p class="text-xs">Embrace this moment</p>
		</div>

				{/if}
				<div class="w-fit mx-auto">
					<a href="/game" class="btn btn-accent mt-2 btn-lg w-full font-1">
						Again?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
							<path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
						  </svg>
						  
						</a>

				</div>
				
			</div>
		{/if}
		
	</div>
</div>

<!-- <div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={startTimer}>reset values</div> -->

<!-- <div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={storeError}>store error correction</div>
<div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={() => {storedErrorX = 0; storedErrorY = 0}}>reset error correction</div> -->
