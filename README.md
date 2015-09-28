**PourOver** is a library for simple, fast filtering and sorting of large collections -- think 100,000s of items -- in the browser. It allows you to build data-exploration apps and archives that run at 60fps, that don't have to to wait for a database call to render query results. 

PourOver is built around the ideal of simple queries that can be arbitrarily composed with each other, without having to recalculate their results. You can union, intersect, and difference queries. PourOver will remember how your queries were constructed and can smartly update them when items are added or modified. You also get useful features like collections that buffer their information periodically, views that page and cache, fast sorting, and much, much more. 

Visit [the PourOver homepage on Github pages](http://nytimes.github.io/pourover) for more info.

### Examples in the Wild

PourOver was created by the Interactive News group at the New York Times, and open-sourced in 2014.  We actively use it in production across a number of projects, including:

  * [Live Blogs](http://www.nytimes.com/live/republican-debate-election-2016-cleveland/)
  * [Red Carpet Project](http://www.nytimes.com/interactive/2014/02/02/fashion/red-carpet-project.html)
  * plus a number of internal admin tools that allow newsroom staff to edit and sort large collections of items.

### Maintenance and Upkeep

PourOver is in active, daily use in the newsroom.  As we make bugfixes and enhancements in the course of our NYT work, we'll push them into this repo.

We welcome suggestions and feedback via issues or pull requests, but a stable build and consistent API for internal NYT use is our primary goal.  We recognize that this may not accommodate all community uses or interests.

Contributor @hhsnopek has created a [community fork here](https://github.com/hhsnopek/pourover) intended for a broader developer audience.

### Dependencies

[Underscore.js](http://underscorejs.org/) is the only dependency.
Optionally, you may use [Lo-dash](https://lodash.com/) instead of underscore.

### Browser Support

PourOver should work in any browser that underscore works in.
It has been tested in: 

- IE7+ 
- Firefox 4+
- Safari 5+
- Opera 9+
- Chrome 1+
