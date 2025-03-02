<script>
    import { onMount, createEventDispatcher } from 'svelte';
    
    export let turnText = "Your Turn"; // default text to display
    
    // throwing state stuff
    let x = 0;
    let y = 0;
    let z = 0;
    let xData = [];
    let yData = [];
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
    let buttonClicked = false;
    let time = 4;
    
    const dispatch = createEventDispatcher();
    
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

    function getDistance(list, totalTime) {
        let totalDistance = 0;
        const timeStep = totalTime / list.length;

        // push the velocity magnitude
        for (let i = 0; i < list.length; i++) {
            totalDistance += list[i] * timeStep; // convert ms to seconds
        }

        return totalDistance;
    }

    onMount(async () => {
        const handleDeviceMotion = (event) => {
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
                    
                    // emit the score to the parent
                    dispatch('throwComplete', { score: highestDisplacement });
                    
                    startCounting = false;
                }
            }

            if (Math.abs(z) < marginOfError) {
                marginCheck++;
            } else {
                marginCheck = 0;
                isOnGround = false;
            }
        };

        window.addEventListener('devicemotion', handleDeviceMotion);

        return () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
        };
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

    export function reset() {
        time = 4;
        highestDisplacement = 0;
        xData = [];
        yData = [];
        buttonClicked = false;
        startCounting = false;
    }
</script>

<div class="hero-content flex-col">
    <p class="font-1 font-bold text-6xl">{turnText}</p>
    
    {#if time === 4}
        <p class="font-1 text-lg">Get ready to throw...</p>
        {#if !buttonClicked}
            <button class="btn btn-primary font-2 btn-lg animate-bounce" on:click={startTimer}>
                Start throw
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
        {#if buttonClicked}
            <button
                class="btn btn-primary btn-disabled font-2 btn-lg"
                aria-disabled="true"
            >
                Start throw
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
        </div>
    {/if}
</div>