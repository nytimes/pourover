// #Basic PourOver example
// This will cover the creation of a collection and the basic use of filters, views, and sorts

// ###Data

// Let's start with a nice array of data. All PourOver collections *must* be instantiated on
// arrays of hashes like the following, each item a hash of attributes.
var monsters = [{name: "sphinx", mythology: "greek", eyes: 2, sex: "f", hobbies: ["riddles","sitting","being a wonder"]},
                {name: "hydra", mythology: "greek", eyes: 18, sex: "m", hobbies: ["coiling","terrorizing","growing"]},
                {name: "huldra", mythology: "norse", eyes: 2, sex: "f", hobbies: ["luring","terrorizing"]},
                {name: "cyclops", mythology: "greek", eyes: 1, sex: "m", hobbies: ["staring","terrorizing"]},
                {name: "fenrir", mythology: "norse", eyes: 2, sex: "m", hobbies: ["growing","god-killing"]},
                {name: "medusa",  mythology: "greek", eyes: 2, sex: "f", hobbies: ["coiling","staring"]}];

// ###Collection creation

// We create a new PourOver collection by passing the data array into the `PourOver.Collection` constructor.
var collection = new PourOver.Collection(monsters);

// ###Filter creation

// To do anything interesting with collections, we -- almost always -- need to add some filters. 
// The most common filter is the exactFilter, a filter that describes an attribute that is satisfied by exactly
// one choice of several possibilities. For example, in the above example, the "mythology" attribute has two possibilities:
// "greek" or "norse". Every item has the value "greek" or "norse" for its mythology.
// *NOTE: `exactFilter`s' names must be identical to the item attribute that they index*
//
// For the most common filter types, such as "exactFilter", PourOver ships with convenience constructors.
// *NOTE: Constructors for preset filters and sorts -- like the ones below -- are not initialized with "new".
// They are simply passed a name and the set of possibilities.*
var mythology_filter = PourOver.makeExactFilter("mythology", ["greek","norse"]);
var gender_filter = PourOver.makeExactFilter("sex", ["m","f"]);

// Now, we will construct the other most-common filter, the `inclusionFilter`. The `inclusionFilter` is similar to the `exactFilter`.
// However, rather than items have a single choice, `inclusionFilter`s describe attributes that can have multiple choices per item.
// *NOTE: `inclusionFilter`s' names must be identical to the item attribute that they index*
var hobbies_filter = PourOver.makeInclusionFilter("hobbies",["riddles",
                                                             "sitting",
                                                             "being a wonder",
                                                             "coiling",
                                                             "terrorizing",
                                                             "growing",
                                                             "luring",
                                                             "staring",
                                                             "god-killing"]);

// ###Adding filters

// After constructing our filters, we have to add them to the collection. This will causes the filters to index
// the collection, pre-computing which collection elements satisfy each possibility's predicate. For exact filters, the
// predicate is equality; a collection item satisfies a possibility if it's value is equal to the value of the possibility.
//
// Adding a filter to a collection will also tell the filter to smartly reconstruct itself when items are added to, removed from, or
// updated in the collection.
collection.addFilters([mythology_filter, gender_filter, hobbies_filter]);

// ###Non-stateful (pure) querying of filters

// Now that we have a nice set of filters, we would like to do something interesting: query them and combine the queries into more
// complex queries. PourOver supports both pure and stateful queries. We will cover the former first.

// Here we see that we query `exactFilter`s and `inclusionFilter`s the same way, by passing in the value for which we would like to search.
// *NOTE: Always access the filter through the `collection.filters` object. Do not use the "foo_filter" that you initialized earlier. When 
// you add filters to a collection, the filter gets cloned first. Querying the original filters, the pre-added filters, will not work.* 
var greek_monsters = collection.filters.mythology.getFn("greek");
var terror_monsters = collection.filters.hobbies.getFn("terrorizing");

// Querying filters returns a `MatchSet`, an objects that wraps a result and can be combined -- AND, OR, NOT -- with other `MatchSets`.
// The boolean combinations will also return `MatchSet`s and can, in turn, be further combined.
var greek_terrors = greek_monsters.and(terror_monsters);

// To get the value of a MatchSet, simply access its `cids` -- read "collection ids" -- property. These cids can be passed to a collection's `get`
// function to transform the cids into the actual objects they represent.
// The value of my_monsters will be:
//
//     [{"name":"hydra","mythology":"greek","eyes":18,"sex":"m","hobbies":["coiling","terrorizing","growing"],"cid":1},
//      {"name":"cyclops","mythology":"greek","eyes":1,"sex":"m","hobbies":["staring","terrorizing"],"cid":3}]
var my_monsters = collection.get(greek_terrors.cids);

