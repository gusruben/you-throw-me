<script>
    import Navbar from "$lib/Navbar.svelte";

    const leaderboard = [
        {
            name: "Carlos",
            distance: 59.40,
            rank: 1,
        },
        {
            name: "Ben",
            distance: 52.40,
            rank: 2,
        },
        {
            name: "Asher",
            distance:41.40,
            rank: 3,
        },
        {
            name: "Deni",
            distance: 30.40,
            rank: 4,
        },
        {
            name: "Gen",
            distance: 2.40,
            rank: 5,
        },
        {
            name: "Gen",
            distance: 2.40,
            rank: 6,
        },
        {
            name: "Gen",
            distance: 2.40,
            rank: 7,
        },
        {
            name: "Gen",
            distance: 2.40,
            rank: 8,
        },
        {
            name: "Gen",
            distance: 2.40,
            rank: 9,
        },
        {
            name: "Gen",
            distance: 2.40,
            rank: 10,
        },

    ];



</script>
<div>

    <Navbar />


    <div class="p-2 bg-base-300">
        <p class="font-1 text-2xl font-bold ">Leaderboard</p>

    </div>
    <div class="overflow-y-auto list h-[80vh]">
        
        {#each leaderboard as item}
            <div class="list-row">
                <p class="text-4xl tabular-nums font-extrabold font-2">{item.rank}</p>
                <div class="list-col-grow flex flex-row items-center">
                    <p class="font-1 text-3xl">{item.name}</p>

                </div>
                
                <div class="flex flex-row items-center">
                    <div class="badge badge-primary font-1">
                        {item.distance} meters
                    </div>
                </div>
               
            </div>


        {/each}
        
        

    </div>





</div>