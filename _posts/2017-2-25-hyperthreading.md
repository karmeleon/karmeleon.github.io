---
layout: post
title: Hyperthreading in 2017
---

Hyperthreading has had a long, albeit checkered past in Intel's CPUs. Originally launched in 2002 on that year's revisions of the Pentium 4 and Xeon, it was great in theory, but a combination of an immature hardware implementation and [several games](http://www.tweakguides.com/SWB2_1.html) not [being programmed](http://www.ign.com/boards/threads/thief-keeps-crashing.85890687/) for the [pseudo-multicore CPUs](https://software.intel.com/en-us/forums/intel-moderncode-for-parallel-architectures/topic/310118) meant the initial incarnation of HT often caused more headaches than performance gains. Later revisions of the Netburst microarchitecture as well as newer, SMT-aware software eventually resolved these problems, but the feature went the way of the buffalo with the release of the Core line of CPUs in 2006. It wasn't until Nehalem in late 2008 that the feature returned, with a supposedly more mature implementation of the feature. Despite it being present on every Core m and i7 processor released since, as well as many Atoms, i3s, and i5s, plus almost all Xeons, I wasn't able to find any hard data on what kind of performance gains it brought. So naturally, I decided to gather some myself.

<!--more-->

HT: A Primer
------------

Hyperthreading is a hardware feature that allows the OS to schedule two software threads on a single physical CPU core. This is made possible by the superscalar architecture of virtually all modern x86 and POWER implementations. The idea is that each CPU core has several different execution units in it -- integer math, floating point math, vector units, memory units, and more -- often with two or more of each. Software tends to be unable to fill all of these simultaneously, meaning those extra units sit unused. Hyperthreading allows a second thread to run at the same time as the first, using the otherwise idle execution resources to perform other work. One could imagine a video game where one thread is performing floating point-heavy operations such as physics while another is running integer-focused AI code; this is a prime example of a situation where HT could show significant performance gains. Programs that have lots of unpredictable memory accesses can benefit as well, since HT can run a second thread while the first thread is waiting on a slow memory access before it can continue execution.

Software
--------

I've chosen a variety of games and other software to get a wide picture of any possible performance impact that HT may have. Frame time data for games will be collected with FRAPS, and all tests will be run with [pcm](https://github.com/opcm/pcm), a really cool program that measures actual IPC across all cores and threads. Games will be run in 1080p using the "Low" presets with V-Sync off using their built-in benchmarking tools to reduce the GPU bottleneck. Where applicable, they'll be run in DirectX 11 mode, since FRAPS can't handle DirectX 12 yet.

* Grand Theft Auto V
* HITMAN (2016)
* Deus Ex: Mankind Divided
* Handbrake
* 7-Zip
* Cinebench R15.038
* [Pbrot](https://github.com/karmeleon/Pbrot) in CPU OpenCL mode

Test Setup
----------

|               |                               |
|---------------|-------------------------------|
| CPU           | Intel Core i7-4790K @4.7 GHz  |
| Cooler        | Corsair H100i GTX             |
| Memory        | 16 GB DDR3-2133               |
| GPU           | AMD R9 Fury @1070/570 MHz     |
| Storage (SSD) | Samsung 950 Pro 512 GB        |
| Storage (HDD) | WD Blue 1 TB (7200 RPM)       |
| OS            | Windows 10 Pro x64 build 1607 |

I'll run each test with HT on as well as switched off in the BIOS.

Without further ado, the benchmarks!

Grand Theft Auto V
------------------

Open-world games are traditionally heavy on the CPU, and Rockstar Games' most recent title is no exception. Crowds of pedesetrians, extensive draw distance, and real-time streaming of terrain and texture data from disk all contribute to an excellent game that can bring even the most powerful CPU to its knees. While I used the "Low" preset here, I did crank up Extended Distance Scaling, High Detail Streaming while Flying, Population Density, Population Variety, and Distance Scaling, as they contribute even more to the CPU load.

|                | HT       | noHT    |
|----------------|----------|---------|
| FPS            | 73.18    | 70.36   |
| 99% Frame Time | 18.77 ms | 17.7 ms |
| IPC            | 6.296    | 4.000   |

(pls excuse the graphs not lining up, Google Sheets is a pain in the ass to work with)

![GTAV frame times](/assets/HT/GTAV.svg)

Hyperthreading caused some small, but measurable gains in mean FPS (4.00%), but a small increase in 99% frame times as well, manifesting in a "fuzzier" frame time graph (6.04%). I'm not sure what happened here, but it might be a result of only running one trial in the interest of time. The significantly increased IPC didn't really seem to affect much here.

HITMAN (2016)
-------------

Built on their proprietary Glacier engine, IO Interactive's return to the World of Assassination features exquisitely detailed maps, huge crowds of NPCs, and an amazing lighting model. The mass number of NPCs in the Paris map in particular cause the most CPU load, [as shown by the Xbox One's more powerful CPU putting it ahead of the PS4's faster GPU in the console version](https://www.youtube.com/watch?v=WZNOFBU9zsY).

|                | HT       | noHT     |
|----------------|----------|----------|
| FPS            | 80.43    | 68.88    |
| 99% Frame Time | 15.90 ms | 19.05 ms |
| IPC            | 4.92     | 3.26     |

![HITMAN frame times](/assets/HT/HITMAN.svg)

HITMAN loves its threads! Multithreading increased mean FPS by 16.76% and decreased 99% frame time by 16.53%, which is easily visible in the graphs as being much less noisy with HT on. IO's done a great job of designing its engine to scale with high thread count, and this densely-populated map makes the most of it.

Deus Ex: Mankind Divided
------------------------

Deus Ex: Mankind Divided is another Square Enix-published game, this time based on Eidos Montreal's Dawn Engine and ported to the PC by longtime partner Nixxes Software. This game's benchmark mode doesn't have nearly the scale or NPC headcount as the previous two games, so it should be interesting to contrast it with them.

|                | HT       | noHT     |
|----------------|----------|----------|
| FPS            | 72.00    | 69.22    |
| 99% Frame Time | 15.94 ms | 17.46 ms |
| IPC            | 3.424    | 2.532    |

![Deus Ex: Mankind Divided frame times](/assets/HT/DXMD.svg)

Activating HT boosted average FPS by 4.01%, but decreased 99% frame times by a much greater 8.70%. This change manifests itself in-game as somewhat decreased judder, though the improvement isn't as great as HITMAN's. This game doesn't seem to be as CPU-heavy as the previous two, so it makes sense that the extra threads won't help a whole lot.

Handbrake
---------

Perennial favorite of home theater and iPad owners alike, Handbrake is the gold standard for CPU-based video transcoding. For this test, I'll be converting the 2160p version of [Tears of Steel](https://mango.blender.org/) to 1080p H.265 at the Fast 1080p30 preset.

|                | HT    | noHT  |
|----------------|-------|-------|
| Transcode time | 18:19 | 18:39 |
| IPC            | 8.72  | 7.468 |


Handbrake didn't seem to care about the extra threads much at all. Transcode times decreased by only 1.78%, within the margin of error, despite the much larger boost to IPC. My guess is each block of video data fits well within the CPU's cache, not leaving many slow main memory accesses for the secondary threads to capitalize on. The high IPC seems to agree; it's significantly above the next-highest test result, indicative of very few bubbles in the CPU pipeline.

7-Zip
-----

My personal archive manager of choice comes with a built-in benchmarking mode, which generates a stream of data that is then compressed and decompressed using the LZMA algorithm. LZMA has a lot of unpredictable RAM accesses, which Hyperthreading should be able to take advantage of to great effect.

|            | HT         | noHT       |
|------------|------------|------------|
| 7-Zip MIPS | 25807 MIPS | 19682 MIPS |
| IPC        | 6.224      | 4.872      |

[The official benchmark page](http://www.7-cpu.com/) explains that Hyperthreading leads to a large boost in performance in this test due to the code's branchy nature. Indeed, we see a huge 31.12% increase in MIPS on this benchmark.

Cinebench R15
-------------

While both of the previous CPU tests used integer math almost exclusively, Cinebench's raytracer relies heavily on floating-point math. I'm not sure what kind of memory access patterns are involved, so let's just run it and see what happens, shall we?

|       | HT     | noHT   |
|-------|--------|--------|
| Score | 894 cb | 691 cb |
| IPC   | 7.008  | 5.26   |

I'll admit, this one surprised me a bit. I guessed before I ran the test that it'd be like Handbrake: math-heavy, non-branchy, and totally indifferent of the extra threads as a result. But the 29.37% increase in points shows that at least one of those assumptions is false, possibly both!

Pbrot
-----

My self-penned Buddhabrot renderer is floating-point heavy and has a lot of uncacheable memory accesses, which I wrote extensively about [here](/2015/02/21/buddhabrot/). I used the default settings, but with 5x supersampling.

|                 | HT       | noHT     |
|-----------------|----------|----------|
| Completion Time | 22.803 s | 30.896 s |
| IPC             | 7.928    | 5.832    |

As expected, having a pair of threads executing on each core, covering for each other's rampant cache misses led to a healthy 26.19% decrease in rendering time.

Conclusion
----------

|               | Improvement |
|---------------|-------------|
| GTAV FPS      | +4.00%      |
| GTAV 99%      | -6.04%      |
| HITMAN FPS    | +16.76%     |
| HITMAN 99%    | +16.53%     |
| DX:HR FPS     | +4.01%      |
| DX:HR 99%     | +8.70%      |
| Handbrake     | +1.78%      |
| 7-Zip         | +31.12%     |
| Cinebench R15 | +29.37%     |
| Pbrot         | +26.19%     |

With the exception of GTAV's 99% frame times and the Handbrake encoding test, Hyperthreading had a significant positive impact on performance. I'm personally surprised with how much HITMAN and the synthetics improved; I expected a ~10% improvement at most, with most tests being totally indifferent to the feature. I'm happy to be proven wrong here and glad that Intel's second stab at SMT went so much better than it did back in the Netburst days.

So is stepping up from the i5 to the i7 in your next build worth it? Maybe. Using Intel's latest i5-7600K and i7-7700K as examples, you'll pay an extra $100 for Hyperthreading, 300 MHz of boost clock speed, and 2 MB of L3 cache. With a good cooler both will overclock to the same ~5.0 GHz, so you're really paying for that L3 and HT. I wasn't able to find numbers on the impact of L3 cache on the likes of Cinebench or Handbrake, but [this link](http://wccftech.com/intel-amd-l3-cache-gaming-benchmarks/) shows that the performance gap between 6 MB and 8 MB is only a couple percent. That leaves Hyperthreading as the single real advantage, but these tests show that it does actually have a large impact depending on what you plan to do with it. I don't know if the extra $100 is worth the ~10% or so average boost in FPS, but if I were doing a lot of raytracing or compression that bonus 30% performance looks very tempting.

AMD's new Ryzen CPUs are rumored to have an even more effective SMT implementation than Kaby Lake, so I'll be interested to see what kind of benefits it brings to the already heavily-multithreaded 8-core chips.