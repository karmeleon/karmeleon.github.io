---
layout: post
title: Chrome and gradients are not friends.
---

While I was making this site, I discovered that Chrome has a bug with really tall gradients. To see what I mean, open up [this long post]({% post_url 2015-2-21-buddhabrot %}) and look at the upper left-hand corner. The excerpt on the page and the sidebar work fine because they're shorter. [This codepen](http://codepen.io/anon/pen/KwBwBp) demonstrates the issue as well. IE11 has no problem with it and while Firefox blurs the sharp edge pretty badly, it does show up. The chrome team has known about this for [about two years now](https://code.google.com/p/chromium/issues/detail?id=177293). I guess I'll have to find a workaround until they get it fixed.