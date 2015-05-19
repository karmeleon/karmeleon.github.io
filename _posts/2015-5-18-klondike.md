---
layout: post
title: I take games way too seriously
---

So, I'm bad at Solitaire. Like, [_really bad_](https://imgur.com/3ErkH5f). However, I'm good at writing code and just took an algorithms course this semester, so one afternoon I decided to make up for my complete lack of card game strategy with brute force. About twelve hours later, I had a working Klondike generator and solver. Unfortunately, it doesn't seem to solve many initial states, but I'm not sure if that's because my code is bad or because the shuffling routine I use is just really good at making unsolveable decks.

Whatever the reason is, it's pretty fast at calculating moves due to a multithreaded architecture and a thread-safe priority queue that allows for a sort of hill-climbing algorithm. It often gets stuck in local maxima, though, but I think that's just due to the nature of Klondike.

On a related note, it's almost the 25<sup>th</sup> birthday of Windows 3.0, the first version of Windows to include the familiar card game. Happy birthday, you dinosaur.

The code is [here](https://github.com/shawnwalton/SolitaireSolver).
