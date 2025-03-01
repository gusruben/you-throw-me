
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




    function LRAM(list, amountOfRectangles=timeElapsed) {
        let totalSum = 0;
        let xVelocityData = [];
        for (let i=0; i<list.length; i++) {
            totalSum += list[i];
            xVelocityData.push((list.length/amountOfRectangles) * (list[i]));
        }

        xVelocity = (list.length/amountOfRectangles) * (totalSum);
        return xVelocityData;
    }


    function getDistance(list, amountOfRectangles=timeElapsed) {
        let totalSum = 0;
        for (let i=0; i<list.length; i++) {
            totalSum += list[i];
        }


        return (list.length/amountOfRectangles) * (totalSum);
    }


    onMount(async() => {
        
        // Assume on the ground when z=9.8 or so
    
        window.addEventListener("devicemotion", (event) => {
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


</div>




<div class="p-4 bg-blue-300 w-fit hover:bg-blue-400" onclick={startTimer}>

    start timer
</div>

