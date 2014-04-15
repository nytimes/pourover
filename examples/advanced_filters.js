// # Advanced filters
// This example will cover the preset filter types and demonstrate how to create custom filter types.

// First, let's use our set up from the [basic example](/pourover/examples/examples_build/basic_pourover_ing.html)

var monsters = [{name: "sphinx", mythology: "greek", eyes: 2, sex: "f", hobbies: ["riddles","sitting","being a wonder"]},
                {name: "hydra", mythology: "greek", eyes: 18, sex: "m", hobbies: ["coiling","terrorizing","growing"]},
                {name: "huldra", mythology: "norse", eyes: 2, sex: "f", hobbies: ["luring","terrorizing"]},
                {name: "cyclops", mythology: "greek", eyes: 1, sex: "m", hobbies: ["staring","terrorizing"]},
                {name: "fenrir", mythology: "norse", eyes: 2, sex: "m", hobbies: ["growing","god-killing"]},
                {name: "medusa",  mythology: "greek", eyes: 2, sex: "f", hobbies: ["coiling","staring"]}];

var collection = new PourOver.Collection(monsters);

// ### Preset Filters 

// We have already seen `exactFilter` and `inclusionFilter` in the [basic example](/pourover/examples/examples_build/basic_pourover_ing.html).
// *NOTE: `exactFilter`s' and `inclusionFilter`s' names must be identical to the item attribute that they index*
// We have seen `manualFilter` in the [advanced views example](/pourover/examples/examples_build/advanced_views.html)
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
var favorites_filter = PourOver.makeManualFilter("favorites");
collection.addFilters([mythology_filter, gender_filter, hobbies_filter, favorites_filter]);

// There are two more preset filters which are related to each other:
// - `rangeFilter` : Possibilities are inclusive, numerical ranges ([[1,5],[6,10]]), queries can only be one of these exact ranges 
// and they return all items, whose relevant attribute falls between the extents of the range
// - `dvrangeFilter` : Possibilities are an ordered set of values ([1,2,3,4,5,6,7,8,9,10]), queries are any lower and upper bound for the
// sorted set of possibilites and they return all items, whose relevant attribute falls between the extents of the range
// 
// Range filters are more efficient than dvrangeFilters for wide domains ([[1,10000],[10001,100000]]). They trade efficiency for flexibility; you can only query by the
// preset ranges
//
// *NOTE: Range filters must be numeric. DvrangeFilters can be any sorted set, it determines a range based on index.*

// Here we create two eyes filters. One for each of the range filter types.
var eyes_range_filter = PourOver.makeRangeFilter("eyes_range",[[1,1],[2,10],[11,20]],{attr: "eyes"})
var eyes_dvrange_filter = PourOver.makeDVrangeFilter("eyes_dvrange",[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],{attr: "eyes"})
collection.addFilters([eyes_range_filter,eyes_dvrange_filter])

// To get all 2-10 eyed monsters
var some_eyed_monster_cids = collection.filters.eyes_range.getFn([2,10]).cids
var some_eyed_monsters = collection.get(some_eyed_monster_cids)

// To get 1-2 eyed monsters
var lte_two_eyed_monster_cids = collection.filters.eyes_dvrange.getFn([1,2]).cids
var lte_two_eyed_monsters = collection.get(lte_two_eyed_monster_cids)

// While we could get, say, all the 1-10 eyed monsters by `or` combining the 1-1 range and the 2-10 range,
// there would be no way to get 1-2 eyed monsters out of the `eyes_range_filter`. Here we see the flexibility of
// dvrangeFilters

// ### Making new filter types

// One of the virtues of PourOver is how easy it is to construct new filter types for either convenience or optimization.
// PourOver's default filtering is fast but not optimized for huge numerical domains, like Crossfilter. You could, if you wanted to,
// make a custom filter type to integrate Crossfilters continunous numerical filtering power with the patterns and abstractions of 
// PourOver.
//
// Here we will create a new, toy filter type, caseInsensitiveFilter. It will work similarly to the exactFilter. However, it will
// match queries regardless of their case

// To create a new filter type we have to extend `PourOver.Filter` with a `cacheResults`,`addCacheResults` and `getFn`
// - `cacheResults` specifies how to take set of items and assign them to possibilities
// - `addCacheResults` specifies how to append a set of items to extant possibility caches (This can be the same thing as cacheResults and
// only needs to be different for optimization purposes.
// - `getFn` specifies how to translate a query into some combination of possibility caches
var CaseInsensitiveFilter = PourOver.Filter.extend({
    cacheResults: function(items){
      var possibilities = this.possibilities,
          attribute = this.attr; 
      _(items).each(function(i){
        var value = i[attribute].toLowerCase();
        _(possibilities).each(function(p){
            if (p.value.toLowerCase() === value) {
              p.matching_cids = PourOver.insert_sorted(p.matching_cids,i.cid)
            }
        })
      });
    },
    addCacheResults: function(new_items){
        this.cacheResults.call(this,new_items); 
    },
    getFn: function(query){
        var query_lc = query.toLowerCase(),
            matching_possibility = _(this.possibilities).find(function(p){
                var value_lc = p.value.toLowerCase();
                return value_lc === query_lc;
            });
        // `getFn` must return a `MatchSet`
        // `makeQueryMatchSet` is a convenience function for making match sets.
        return this.makeQueryMatchSet(matching_possibility.matching_cids,query)
    }
});

// Generally, we have to create convenience functions, mapping over input values to create the value objects that the Filter 
// constructor expects.
var makeCaseInsensitiveFilter = function(name,values,attr){
    var values = _(values).map(function(i){return {value:i}}),
        opts = {associated_attrs: [attr], attr: attr},
        filter = new CaseInsensitiveFilter(name,values,opts);
    return filter;
}
var case_insensitive_name_filter = makeCaseInsensitiveFilter("ci_name_filter",["sphinx","hydra","huldra","cyclops","medusa","fenrir"],"name")
collection.addFilters([case_insensitive_name_filter])
var ci_cyclops_match_set = collection.filters.ci_name_filter.getFn("CyClOps")
var ci_cyclops = collection.get(ci_cyclops_match_set.cids)
