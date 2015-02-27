---
layout: post
title: Buddhabrot?
---

![Buddhabrot with a maximum of 10 iterations](/assets/buddhabrot10.png)

So, if you haven't been able to tell from the sidebar already, I do a lot of stuff with fractals, for two reasons: first, they present a fun challenge to parallelize and can be incredibly satisfying to get working, and second, they make pretty pictures!ting them by hand would
The second one was particularly important when I found [the Wikipedia article on Buddhabrot](https://en.wikipedia.org/wiki/Buddhabrot) one night about four years ago. I decided it looked so cool that I was gonna code it the very next day! A week later, I had a somewhat-working implementation written in Java (since it was the only language I knew at the time) using [JOCL](http://www.jocl.org/). It was fast, but the images it produced were downright garbage since I had zero knowledge of parallel programming other than "it made things faster".

Over this past winter break, I had a ton of time and nothing to do, so I decided to revive the project in C. I had just aced a parallel programming class, so I had the knowledge I lacked when I tried so long ago. I ended up pulling it off, learning a ton in the process.

<!--more-->

Fractals 101
------------

Fractals are just mathematically-generated images with infinite complexity. That is, no matter how far you zoom in, you'll always see more detail. The beautiful part of them is that they're usually extremely simple to describe. Jonathan Coulton even explained the Mandelbrot set in just a few lines [of his eponymous song](https://www.youtube.com/watch?v=AGUlJus5kpY):

> Just take a point called z in the complex plane,
>
> Let z<sub>1</sub> be z<sup>2</sup>+z,
>
> z<sub>2</sub> is z<sub>1</sub><sup>2</sup>+z,
>
> z<sub>3</sub> is z<sub>2</sub><sup>2</sup>+z, and so on
>
> If the series of z<sub>(n)</sub> will always stay,
>
> Close to z and never trend away,
>
> That point is in the Mandelbrot set.

As you may have guessed from the name, the Buddhabrot set is very closely related to the Mandelbrot set. The only difference is that the Buddhabrot set records and plots every value of z on the image rather than simply using them to determine a point's membership in the set. This tiny tweak to the formula makes it much more difficult to compute in parallel because it requires multiple threads to potentially access the same pixel's data, a problem known as a race condition. The Mandelbrot set, on the other hand, computes each pixel independently of all other pixels, making that computation embarrasingly parallel and much easier to execute.

Racy Operations
---------------

Since Buddhabrot requires each thread to access and increment arbitrary "pixels" on the output, a race condition can crop up. You can actually see the result if you check the "Unsafe Mode" box in Pbrot and crank up the number of threads. The result is nearly identical to the default, race condition-free image because of the sheer size of the problem, but I saw an opportunity to investigate different methods to avoid it and decided to try.

I ran some tests using OpenMP's two built-in synchronization constructs, `atomic` and `critical`, as well as my own solution and the baseline. Pbrot only accesses the array in one line, so here it is with `atomic`:

{% highlight c %}
#pragma omp atomic
	grid[coord]++;
{% endhighlight %}

And `critical`:

{% highlight c %}
#pragma omp critical
{
	grid[coord]++;
}
{% endhighlight %}

The solution that I made up was simply to give each thread its own copy of the output grid, then combine them together at the end. This avoids the overhead of OpenMP's synchronization implementations, but requires far more memory. Its code is also a little more complex, but still not hard:

{% highlight c %}
for (k = 0; k < numThreads; k++) {
	grid[k] = malloc(sizeof(OMPbucket_t) * gridSize * gridSize);
}

// ...

grid[threadNum][coord]++;
{% endhighlight %}

Now that we have our code, let's take a look at the results! [^1]

![Results of race condition avoidance methods](/assets/raceresults.png)

| Method                  | Time (s) | Time (relative) |
|-------------------------|----------|-----------------|
| Unsafe (race condition) | 44.887   | 1.000           |
| Atomic                  | 369.747  | 8.232           |
| Critical                | 426.404  | 9.499           |
| Independent grids       | 56.307   | 1.254           |

Right away, we can see that atomic operations and critical sections are much, much slower than our baseline. An 8x performance penalty is unacceptable. I don't know enough about the implementation of atomic operations or mutexes on x86 processors to take a guess as to why their performance is so bad. The slight performance degradation in the independent grids approach is easily explained by caching; running this test with a smaller grid size but higher supersampling gives virtually identical results for the unsafe and independent grid runs.

More to come! I'm writing this in my free time.

[^1]: Tests performed on an Intel Core i5-4460 with 8 GB DDR3-1866 and EVGA GeForce GTX 970 with 347.52 drivers on Windows 8.1 Pro x64.