
<script>
    import { onMount } from 'svelte';
    import KalmanFilter from 'kalmanjs';
	import Navbar from '$lib/Navbar.svelte';
	let x = 0;
	let y = 0;
	let z = 0;

	let xData = [];
	let yData = [];



	let gameStats = {
		playerOne: 0,
		playerTwo: 0,
		currentTurn: 1,
		
	}




	let intervalLengths = []; // intervalLengths[i] should be the time between xData[i] and xData[i+1]
	let lastUpdateTime;

	let totalDisplacement = 0;
	// let totalAccel = [0, 0, 0];
	// let averages = [0, 0];
	let storedErrorX = 0;
	let storedErrorY = 0;
	let averageSample = 50
    let debugAngle = 0;
	let highestDisplacement = 0;
	let isOnGround = false;
	let marginCheck = 0;
	let initialTime = Date.now();
	let timeElapsed = 0;




	
	let makeScreenRed = false;
	let xVelocity = 0;

	let divider = 0;

	let interval = 0;

	


	let time = 4;
    // R
   

	// amountOfRectangles reprsents the interval of each datapoint
	function LRAM(listX, listY, totalTime) {
		let velocityData = [];
		let velocityX = 0;
		let velocityY = 0;
        
        const timeStep = totalTime / listX.length;
		for (let i = 0; i < listX.length; i++) {
            
			const accelX = Math.abs(listX[i]) > 1 ? listX[i] : 0;
			const accelY = Math.abs(listY[i]) > 1 ? listY[i] : 0;
			velocityX += accelX*timeStep
			velocityY += accelY*timeStep


            const angle = Math.atan(velocityY/velocityX);
            const hypo = velocityX/(Math.cos(angle));
            debugAngle = hypo
            if (!isNaN(hypo)) {
                velocityData.push(hypo);
            }
            
		
            

            
		}

		return velocityData;
	}

	function getDistance(list, totalTime) {
		let totalDistance = 0;
        const timeStep = totalTime / list.length;
        divider = timeStep;

			// Push the velocity magnitude
		for (let i = 0; i < list.length; i++) {
			totalDistance += list[i] *timeStep // Convert ms to seconds
		}

		return totalDistance;
	}


    function pleaseHelp(listX,listY,totalTime) {
        let total = 0;
        for (let i=0; i<listX.length;i++) {
            total+=(Math.sqrt(listX[i]**2 + listY[i]**2) * totalTime**2)/4;
        }
        return total


    }

	onMount(async () => {
		// Assume on the ground when z=9.8 or so
		try {
			await DeviceMotionEvent.requestPermission();
		} catch(e){
			
		}
		
		window.addEventListener('devicemotion', (event) => {
			if (lastUpdateTime) {
				intervalLengths.push(Date.now() - lastUpdateTime);
			}
			lastUpdateTime = Date.now()

			
			interval = event.interval; // Time step in ms
			x = event.acceleration.x.toFixed(2) + storedErrorX;
			y = event.acceleration.y.toFixed(2) + storedErrorY;
            xData.push(x);
            yData.push(y);
	
			z = event.acceleration.z;

			// totalAccel = [totalAccel[0] + x, totalAccel[1] + y, totalAccel[2] + z]
            
			const marginOfError = 0.2;

			if (marginCheck > 4 && !isOnGround) {
				isOnGround = true; 

				timeElapsed = (Date.now() - initialTime)/1000;

				const velocityData = LRAM(xData, yData, timeElapsed);

				totalDisplacement = Math.abs(getDistance(velocityData, timeElapsed));

				if (highestDisplacement===0) {
					highestDisplacement=totalDisplacement;
					if (gameStats.currentTurn === 1) {
						gameStats.playerOne = highestDisplacement
					} else {
						gameStats.playerTwo = highestDisplacement
					}

				}


				// if (totalDisplacement > highestDisplacement) {
				// 	highestDisplacement = totalDisplacement;
					
				// }
		
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

		let interval = setInterval(() => {
			time -= 1;
			if (time <= 0) {
				clearInterval(interval)
			}
		},1000)
		setTimeout(() => {
			xData = [];
			yData = [];
			initialTime = Date.now();
			highestDisplacement = 0;
			// totalAccel = [0, 0, 0];

		}, 3000)
	
	};

	const resetTurn = () => {
		time =4;
		highestDisplacement =0;
		gameStats.currentTurn = 2;
	}


</script>


<!-- <h1>Welcome to SvelteKit</h1>

<div class={makeScreenRed ? 'bg-red-500' : 'bg-white-100'}>
	<p class="">X coordinate: {x}</p>
	<p class="">Y Coordinate: {y}</p>
	<p class="">Z Coordinate: {z}</p>
	<p class="">total acceleration: {JSON.stringify(totalAccel.map(v => Math.round(v*1000)/1000))}</p>
	<p class="">averages: {JSON.stringify(averages.map(v => Math.round(v*1000)/1000))}</p>
	<p class="">stored error: [{storedErrorX}, {storedErrorY}]</p>
	<p class="">Is on ground: {isOnGround}</p>
	<p class="">Displacement: {totalDisplacement}</p>
	Dividing amt: {divider}
	Interval: {interval}
	Time Elapsed: {timeElapsed}
	Highest recent displacement: {highestDisplacement}
    Angle: {debugAngle}
</div> -->

<Navbar />

<div class="hero h-[70vh]">
	<div class="hero-content flex-col">
		<p class="font-1 font-bold text-6xl">Player {gameStats.currentTurn}</p>
		{#if time === 4}
		<p class="font-1 text-lg">Get ready to throw...</p>
		<div class="btn btn-primary font-2 btn-lg" onclick={startTimer}>
			Start throw<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
				<path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
			  </svg>
			  

		</div>
		{/if}


		{#if ((time <=3) && (time!==0))}

			<div>
				<p class="font-1 text-6xl font-extrabold">{time}</p>
			</div>
		{/if}

		{#if ((time===0) && (highestDisplacement===0))}
			<div class="">
				<p class="text-center font-1 font-bold text-4xl text-error">Throw now</p>

				<div class="rounded-box bg-base-200 p-4 mt-4 text-lg font-medium text-base-content">
					<div class="font-2">
						<p>Height Acceleration: <span class="font-extrabold">{z}</span></p>
					</div>

				</div>
			

			
			</div>

		{/if}

		{#if ((highestDisplacement !== 0))}
			<div class="text-center">
				<p class="font-1 text-xl">You're an ape. You got <span>{highestDisplacement.toFixed(2)}</span> points</p>
				{#if gameStats.currentTurn===1}
					<button class="btn btn-primary font-1" onclick={resetTurn}>
						<p>Next Turn</p>
					</button>
				{/if}
			</div>

		{/if}
		{#if ((gameStats.playerOne != 0) && (gameStats.playerTwo != 0))}
			<div class="text-xl font-bold">
				{#if gameStats.playerOne > gameStats.playerTwo}
					<p>Player 1 has won</p>
				{/if}
				{#if gameStats.playerOne < gameStats.playerTwo}
					<p>Player 2 has won</p>
				{/if}
				


			</div>

		
		{/if}
	</div>


</div>










<!-- <div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={startTimer}>reset values</div> -->

<!-- <div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={storeError}>store error correction</div>
<div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={() => {storedErrorX = 0; storedErrorY = 0}}>reset error correction</div> -->
