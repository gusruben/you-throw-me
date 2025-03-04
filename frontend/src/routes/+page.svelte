<script>
	import { onMount } from 'svelte';
	import Navbar from '../lib/Navbar.svelte';
	import Marquee from 'svelte-fast-marquee';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	function iOS() {
		return (
			navigator.platform.startsWith('iP') ||
			(navigator.platform.startsWith('Mac') && navigator.maxTouchPoints > 4)
		);
	}

	let isIOS;

	onMount(() => {
		isIOS = iOS();
	});

	function requestMotionPermission() {
		if (
			typeof DeviceMotionEvent !== 'undefined' &&
			typeof DeviceMotionEvent.requestPermission === 'function'
		) {
			DeviceMotionEvent.requestPermission()
				.then((permissionState) => {
					if (permissionState === 'granted') {
						isIOS = false;
					} else {
						alert('Permission denied for motion data');
					}
				})
				.catch((error) => {
					console.error('Error requesting motion permission:', error);
				});
		} else {
			alert(
				'DeviceMotionEvent is not supported or permission request is not needed on this device'
			);
		}
	}

	const infoMarkdown = `
**You Throw Me (YTM)** is a mobile game about destroying expensive technology.

<div align="center">
<img height="120" src="https://raw.githubusercontent.com/gusruben/you-throw-me/master/frontend/static/line1.gif" alt="Chuck That Thang Like You're A 15th Century Siege Weapon">
</div>

Violence is an indelible element of the human spirit. No matter how much we try to socialize and condition ourselves to an imposed pacifism, the law of the jungle will always be inscribed on our bones. The proof is in the surges and swings of everyday irritants, in that clenched jaw you bear telling your coworker to for the last **goddamn** time to quit bothering you. Eventually, as with any other plaque that might build within the hearts of men, the pressure created becomes overwhelming - release must come about some way or another. So why not throw your phone like a complete fucking ape and enjoy watching numbers go up like an even stupider ape? Come on, your shriveled little dopamine receptors are begging for it.

---

<div align="center">
<img height="120" src="https://raw.githubusercontent.com/gusruben/you-throw-me/master/frontend/static/line2.gif" alt="All the Features Your Stupid Ape Brain Wants and Craves">
</div>

Studies *(citing sources is for losers)* show that monkeys like watching numbers go up in response to their actions. Studies also show that throwing things relieves tension in desperately stressed claustrophobic fatalist human beings. Even more studies *(independently conducted by the nation's greatest minds)* indicate that your phone has an accelerometer in it. We made an app using based on this technology where you throw your phone as hard as you can and get points according to how far you threw it - and some other secret factors we won't tell you about. **Yes, you can finally live out your hidden fantasies of shot put stardom!**

Are you an empty-headed beast that blindly follows the fraudulent theories of "Darwin", whoever that is? I'm sure you'll love to prove to all the other beasts that you are better than them in one singular trivial aspect by beating them in our head-to-head mode. You can either use our 0% guarantee downtime servers *(as in there is 0% of a guarantee that they won't have downtime)* to initiate a competition over the network, or if you're clever and cruel and unwilling to risk your own possessions you can force your friend to sacrifice theirs with Pass & Play! 

There's even a solo leaderboard so you can boast to every other dumb beast on the planet just how good you are at brutishly launching your phone with reckless abandon. Don't worry about the fact you had to pay for that thing; raw, natural competition is clearly much more important.

---

<div align="center">
<img height="120" src="https://raw.githubusercontent.com/gusruben/you-throw-me/master/frontend/static/line3.gif" alt="I Hate Money and Love Winning. How Do I Play?">
</div>

Our app is a progressive web app built in Svelte and decorated with Tailwind, with a backend utilizing Socket.io for server communication. It'd be easy to host yourself, using npm and reconfiguring to run on localhost. But if you don't wanna go through all the hassle, you can find it hosted at [youthrow.me](https://youthrow.me). The game is pretty self-explanatory in its usage - go to the home page, select the mode you wanna play, and either make a session that your friend can join or share the phone with your friend. More features may or may not be coming soon; like any good capitalists, we confine ourselves to no promises.

---

<div align="center">
<img height="60" src="https://raw.githubusercontent.com/gusruben/you-throw-me/master/frontend/static/line4.gif" alt="So, What's This Good For??">
</div>

Well, to be blunt, breaking phones. Certainly, you must have a busted old Android lying in a sock drawer somewhere you won't miss. But I'm sure you could also use it to test your accelerometer in a controlled environment! Get a lot of cushions. And hey, this is Scrapyard, the point is that it's useless. Why are you so convinced that everything needs to have a purpose anyways? Get your head out of your ass. Make stupid shit for the sake of making it. We did, and we had an absolute blast doing it.

---

*MADE FOR [HACK CLUB](https://hackclub.com)'S FLAGSHIP [SCRAPYARD](https://scrapyard.hackclub.com) EVENT BY*

**Sebastian Tavares** - *Super Master Front-End Genius and Licensed Svelte Wizard* // [website](https://xdagging.github.io)

**Gus Ruben** - *General Grand Programming Warlock and Seasoned Hackathon Conqueror* // [website](https://gus.ink)

**Joaquin Schere** - *Supreme Jester, in charge of Overall Buffoonery and Back-end Fumbling* // [website](https://jschere.com)

`
</script>

