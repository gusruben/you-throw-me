<script>
	import { processScore } from '$lib/utils';
    import Navbar from "$lib/Navbar.svelte";

    let { data } = $props();

</script>
<div>

    <div class="p-2 bg-base-300">
        <p class="font-1 text-2xl font-bold ">Leaderboard</p>

    </div>
    <div class="overflow-y-auto list h-[100vh]">
        
        {#each data.leaderboard as item, i}
            <div class="list-row rounded-none" style={i==0?"background-image:url('/fire.apng');background-size:6rem":""}>
                {#if i<=2}

                <p class="text-4xl tabular-nums font-extrabold font-2 text-yellow-500 p-2 rounded-full">{i+1}</p>

                {/if}

                {#if i>2}

                <p class="text-4xl tabular-nums font-extrabold font-2  p-2 ">{i+1}</p>

                {/if}
                
             
                <div class="list-col-grow flex flex-row items-center">
                    <p class="font-1 text-3xl">{item.name}</p>

                </div>
                
                <div class="flex flex-row items-center">
                    <div class="badge badge-primary font-1">
                        {processScore(item.score,1,1,1)} points
                    </div>
                </div>
               
            </div>


        {/each}
        
        

    </div>


</div>