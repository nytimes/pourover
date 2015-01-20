// #Advanced Views
// This example will cover how to create and add sorts to collections, how to create custom view types with
// custom selectionFns, and some common PourOver view tricks

// First, let's use our set up from the [basic example](/pourover/examples/examples_build/basic_pourover_ing.html)

var monsters = [{name: "sphinx", mythology: "greek", eyes: 2, sex: "f", hobbies: ["riddles","sitting","being a wonder"]},
                {name: "hydra", mythology: "greek", eyes: 18, sex: "m", hobbies: ["coiling","terrorizing","growing"]},
                {name: "huldra", mythology: "norse", eyes: 2, sex: "f", hobbies: ["luring","terrorizing"]},
                {name: "cyclops", mythology: "greek", eyes: 1, sex: "m", hobbies: ["staring","terrorizing"]},
                {name: "fenrir", mythology: "norse", eyes: 2, sex: "m", hobbies: ["growing","god-killing"]},
                {name: "medusa",  mythology: "greek", eyes: 2, sex: "f", hobbies: ["coiling","staring"]}];

var collection = new PourOver.Collection(monsters);

var mythology_filter = PourOver.makeExactFilter("mythology", ["greek","norse"]);
var gender_filter = PourOver.makeExactFilter("sex", ["m","f"]);
var hobbies_filter = PourOver.makeInclusionFilter("hobbies",["riddles",
                                                             "sitting",
                                                             "being a wonder",
                                                             "coiling",
                                                             "terrorizing",
                                                             "growing",
                                                             "luring",
                                                             "staring",
                                                             "god-killing"]);

collection.addFilters([mythology_filter, gender_filter, hobbies_filter]);

var view = new PourOver.View("default_view", collection);

// ### Sorting

// #### Creating a custom sort
// To create a custom sort, we generally extend the Sort object with a `fn`, the comparator function used to order items.
// We also specify which attribute the sort operates over -- what it sorts with respect to --  with the `attr` attribute.
// Then, we instantiate our new sort. This attr field has no special signifigance other than convention. You must still
// manually extract values in your sort function.
var RevNameSort = PourOver.Sort.extend({
    fn: function(a,b){
        var x = a.name, y = b.name;    
        if (y < x){
          return -1;
        } else if (y > x){
          return 1;
        } else {
          return 0;
        }
    }
});

// We create a new sort and we associate it with attrs, so that when those attributes change -- if an item's name can change --
// then the sort will rebuild itself.
var rev_name_sort = new RevNameSort("rev_name", {associated_attrs: ["name"]});

// Like we do with filters, we add the sort to the collection. This indexes the sort of the current items. Additionally, `addSorts` 
// binds collection changes to a re-sorting operation.

collection.addSorts([rev_name_sort]);

// Once we have added the sort we can call the `setSort` method of a view with the name of a sort that has been added to its collection.
// Even though sorts are added to collections, every view can set its sort independently.

view.setSort("rev_name");

// Now, we when call `view.getCurrentItems`, the items will be sorted accordingly.
view.getCurrentItems();

// ### Sort Types

// PourOver ships with two default sorts, `explicitSort` and `reverseCidSort`

// `explicitSort` models a sort in which an explicit order of cids is passed. This is how we model
// orders that have no functional reference to items' attributes. `explicitSort`s are used for, among other things,
// user-defined orders or arbitrary orders.
// The `makeExplicitSort` constructor takes `(sort_name: String, collection: Collection, attribute_represented_in_order: String, order: [attribute])`
// Here, we define an explicit sort by passing in the order of the items, identified by their name attribute. 
// Generally, the attribute that you store an `explicitSort` on will be a GUID.

var my_slideshow_sort = PourOver.makeExplicitSort("my_slideshow_order",collection,"name",["hydra","huldra","medusa","cyclops","fenrir","sphinx"])

// `reverseCidSort` is the reverse of the default sort. It sorts your items in the reverse of the order in which they were put into the collection

var rev_cid_sort = PourOver.makeReverseCidSort("rev_sort",collection)
collection.addSorts([my_slideshow_sort,rev_cid_sort])
view.setSort("my_slideshow_order")

// ### Custom View types

// Changing our attention from sorts to the views they influence, how do we define custom views: views that combine their filters in a non-standard ways.
// Keeping with the Backbone-ese pattern of extension, we simply extend the `PourOver.View` object with a new selectionFn.
// *NOTE: The selectionFn must return a `MatchSet`, not a raw array of items. This `MatchSet` gets cached on the view for subsequent queries/renders.*
// Here, we create a custom view that takes the current query on "mythology" subtracts the current query on sex and ignores hobbies entirely. 
// This could model a UI in which the user selects a mythology facet to view, a sex to hide and is unable to filter on hobby.
var CustomView = PourOver.View.extend({
    selectionFn: function(){
        var mythology_query = collection.filters.mythology.current_query,
           sex_query  = collection.filters.sex.current_query;
        return mythology_query.not(sex_query);
    },
    render: function(){
        current_items = this.getCurrentItems();
        console.log(current_items);
    }
})
var custom_view = new CustomView("custom_view",collection);
custom_view.on("update",custom_view.render);

// Now, `custom_view.getCurrentItems()` will ignore the hobby query and return the result of the mythology query - that of sex.
// Whenever any query changes or the collection changes, the custom view will "render" this result

// ### Pattern: User favorites

// Say we wanted to have an app that renders a grid of items that users can filter. However, we also want to add a pop-up that will show the 
// items that users have starred. Can we do this with a single collection and multiple views?

// Absolutely.

// First, lets make a new collection so as to not interfere with the previous part of the example
var collection_two = new PourOver.Collection(monsters);

// Now, we will need three new objects: 
// - a filter that represents the objects a user has selected, a favorites filter
// - a grid view that intersects the hobby, mythology, and sex queries but ignores the favorites filter
// - a favorites view that ignores every filter but the favorites filter

// We use `manualFilter` to create the favorites filter. A `manualFilter` is exactly what it sounds like: a filter that you manually 
// control, adding and removing items to specify which items it selects.
var favorites_filter = PourOver.makeManualFilter("favorites");
collection_two.addFilters([mythology_filter, gender_filter, hobbies_filter, favorites_filter]);

// When a user favorites an item, say the 2nd and 4th items in our collection, the hydra and the cyclops (this would happen in a callback)
var user_selection_cids = [1,3];
collection_two.filters.favorites.addItems(user_selection_cids);

// Now, we make a grid view that ignores the favorites filter
var GridView = PourOver.View.extend({
    selectionFn: function(){
        var mythology_query = collection_two.filters.mythology.current_query,
            sex_query  = collection_two.filters.sex.current_query,
            hobbies_query = collection_two.filters.hobbies.current_query;
        return mythology_query.and(sex_query).and(hobbies_query);
    }
});
var grid_view = new GridView("grid_view",collection_two)

// Finally, we make a favorite view that only considers the favorites filter
var FavView = PourOver.View.extend({
    selectionFn: function(){
        return collection_two.filters.favorites.current_query;
    }
});
var fav_view = new FavView("fav_view",collection_two)

// Now, `grid_view.getCurrentItems()` will only be affected by queries on mythology, sex, or hobbies.
// `fav_view.getCurrentItems()` will only be affected by queries (`addItems` and `removeItems`) on the favorites filter