<!-- "what is this?" overlay -->
<div class="hero fixed inset-0 w-screen h-screen z-50 bg-black/70 backdrop-blur-lg overflow-scroll hidden" id="what-is-this">
	<div class="hero-content flex-col text-center text-2xl" id="markdown">
		<button class="btn btn-ghost self-start text-xl -translate-x-4" onclick={() => document.getElementById("what-is-this").style.display = "none"}>
			&lt; Back
		</button>
		<img src="/whatisthis.apng" alt="What Is This?" class="text-8xl">
		<SvelteMarkdown source={infoMarkdown} />
		<a class="btn btn-ghost underline !text-white text-xl mt-4" href="https://github.com/gusruben/you-throw-me">
			<svg class="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24" version="1.1" data-view-component="true" fill="white">
				<path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
			</svg>
			<span class="pl-0.5">Source Code</span>
		</a>
		<div class="h-24"></div>
	</div>
</div>

<div class="bg-[url('/grid.apng')] bg-center bg-cover h-[100vh]" style="image-rendering:pixelated">
	<div class="fixed top-0 left-0 w-full p-2 bg-black/50 b">
		<Marquee pauseOnHover={true} className=" w-full">
			<div class="grid grid-cols-3 justify-between w-full font-1 font-semibold">
				<div>
					<p class="text-center font-1">Thank god phones can't get concussed!</p>
				</div>
				<div>
					<p class="text-center font-1">
						Free AppleCare+ for the top of the leaderboard! (terms apply) [you're not getting
						anything]
					</p>
				</div>
				<div>
					<p class="text-center font-1">You need a new phone anyway!</p>
				</div>
			</div>
		</Marquee>
	</div>
	<div class="hero w-full h-[80vh]">
		<div class="hero-content flex-col text-center">
			<!-- <h1 class="font-1 text-5xl font-bold">Chuck that thang!!</h1> -->
            <img src="/logo.apng" alt="" class="h-40">

			<div class="mt-2 flex font-1 flex-col gap-2">
				{#if isIOS}
					<div class="fixed top-0 left-0 z-50 h-screen w-full bg-black opacity-75"></div>

					<div class="absolute z-60 top-[10%] left-0 text-left p-4">
						<p class="font-2 text-xl font-extrabold mb-2 text-center">
							I think your accelerometer's broken. Can I check?
						</p>

						<div class="bg-base-300 p-10 mt-4">
							<p class=" text-center">Please accept our permissions to see our magic.</p>

							<button class="btn btn-primary mx-auto w-full mt-4" onclick={requestMotionPermission}>
								Accept Permissions
							</button>
						</div>
						<p class="text-center mt-2">We wont hack you. I promise🥺</p>
					</div>
				{/if}
                <a class="btn text-lg btn-primary scale-150 my-3" href="/lobby"
					>Head-to-head<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path
							fillRule="evenodd"
							d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0a.75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.06 0c-4.98-4.979-13.053-4.979-18.032 0a.75.75 0 0 1-1.06 0l-.53-.53a.75.75 0 0 1 0-1.06Zm3.182 3.182c4.1-4.1 10.749-4.1 14.85 0a.75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.062 0 8.25 8.25 0 0 0-11.667 0 .75.75 0 0 1-1.06 0l-.53-.53a.75.75 0 0 1 0-1.06Zm3.204 3.182a6 6 0 0 1 8.486 0 .75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.061 0 3.75 3.75 0 0 0-5.304 0 .75.75 0 0 1-1.06 0l-.53-.53a.75.75 0 0 1 0-1.06Zm3.182 3.182a1.5 1.5 0 0 1 2.122 0 .75.75 0 0 1 0 1.061l-.53.53a.75.75 0 0 1-1.061 0l-.53-.53a.75.75 0 0 1 0-1.06Z"
							clipRule="evenodd"
						/>
					</svg>
				</a>
				<a class="btn text-lg btn-outline scale-150 my-3" href="/local">
					Pass and Play<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
						<path
							fillRule="evenodd"
							d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
							clipRule="evenodd"
						/>
					</svg>
				</a>
				<p class="text-3xl">or</p>
                <a class="btn text-lg btn-outline scale-150 my-3" href="/singleplayer">
					Singleplayer<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>                      
				</a>
			</div>
			<button class="text-xl underline cursor-pointer absolute text-center bottom-8" onclick={() => document.getElementById("what-is-this").style.display = "initial"}>What is this?</button>
		</div>
	</div>
</div>

<style>
	:global(#markdown a) {
		text-decoration: underline;
		color: #ffcb30;
	}
	:global(#markdown strong) {
		font-size: 1.1em;
	}
</style>