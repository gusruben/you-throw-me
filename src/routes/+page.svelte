
<script>
	import { onMount } from "svelte";

 
    let x =0;
    let y=0;
    let z=0;
    
    let xData = [];
    let yData = [];

    let totalDisplacement = 0;
    



    
    let isOnGround = false;
    let marginCheck = 0;
    let initialTime = Date.now();
    let timeElapsed = 0;
    let makeScreenRed = false;
    let xVelocity = 0;
    

    let divider = 0;

    let interval = 0;

    



    // amountOfRectangles reprsents the interval of each datapoint
    function LRAM(list, totalTime) {
        
        let totalSum = 0;
        let xVelocityData = [];
        for (let i=0; i<list.length; i++) {
            totalSum += list[i];
            // amount of rectangles = b-a = finalTime-initialTime (ms)
            xVelocityData.push((((totalTime))/(list.length)/1000) * (list[i]));
        }

        xVelocity = (list.length/totalTime) * (totalSum);
        return xVelocityData;
    }


    function getDistance(list, totalTime) {
        divider = totalTime/list.length/1000;
        
        let totalSum = 0;
        for (let i=0; i<list.length; i++) {
            totalSum += list[i];
        }


        return (totalTime/(list.length*10)/1000) * (totalSum);
    }


    onMount(async() => {
        
        // Assume on the ground when z=9.8 or so
    
        window.addEventListener("devicemotion", (event) => {
            interval = event.interval;
            x = event.accelerationIncludingGravity.x;
            y = event.accelerationIncludingGravity.y;

            xData.push(x);
            yData.push(y);

            z = event.accelerationIncludingGravity.z-9.8;
            

            const marginOfError = 0.2;

            if ((marginCheck > 4) && !isOnGround) {
                isOnGround = true;
                timeElapsed = Date.now() - initialTime;
                
                const xVelocityData = LRAM(xData, timeElapsed);

                totalDisplacement = getDistance(xVelocityData, timeElapsed);
                xData = [];
                yData = [];

            }


            if (Math.abs(z) < marginOfError) {
                marginCheck++;
            } else {
                marginCheck = 0; 
                isOnGround=false;
            }

        });




    
    })
   


    const startTimer = () => {
        setTimeout(() => {  
            makeScreenRed = true;
            initialTime = Date.now();
        }, 3000)


    }
    




</script>

<h1>Welcome to SvelteKit</h1>

<div class={makeScreenRed ? "bg-red-500" : "bg-white-100"} >
    <p class="">X coordinate: {x} </p>
    <p class="">Y Coordinate: {y} </p>
    <p class="">Z Coordinate:  {z} </p>
    <p class="">Is on ground: {isOnGround}</p>
    <p class="">Displacement: {totalDisplacement}</p>
    Dividing amt: {divider} 
    Interval: {interval}
    Time Elapsed: {timeElapsed}


</div>




<div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={startTimer}>

    start timer
</div>

