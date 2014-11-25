module("Basic set operations")
test("union sorted sets", function(){
  var output = PourOver.union_sorted([1,3,7,8,9],[1,2,3,4,5,15]);
  deepEqual(output, [1,2,3,4,5,7,8,9,15], "Standard union");
  var output = PourOver.union_sorted([1,3,7,8,9,14,20,70],[4,5,15]);
  deepEqual(output, [1,3,4,5,7,8,9,14,15,20,70], "Standard union");
  var output = PourOver.union_sorted([1],[1]);
  deepEqual(output, [1], "Tiny union 1");
  var output = PourOver.union_sorted([1],[2]);
  deepEqual(output, [1,2], "Tiny union 1,2");
  var output = PourOver.union_sorted([1],[]);
  deepEqual(output, [1], "Empty union 1");
  var output = PourOver.union_sorted([],[1]);
  deepEqual(output, [1], "Empty union 2");
});
test("intersect sorted sets", function(){
  var output = PourOver.intersect_sorted([1,3,7,8,9],[1,2,3,4,5,9]);
  deepEqual(output, [1,3,9], "Standard intersect");
  var output = PourOver.intersect_sorted([1,3,4,5,7,8,9,14,20,70],[4,5,20]);
  deepEqual(output, [4,5,20], "Standard intersect");
  var output = PourOver.intersect_sorted([1],[1]);
  deepEqual(output, [1], "Tiny intersect 1");
  var output = PourOver.intersect_sorted([1],[2]);
  deepEqual(output, [], "Tiny intersect 1,2");
  var output = PourOver.intersect_sorted([1],[]);
  deepEqual(output, [], "Empty intersect 1");
  var output = PourOver.intersect_sorted([],[1]);
  deepEqual(output, [], "Empty intersect 2");
});
test("subtract sorted sets", function(){
  var output = PourOver.subtract_sorted([1,3,7,8,9],[3,6,7]);
  deepEqual(output, [1,8,9], "Standard subtract");
  var output = PourOver.subtract_sorted([1,3,4,5,7,8,9,14,20,70],[4,5,20]);
  deepEqual(output, [1,3,7,8,9,14,70], "Standard subtract");
  var output = PourOver.subtract_sorted([1],[1]);
  deepEqual(output, [], "Tiny subtract 1");
  var output = PourOver.subtract_sorted([1],[2]);
  deepEqual(output, [1], "Tiny subtract 1,2");
  var output = PourOver.subtract_sorted([1],[]);
  deepEqual(output, [1], "Empty subtract 1");
  var output = PourOver.subtract_sorted([],[1]);
  deepEqual(output, [], "Empty subtract 2");
});
test("insert sorted",function(){
  var set = PourOver.insert_sorted([1,3,5,8],7);
  deepEqual(set,[1,3,5,7,8],"Simple insertion");
  var set = PourOver.insert_sorted([1,3,5],7);
  deepEqual(set,[1,3,5,7],"End insertion");
  var set = PourOver.insert_sorted([1,3,5],0);
  deepEqual(set,[0,1,3,5],"Beginning insertion");
  var set = PourOver.insert_sorted([],1);
  deepEqual(set,[1],"Empty insertion");
});
test("remove sorted",function(){
  var set = PourOver.remove_sorted([1,3,8,9],8);
  deepEqual(set,[1,3,9],"Standard remove")
  var set = PourOver.remove_sorted([1,3,8,9],1)
  deepEqual(set,[3,8,9],"Beginning remove")
  var set = PourOver.remove_sorted([1,3,8,9],9);
  deepEqual(set,[1,3,8],"End remove")
});
test("permutation",function(){
  var permutation_array = PourOver.build_permutation_array([{cid: 1, name: "Erik"},{cid: 2, name: "Brad"}, {cid: 3, name: "Chris"}],function(a,b){return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0}),
      output_array = PourOver.permute_from_array([1,2],permutation_array);
  deepEqual(output_array, [2,1],"Permute subset");
  output_array = PourOver.permute_from_array([1,2,3],permutation_array);
  deepEqual(output_array, [2,3,1],"Permute whole set");
});

