---
layout: post
title: Quick note on Webdriverio
category: webdriverio
---

The web team at TigerText uses CucumberJS, Selenium, and Webdriverio for its unit tests. However, I was unable to get it to run on my machine; Selenium would open a Chrome window to the url "data;,", then do nothing. After hours of Googling and headaches, the problem ended up being that some of the files the tests use had syntax errors in them. Webdriverio didn't spit out any error messages whatsoever, which made finding the problem difficult. I couldn't find any mention of this on the internet, so I thought I'd post my findings for the good of everyone.

Happy unit testing.
