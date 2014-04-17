**PourOver** is a library for simple, fast filtering and sorting of large collections -- think 100,000s of items -- in the browser. It allows you to build data-exploration apps and archives that run at 60fps, that don't have to to wait for a database call to render query results. 

PourOver is built around the ideal of simple queries that can be arbitrarily composed with each other, without having to recalculate their results. You can union, intersect, and difference queries. PourOver will remember how your queries were constructed and can smartly update them when items are added or modified. You also get useful features like collections that buffer their information periodically, views that page and cache, fast sorting, and much, much more. 


Visit [the PourOver homepage on Github pages](http://nytimes.github.io/pourover) for more info.


[Underscore.js](http://underscorejs.org/) is the only dependency.

PourOver should work in any browser that underscore works in.
It has been tested in: 

- IE7+ 
- Firefox 4+
- Safari 5+
- Opera 9+
- Chrome 1+