module("Basic collection operations");
test("constructs collection", function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}])
  equal(collection.items.length,3,"Builds a three item collection");
})
test("get items from collection", function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]),
      people = collection.get([1]);
  equal(people[0].name,"Bart","Gets one item");
  people = collection.get([0,2]);
  equal(people[1].name,"Cindy","Gets two items");
})
test("add items to collection", function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]),
      person;
  collection.addItems([{name: "Bruce", age: 50, color: "black"}])
  person = collection.get([3])[0]
  equal(person.name,"Bruce","Adds one item");
  collection.addItems([{name: "Bryce", age: 50, color: "black"},{name: "Charles", age: 50, color: "black"}])
  person = collection.get([5])[0]
  equal(person.name,"Charles","Add two items");
})
test("get an all items match",function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]),
      all_match = collection.getAllItems();
  deepEqual(all_match.stack,["all"],"correctly stacks an all result")
  equal(all_match.cids.length,3,"correctly retrieves all 3 items")
})
test("get first match",function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "red"}]),
      first_match = collection.getByFirst("color","red");
  equal(first_match.name, "Erik","First match gets exactly one item, the first match")
})
test("update an item",function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
  collection.updateItem(1,"color","silver");
  equal(collection.get([1])[0].color,"silver","updates attribute")
});
test("remove an item attribute",function(){
  var collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
  collection.removeItemAttribute(1,"color");
  equal(collection.get([1])[0].color,undefined,"removed attribute")
  equal(collection.get([1])[0].age,100,"left other attributes")
});

module("Filters");
test("create and query a filter", function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]);
  collection.addFilters([filter]);
  equal(_.keys(collection.filters).length,1,"one filter added");
  equal(_.keys(collection.filters.gender.possibilities).length,2,"all possibilities added to filter");
  var boys = collection.getFilteredItems("gender","boy");
  equal(boys.cids.length,3,"correct number of items returned")
})
test("add items to collection updates filter", function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]);
  collection.addFilters([filter]);
  var boys = collection.getFilteredItems("gender","boy");
  equal(boys.cids.length,3,"correct number of items returned before addition")
  collection.addItems([{gender: "boy", name:"Cilian", age: 11, color: "pink"}]);
  var boys = collection.getFilteredItems("gender","boy");
  equal(boys.cids.length,4,"correct number of items returned after addition")
})
test("querying filter remembers last query", function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]);
  collection.addFilters([filter]);
  ok(! collection.filters.gender.current_query, "No starting query")
  collection.filters.gender.query("boy");
  var boy = collection.filters.gender.current_query;
  equal(boy.cids.length,3,"Corrent number of items returned from memorized query.")
  collection.addItems([{gender: "boy", name:"Cilian", age: 11, color: "pink"}]);
  equal(boy.cids.length,4,"Memorized query updates on addition.")
  collection.filters.gender.query("girl");
  var girl = collection.filters.gender.current_query;
  equal(girl.cids.length,2,"Corrent number of items returned from memorized query.")
  collection.filters.gender.clearQuery();
  var girl = collection.filters.gender.current_query;
  ok(!girl,"Query cleared")
})
test("filters can be booleaned together", function(){

  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]);
  collection.addFilters([filter]);
  collection.filters.gender.query("boy");
  collection.filters.gender.unionQuery("girl");
  var people = collection.filters.gender.current_query;
  equal(people.cids.length,5,"Filters can be self-unioned correctly")
  collection.filters.gender.removeSingleQuery("girl");
  var people = collection.filters.gender.current_query;
  equal(people.cids.length,3,"Filters can be correctly removed from an unioned cached query")
  collection.filters.gender.query("boy");
  collection.filters.gender.unionQuery("girl");
  collection.filters.gender.removeSingleQuery("boy");
  var people = collection.filters.gender.current_query;
  equal(people.cids.length,2,"Filters can be correctly removed from an union cached query's head")
  collection.filters.gender.query("boy");
  collection.filters.gender.intersectQuery("girl");
  var people = collection.filters.gender.current_query;
  equal(people.cids.length,0,"Filters can be self-intersected correctly")
  collection.filters.gender.removeSingleQuery("girl");
  var people = collection.filters.gender.current_query;
  equal(people.cids.length,3,"Filters can be correctly removed from an intersected cached query")
  collection.filters.gender.query("boy");
  collection.filters.gender.intersectQuery("girl");
  collection.filters.gender.removeSingleQuery("boy");
  var people = collection.filters.gender.current_query;
  equal(people.cids.length,2,"Filters can be correctly removed from an intersected cached query's head")
});

