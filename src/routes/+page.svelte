
<script>
	import { onMount } from "svelte";

 
    let x =0;
    let y=0;
    let z=0;
    
    let xData = [];
    let yData = [];

    let totalDisplacement = 0;
    



    let highestDisplacement = 0;
    let isOnGround = false;
    let marginCheck = 0;
    let initialTime = Date.now();
    let timeElapsed = 0;
    let makeScreenRed = false;
    let xVelocity = 0;
    

    let divider = 0;

    let interval = 0;

    



    // amountOfRectangles reprsents the interval of each datapoint
    function LRAM(listX, listY, interval) {
    let velocityData = [];
    let velocityX = 0;
    let velocityY =0;

    for (let i = 0; i < listX.length; i++) {
        const accelX = Math.abs(listX[i]) > 0.3 ? listX[i] : 0;
        const accelY = Math.abs(listY[i]) > 0.3 ? listY[i] : 0;
        velocityX += accelX * (interval / 1000);
        velocityY += accelY * (interval / 1000);
        
        // Push the velocity magnitude
        velocityData.push(Math.sqrt(velocityX ** 2 + velocityY ** 2));
    }

    
    return velocityData;
}

function getDistance(list, interval) {
    let totalDistance = 0;

    for (let i = 0; i < list.length; i++) {
        totalDistance += list[i] * (interval / 1000); // Convert ms to seconds
    }

    return totalDistance;
}



    onMount(async() => {
        
        // Assume on the ground when z=9.8 or so
    
        window.addEventListener("devicemotion", (event) => {
    interval = event.interval; // Time step in ms
    x = event.accelerationIncludingGravity.x;
    y = event.accelerationIncludingGravity.y;

    if (Math.abs(x) > 0.3 || Math.abs(y) > 0.3) {
        xData.push(x);
        yData.push(y);
    }
    
    

    z = event.accelerationIncludingGravity.z - 9.8;

    const marginOfError = 0.2;

    if ((marginCheck > 4) && !isOnGround) {
        isOnGround = true;
        timeElapsed = Date.now() - initialTime;
        
        

        const velocityData = LRAM(xData, yData, interval);

        totalDisplacement = Math.abs(getDistance(velocityData, interval));

        if (totalDisplacement > highestDisplacement) {
            highestDisplacement = totalDisplacement;
        }
        xData = [];
        yData = [];

    }

    if (Math.abs(z) < marginOfError) {
        marginCheck++;
    } else {
        marginCheck = 0;
        isOnGround = false;
    }
});




    
    })
   


    const startTimer = () => {
        xData = [];
        yData = [];
        initialTime = Date.now();
        highestDisplacement = 0;


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
    Highest recent displacement: {highestDisplacement}


</div>




<div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={startTimer}>

    reset values
</div>

