<h1 align='center'>Pourover</h1>

<p align="center">
  <a href="https://nodei.co/npm/pourover/">
    <img src="https://nodei.co/npm/pourover.png?downloads=true">  
  </a>
</p>

<p align="center">
  <a title='NPM version' href="http://badge.fury.io/js/pourover">
    <img src='http://img.shields.io/npm/v/pourover.svg?style=flat' />
  </a>
  <a title='Build Status' href="https://travis-ci.org/hhsnopek/pourover">
    <img src='http://img.shields.io/travis/hhsnopek/pourover.svg?style=flat' />
  </a>
  <a href="https://gitter.im/hhsnopek/pourover?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
  <img alt="Join the chat at https://gitter.im/hhsnopek/pourover" src="https://badges.gitter.im/Join%20Chat.svg"/>
  </a>
</p>

**PourOver** is a library for simple, fast filtering and sorting of large collections -- think 100,000s of items -- in the browser. It allows you to build data-exploration apps and archives that run at 60fps, that don't have to to wait for a database call to render query results.

PourOver is built around the ideal of simple queries that can be arbitrarily composed with each other, without having to recalculate their results. You can union, intersect, and difference queries. PourOver will remember how your queries were constructed and can smartly update them when items are added or modified. You also get useful features like collections that buffer their information periodically, views that page and cache, fast sorting, and much, much more.

Visit [the PourOver homepage on Github pages](http://nytimes.github.io/pourover) for more info.

## Usage
Install through preferred package manager:
- npm: `npm install pourover`
- bower: `bower install pourover`
- component: `component install hhsnopek/pourover`

### Dependencies
[Underscore.js](http://underscorejs.org/) is the only dependency. Optionally, you may use [Lo-dash](https://lodash.com/) instead of underscore.

Then require `pourover` and `underscore`/`lodash` into your project script and you're all set!



## Browser Support
PourOver should work in any browser that underscore works in. It has been tested in:
- IE7+
- Firefox 4+
- Safari 5+
- Opera 9+
- Chrome 1+

## Notice
This repo contains upstream changes that weren't verified by [NYTimes](//github.com/NYTimes) developers. I attempted contact the original developers of PourOver for changes to be looked at or add myself or others as maintainers, but was unable to receive a response. There is an issue present in [NYTimes/pourover](//github.com/NYTimes/pourover/issues/56) that contains an open issue regarding this.