module("Sorts")
test("Sorts can be created",function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]),
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age}}),
      sort = new age_sort("age");
  collection.addFilters([filter]);
  collection.addSort(sort);
  var items = _.pluck(collection.getSortedItems("age"),"cid");
  deepEqual(items,[2,4,0,3,1],"Sorts items correctly")
})

module("Views")
test("Views can be created",function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]),
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age}}),
      sort = new age_sort("age");
  collection.addFilters([filter]);
  collection.addSort(sort);
  var view = new PourOver.View("default",collection);
  deepEqual(view.getCurrentItems(),collection.items,"View successful constructs with all items")
})
test("Views can be paged",function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]),
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age}}),
      sort = new age_sort("age");
  collection.addFilters([filter]);
  collection.addSort(sort);
  var view = new PourOver.View("default",collection);
  view.setPageSize(2);
  var items = view.getCurrentItems();
  deepEqual([0,1],_.pluck(items,"cid"),"Page size is correct")
  view.page(1);
  var items = view.getCurrentItems();
  deepEqual([2,3],_.pluck(items,"cid"),"View can be paged forward")
  view.page(-1);
  var items = view.getCurrentItems();
  deepEqual([0,1],_.pluck(items,"cid"),"View can be paged backward")
  view.page(2);
  var items = view.getCurrentItems();
  deepEqual([4],_.pluck(items,"cid"),"View can be skipped forward")
  view.page(1);
  var items = view.getCurrentItems();
  deepEqual([4],_.pluck(items,"cid"),"View stops at end")
})
test("Views can be paged to a specific page",function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]),
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age}}),
      sort = new age_sort("age");
  collection.addFilters([filter]);
  collection.addSort(sort);
  var view = new PourOver.View("default",collection);
  view.setPageSize(2);
  var items = view.getCurrentItems();
  deepEqual([0,1],_.pluck(items,"cid"),"Page size is correct")
  view.setPage(0);
  var items = view.getCurrentItems();
  deepEqual([0,1],_.pluck(items,"cid"),"View can be paged to a specific page")
  view.setPage(1);
  var items = view.getCurrentItems();
  deepEqual([2,3],_.pluck(items,"cid"),"View can be paged to a specific page")
  view.setPage(2);
  var items = view.getCurrentItems();
  deepEqual([4],_.pluck(items,"cid"),"View can be paged to a specific page")
})
test("Views can be sorted",function(){
  var collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]),
      filter = PourOver.makeExactFilter("gender",["boy","girl"]),
      age_sort = new PourOver.Sort("age",{fn: function(a,b){return a.age - b.age}});
  collection.addFilters([filter]);
  collection.addSort(age_sort);
  var view = new PourOver.View("default",collection);
  var items = view.getCurrentItems();
  deepEqual([0,1,2,3,4],_.pluck(items,"cid"),"View initially sorted")
  view.setSort("age");
  var items = view.getCurrentItems();
  deepEqual([2,4,0,3,1],_.pluck(items,"cid"),"View sort can be set")
})
module("Benchmark")
test("100000 items can be fast filtered",function(){
    fixture = [], i = 0;
    while (i < 100000){
      fixture.push({
        quantity: Math.random() * 3 >>> 0,
        total: Math.random() * 300 >>> 0,
        tip: Math.random() * 200 >>> 0,
        type: ["tab","visa","cash"][Math.random() * 3 >>> 0],
        color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0],
        percent: Math.random()
      });
      i++;
    }
    c = new PourOver.Collection(fixture)
    f = PourOver.makeExactFilter("quantity",[1,2]);
    ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
    fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
    ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
    ffive = PourOver.makeContinuousRangeFilter("percent");

   c.addFilters([f,ftwo,fthree,ffour,ffive]);
   var timea = Number(new Date());
   var output = c.getFilteredItems("type","tab");
   var timeb = Number(new Date());
   console.log(timeb-timea,output.length(),"Simple select");
   ok(timeb-timea < 10,"Simple select is fast enough")
   var timea = Number(new Date());
   var output = c.getFilteredItems("color",["red","green"]);
   var timeb = Number(new Date());
   console.log(timeb-timea,output.length(),"Dvrange select");
   ok(timeb-timea < 45,"Dvrange select is fast enough")
   var timea = Number(new Date());
   var output = c.getFilteredItems("percent",[.25, .75]);
   var timeb = Number(new Date());
   console.log(timeb-timea,output.length(),"ContinuousRange select");
   ok(timeb-timea < 45,"Continuous range select is fast enough: took " + (timeb-timea))
   var timea = Number(new Date());
   var output = c.getFilteredItems("total",[101,200]);
   var timeb = Number(new Date());
   console.log(timeb-timea,output.length(),"Range select");
   ok(timeb-timea < 10,"Range select is fast enough")
});
module("Non-stateful queries")
test("Range crossfilter works",function() {
  fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
  c = new PourOver.Collection(fixture)
  f = PourOver.makeContinuousRangeFilter("num");
  c.addFilters([f]);
  query = c.getFilteredItems("num", [-100, 100])
  equal(query.cids.length, 6, "All-inclusive range works.")
  query = c.getFilteredItems("num", 1)
  equal(query.cids.length, 2, "Equal range works.")
  query = c.getFilteredItems("num", 2)
  equal(query.cids.length, 0, "Empty equal range works.")
  query = c.getFilteredItems("num", 12)
  equal(query.cids.length, 1, "Top equal range works.")
  query = c.getFilteredItems("num", [1, 3])
  equal(query.cids.length, 2, "Small range works.")
  query = c.getFilteredItems("num", [1, 3.00001])
  equal(query.cids.length, 3, "Small range works.")
  query = c.getFilteredItems("num", [13, 15])
  equal(query.cids.length, 0, "Empty high range works.")
  query = c.getFilteredItems("num", [-5, -4])
  equal(query.cids.length, 0, "Empty low range works.")
})
test("Complex queries work",function(){
  data = [{guid:1,color:"red",sex:"male"},{guid:2,color:"yellow",sex:"thing"},{guid:3,color:"blue",sex:"female"},{guid:4,color:"blue",sex:"male"},{guid:5,color:"red",sex:"female"}];
  c = new PourOver.Collection(data);
  f = PourOver.makeExactFilter("color",["red","yellow","blue"]);
  ftwo = PourOver.makeExactFilter("sex",["male","female"]);
  c.addFilters([f,ftwo]);
  query_one = c.getFilteredItems("color","red");
  ok(query_one.cids.length == 2,"Initial simple query is correct");
  query_blue = c.getFilteredItems("color","blue");
  query_yellow = c.getFilteredItems("color","yellow");
  query_male = c.getFilteredItems("sex","male");
  query_complex = query_one.and(query_male);
  ok(_.isEqual(query_complex.cids,[0]),"Single compound query is correct");
  c.updateItem(4,"sex","male");
  query_complex.refresh();
  ok(_.isEqual(query_complex.cids,[0,4]),"Single compound query can be refreshed");
  c.updateItem(4,"sex","female");
  query_complex_2 = query_male.not(query_yellow).and(query_blue);
  ok(_.isEqual(query_complex_2.cids,[3]),"Double compound query is correct");
  c.updateItem(2,"sex","male");
  query_complex_2.refresh();
  ok(_.isEqual(query_complex_2.cids,[2,3]),"Double compound query can be refreshed");
})
module("Stateful queries")
test("Queries can be unioned",function(){
    fixture = [], i = 0;
    while (i < 100000){ fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); i++; }
    console.log("made it")
    c = new PourOver.Collection(fixture)
    f = PourOver.makeExactFilter("quantity",[1,2]);
    ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
    fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
    ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
   c.addFilters([f,ftwo,fthree,ffour]);
   c.filters.color.query(["red","green"])
   var old_length = c.filters.color.current_query.cids.length;
   c.filters.color.unionQuery(["blue","blue"])
   var new_length = c.filters.color.current_query.cids.length;
   ok(new_length > old_length, "Unioning adds elements to a filter")
   var items = c.get(c.filters.color.current_query.cids);
   ok(_.any(items,function(i){ return i.color == "blue" }), "Union adds the correct items to the query")
   var change_item = _.find(c.items,function(i){return i.color == "indigo"})
   c.updateItem(change_item.cid,"color","blue")
   var final_length = c.filters.color.current_query.cids.length;
   ok (final_length == new_length + 1, "Unioned queries are successfully refreshed")
});
test("Queries can be intersected",function(){
    fixture = [], i = 0;
    while (i < 100000){ fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); i++; }
    c = new PourOver.Collection(fixture)
    f = PourOver.makeExactFilter("quantity",[1,2]);
    ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
    fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
    ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
   c.addFilters([f,ftwo,fthree,ffour]);
   c.filters.color.query(["red","green"])
   var old_length = c.filters.color.current_query.cids.length;
   c.filters.color.intersectQuery(["red","red"])
   var new_length = c.filters.color.current_query.cids.length;
   ok(new_length < old_length, "Intersecting removes elements from a filter")
   var items = c.get(c.filters.color.current_query.cids);
   ok(_.all(items,function(i){ return i.color == "red" }), "Intersecting works properly")
   var change_item = _.findWhere(c.items,{color:"blue"})
   c.updateItem(change_item.cid,"color","red")
   var final_length = c.filters.color.current_query.cids.length;
   ok (final_length == new_length + 1, "Intersected queries are successfully refreshed")
});
test("Queries can be subtracted",function(){
    fixture = [], i = 0;
    while (i < 100000){ fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); i++; }
    c = new PourOver.Collection(fixture)
    f = PourOver.makeExactFilter("quantity",[1,2]);
    ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
    fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
    ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
   c.addFilters([f,ftwo,fthree,ffour]);
   c.filters.color.query(["red","green"])
   var old_length = c.filters.color.current_query.cids.length;
   c.filters.color.subtractQuery(["orange","orange"])
   var new_length = c.filters.color.current_query.cids.length;
   ok(new_length < old_length, "Subtracting removes elements from a filter")
   var items = c.get(c.filters.color.current_query.cids);
   ok(! _.any(items,function(i){ return i.color == "orange" || i.color == "blue" || i.color == "indigo" || i.color == "violet" }), "Subtracting corrent differences the query")
   var change_item = _.findWhere(c.items,{color:"red"})
   c.updateItem(change_item.cid,"color","violet")
   var final_length = c.filters.color.current_query.cids.length;
   ok (final_length + 1 == new_length, "Subtracted queries are successfully refreshed")
});
