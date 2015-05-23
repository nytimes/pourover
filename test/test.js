var should = require('chai').should();
var _ = require('underscore');
var PourOver = require('../');

describe('Basic Operations', function() {
  describe('Union Sorts', function() {
    it('should run a Standard Union 1', function() {
      this.output = PourOver.union_sorted([1,3,7,8,9], [1,2,3,4,5,15]);
      this.expected = [1,2,3,4,5,7,8,9,15];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Standard Union 2', function() {
      this.output = PourOver.union_sorted([1,3,7,8,9,14,20,70], [4,5,15]);
      this.expected = [1,3,4,5,7,8,9,14,15,20,70];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Tiny Union 1', function() {
      this.output = PourOver.union_sorted([1],[1]);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Tiny Union 2', function() {
      this.output = PourOver.union_sorted([1],[2]);
      this.expected = [1,2];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Union 1', function() {
      this.output = PourOver.union_sorted([1],[]);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Union 2', function() {
      this.output = PourOver.union_sorted([],[1]);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Intersect Sorts', function() {
    it('should run a Standard Intersect 1', function() {
      this.output = PourOver.intersect_sorted([1,3,7,8,9], [1,2,3,4,5,9]);
      this.expected = [1,3,9];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Standard Intersect 2', function() {
      this.output = PourOver.intersect_sorted([1,3,4,5,7,8,9,14,20,70], [4,5,20]);
      this.expected = [4,5,20];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Tiny Intersect 1', function() {
      this.output = PourOver.intersect_sorted([1], [1]);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Tiny Intersect 2', function() {
      this.output = PourOver.intersect_sorted([1], [2]);
      this.expected = [];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Intersect 2', function() {
      this.output = PourOver.intersect_sorted([1], []);
      this.expected = [];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Intersect 2', function() {
      this.output = PourOver.intersect_sorted([], [1]);
      this.expected = [];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Subtract Sorts', function() {
    it('should run a Standard Subtract 1', function() {
      this.output = PourOver.subtract_sorted([1,3,7,8,9], [3,6,7]);
      this.expected = [1,8,9];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Standard Subtract 2', function() {
      this.output = PourOver.subtract_sorted([1,3,4,5,7,8,9,14,20,70], [4,5,20]);
      this.expected = [1,3,7,8,9,14,70];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Tiny Subtract 1', function() {
      this.output = PourOver.subtract_sorted([1], [1]);
      this.expected = [];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Tiny Subtract 2', function() {
      this.output = PourOver.subtract_sorted([1], [2]);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Subtract 2', function() {
      this.output = PourOver.subtract_sorted([1], []);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Subtract 2', function() {
      this.output = PourOver.subtract_sorted([], [1]);
      this.expected = [];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Insert Sorts', function() {
    it('should run a Standard Insert', function() {
      this.output = PourOver.insert_sorted([1,3,5,8], 7);
      this.expected = [1,3,5,7,8];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Beginning Insert', function() {
      this.output = PourOver.insert_sorted([1,3,5], 0);
      this.expected = [0,1,3,5];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an End Insert', function() {
      this.output = PourOver.insert_sorted([1,3,5], 7);
      this.expected = [1,3,5,7];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Insert', function() {
      this.output = PourOver.insert_sorted([], 1);
      this.expected = [1];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Remove Sorts', function() {
    it('should run a Standard Remove', function() {
      this.output = PourOver.remove_sorted([1,3,8,9], 8);
      this.expected = [1,3,9];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Beginning Remove', function() {
      this.output = PourOver.remove_sorted([1,3,8,9], 1);
      this.expected = [3,8,9];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an End Remove', function() {
      this.output = PourOver.remove_sorted([1,3,8,9], 9);
      this.expected = [1,3,8];
      this.output.should.deep.equal(this.expected);
    });
    it('should run an Empty Remove', function() {
      this.output = PourOver.remove_sorted([], 1);
      this.expected = [];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Permutation', function() {
    it('should run a Permute Subset', function() {
      this.permutation = PourOver.build_permutation_array([{cid: 1, name: "Erik"},{cid: 2, name: "Brad"}, {cid: 3, name: "Chris"}],function(a,b){return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;});
      this.output = PourOver.permute_from_array([1,2], this.permutation);
      this.expected = [2,1];
      this.output.should.deep.equal(this.expected);
    });
    it('should run a Permute Whole set', function() {
      this.permutation = PourOver.build_permutation_array([{cid: 1, name: "Erik"},{cid: 2, name: "Brad"}, {cid: 3, name: "Chris"}],function(a,b){return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;});
      this.output = PourOver.permute_from_array([1,2,3], this.permutation);
      this.expected = [2,3,1];
      this.output.should.deep.equal(this.expected);
    });
  });
});

describe('Basic Collection Operations', function() {
  describe('Constructs Collection', function() {
    it('should build a three item collection', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.output = this.collection.items.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
  });

  describe('Get items from Collection', function() {
    it('should get one item', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.output = this.collection.get([1])[0].name;
      this.expected = "Bart";
      this.output.should.equal(this.expected);
    });
    it('should get two items', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.output = this.collection.get([1,2])[1].name;
      this.expected = "Cindy";
      this.output.should.equal(this.expected);
    });
  });

  describe('Add items to Collection', function() {
    it('should add one item', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.collection.addItems([{name: "Bruce", age: 50, color: "black"}]);
      this.output = this.collection.get([3])[0].name;
      this.expected = "Bruce";
      this.output.should.equal(this.expected);
    });
    it('should add two items', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.collection.addItems([{name: "Bryce", age: 50, color: "black"}, {name: "Charles", age: 50, color: "black"}]);
      this.output = this.collection.get([4])[0].name;
      this.expected = "Charles";
      this.output.should.equal(this.expected);
    });
  });

  describe('Get all matched items', function() {
    it('should correctly stack all results', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.output = this.collection.getAllItems().stack;
      this.expected = ["all"];
      this.output.should.deep.equal(this.expected);
    });
    it('should correctly retrieve all items', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.output = this.collection.getAllItems().cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
  });

  describe('Get first match', function() {
    it('should get exactly one item, this first match', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.output = this.collection.getByFirst("color", "red").name;
      this.expected = "Erik";
      this.output.should.equal(this.expected);
    });
  });

  describe('Update an item', function() {
    it('should update an attribute', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.collection.updateItem(1, "color", "silver");
      this.output = this.collection.get([1])[0].color;
      this.expected = "silver";
      this.output.should.equal(this.expected);
    });
  });

  describe('Remove an item attribute', function() {
    it('should remove an attribute', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.collection.removeItemAttribute(1,"color");
      this.output = this.collection.get([1])[0].color;
      should.not.exist(this.output);
    });
    it('should not touch other attributes', function() {
      this.collection = new PourOver.Collection([{name: "Erik", age: 26, color: "red"},{name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue"}]);
      this.collection.removeItemAttribute(1,"color");
      this.output = this.collection.get([1])[0].age;
      this.expected = 100;
      this.output.should.equal(this.expected);
    });
  });
});

describe('Filters', function() {
  describe('Create and query a filter', function() {
    it('should add one filter', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.output = _.keys(this.collection.filters).length;
      this.expected = 1;
      this.output.should.equal(this.expected);
    });
    it('should add all possibilities to filter', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.output = _.keys(this.collection.filters.gender.possibilities).length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
    it('should return correct number of items', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.output = this.collection.getFilteredItems("gender", "boy").cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
  });

  describe('Add items to collection and update filter', function() {
    it('should return correct number of items before addition', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.output = this.collection.getFilteredItems("gender", "boy").cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
    it('should return correct number of items after addition', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addItems([{gender: "boy", name:"Cilian", age: 11, color: "pink"}]);
      this.output = this.collection.getFilteredItems("gender", "boy").cids.length;
      this.expected = 4;
      this.output.should.equal(this.expected);
    });
  });

  describe('Query filter remembers last query', function() {
    it('should be okay without a starting query', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      should.not.exist(this.collection.filters.gender.current_query);
    });
    it('should return correct number of items from memorized query', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
    it('should update memorized query on addition', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.addItems([{gender: "boy", name:"Cilian", age: 11, color: "pink"}]);
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 4;
      this.output.should.equal(this.expected);
    });
    it('should return correct number of items from memorized query', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.addItems([{gender: "boy", name:"Cilian", age: 11, color: "pink"}]);
      this.collection.filters.gender.query("girl");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
    it('should be okay after query clear', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.addItems([{gender: "boy", name:"Cilian", age: 11, color: "pink"}]);
      this.collection.filters.gender.query("girl");
      this.collection.filters.gender.clearQuery();
      false.should.equal(this.collection.filters.gender.current_query);
    });
  });

  describe('Can be booleaned together', function() {
    it('should be self-unioned correctly', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender",["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 5;
      this.output.should.equal(this.expected);
    });
    it('should correctly be removed from a unioned cached query', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender",["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
    it('should correctly be removed from an unioned cached query\'s head', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender",["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("boy");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
    it('should correctly be self-intersected', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender",["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("boy");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.intersectQuery("girl");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 0;
      this.output.should.equal(this.expected);
    });
    it('should be correctly removed from an intersected cached query', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender",["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("boy");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.intersectQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
    it('should be correctly removed from an intersected cached query\'s head', function() {
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender",["boy","girl"])]);
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.unionQuery("girl");
      this.collection.filters.gender.removeSingleQuery("boy");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.intersectQuery("girl");
      this.collection.filters.gender.removeSingleQuery("girl");
      this.collection.filters.gender.query("boy");
      this.collection.filters.gender.intersectQuery("girl");
      this.collection.filters.gender.removeSingleQuery("boy");
      this.output = this.collection.filters.gender.current_query.cids.length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
  });
});

describe('Sorts', function() {
  describe('Can be created', function() {
    it('should sort items correctly', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.output = _.pluck(this.collection.getSortedItems("age"), "cid");
      this.expected = [2,4,0,3,1];
      this.output.should.deep.equal(this.expected);
    });
  });
});

describe('Views', function() {
  describe('Can be created', function() {
    it('should construct successfully with all items', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.output = new PourOver.View("default", this.collection).getCurrentItems();
      this.expected = this.collection.items;
      this.output.should.deep.equal(this.expected);
    });
  });
  describe('Can be paged', function() {
    it('should have the correct page size', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [0,1];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be paged forward', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.page(1);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [2,3];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be paged backward', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.page(1);
      this.view.page(-1);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [0,1];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be skipped forward', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.page(1);
      this.view.page(-1);
      this.view.page(2);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [4];
      this.output.should.deep.equal(this.expected);
    });
    it('should stop at end', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.page(1);
      this.view.page(-1);
      this.view.page(2);
      this.view.page(1);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [4];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Can be paged to a specific page', function() {
    it('should have the correct page size', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [0,1];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be paged to a specific page: 0', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.setPage(0);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [0,1];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be paged to a specific page: 1', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.setPage(0);
      this.view.setPage(1);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [2,3];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be paged to a specific page: 2', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setPageSize(2);
      this.view.setPage(0);
      this.view.setPage(1);
      this.view.setPage(2);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [4];
      this.output.should.deep.equal(this.expected);
    });
  });

  describe('Can be sorted', function() {
    it('should be initially sorted', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [0,1,2,3,4];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to be set', function() {
      age_sort = PourOver.Sort.extend({fn: function(a,b){return a.age - b.age;}});
      this.collection = new PourOver.Collection([{gender: "boy", name: "Erik", age: 26, color: "red"},{gender: "boy", name:"Bart", age: 100, color: "dead"},{name: "Cindy", age: 10, color: "blue", gender: "girl"},{gender: "girl", name:"Sandra", age: 70, color: "purple"}, {gender: "boy", name:"Cargo", age: 10, color: "gold"} ]);
      this.collection.addFilters([PourOver.makeExactFilter("gender", ["boy","girl"])]);
      this.collection.addSort(new age_sort("age"));
      this.view = new PourOver.View("default", this.collection);
      this.view.setSort("age");
      this.output = _.pluck(this.view.getCurrentItems(), "cid");
      this.expected = [2,4,0,3,1];
      this.output.should.deep.equal(this.expected);
    });
  });
});

describe('Non-stateful queries', function() {
  describe('Range crossfilters', function() {
    it('should have an all-inclusive range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.output = this.query.cids.length;
      this.expected = 6;
      this.output.should.equal(this.expected);
    });
    it('should have an equal range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.output = this.query.cids.length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
    it('should have an empty equal range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.query = this.c.getFilteredItems("num", 2);
      this.output = this.query.cids.length;
      this.expected = 0;
      this.output.should.equal(this.expected);
    });
    it('should have top equal range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.query = this.c.getFilteredItems("num", 2);
      this.query = this.c.getFilteredItems("num", 12);
      this.output = this.query.cids.length;
      this.expected = 1;
      this.output.should.equal(this.expected);
    });
    it('should have small range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.query = this.c.getFilteredItems("num", 2);
      this.query = this.c.getFilteredItems("num", 12);
      this.query = this.c.getFilteredItems("num", [1, 3]);
      this.output = this.query.cids.length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
    it('should have small range with decimals', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.query = this.c.getFilteredItems("num", 2);
      this.query = this.c.getFilteredItems("num", 12);
      this.query = this.c.getFilteredItems("num", [1, 3]);
      this.query = this.c.getFilteredItems("num", [1, 3.00001]);
      this.output = this.query.cids.length;
      this.expected = 3;
      this.output.should.equal(this.expected);
    });
    it('should have empty high range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.query = this.c.getFilteredItems("num", 2);
      this.query = this.c.getFilteredItems("num", 12);
      this.query = this.c.getFilteredItems("num", [1, 3]);
      this.query = this.c.getFilteredItems("num", [1, 3.00001]);
      this.query = this.c.getFilteredItems("num", [13, 15]);
      this.output = this.query.cids.length;
      this.expected = 0;
      this.output.should.equal(this.expected);
    });
    it('should have empty low range', function() {
      this.fixture = [{num: 5}, {num: 1}, {num: 9}, {num: 3}, {num: 1}, {num: 12}];
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeContinuousRangeFilter("num");
      this.c.addFilters([this.f]);
      this.query = this.c.getFilteredItems("num", [-100, 100]);
      this.query = this.c.getFilteredItems("num", 1);
      this.query = this.c.getFilteredItems("num", 2);
      this.query = this.c.getFilteredItems("num", 12);
      this.query = this.c.getFilteredItems("num", [1, 3]);
      this.query = this.c.getFilteredItems("num", [1, 3.00001]);
      this.query = this.c.getFilteredItems("num", [13, 15]);
      this.query = this.c.getFilteredItems("num", [-5, -4]);
      this.output = this.query.cids.length;
      this.expected = 0;
      this.output.should.equal(this.expected);
    });
  });

  describe('Complex queries', function() {
    it('should have initial simple query', function() {
      this.data = [{guid:1,color:"red",sex:"male"},{guid:2,color:"yellow",sex:"thing"},{guid:3,color:"blue",sex:"female"},{guid:4,color:"blue",sex:"male"},{guid:5,color:"red",sex:"female"}];
      this.c = new PourOver.Collection(this.data);
      this.f = PourOver.makeExactFilter("color",["red","yellow","blue"]);
      this.ftwo = PourOver.makeExactFilter("sex",["male","female"]);
      this.c.addFilters([this.f, this.ftwo]);
      this.query_one = this.c.getFilteredItems("color","red");
      this.output = this.query_one.cids.length;
      this.expected = 2;
      this.output.should.equal(this.expected);
    });
    it('should have single compound query', function() {
      this.data = [{guid:1,color:"red",sex:"male"},{guid:2,color:"yellow",sex:"thing"},{guid:3,color:"blue",sex:"female"},{guid:4,color:"blue",sex:"male"},{guid:5,color:"red",sex:"female"}];
      this.c = new PourOver.Collection(this.data);
      this.f = PourOver.makeExactFilter("color",["red","yellow","blue"]);
      this.ftwo = PourOver.makeExactFilter("sex",["male","female"]);
      this.c.addFilters([this.f, this.ftwo]);
      this.query_blue = this.c.getFilteredItems("color","blue");
      this.query_yellow = this.c.getFilteredItems("color","yellow");
      this.query_male = this.c.getFilteredItems("sex","male");
      this.query_complex = this.query_one.and(this.query_male);
      this.output = this.query_complex.cids;
      this.expected = [0];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to refresh a single compound query', function() {
      this.data = [{guid:1,color:"red",sex:"male"},{guid:2,color:"yellow",sex:"thing"},{guid:3,color:"blue",sex:"female"},{guid:4,color:"blue",sex:"male"},{guid:5,color:"red",sex:"female"}];
      this.c = new PourOver.Collection(this.data);
      this.f = PourOver.makeExactFilter("color",["red","yellow","blue"]);
      this.ftwo = PourOver.makeExactFilter("sex",["male","female"]);
      this.c.addFilters([this.f, this.ftwo]);
      this.query_blue = this.c.getFilteredItems("color","blue");
      this.query_yellow = this.c.getFilteredItems("color","yellow");
      this.query_male = this.c.getFilteredItems("sex","male");
      this.query_complex = this.query_one.and(this.query_male);
      this.c.updateItem(4,"sex","male");
      this.query_complex.refresh();
      this.output = this.query_complex.cids;
      this.expected = [0,4];
      this.output.should.deep.equal(this.expected);
    });
    it('should have a double compound query', function() {
      this.data = [{guid:1,color:"red",sex:"male"},{guid:2,color:"yellow",sex:"thing"},{guid:3,color:"blue",sex:"female"},{guid:4,color:"blue",sex:"male"},{guid:5,color:"red",sex:"female"}];
      this.c = new PourOver.Collection(this.data);
      this.f = PourOver.makeExactFilter("color",["red","yellow","blue"]);
      this.ftwo = PourOver.makeExactFilter("sex",["male","female"]);
      this.c.addFilters([this.f, this.ftwo]);
      this.query_blue = this.c.getFilteredItems("color","blue");
      this.query_yellow = this.c.getFilteredItems("color","yellow");
      this.query_male = this.c.getFilteredItems("sex","male");
      this.c.updateItem(4,"sex","female");
      this.query_complex = this.query_male.not(this.query_yellow).and(this.query_blue);
      this.output = this.query_complex.cids;
      this.expected = [3];
      this.output.should.deep.equal(this.expected);
    });
    it('should be able to refresh a double compound query', function() {
      this.data = [{guid:1,color:"red",sex:"male"},{guid:2,color:"yellow",sex:"thing"},{guid:3,color:"blue",sex:"female"},{guid:4,color:"blue",sex:"male"},{guid:5,color:"red",sex:"female"}];
      this.c = new PourOver.Collection(this.data);
      this.f = PourOver.makeExactFilter("color",["red","yellow","blue"]);
      this.ftwo = PourOver.makeExactFilter("sex",["male","female"]);
      this.c.addFilters([this.f, this.ftwo]);
      this.query_blue = this.c.getFilteredItems("color","blue");
      this.query_yellow = this.c.getFilteredItems("color","yellow");
      this.query_male = this.c.getFilteredItems("sex","male");
      this.c.updateItem(4,"sex","female");
      this.query_complex = this.query_male.not(this.query_yellow).and(this.query_blue);
      this.c.updateItem(2,"sex","male");
      this.query_complex.refresh();
      this.output = this.query_complex.cids;
      this.expected = [2,3];
      this.output.should.deep.equal(this.expected);
    });
  });
});

describe('Stateful queries', function() {
  describe('Queries can be unioned', function() {
    it('should add elements to a filter', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.unionQuery(["blue","blue"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.old_length.should.be.below(this.new_length);
    });
    it('should add the correct items to the query', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.unionQuery(["blue","blue"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.items = this.c.get(this.c.filters.color.current_query.cids);
      this.output = _.any(this.items, function(i){ return i.color == "blue"; });
      this.output.should.equal(true);
    });
    it('should refresh unioned queries', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.unionQuery(["blue","blue"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.items = this.c.get(this.c.filters.color.current_query.cids);
      this.change_item = _.find(this.c.items, function(i){return i.color == "indigo";});
      this.c.updateItem(this.change_item.cid,"color","blue");
      this.final_length = this.c.filters.color.current_query.cids.length;
      this.final_length.should.equal(this.new_length + 1);
    });
  });
  describe('Queries can be intersected', function() {
    it('should remove intersecting elements from a filter', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.intersectQuery(["red","red"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.old_length.should.be.above(this.new_length);
    });
    it('should proerly intersect', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.intersectQuery(["red","red"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.items = this.c.get(this.c.filters.color.current_query.cids);
      this.output = _.any(this.items, function(i){ return i.color == "red"; });
      this.output.should.equal(true);
    });
    it('should refresh successfuly', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.intersectQuery(["red","red"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.items = this.c.get(this.c.filters.color.current_query.cids);
      this.change_item = _.findWhere(this.c.items,{color:"blue"});
      this.c.updateItem(this.change_item.cid,"color","red");
      this.final_length = this.c.filters.color.current_query.cids.length;
      this.final_length.should.equal(this.new_length + 1);
    });
  });
  describe('Queries can be subtracted', function() {
    it('should remove elements from a filter', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.subtractQuery(["orange","orange"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.old_length.should.be.above(this.new_length);
    });
    it('should difference the current query', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.subtractQuery(["orange","orange"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.items = this.c.get(this.c.filters.color.current_query.cids);
      this.output = _.any(this.items,function(i){ return i.color == "orange" || i.color == "blue" || i.color == "indigo" || i.color == "violet"; });
      this.output.should.equal(false);
    });
    it('should successfully refresh', function() {
      this.fixture = [];
      this.i = 0;
      while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0, tip: Math.random() * 200 >>> 0, type: ["tab","visa","cash"][Math.random() * 3 >>> 0], color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0] }); this.i++; }
      this.c = new PourOver.Collection(this.fixture);
      this.f = PourOver.makeExactFilter("quantity",[1,2]);
      this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
      this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
      this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
      this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour]);
      this.c.filters.color.query(["red","green"]);
      this.old_length = this.c.filters.color.current_query.cids.length;
      this.c.filters.color.subtractQuery(["orange","orange"]);
      this.new_length = this.c.filters.color.current_query.cids.length;
      this.items = this.c.get(this.c.filters.color.current_query.cids);
      this.change_item = _.findWhere(this.c.items,{color:"red"});
      this.c.updateItem(this.change_item.cid,"color","violet");
      this.final_length = this.c.filters.color.current_query.cids.length;
      this.new_length.should.equal(this.final_length + 1);
    });
  });

  describe('Benchmarks', function() {
    describe('Simple select', function() {
      it('should be faster than 10s', function() {
        this.fixture = [];
        this.i = 0;
        while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0,tip: Math.random() * 200 >>> 0,type: ["tab","visa","cash"][Math.random() * 3 >>> 0],color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0],percent: Math.random()});this.i++; }
        this.c = new PourOver.Collection(this.fixture);
        this.f = PourOver.makeExactFilter("quantity",[1,2]);
        this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
        this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
        this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
        this.ffive = PourOver.makeContinuousRangeFilter("percent");
        this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour,this.ffive]);
        this.timeA = process.hrtime();
        this.output = this.c.getFilteredItems("type","tab");
        this.timeB = process.hrtime(this.timeA);
        this.timeB[0].should.be.below(10);
        console.log('\ttime: ' + this.timeB[0] + '.' + this.timeB[1]);
      });
    });

    describe('Dvrange select', function() {
      it('should be faster than 45s', function() {
        this.fixture = [];
        this.i = 0;
        while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0,tip: Math.random() * 200 >>> 0,type: ["tab","visa","cash"][Math.random() * 3 >>> 0],color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0],percent: Math.random()});this.i++; }
        this.c = new PourOver.Collection(this.fixture);
        this.f = PourOver.makeExactFilter("quantity",[1,2]);
        this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
        this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
        this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
        this.ffive = PourOver.makeContinuousRangeFilter("percent");
        this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour,this.ffive]);
        this.timeA = process.hrtime();
        this.output = this.c.getFilteredItems("color", ["red","green"]);
        this.timeB = process.hrtime(this.timeA);
        this.timeB[0].should.be.below(45);
        console.log('\ttime: ' + this.timeB[0] + '.' + this.timeB[1]);
      });
    });

    describe('Continous Range', function() {
      it('should be faster than 45s', function() {
        this.fixture = [];
        this.i = 0;
        while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0,tip: Math.random() * 200 >>> 0,type: ["tab","visa","cash"][Math.random() * 3 >>> 0],color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0],percent: Math.random()});this.i++; }
        this.c = new PourOver.Collection(this.fixture);
        this.f = PourOver.makeExactFilter("quantity",[1,2]);
        this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
        this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
        this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
        this.ffive = PourOver.makeContinuousRangeFilter("percent");
        this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour,this.ffive]);
        this.timeA = process.hrtime();
        this.output = this.c.getFilteredItems("percent", [0.25, 0.75]);
        this.timeB = process.hrtime(this.timeA);
        this.timeB[0].should.be.below(45);
        console.log('\ttime: ' + this.timeB[0] + '.' + this.timeB[1]);
      });
    });

    describe('Range select', function() {
      it('should be faster than 10s', function() {
        this.fixture = [];
        this.i = 0;
        while (this.i < 100000){ this.fixture.push({quantity: Math.random() * 3 >>> 0,total: Math.random() * 300 >>> 0,tip: Math.random() * 200 >>> 0,type: ["tab","visa","cash"][Math.random() * 3 >>> 0],color: ["red","orange","yellow","green","blue","indigo","violet"][Math.random() * 7 >>> 0],percent: Math.random()});this.i++; }
        this.c = new PourOver.Collection(this.fixture);
        this.f = PourOver.makeExactFilter("quantity",[1,2]);
        this.ftwo = PourOver.makeExactFilter("type",["tab","cash","visa"]);
        this.fthree = PourOver.makeRangeFilter("total",[[0,100],[101,200],[201,300]]);
        this.ffour = PourOver.makeDVrangeFilter("color",["red","orange","yellow","green","blue","indigo","violet"]);
        this.ffive = PourOver.makeContinuousRangeFilter("percent");
        this.c.addFilters([this.f,this.ftwo,this.fthree,this.ffour,this.ffive]);
        this.timeA = process.hrtime();
        this.output = this.c.getFilteredItems("total", [101,200]);
        this.timeB = process.hrtime(this.timeA);
        console.log('\ttime: ' + this.timeB[0] + '.' + this.timeB[1]);
      });
    });
  });
});