// ###Stateful querying

// Pure queries are always nice but they don't map nicely to the core use case for PourOver: 
// modelling UI's in which users query a collection by clicking, sliding, scrubbing and editing
// controls. You will want to remember what their current query is. Otherwise, you'd lose their work!
// 
// Stateful queries are very similar to pure queries. You just use the `query` method of a filter instead of the `getFn` method.
// This will store the result of the query  on the `current_query` attribute of the filter.
collection.filters.mythology.query("greek");
collection.filters.hobbies.query("terrorizing");
var getCurrentMonsters = function(){
    var myth_set = collection.filters.mythology.current_query,
        hobby_set = collection.filters.hobbies.current_query,
        output_set = myth_set.and(hobby_set);

    return collection.get(output_set.cids);
}

// Now, whenever a user queries a filter (through some currently undefined UI action), we can just call `getCurrentMonsters()`
// and get the current set of monsters, filtered by mythology and hobbies. By default, an unqueried filter or empty query 
// returns a match set representing the entire collection. This means that intersections and unions will work regardless of 
// whether or not a query has been made.
// 
// But something is missing. We don't want to have to write `getCurrentMonsters` everytime we make an app. 
// Also, it would be nice if we could cache the *result* of getCurrentMonsters to speed up subsequent renders.
// Moreover, we don't have any way (yet) to page through results or sort them.
//
// Enter views ... 

// ### Views

// In PourOver, a View is used to cache the combination of many queries, paging through and sorting the results.
//
// To construct a View, we pass a name and a collection into the constructor.
var view = new PourOver.View("default_view", collection);

// Whenever a stateful query occurs, the View will update its cached `MatchSet` with the result of its `selectionFn`. This 
// describes how a View should combine the filters on a collection. The default View selectionFn simply intersects all the
// collection's filters together. This should cover the standard use case of a UI in which each control maps to a filter.
// If a user selects "greek" for "mythology" and "terrorizing" for "hobbies", she expects the result to be all monsters which are
// Greek AND terrorize, the intersection of all the filters. (Sex will also be intersected but, since it hasn't been queried in 
// our example, it will not affect the result of the intersection)
//
// To get this cached result of a `View`, call the `getCurrentItems` method;
var current_monsters = view.getCurrentItems();

// ### Paging Views

// Views nicely abstract over the paging pattern. By default, Views have an infinite page size. To set a smaller page size, either:

// -1. pass in a `page_size`: [int] option to the constructor
var paged_view_1 = new PourOver.View("paged_view", collection, {page_size: 1});

// -2. extend `PourOver.View`, override the `page_size` attribute and instantiate your new View type
var PagedView = PourOver.View.extend({
    page_size: 1
});
var paged_view_2 = new PagedView("paged_view_2", collection);

// Once instantiated with a page_size attribute, we can call `page` and `pageTo` methods to move around in the `View`. 
// `getCurrentItems` will automatically respect the current page. 
// `page(n)` moves the current_page n pages forward. (Negative n pages backwards)
// `pageTo(cid)` finds which page a cid is on and changes the page to that page

// Page one to the right
paged_view_1.page(1);

// Page to the third item in the collection (cid #2)
paged_view_1.pageTo(2);

// ### Events

// All changes, queries, etc. trigger PourOver events. Most of the time, you only need to care about the View event "update".
// This gets fired whenever something happens that would require a re-render (queries, addition, removals, etc.)
// *NOTE: "render" is nothing special in PourOver. A common pattern is just to define render function for your view.*

paged_view_1.on("update",function(){
   paged_view_1.render(); 
})

// ### Conclusion
// This example should cover 90% of use cases for PourOver. For more complicated behavior.
// - the "advanced_views" example will demonstrate sorting, the creation of custom selectionFns, and other arcana
// - the "advanced_filters" example will explain the default filters and demonstrate how to create a new filter type
// - the "buffering" example will demonstate how to use BufferedCollection and BufferedViews to lazily load non-categorical data
// - the "events" example will demonstrate how to plug into the overly complex event system and uses silent updating to optimize queries
// - the "ui" example will demonstrate how to use the PourOver.UI module to simplify the making of UIs
