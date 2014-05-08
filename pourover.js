var PourOver = (function(){

    PourOver = {
      // Utility functions. Skip down to "Collections" for the real meat of PourOver.
      //
      // # The basic sorted set operations
      //
      union_sorted: function(a,b){
        // Make more efficient by just copying at Infinity
        var lowa = 0, lowb = 0, higha = a.length, highb = b.length, result=[], la, lb;
        while (higha > lowa || highb > lowb){
          la = a[lowa];
          lb = b[lowb];
          if(_.isUndefined(la)) la = Infinity;
          if(_.isUndefined(lb)) lb = Infinity;
          if(lowa == higha){
            return result.concat(b.slice(lowb,highb));
          }
          if(lowb == highb){
            return result.concat(a.slice(lowa,higha));
          }
          if(la == lb){
            result.push(la);
            lowa++;lowb++;
          } else if (la < lb){
            result.push(la);
            lowa++;
          } else {
            result.push(lb);
            lowb++;
          }
        }
        return result;
      },
      intersect_sorted: function(a,b){
        var lowa = 0, lowb = 0, higha = a.length, highb = b.length, result=[], la, lb;
        while (higha > lowa && highb > lowb){
          la = a[lowa];
          lb = b[lowb];


          if(la == lb){
            result.push(la);
            lowa++;lowb++;
          } else if (la < lb){
            lowa++;
          } else {
            lowb++;
          }
        }
        return result;
      },
      subtract_sorted: function(a,b){
        var lowa = 0, lowb = 0, higha = a.length, highb = b.length, result=[], la, lb;
        while (higha > lowa || highb > lowb){
          la = a[lowa];
          lb = b[lowb];
          if(higha == lowa){
            return result;
          }
          if(highb == lowb){
            return result.concat(a.slice(lowa,higha));
          }
          if(la == lb){
            lowa++;lowb++;
          } else if (la < lb){
            result.push(la);
            lowa++;
          } else {
            lowb++;
          }
        }
        return result;
      },
      insert_sorted: function(set,element){
        var length = set.length,
          i = 0,
          last_elem = set[length - 1];
        if(element > last_elem){
          set.push(element);
          return set;
        }
        while(i < length){
          if(element < set[i]){
            return set.slice(0,i).concat([element]).concat(set.slice(i,length));
          } else {
            i++;
          }
        }
        set.push(element);
        return set;
      },

      //
      // # Sort support
      //

      // Sort the set according to some function and then store an array of the translations
      // of the indicies. So if the first item went to index 2 after being sorted, put 2 in
      // the first spot of the permutation array.
      build_permutation_array: function(set,sort){
        var sorted_set = _(set).clone(),perm=[];
        if(typeof(sort) === "function"){
          sorted_set.sort(sort);
        } else {
          sorted_set.sort(function(a,b){return sort.fn.call(sort,a,b);});
        }
        _(sorted_set).each(function(m,i){perm[m.cid] = i;});
        return perm;
      },
      // Use a permutation array to resort a subset of a collection.
      permute_from_array: function(collection,perm){
        var output = [];
        if(typeof(collection[0]) === "number"){
          _(collection).each(function(i){ output[perm[i]] = i ;});
        } else {
          _(collection).each(function(i){ output[perm[i.cid]] = i ;});
        }
        return _(output).without(undefined);
      },
      // Remove an element from a sorted set.
      remove_sorted: function(set,element){
        var length = set.length,
            i = 0;
        while(i < length){
          if(element == set[i]){
            return set.slice(0,i).concat(set.slice(i+1,length));
          } else {
            i++;
          }
        }
        return set;
      },
      // # Pre-defined cache methods
      // Caching is really the raison d'etre of Pourover. Every filter has two cache methods: one for rebuilding the whole filter from scratch
      // and one for adding new items. As Pourover grows it will gain more pre-defined cache methods that correlate with common UI and data patterns.
      cacheMethods: {
        // ### Default: the dumb caches.
        // Just goes through each possible value for the filter and tests every item in the collection against it. As expensive as
        // possibile, but simple.
        defaultCache: function(items){
          var that = this;
          _(that.possibilities).each(function(p){
            var matching_items = _(items).filter(function(i){return that.fn(p,i);}),
                matching_cids = _(matching_items).map(function(i){return i.cid;});
            p.matching_cids = matching_cids;
          });
        },
        defaultAddCache: function(items){
          var that = this;
          _(that.possibilities).each(function(p){
            var matching_items = _(items).filter(function(i){return that.fn(p,i);}),
                matching_cids = _(matching_items).map(function(i){return i.cid;});
            p.matching_cids = PourOver.union_sorted(p.matching_cids,matching_cids);
          });
        },
        // ### Exact: the fastest caches.
        // For filters that evaluate by strict equality (this property === this value). The name of the filter must
        // match the name of the property for exact cache to work.
        exactCache: function(items){
          var that = this,
              attr = this.attr || this.name;
          _(items).each(function(i){
            var p = that.possibilities[i[attr]];
            if (p) {
              p.matching_cids = PourOver.insert_sorted(p.matching_cids,i.cid);
            }
          });
        },
        exactAddCache: function(items){
          PourOver.cacheMethods.exactCache.call(this,items);
        },
        inclusionCache: function(items){
          var that = this,
              attr = this.attr || this.name;
          _(items).each(function(i){
            _(i[attr]).each(function(v){
              var p = that.possibilities[v];
              if(p){
                p.matching_cids = PourOver.insert_sorted(p.matching_cids,i.cid);
              }
            });
          });
        },
        inclusionAddCache: function(items){
          PourOver.cacheMethods.inclusionCache.call(this,items);
        }
      }
    };
        // Copied from Backbone
        var array = [];
        var push = array.push;
        var slice = array.slice;
        var splice = array.splice;
        var Events = PourOver.Events = {

        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        on: function(name, callback, context) {
          if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
          this._events || (this._events = {});
          var events = this._events[name] || (this._events[name] = []);
          events.push({callback: callback, context: context, ctx: context || this});
          return this;
        },

        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function(name, callback, context) {
          if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
          var self = this;
          var once = _.once(function() {
            self.off(name, once);
            callback.apply(this, arguments);
          });
          once._callback = callback;
          return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function(name, callback, context) {
          var retain, ev, events, names, i, l, j, k;
          if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
          if (!name && !callback && !context) {
            this._events = void 0;
            return this;
          }
          names = name ? [name] : _.keys(this._events);
          for (i = 0, l = names.length; i < l; i++) {
            name = names[i];
            if (events = this._events[name]) {
              this._events[name] = retain = [];
              if (callback || context) {
                for (j = 0, k = events.length; j < k; j++) {
                  ev = events[j];
                  if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                      (context && context !== ev.context)) {
                    retain.push(ev);
                  }
                }
              }
              if (!retain.length) delete this._events[name];
            }
          }

          return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function(name) {
          if (!this._events) return this;
          var args = slice.call(arguments, 1);
          if (!eventsApi(this, 'trigger', name, args)) return this;
          var events = this._events[name];
          var allEvents = this._events.all;
          if (events) triggerEvents(events, args);
          if (allEvents) triggerEvents(allEvents, arguments);
          return this;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function(obj, name, callback) {
          var listeningTo = this._listeningTo;
          if (!listeningTo) return this;
          var remove = !name && !callback;
          if (!callback && typeof name === 'object') callback = this;
          if (obj) (listeningTo = {})[obj._listenId] = obj;
          for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
          }
          return this;
        }

      };

      // Regular expression used to split event strings.
      var eventSplitter = /\s+/;

      // Implement fancy features of the Events API such as multiple event
      // names `"change blur"` and jQuery-style event maps `{change: action}`
      // in terms of the existing API.
      var eventsApi = function(obj, action, name, rest) {
        if (!name) return true;

        // Handle event maps.
        if (typeof name === 'object') {
          for (var key in name) {
            obj[action].apply(obj, [key, name[key]].concat(rest));
          }
          return false;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
          var names = name.split(eventSplitter);
          for (var i = 0, l = names.length; i < l; i++) {
            obj[action].apply(obj, [names[i]].concat(rest));
          }
          return false;
        }

        return true;
      };

      // A difficult-to-believe, but optimized internal dispatch function for
      // triggering events. Tries to keep the usual cases speedy (most internal
      // PourOver events have 3 arguments).
      var triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
          case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
          case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
          case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
          case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
          default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
        }
      };

      var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

      // Inversion-of-control versions of `on` and `once`. Tell *this* object to
      // listen to an event in another object ... keeping track of what it's
      // listening to.
      _.each(listenMethods, function(implementation, method) {
        Events[method] = function(obj, name, callback) {
          var listeningTo = this._listeningTo || (this._listeningTo = {});
          var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
          listeningTo[id] = obj;
          if (!callback && typeof name === 'object') callback = this;
          obj[implementation](name, callback, this);
          return this;
        };
      });

      // Aliases for backwards compatibility.
      Events.bind   = Events.on;
      Events.unbind = Events.off;

      // Allow the `PourOver` object to serve as a global event bus, for folks who
      // want global "pubsub" in a convenient place.
      _.extend(PourOver, Events);
      // #Collections
      //The main kind of object in Pourover. A collection is basically a wrapper around an array of objects.
      //It adds collection ids to its members and has support for various ways of retrieving all or a part of
      //its members.

      PourOver.Collection = function(items,opts){
        if(typeof(items) == "undefined"){items = [];}
        this.items = [];
        this.filters = {};
        this.sorts = {};
        this.addItems(items);
        this.on("change",function(){
          _(this.filters).each(function(f){ if(f.current_query){f.current_query.refresh();} });
        });
        this.initialize.apply(this, arguments);
      };

      _.extend(PourOver.Collection.prototype,PourOver.Events,{
          initialize: function(){},
          // Force the filters and sorts of a collection to refresh. Generally most useful if you have batched
          // up a bunch of silented actions and you want to refresh once at the end.
          refresh: function(){
            this.trigger("queryChange");
          },

          // Retrive the objects associated with an array of cids. Like everything in Pourover, the cids must be sorted.
          // This is not ususally an issue as you generally will not be calling `collection.get` with an array you
          // manually create. You will probably be using the output of some function that keeps it sorted for you.
          get: function(cids){
            return PourOver.Collection.prototype.getBy.call(this,"cid",cids,true);
          },

          // Similar to get, except -- rather than getting items by cid -- you are getting them by [attr_name].
          // Here vals is an array of [attr_names]s.
          getBy: function(attr_name,vals,sorted){
            if(! _.isArray(vals)){ var vals = [vals] }
            if(typeof(sorted) == "undefined"){sorted = false;}
            var low = 0, high = this.items.length,lc = 0, hc = vals.length, output = [],items = this.items,i;
            if(sorted == true){
              while (low < high && lc < hc){
                if (vals[lc] == (i=items[low])[attr_name]){
                  output.push(i);
                  low++;
                  lc++;
                } else if (vals[lc] < i[attr_name]){
                  lc++;
                } else{
                  low++;
                }
              }
            } else if (sorted == "reverse"){
              while (low < high && lc < hc){
                if (vals[lc] == (i=items[low])[attr_name]){
                  output.push(i);
                  low++;
                  lc++;
                } else if (vals[lc] > i[attr_name]){
                  lc++;
                } else{
                  low++;
                }
              }
            } else {
              while (low < high && lc < hc){
                if ( _(vals).include((i=items[low])[attr_name])){
                  output.push(i);
                  vals = _(vals).without(i[attr_name]);
                  low++;
                  lc++;
                } else {
                  low++;
                }
              }
            }
            return output;
          },

          // Add items to the collection, triggering the appropriate events to keep all dependent sort and filter sets up-to-date.
          addItems: function(i){
            this.trigger("will_change");
            if(! _.isArray(i)){ var i = [i] }
            var last_id = this.items.length > 0 ? _(this.items).last().cid + 1 : 0,new_items;
            new_items = _(i).map(function(c){var n = PourOver.Item(c); n.cid = last_id++; return n;});
            this.items = this.items.concat(new_items);
            this.regenerateFilterSets(new_items);
            this.trigger("change");
          },

          // Remove items from the collection, triggering the appropriate events to keep all dependent sort and filter sets up-to-date.
          // This functionality is only included begrudgingly. Pourover is best for collections that rarely remove members.
          // TODO: Optimize
          removeItems: function(i,isSorted){
            this.trigger("will_change");
            if(typeof(isSorted) === "undefined"){var isSorted = false}
            if(! _.isArray(i)){ var i = [i] }
            if(isSorted){
              i = i.sort(function(a,b){return a.cid - b.cid ;});
              var new_items = [],old_items = this.items,new_length = i.length,old_length = this.items.length,newi = 0, oldi = 0;
              while(oldi < old_length){
                if(! newi < new_length){
                  new_items = new_items.concat(old_items.slice(oldi));
                  break;
                } else if(old_items[oldi].cid === i[newi].cid){
                  newi++;
                  oldi++;
                } else {
                  new_items.push(old_items[oldi]);
                  oldi++;
                }
              }
            } else {
              var new_items = [], old_items = this.items,old_length = this.items.length, oldi = 0,delete_cids = _(i).pluck("cid");
              while(oldi < old_length && delete_cids.length > 0){
                if(_(delete_cids).include(old_items[oldi].cid)){

                } else {
                  new_items.push(old_items[oldi]);
                }
                oldi++;
              }
            }
            this.items = new_items;
            this.regenerateFilterSets();
            this.trigger("change");
          },

          // # Collection filter functions
          // All filters are associated to collections rather than views. This allows for multiple views to share the same filter.
          // This is especially useful for modal situations in which you can set filters on a grid view that are reflected in the
          // one up view as well.
          addFilters: function(f){
            var that = this,new_filters;
            if(! _.isArray(f)){ var f = [f] }
            new_filters = _(f).reduce(function(m,i){ m[i.name] = _.clone(i); m[i.name].collection = that; return m; },{});
            this.filters = _(this.filters).extend(new_filters);
            // Bubble all query change events up from the individual filters to the collection. This allows a developers to
            // specify events that should be triggered whenever any filter's query is changed.
            _(new_filters).each(function(f){
              f.on("queryChange",function(){
                that.trigger("queryChange");
              });
              // All filters precache the result of their filtering. This is the source of pourover's speed optimizations.
              f.cacheResults(that.items);
              // If a user passes in an `associated_attrs` property on a filter, that filter will re-cache its result whenever
              // any object in the collection has an attribute changed. Setting `associated_attrs` is essential for admins or
              // other uses in which filterable values can change.
              if(f.associated_attrs){
                _(f.associated_attrs).each(function(a){
                  that.on("change:"+a,function(objs){
                    f.removeFromCache(objs);
                    f.addCacheResults(objs);
                    if(f.current_query){f.current_query.refresh();}
                  });
                });
              }
            });
          },

          // A shortcut to re-calculate the results of every filter. This is expensive if you do not pass in `new_items`, in which cases
          // only the new_items will be cached and the filters updated.
          regenerateFilterSets: function(new_items){
            var that = this;
            // If no new items are passed in, regenerate filters for all items in the collection
            if(typeof(new_items) == "undefined"){
              _(this.filters).each(function(f){
                f.cacheResults(that.items);
              });
            } else {
              _(this.filters).each(function(f){
                f.addCacheResults(new_items);
              });
            }
          },

          // A shortcut for returning a match object containing all the items in a collection. More on matches below.
          getAllItems: function(){
            var cids = _(this.items).map(function(i){return i.cid;});
            return new PourOver.MatchSet(cids,this,["all"]);
          },

          // Get the currently cached results for the last stateful query on a filter (the last time a `setQuery` was called on that filter.)
          // If `empty_default` is set to true, the function will return no items if the filter does not have a current query set. Otherwise,
          // the function will return all items in the collection. The former `empty_default` setting is useful when OR-ing filters together, when
          // you want an unset filter to represent an unselected dimension. The latter is useful when AND-ing filters together, when you
          // want an unset filter to comprise all objects in the collection.
          getCurrentFilteredItems: function(filter_name,empty_default){
            if(typeof(empty_default) === "undefined"){empty_default = false;}
            if(this.filters[filter_name].current_query && this.filters[filter_name].current_query.stack.length > 0){
              return this.filters[filter_name].current_query;
            } else {
              if(empty_default){
                return new PourOver.MatchSet([],this,[]);
              } else {
                return this.getAllItems();
              }
            }
          },

          // The non-stateful way to query a filter. Simply returns the result of the query but does not store the query on the filter.
          getFilteredItems: function(filter_name,query){
            var filter = this.filters[filter_name],possibility;
            if (_.isUndefined(filter) ) throw "The filter " + filter_name + " does not exist.";
            return filter.getFn(query);
          },

          // # Sort functions
          // Sorts, like filters, are generally stored on collections for the same reason that filters are stored on the collection rather than the view.
          // However, whereas filters keep track of their own state and this is shared between views, the state of which sort is enabled is stored on the view.

          addSort: function(sort){
            var that = this;
            this.sorts[sort.name] = sort;
            sort.collection = this;
            sort.rebuild_sort();
            this.on("change",function(){ sort.rebuild_sort(); });
            // Like filters, if you set `associated_attrs` on a sort, they will rebuild themselves whenever any item in the collection undergoes a change
            // on that attribute.
            // TODO: Consider cloning on add. Also, bring in line with addFilter (events or not!?)
            if(sort.associated_attrs){
              _(sort.associated_attrs).each(function(a){
                that.on("change:"+a,function(objs){
                  sort.rebuild_sort();
                });
              });
            }
          },

          // Add multiple sorts.
          addSorts: function(sorts){
            if(typeof(opts) === "undefined"){ opts = {};}
            if(! _(sorts).isArray()){sorts = [sorts];}
            var that = this;
            _(sorts).each(function(s){
              that.addSort(s);
            });
          },

          // The non-stateful way to retrieve all the items in the collection, sorted.
          getSortedItems: function(sort_name){
            var s = this.sorts[sort_name],that = this,output;
            return s.sort(this.items);
          },

          // A silly shortcut, pass in a cid and an attribute, retrieve its value. Useful for template helpers.
          getItemValue: function(cid,attribute){
            var item = _(this.items).find(function(i){return i.cid === Number(cid);});
            return item[attribute];
          },

          // Update the value of one attribute of one item in the collection.
          updateItem: function(cid,attribute,value){
            this.trigger("will_incremental_change");
            var item = _(this.items).find(function(i){return i.cid === Number(cid);});
            item[attribute] = value;
            this.trigger("change:"+attribute,[item]);
            this.trigger("incremental_change",[attribute]);
            this.trigger("update","updateItem");
            return item.guid;
          },

          // Change the value of one attribute of many items to the same value.
          batchUpdateItems: function(cids,attribute,value){
            this.trigger("will_incremental_change");
            var items = this.get(cids,true);
            _(items).each(function(i){
              i[attribute] = value;
            });
            this.trigger("change:"+attribute,items);
            this.trigger("incremental_change",[attribute]);
            this.trigger("update","batchUpdate");
            return _(items).pluck("guid");
          },

          // Change the value of several attributes of a single item in the collection.
          updateAttributes: function(cid,updates){
            this.trigger("will_incremental_change");
            var item = _(this.items).find(function(i){return i.cid === Number(cid);});
            var that = this;
            _(updates).each(function(v,k){
              item[k] = v;
              that.trigger("change:"+k,[item]);
            });
            this.trigger("incremental_change",_(updates).keys());
            this.trigger("update","updateAttribute");
            return item.guid;
          },

          // Change the value of several attributes of several items in the collection. Here 'updates'
          // is a hash of attributes -> new values.
          batchUpdateAttributes: function(cids,updates){
            this.trigger("will_incremental_change");
            var items = this.get(cids,true);
            var that = this;
            _(items).each(function(item){
              _(updates).each(function(v,k){
                item[k] = v;
              });
            });
            _(updates).each(function(v,k){
              that.trigger("change:"+k,items);
            });
            this.trigger("incremental_change",_(updates).keys());
            this.trigger("update");
            this.trigger("batchUpdateAttribute");
            return _(items).pluck("guid");
          }
      });

      // #Items
      // If we ever need to add properties to items in a collection, the code would go here.
      PourOver.Item = function(i){
        return i;
      },

      // #Filters

      // A filter is basically a rule for mapping items of a collection into groups based on attribute
      // values. It caches the results and can be queried either statefully or non-statefully, depending
      // on developer preference.
      PourOver.Filter = function(name,values,opts){
        if(typeof(opts) === "undefined"){opts = {};}
        this.name = name;
        this.possibilities = this.create_possibilities(values);
        this.values = _(values).map(function(v){return v.value;});
        _.extend(this,opts);
        this.initialize.apply(this, arguments);
      }

      _.extend(PourOver.Filter.prototype,PourOver.Events,{

        // Initialize is a no-op by default.
        initialize: function(){},

        // Given an array of possible values, initializes the object that will store the cached results
        // of querying for that possibility.
        create_possibilities: function(vs){
          var o = {};
          _(vs).each(function(v){
            var name = v.name || String(v.value);
            o[name] = v;
            o[name].matching_cids = [];
          });
          return o;
         },

         // cacheResults and addCacheResults are generic methods that are must be overridden before instantiating a filter.
         // The preset filters included below provide good examples of how these functions should be written. cacheResults
         // should cache all the items in the collection, whereas addCacheResults incrementally adds new items to already
         // cached, filtered results.
         cacheResults: function(items){
           throw "No cache function has been defined for this filter '" + this.name + "'.";
         },
         addCacheResults: function(items){
           throw "No add cache function has been defined for this filter '" + this.name + "'.";
         },

         makeQueryMatchSet: function(cids,query){
            return new PourOver.MatchSet(cids, this.getCollection(), [[this,query]]);
         },

         // Generally only used when removing items from a collection or when an item changes value. This will remove the item from
         // the cache so that it can either be recached with its new value or thrown away.
         removeFromCache: function(items){
          var cids = _(items).map(function(i){return i.cid;}).sort(function(a,b){return a-b;});
          _(this.possibilities).each(function(p){
            p.matching_cids = PourOver.subtract_sorted(p.matching_cids,cids);
          });
         },

         // The stateful way to query a filter. Delegates the retrieval of a MatchSet to the filter's getFn and caches the results on the filter.
         query: function(q,silent){
           if(typeof(silent) === "undefined"){var silent = false;}
           var match_set = this.getFn(q);
           this.setQuery(match_set,silent);
         },

         // Assigns a MatchSet to a filter (caches the result) and triggers the appropriate events.
         setQuery: function(q,silent){
           if(typeof(silent) === "undefined"){var silent = false;}
           this.current_query = q;
           if(!silent){
             this.trigger("queryChange");
           }
         },

         // Removes a cached result from a filter.
         clearQuery: function(silent){
           if(typeof(silent) === "undefined"){var silent = false;}
           this.current_query = false;
           if(!silent){
             this.trigger("queryChange");
           }
         },

         // Unions a cached result with another result (both being MatchSets) and produces a new MatchSet.
         unionQuery: function(q,silent){
           if(typeof(silent) === "undefined"){var silent = false;}
           if(typeof(q) === "string" || typeof(q) === "number" || _.isArray(q)){
             var q = this.getFn(q);
           }
           if(this.current_query){
             this.current_query = this.current_query.or(q);
           } else {
             this.current_query = q;
           }
           if(!silent){
             this.trigger("queryChange");
           }
         },

         // Intersects a cached result with another result (both being MatchSets) and produces a new MatchSet.
         intersectQuery: function(q,silent){
           if(typeof(silent) === "undefined"){var silent = false;}
           if(typeof(q) === "string" || typeof(q) === "number" || _.isArray(q)){
             var q = this.getFn(q);
           }
           if(this.current_query){
             this.current_query = this.current_query.and(q);
           } else {
             this.current_query = q;
           }
           if(!silent){
             this.trigger("queryChange");
           }
         },

         // Subtracts a cached result with another result (both being MatchSets) and produces a new MatchSet.
         subtractQuery: function(q,silent){
           if(typeof(silent) === "undefined"){var silent = false;}
           if(typeof(q) === "string" || typeof(q) === "number" || _.isArray(q)){
             var q = this.getFn(q);
           }
           if(this.current_query){
             this.current_query = this.current_query.not(q);
           } else {
             this.current_query = q;
           }
           if(!silent){
             this.trigger("queryChange");
           }
         },

         // This is the inverse of the three functions above. Removes a query from a compound, cached MatchSet on a filter.
         // This is useful when you have a UI in which subsequent selections union together. It is faster on a toggle to remove
         // the deselected possibility rather than re-union the remaining selected ones.
         // TODO: Test
         removeSingleQuery: function(q,silent){
           if(! this.current_query){return false;}
           if(typeof(silent) === "undefined"){var silent = false;}
           if(typeof(q) === "string" || typeof(q) === "number" || _.isArray(q)){
             var q = this.getFn(q);
           }
           var s = [],
               stack = this.current_query.stack,new_stack,
               is_compound = function(c){return _.isString(c) && c.match(/^(or|and|not)$/);};
            new_stack = _(stack).reduce(function(m,i){
              if(i[1] === q.stack[0][1]){
                return m;
              } else if(is_compound(i[0]) && i[1][0][1] === q.stack[0][1]){
                return m;
              } else {m.push(i); return m;}
            },s);
           if(new_stack[0] && (new_stack[0][0] == "and" || new_stack[0][0] == "or" || new_stack[0][0] == "not")){
             new_stack[0] = new_stack [0][1][0];
           }
           this.current_query.stack = new_stack;
           this.current_query.refresh();
           if(!silent){
             this.trigger("queryChange");
           }
         },

         // Convenice method for getting the collection attached to a filter.
         // Just an aesthetic thing. I like the explicit "getCollection" calls in
         // the rest of the code.
         getCollection: function(){
           return this.collection;
          }
      });

      // #Sorts
      //
      // Sorts cache different orderings of collection items and subsets thereof. Sorts generally belong to collections,
      // but they can belong to views as well for optimization concerns.
      PourOver.Sort = function(name,opts){
        this.name = name;
        _.extend(this,opts);
        this.initialize.apply(this, arguments);
      };

      _.extend(PourOver.Sort.prototype,PourOver.Events,{
        initialize: function(){},

        // By default, sorts are not view sorts. A view sort is attached to a specific view and only updates when that
        // view undergoes a queryChange.
        view: false,

        // Use a sort to order an array of cids
        sort: function(set){return PourOver.permute_from_array(set,this.permutation_array);},

        // Recache the results of sorting the collection.
        rebuild_sort: function(){
          if(this.view){
            var items = this.view.match_set.all();
          } else {
            var items = this.collection.items;
          }
          this.permutation_array = PourOver.build_permutation_array(items,this);
          this.trigger("resort");
        }
      });

      // #Views
      //
      // Views store a state of collection and are generally what should be rendered. There can be many views per collection.
      // Views can be paged. Moreover, a view has a selection function which tells the view how to compose its various filters to produce the current set.
      PourOver.View = function(name,collection,opts){
        var that = this;
        this.name = name;
        if(typeof(opts) === "undefined"){ opts = {};}
        this.collection = collection;
        this.match_set = new PourOver.MatchSet(_(this.collection.items).map(function(i){return i.cid;}),this.collection,["all"]);
        if(opts.template){this.template = opts.template;}

        // Whenever the collection gains or loses members, recache the MatchSet saved on the view.
        this.collection.on("will_change will_incremental_change",function(){
            that.storeViewPosition();
        });

        this.collection.on("change",function(){
          that.match_set.refresh();
          that.setNaturalSelection();
          that.resetPage();
        });

        // Whenever an item in the collection is changed, recache the MatchSet saved on the view.
        this.collection.on("incremental_change",function(attrs){
          that.match_set.refresh();
          that.setNaturalSelection(attrs);
          that.resetPage();
        });

        // Bubble all collection update events through.
        this.collection.on("update",function(f){
          that.trigger("update",f);
        });

        // Whenever any filter is queried statefully, reset the view's MatchSet; We don't have to refresh the match_set here. That is only necessary
        // when it's possible that a filter has stale information as a result of a change in the underlying data.
        this.collection.on("queryChange",function(){
          that.setNaturalSelection();
          that.trigger("update","query");
        });

        // Bubble up sortChange events as updates
        this.on("sortChange",function(){
          this.trigger("update","sort");
        });

        // Bubble up pageChange events as updates
        this.on("pageChange",function(){
          this.trigger("update","page");
        });
        _.extend(this,opts);
        this.initialize.apply(this, arguments);
      };

      _.extend(PourOver.View.prototype,PourOver.Events,{
        initialize: function(){},
        current_page: 0,
        view_sorts: [],

        // By default, return all items in the view.
        page_size: Infinity,
        current_sort: false,

        // Changes a view from being sorted to no longer being sorted.
        removeSort: function(){
          if(this.current_sort.off){this.current_sort.off("resort");}
          this.current_sort = false;
          this.trigger("sortChange");
        },

        // Sets a sort on a view and fires all appropriate events.
        setSort: function(sort_name,view_sort){
          if(typeof(view_sort) === "undefined"){view_sort = false;}
          var that = this;
          if(this.current_sort.off){this.current_sort.off("resort");}
          if(sort_name && view_sort){
            this.current_sort = this.view_sorts[sort_name];
            this.current_sort.on("resort",function(){that.trigger("sortChange");});
          } else if(sort_name){
            this.current_sort = this.collection.sorts[sort_name];
            this.current_sort.on("resort",function(){that.trigger("sortChange");});
          } else {
            this.current_sort = false;

          }
          this.trigger("sortChange");
        },

        // Return the name of the current sort of the view.
        getSort: function(){
          if (!this.current_sort){
            return false;
          } else {
            return this.current_sort.name;
          }
        },

        // Add a sort to the view. The difference between this and a collection sort is that this sort will
        // only change if the view receives a selectionChange.
        addViewSorts: function(sorts){
            if(typeof(opts) === "undefined"){ opts = {};}
            if(! _(sorts).isArray()){sorts = [sorts];}
            var that = this;
            _(sorts).each(function(sort){
              that.view_sorts[sort.name] = sort;
              sort.collection = that.collection;
              sort.view = that;
              sort.rebuild_sort();
              that.on("selectionChange",function(attrs){
                if(sort.associated_attrs == undefined){
                  sort.rebuild_sort();
                }
                if(sort.associated_attrs && _.intersection(sort.associated_attrs,attrs).length > 0){
                  sort.rebuild_sort();
                }
              });
            });
        },

        // IMPORTANT: This determines how a view composes the filters on a collection to generate results. Here, by default,
        // every filter on the collection is intersected. This is often the desired behavior. However, this must be overridden
        // if you want your view to do fancier things such as union some filters, difference others, and intersect the rest.
        selectionFn: function(){
          var collection = this.collection;
          var output = _(collection.filters).reduce(function(m,i){
            var q = i.current_query;
            if(m && (!q || _.isEmpty(q.stack))){ return m;}
            if(!m && (!q || _.isEmpty(q.stack))){return collection.getAllItems();}

            if(m){
              return m.and(q);
            } else {
              return q;
            }
          },false);
          return output;
        },

        // Caches a MatchSet on the view as the current match_set;
        setSelection: function(match_set,attrs){
          this.match_set = match_set;
          this.trigger("selectionChange",attrs);
        },

        // Delegates to the views selectionFn to generate an array of valid cids given the current filters.
        setNaturalSelection: function(attrs){
          var selection;
          selection = this.selectionFn();
          this.setSelection(selection,attrs);
        },

        // Removes a MatchSet from a view and replaces it with the universe of possible items.
        clearSelection: function(){this.match_set = this.collection.getAllItems();},

        // IMPORTANT: This is the function you will call most often on views. This returns the cached, filtered items and
        // then sorts them and pages them as appropriate.
        getCurrentItems: function(page){
          if(! this.match_set){return [];}
          if(typeof(page) === "undefined"){
            var page = this.current_page;
          }
          if(this.page_size == Infinity){
            if(this.current_sort){
              var items = this.match_set.all_sorted(this.current_sort);
            } else {
              var items = this.match_set.all();
            }
          } else {
          // TODO: Slice cids before reassociating
            if(this.current_sort){
              var items = this.match_set.all_sorted_cids(this.current_sort);
              items = items.slice(this.page_size * page,this.page_size * (page + 1));
              var ordered_cids = _(items).clone().sort(function(a,b){return a-b;});
              var unsorted_items = this.collection.get(ordered_cids);
              items = _(items).map(function(i){return _(unsorted_items).find(function(o){return o.cid === i;});});
            } else {
              var items = this.match_set.cids;
              items = items.slice(this.page_size * page,this.page_size * (page + 1));
              items = this.collection.get(items);
            }
          }
          return items;
        },

        storeViewPosition: function(){
            var head_item =  this.getCurrentItems()[0];
            if(head_item){
                this.last_head_cid = head_item.cid;
            }
        },

        resetPage: function(){
            if(this.last_head_cid){
                if(this.current_sort){
                    this.current_sort.rebuild_sort();
                }
                this.pageTo(this.last_head_cid,true);
            }
            this.last_head_cid = undefined;
        },

        // Change the page of the view by [dir] pages. Negative values to page back.
        page: function(dir){
          var new_dir = dir + this.current_page;
          if(new_dir < 0) new_dir = 0;
          if(new_dir > Math.ceil(this.match_set.length()/this.page_size - 1)) new_dir = Math.ceil(this.match_set.length()/this.page_size - 1);
          this.current_page = new_dir;
          this.trigger("pageChange");
        },

        // Page to a specific cid.
        pageTo: function(cid,silent){
          if(typeof(silent) == "undefined"){
            var silent = false;
          }
          if(this.current_sort){
            var index = _(this.match_set.all_sorted_cids(this.current_sort)).indexOf(cid),
                len = this.match_set.cids.length,
                page = Math.floor(index/this.page_size);
          } else {
            var index = _(this.match_set.cids).indexOf(cid),
                len = this.match_set.cids.length,
                page = Math.floor(index/this.page_size);
          }
          if(index >= 0){
              this.current_page = page;
              if(! silent){
                this.trigger("pageChange");
              }
          }
        },

        // Change the page of the view to a specific page.
        setPage: function(page) {
          if(page < 0) page = 0;
          if(page > Math.ceil(this.match_set.length()/this.page_size - 1)) page = Math.ceil(this.match_set.length()/this.page_size - 1);
          this.current_page = page;
          this.trigger("pageChange");
        },

        // Set the page size.
        setPageSize: function(size){
          this.page_size = size;
          this.trigger("pageChange");
        },
        render: function(){}
      });

      // #MatchSets
      //
      // These are what are returned from queries on filters. They can be chained together with ands, or, & nots.
      // They also keep a "stack" to remember how they were created (after chaining) so that they can refresh themselves.
      PourOver.MatchSet = function(cids,collection,stack){
        this.cids = cids;
        this.collection = collection;
        this.stack = stack;
        this.initialize.apply(this, arguments);
      };
      _.extend(PourOver.MatchSet.prototype,PourOver.Events,{
        initialize: function(){},

        // When the underlying data has changed re-evaluate which items are included in this possibily compound result.
        refresh: function(s,match_set){
         if(typeof(s) === "undefined"){var s = this.stack || []}
         if(s.length < 1 && match_set){
           this.cids = match_set.cids;
           return this;
         } else if (s.length < 1){
           this.cids = false;
           return this;
         }

         var step = s[0],
             operation = step[0],
             is_compound = function(c){return _.isString(c) && c.match(/^(or|and|not)$/);};
         if(typeof(operation) === "object"){
           var match_set = operation.getFn(step[1]);
           return this.refresh(_(s).rest(),match_set);
         } else if(operation === "all" || step === "all") {
           var cids = _(this.collection.items).map(function(i){return i.cid;});
           var match_set = new PourOver.MatchSet(cids,this,["all"]);
           return this.refresh(_(s).rest(),match_set)
         } else if(is_compound(operation)) {
             var m = match_set[operation](this.refresh(step[1]));
         } else {
             var m = this.refresh(step[1]);
         }
         return this.refresh(_(s).rest(),m);
        },

        // Intersect this MatchSet with another MatchSet.
        and: function(other_matches){
          if(this.stack.length < 1 && other_matches){
            return other_matches;
          } else if (!other_matches){
            return this;
          } else {
            var set = PourOver.intersect_sorted(this.cids,other_matches.cids);
            return new PourOver.MatchSet(set,this.collection,this.stack.concat([["and",other_matches.stack]]))
          }
        },

        // Union this MatchSet with another MatchSet.
        or: function(other_matches){
          if(this.stack.length < 1 && other_matches){
            return other_matches;
          } else if (!other_matches){
            return this;
          } else {
            var set = PourOver.union_sorted(this.cids,other_matches.cids);
            return new PourOver.MatchSet(set,this.collection,this.stack.concat([["or",other_matches.stack]]));
          }
        },

        // Difference this MatchSet with another MatchSet.
        not: function(other_matches){
          if(this.stack.length < 1 || ! other_matches){
            return this;
          } else {
            var set = PourOver.subtract_sorted(this.cids,other_matches.cids);
            return new PourOver.MatchSet(set,this.collection,this.stack.concat([["not",other_matches.stack]]));
          }
        },

        // Return all the items corresponding to the cids cached on the MatchSet.
        all: function(){ return this.collection.get(this.cids);},

        // Return a slice of the items corresponding to the cids cached on the MatchSet.
        slice: function(s,e){ return this.collection.get(this.cids.slice(s,e)) },

        // Return all the items corresponding to the cids cached on the MatchSet AND sorted by sort s.
        all_sorted: function(s){
          var c = this.all();
          if(s){
            return s.sort(c);
          } else {
            return c;
          }
        },

        // Sort the cached cids.
        all_sorted_cids: function(s){
          var c = this.cids;
          if(s){
            return s.sort(c);
          } else {
            return c;
          }
        },

        // Return how many items comprise this MatchSet.
        length: function(){return this.cids.length}
      });


    // #PourOver.UI
    // PourOver.UI is a simple add-on for creating objects to be rendered as UI elements controlling the
    // state of filters and views.
    PourOver.UI = {}
    PourOver.UI.Element = function(opts){
        if(typeof(opts) === "undefined"){var opts = {}}
        _.extend(this,opts)
        this.initialize.apply(this, arguments);
    }

    _.extend(PourOver.UI.Element.prototype,PourOver.Events,{
      initialize: function(){},
      getMatchSet: function(){
        throw "No get match set function specified"
      },
      getFilterState: function(){
        throw "No get filter state specified";
      },
      template: function(){
        throw "No template specified"
      },
      render: function(){
        var filter_state = this.getFilterState(),
            output = this.template({state:filter_state});
        return output
      },
      // Pass in a MatchSet that only has a single query of a chain of OR'ed queried and receive
      // an array of possibility names that have been selected.
      getSimpleSelectState: function(match_set,s,output){
          if(typeof(match_set) === "undefined" || !match_set || !match_set.stack){return false}
          if(typeof(s) === "undefined"){var s = match_set.stack}
          if(typeof(output) === "undefined"){var output = []}
          if(s.length < 1){
            return output;
          } else if (typeof(s[0][0]) === "object"){
            output.push(s[0][1]);
            return this.getSimpleSelectState(match_set,_(s).rest(),output);
          } else if (s[0][0] === "or"){
            output = output.concat(this.getSimpleSelectState(match_set,s[0][1]));
            return this.getSimpleSelectState(match_set,_(s).rest(),output);
          } else {
            throw "This does not appear to be a valid, simple selectElement stack."
          }
      },
      getIntersectedSelectState: function(match_set,s,output){
          if(typeof(match_set) === "undefined" || !match_set || !match_set.stack){return false}
          if(typeof(s) === "undefined"){var s = match_set.stack}
          if(typeof(output) === "undefined"){var output = []}
          if(s.length < 1){
            return output;
          } else if (typeof(s[0][0]) === "object"){
            output.push(s[0][1]);
            return this.getIntersectedSelectState(match_set,_(s).rest(),output);
          } else if (s[0][0] === "and"){
            output = output.concat(this.getIntersectedSelectState(match_set,s[0][1]));
            return this.getIntersectedSelectState(match_set,_(s).rest(),output);
          } else {
            throw "This does not appear to be a valid, simple selectElement stack."
          }
      },

      // Pass in a MatchSet that is the result of a single, non-compounded range and receive the
      // value of that range.
      getSimpleRangeState: function(match_set){
        if(typeof(match_set) === "undefined" || !match_set || !match_set.stack){return false}
        stack = match_set.stack;
        if(stack.length !== 1 || stack[0][1].length !== 2){throw "The filter specified does not appear to have a simple range stack."}
        return stack[0][1];
      }

      // TODO: Added more UI gets.
    });


    // From Backbone
    // Helper function to correctly set up the prototype chain, for subclasses.
      // Similar to `goog.inherits`, but uses a hash of prototype properties and
      // class properties to be extended.
      PourOver.extend = function(protoProps, staticProps) {
          var parent = this;
          var child;

          // The constructor function for the new subclass is either defined by you
          // (the "constructor" property in your `extend` definition), or defaulted
          // by us to simply call the parent's constructor.
          if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
          } else {
            child = function() {
              return parent.apply(this, arguments);
            };
          }

          // Add static properties to the constructor function, if supplied.
          _.extend(child, parent, staticProps);

          // Set the prototype chain to inherit from `parent`, without calling
          // `parent`'s constructor function.
          var Surrogate = function() {
              this.constructor = child;
            };
          Surrogate.prototype = parent.prototype;
          child.prototype = new Surrogate;

          // Add prototype properties (instance properties) to the subclass,
          // if supplied.
          if (protoProps) _.extend(child.prototype, protoProps);

          // Set a convenience property in case the parent's prototype is needed
          // later.
          child.__super__ = parent.prototype;

          return child;
        };


      PourOver.Collection.extend = PourOver.View.extend = PourOver.Filter.extend = PourOver.Sort.extend = PourOver.MatchSet.extend = PourOver.UI.Element.extend = PourOver.extend

      // #Presets

      // A PourOver buffered collection is one that stores some or all of its data as a promise. This is useful in conjunction with a
      // large data set in which you don't want to load all the data at page open.
      PourOver.BufferedCollection = PourOver.Collection.extend({
        buffered_items: {},
        stripFutures: function(item){
          return _(item).reduce(function(m,v,k){if(typeof(v) != "undefined"){m[k] = v} return m},{});
        },

        // Overrides the base get function with one that buffers in whole values from the server
        get: function(cids,raw){
          if(typeof(raw) === "undefined"){var raw = false}
          var items = PourOver.Collection.prototype.get.call(this,cids),
              that = this;
          if(raw){return items;}
          return _(items).map(function(i){
            var guid = i.guid, new_item;
            if(that.buffered_items.hasOwnProperty(guid)){
              return _(that.buffered_items[guid]).extend(that.stripFutures(i));
            } else {
              return i;
            }
          });
        },
        getBy: function(attr_name,vals,sorted,raw){
          if(typeof(raw) === "undefined"){var raw = false}
          var items = PourOver.Collection.prototype.getBy.call(this,attr_name,vals,sorted),
              that = this;
          if(raw){return items;}
          return _(items).map(function(i){
            var guid = i.guid, new_item;
            if(that.buffered_items.hasOwnProperty(guid)){
              return _(that.buffered_items[guid]).extend(that.stripFutures(i));
            } else {
              return i;
            }
          });
        },

        // Retrieve a specific attr of a specific item from the buffer.
        getBufferedValue: function(guid,attr){
          if(this.buffered_items.hasOwnProperty(guid)){
            return this.buffered_items[guid][attr] || false;
          } else {
            return false;
          }
        },

        // Delete all buffered values for items in the collection.
        clearBufferedItems: function (){
          var buffered_items = this.buffered_items;
          for (var p in buffered_items){
            if (buffered_items.hasOwnProperty(p)){
                delete buffered_items[p];
            }
          }
        },

        // When instantiating a buffered collection you must provide this method. This is how a buffered collection
        // knows what URL to fetch new data from.
        getBufferUrl: function(guids){
          throw "You must override getBufferUrl;"
        },
        preprocessItem: function(item){
          return [item["guid"],item]
        },

        // Pull down new data for an array of guids from the server at the URL returned by getBufferUrl. When the request returns,
        // push the new values into the buffer. The deferred object is returned from this method so you can chain additional callbacks
        // onto the resolution such as a render action.
        bufferGuids: function(guids){
          var that = this,
              guids = _(guids).select(function(g){ return g &&  ! that.buffered_items.hasOwnProperty(g);}),
              buffurl = this.getBufferUrl(guids),
              url = buffurl[0],
              jsonpCallback = buffurl[1];
          if(guids.length > 0){
            return $.ajax({
              url: url,
              dataType:'jsonp',
              cache: true
            }).always(function(d){
              if(_.isArray(d)){
                items = _(d).map(_.bind(that.preprocessItem,that));
                _(items).each(function(i){
                  that.buffered_items[i[0]] = i[1];
                });
              }
            });
          } else {
            return $.Deferred().resolve(false);
          }
        }
      });

      // A buffered view is the pair to a buffered collection. It calls the appropriate buffering methods of the buffered collection
      // so that you automatically get the benefits of buffering as you are paging through the view. If you use a buffered view with a buffered collection
      // you shouldn't need to call the buffering methods of the collection explicitly.
      PourOver.BufferedView = PourOver.View.extend({
        buffer_pages: 1,
        bufferAroundCurrentPage: function(){
          var current_page = this.current_page,
              low_bound = current_page - this.buffer_pages > 0 ? current_page - this.buffer_pages : 0,
              high_bound = current_page + this.buffer_pages,
              range = _.range(low_bound,high_bound + 1),
              that = this;
          range = _(range).map(function(page){
            return _(that.getCurrentItems(page)).pluck("guid");
          });
          var guids = _.flatten(range);
          buffer_deferred = this.collection.bufferGuids(guids);
          buffer_deferred.done(function(d){
              if(d){
                that.render();
              }
          })
        },
        bufferRender: function(){
          var guids = _(this.getCurrentItems()).pluck('guid'),
              buffer_deferred = this.collection.bufferGuids(guids);
          buffer_deferred.done(_(function(){
            this.render()
          }).bind(this));
        },
        page: function(dir){
          PourOver.View.prototype.page.call(this,dir);
          this.bufferAroundCurrentPage();
        },
        pageTo: function(cid,silent){
          if(typeof(silent) === "undefined"){
            var silent = false;
          }
          PourOver.View.prototype.pageTo.call(this,cid,silent);
          this.bufferAroundCurrentPage();
        }
      })

      // ## Filter defaults
      //
      // A strange filter that selects items based on an explicit list of cids. This is useful when you want to use PourOver in association
      // with, say, an editorially composed list of items or any mechanic in which you can "select" items to be included in a filter independent of
      // any attribute.
      PourOver.manualFilter = PourOver.Filter.extend({
        cacheResults: function(){return false},
        addCacheResults: function(){return false},
        getFn: function(query){
          if(_(query).isArray()){
            query = query.sort(function(a,b){return a - b})
            return new PourOver.MatchSet(query,this.getCollection(),[[this,query]]);
          } else if (typeof(query) === "number") {
            return new PourOver.MatchSet([query],this.getCollection(),[[this,query]]);
          } else {
            throw "Manual filters only support querying by one or more cids"
          }
        },
        addItems: function(cids){
          if(! _(cids).isArray()){cids = [cids]}
          cids = cids.sort(function(a,b){return a - b});
          if(this.current_query){
            var current_query = this.current_query.cids,
                new_query = PourOver.union_sorted(current_query,cids);
          } else {
            var new_query = cids;
          }
          this.query(new_query);
        },
        removeItems: function(cids){
          if(! _(cids).isArray()){cids = [cids]}
          cids = cids.sort(function(a,b){return a - b});
          var current_query = this.current_query.cids,
              new_query = PourOver.subtract_sorted(current_query,cids);
          this.query(new_query);
        }
      });

      // The convenience constructor for manual filters.
      PourOver.makeManualFilter = function(name){
        var filter = new PourOver.manualFilter(name,[]);
        return filter;
      }

      // An exact filter is the most commonly used filter. Given an attribute and a list of possibilities, an exact filter will bucket the items
      // into those satisfying each of the possibilities. This also has the fastest peformance as far as creating and updating.
      PourOver.exactFilter = PourOver.Filter.extend({
        cacheResults: PourOver.cacheMethods.exactCache,
        addCacheResults: PourOver.cacheMethods.exactAddCache,
        getFn: function(query){
          var that = this;
          if(_(query).isArray()){
            var match_set = _(query).reduce(function(m,i){
              if(!m){
                return that.getFn(i);
              } else {
                return m.or(that.getFn(i));
              }
            },false);
            return match_set;
          } else {
            var possibility = this.possibilities[query];
            if (_.isUndefined(possibility) ) throw "The filter " + this.name + " does not have a match for the query '" + query + "'.";
            return new PourOver.MatchSet(possibility.matching_cids,this.getCollection(),[[this,query]]);
          }
        }
      });

      // The convenience constructor for exact filters.
      PourOver.makeExactFilter = function(name,values,opts){
        if(typeof(opts) === "undefined"){opts = {}}
        var values = _(values).map(function(i){return {value:i}}),
            attr = opts.attr || name,
            opts = _.extend({associated_attrs: [attr]},opts),
            filter = new PourOver.exactFilter(name,values,opts);
        return filter;
      }

      PourOver.inclusionFilter = PourOver.exactFilter.extend({
        cacheResults: PourOver.cacheMethods.inclusionCache,
        addCacheResults: PourOver.cacheMethods.inclusionAddCache
      });

      PourOver.makeInclusionFilter = function(name,values,opts){
        if(typeof(opts) === "undefined"){opts = {}}
        var values = _(values).map(function(i){return {value:i}}),
            attr = opts.attr || name,
            opts = _.extend({associated_attrs: [attr]},opts),
            filter = new PourOver.inclusionFilter(name,values,opts);
        return filter;
      };

      // A range filter is for dividing items into buckets of ranges based on a specific attribute. A good example is, say, each item as 0-1000 "friends", then you can
      // supply a range filter with the possibilities: [[0,10],[11,100],[101,1000]] and it will create buckets for 0-10, 11-100, and 101 + friends.
      PourOver.rangeFilter = PourOver.Filter.extend({
        cacheResults: PourOver.cacheMethods.defaultCache,
        addCacheResults: PourOver.cacheMethods.defaultAddCache,
        fn: function(possibility,item){
          var attr = this.attr || this.name;
          return possibility.low <= item[attr] && possibility.high >= item[attr]
        },
        getFn: function(query){
          var possibility = this.possibilities[query.join("-")];
          if (_.isUndefined(possibility) ) throw "The filter " + this.name + " does not have a match for the query '" + query + "'.";
          return new PourOver.MatchSet(possibility.matching_cids,this.getCollection(),[[this,query]]);
        }
      });

      // The convenience constructor for range filters.
      PourOver.makeRangeFilter = function(name,ranges,opts){
        if(typeof(opts) === "undefined"){opts = {}}
        var values = _(ranges).map(function(r){return {low: r[0], high: r[1], value: r.join("-")}}),
            attr = opts.attr || name,
            newopts = _.extend({associated_attrs: [attr]},opts),
            filter = new PourOver.rangeFilter(name,values,newopts);
        return filter;
      }

      // The inverse of a range filter. Again each item has single value for a certain attribute, but the possibilities you provide are every value of that attribute.
      // Then, you query by a range. So, if a person can have 1-10 hats, you would feed a dv range filter the possibilities [1,2,3,4,5,6,7,8,9,10] and then make
      // queries such as [2,5] for 2-5 hats. Do not use this for huge ranges like 1-100. Use crossfilter or write some optimized way of doing this. PourOver is not optimized
      // for that kind of continuous query.
      PourOver.dvrangeFilter = PourOver.Filter.extend({
        cacheResults:  PourOver.cacheMethods.exactCache,
        addCacheResults: PourOver.cacheMethods.exactAddCache,
        getFn: function(query){
          if(! query[0] || ! query[1]){
            return new PourOver.MatchSet([],this.getCollection(),[[this,query]]);
          }
          var li,hi,that,possibilities,cids;
          li = _(this.values).indexOf(query[0]);
          hi = _(this.values).indexOf(query[1]);
          that = this;
          possibilities = _(this.values.slice(li,hi+1)).map(function(p){return that.possibilities[p]});
          cids = _(possibilities).reduce(function(m,i){ return PourOver.union_sorted(m,i.matching_cids) },[]);
          return new PourOver.MatchSet(cids,this.getCollection(),[[this,query]]);
        }
      });

      // The convenience constructor for dv range filters.
      PourOver.makeDVrangeFilter = function(name,v,opts){
        if(typeof(opts) === "undefined"){opts = {}}
        var values = _(v).map(function(i){return {value:i}}),
            attr = opts.attr || name,
            newopts = _.extend({associated_attrs: [attr]},opts),
            filter = new PourOver.dvrangeFilter(name,values,newopts);
        return filter
      }

      // ## Preset sorts
      //
      // Sorts items based on an explicit ordering of values. This would be useful for, say, a slideshow in which
      // the order of items has nothing to do with any of their filterable attributes. Comes with methods to reorganize
      // the items in the sort.
      PourOver.explicitSort = PourOver.Sort.extend({
        fn: function(a,b){
          var a_index = _(this.order).indexOf(a[this.attr]),
              b_index = _(this.order).indexOf(b[this.attr]);
          if(a_index === -1) {a_index = 1/0}
          if(b_index === -1) {b_index = 1/0}
          return a_index - b_index;
        },
        reset: function(items){
          this.order = _(items).pluck(this.attr);
          this.rebuild_sort();
        },

        // Insert an item into the sort.
        insert: function(items,index){
          if(typeof(index) === "undefined"){var index = this.order.length}
          if(! _(items).isArray()){items = [items]}
          var new_order = _(items).pluck(this.attr),
              args = [index,0].concat(new_order);
          this.order.splice.apply(this.order,args);
          this.rebuild_sort();
        },

        // Remove an item from the sort.
        remove: function(items){
          if(! _(items).isArray()){items = [items]}
          var attrs = _(items).pluck(this.attr);
          this.order = _(this.order).difference(attrs);
          this.rebuild_sort();
        },

        // Move an item from one place to another in the sort.
        move: function(items,index){
          if(! _(items).isArray()){items = [items]}
          var attrs = _(items).pluck(this.attr);
          this.order = _(this.order).map(function(o){ return _(attrs).include(o) ? null : o });
          this.insert(items,index);
          this.order = _(this.order).compact();
        }
      });

      // The convenience constructor for an explicit sort.
      PourOver.makeExplicitSort = function(name,collection,attr,order,opts){
        var sort = new PourOver.explicitSort(name,opts);
        sort.attr = attr;
        sort.order = order;
        return sort;
      }

      PourOver.reverseCidSort = PourOver.Sort.extend({
        fn: function(a,b){
            return b.cid - a.cid;
        }
      })

      PourOver.makeReverseCidSort = function(name,collection){
        var sort = new PourOver.reverseCidSort(name);
        sort.attr = "cid";
        return sort;
      }

      // ## Preset UI elements
      //
      // A simple select element is roughly equavalent to elements such as a checklist or a radio list.
      // Items can only be unioned together. One or more selected.
      PourOver.UI.SimpleSelectElement = PourOver.UI.Element.extend({
        initialize: function(opts){
          if(!opts.filter){throw "A simple select element must have a filter specified"}
          this.filter = opts.filter;
        },
        getMatchSet: function(){
          return this.filter.current_query;
        },
        getFilterState: function(){
          var match_set = this.getMatchSet();
          return this.getSimpleSelectState(match_set)
        }
      });

      // A dv range element can be used for a slider in which you set the low and high and the query
      // corresponds to everything in between.
      PourOver.UI.SimpleDVRangeElement = PourOver.UI.Element.extend({
        initialize: function(opts){
          if(!opts.filter){throw "A simple dv range element must have a filter specified"}
          this.filter = opts.filter;
        },
        getMatchSet: function(){
          return this.filter.current_query;
        },
        getFilterState: function(){
          var match_set = this.getMatchSet();
          return this.getSimpleRangeState(match_set)
        }
      });

    return PourOver;
})();