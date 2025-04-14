<script>

	// The meat of the program: this is where all the calculations are performed
	// I never expected to show up to a hackathon and have to do a double integral, but here we are...
	// Shoutout to my AP Physics C teacher, Mrs. Drake - Joaquin

	import { processScore } from '$lib/utils';
    import { onMount, createEventDispatcher } from 'svelte'
    
    export let turnText = "Your Turn"; // default text to display
    export let bottomText = null;
    
    // throwing state stuff
    let x = 0;
    let y = 0;
    let z = 0;
    let xData = [];
    let yData = [];
    let lastUpdateTime;
    let totalDisplacement = 0;

	// We ended up having to account for errors in measurement manually:

	// Why did we have errors in our calculation? Because there are limits to what can be calculated in finite space.
	// Since we can't literally perform a definite integral over every single infinitesimal instant, only what we can
	// discretely measure, that devious "+C" term is going to exponentially increase after two integrations, resulting
	//in a large margin of error we had to account for manually.


    let storedErrorX = 0;
    let storedErrorY = 0;
    let startCounting = false;
    let highestDisplacement = 0; // Records the highest displacement value calculated
    let isOnGround = false; // We need to know whether the device is on the ground (its z acceleration is 0
    let marginCheck = 0;
    let initialTime = Date.now();
    let timeElapsed = 0;
    let buttonClicked = false;
    let time = 4;
    let done = false;

    export let totalSpin = 0;
    
    const dispatch = createEventDispatcher();
    
    function LRAM(listX, listY, totalTime) {
	// An implementation of a left-handed Riemann sum, used to integrate over discrete values
        let velocityData = []; // First we instantiate an array (that will end up very large) full of our velocity magnitudes
        let velocityX = 0; // Velocity is a vector with two dimensions, so we have to calculate the magnitude from the X and Y components separated
        let velocityY = 0;

        const timeStep = totalTime / listX.length; // Gives us our delta t, the amount of time in between values 
        for (let i = 0; i < listX.length; i++) {
            const accelX = Math.abs(listX[i]) > 1 ? listX[i] : 0; // Get our acceleration values, round down to 0 if less than 1
            const accelY = Math.abs(listY[i]) > 1 ? listY[i] : 0;

		// [Acceleration = velocity / time], so we multiply our acceleration by our time step to get the velocity
            velocityX += accelX * timeStep;
            velocityY += accelY * timeStep;

            const angle = Math.atan(velocityY / velocityX); // We use the arctan function to get the angle from the X and Y components
            const hypo = velocityX / Math.cos(angle); // And then we use that angle to calculate the magnitude of the resultant velocity vector

            if (!isNaN(hypo)) {
		// As long as nothing went wrong, we push our calculated resultant velocity to the big array.
                velocityData.push(hypo);
            }
        }

        return velocityData;
    }

    function getDistance(list, totalTime) {
	// Then we have to do the second part, determining how far it went by multiplying the velocity by the time
        let totalDistance = 0;
        const timeStep = totalTime / list.length; // Delta t, again

        // push the velocity magnitude
        for (let i = 0; i < list.length; i++) {
            totalDistance += list[i] * timeStep; // convert ms to seconds
        }

        return totalDistance;
    }

    onMount(async () => {
		// make sure we can access the device accelerometers through event.acceleration
        const handleDeviceMotion = (event) => {
            totalSpin += Math.abs(event.rotationRate.alpha) + Math.abs(event.rotationRate.beta) + Math.abs(event.rotationRate.gamma)


		// Gather our current acceleration values while in flight
            x = event.acceleration.x.toFixed(2) + storedErrorX;
            y = event.acceleration.y.toFixed(2) + storedErrorY;
            xData.push(x);
            yData.push(y);

            z = event.acceleration.z;

            const marginOfError = 0.2; // Our manually calculated margin of error, could certainly be tweaked further

            // console.log(Date.now() - initialTime, done)
            // if (Date.now() - initialTime >= 5000 + 5000 && !done) {
            //     marginCheck = 5;
            // }

            if (marginCheck > 4 && !isOnGround && startCounting) {
		// Runs at flight conclusion
                isOnGround = true;

                timeElapsed = (Date.now() - initialTime) / 1000; // Figure out how long our flight was

                const velocityData = LRAM(xData, yData, timeElapsed); // Run the calculations with the gathered data

                totalDisplacement = Math.abs(getDistance(velocityData, timeElapsed)); // Get our final displacement!

                if (highestDisplacement === 0 || (Date.now() - initialTime >= 5000 && !done)) {
                    highestDisplacement = totalDisplacement;
                    
                    console.log("FINISHING THROW", highestDisplacement)
                    // emit the score to the parent
                    dispatch('throwComplete', { score: highestDisplacement });
                    
                    startCounting = false;
                    done = true;
			// tell the rest of the program we're done with the throw
                }
            }

            if (Math.abs(z) < marginOfError) {
                marginCheck++;
            } else {
                marginCheck = 0;
                isOnGround = false;
            }
        };

        window.addEventListener('devicemotion', handleDeviceMotion); // Access the accelerometer data with our function

        return () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
        };
    });

    const startTimer = () => {
        buttonClicked = true;
        dispatch("throwPrimed");

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

    export function reset() {
        time = 4;
        highestDisplacement = 0;
        xData = [];
        yData = [];
        buttonClicked = false;
        startCounting = false;
    }
</script>

// -- FRONT-END --
// all designed by our hero Sebastian (XDigging)
// and populated with foolishness by Joaquin (scherepi)
<div class="hero-content flex-col">
    <p class="font-1 font-bold text-6xl text-center">{turnText}</p>
    
    {#if time === 4}
        <p class="font-1 text-xl">Did you stretch properly?</p>
        {#if !buttonClicked}
            <button class="btn btn-primary font-2 btn-lg bg-[#1a1a1a] border-[#4f4f4f] animate-bounce" on:click={startTimer}>
                THROW THAT PHONE, YOU OAF
                <svg
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
        {:else}
            <button
                class="btn btn-primary btn-disabled font-2 btn-lg"
                aria-disabled="true"
            >
                CHUCK IT LIKE YOUR EX TEXTED
                <svg
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
        <div class="fixed top-0 left-0 bg-[] opacity-95 animate-pulse h-screen w-full"></div>
        <div class="">
            <p class="text-center font-1 font-bold text-4xl text-error">TOSS IT</p>

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
                Congrats, you ape. You got <span>{processScore(highestDisplacement,1,1,1)}</span> points. Proud of yourself?
            </p>
        </div>
    {/if}

    {#if !buttonClicked && bottomText}
        <p class="text-xl text-center w-full absolute bottom-[16vh]">{bottomText}</p>
    {/if}
</div>
