// #Buffering example
// This example will show how to use `BufferedCollections` and `BufferedViews `to lazily load full-text data, rather than mandating
// that every item in the collection has it's entire set of attributes from the beginning. Of course, you cannot filter on buffered
// attributes. `BufferedCollections` and `BufferedViews` simply provide a mechanism for rending Views that depend on buffered data.

// `BufferedCollections` are just like `Collections`, except for a few new methods and a few modifications. 
// - `BufferedCollection` maintain a dictionary between guids and buffered values, this dictionary is used to
// provide the full attributes for some item
// - `get` and `getBy` are slightly altered so that they merge in the buffered attributes from the collection. However,
// these functions are used the same way as the vanilla `Collection` counterparts.
// - When creating buffered collections you must supply a 'getBufferUrl' function that can transform an array of guids
// into a url that will return full data for that set of guids
// - `bufferGuids` takes a set of guids and returns a promise. This promise will return after the full attributes are available 
// for the specified guids

// Say you had a server at example.com/data?guids=[guids]
var monsters = [{name: "sphinx", mythology: "greek", eyes: 2, sex: "f", hobbies: ["riddles","sitting","being a wonder"],guid:1},
                {name: "hydra", mythology: "greek", eyes: 18, sex: "m", hobbies: ["coiling","terrorizing","growing"],guid:2},
                {name: "huldra", mythology: "norse", eyes: 2, sex: "f", hobbies: ["luring","terrorizing"],guid:3},
                {name: "cyclops", mythology: "greek", eyes: 1, sex: "m", hobbies: ["staring","terrorizing"],guid:4},
                {name: "fenrir", mythology: "norse", eyes: 2, sex: "m", hobbies: ["growing","god-killing"],guid:5},
                {name: "medusa",  mythology: "greek", eyes: 2, sex: "f", hobbies: ["coiling","staring"],guid:6}];

var MyBufferedCollection = PourOver.BufferedCollection.extend({
    getBufferUrl: function(guids){
        var query = encodeURIComponent(guids.join(","));
        return "http://example.com/data?guids="+query;
    }
});
var collection = new MyBufferedCollection(monsters);

// `BufferedViews` can only be defined on `BufferedCollections`.
// Buffered views provide paging and rendering functions that buffer in the relevant items,
// those which are returned from `getCurrentItems()`, (using the collection's `bufferGuids` function) 
// and then delegate back to the default `render` function of the view
var MyBufferedView = PourOver.BufferedView.extend({
    render: function(){
       var items = this.getCurrentItems();
       console.log(items);
    }
});
var my_buffered_view = new MyBufferedView("buffered_view",collection);

// We call `bufferRender` instead of render, so that the collection buffers the data before
// relinquishing control back to the vanilla `render`.

my_buffered_view.bufferRender();

// Of course, here nothing will happen because the example.com URL will never resolve
