var PourOver=(function(){var i=function(){};var c=_.create||function(m){i.prototype=m;var l=new i;i.prototype=null;return l};PourOver={union_sorted:function(s,r){var o=0,n=0,q=s.length,p=r.length,t=[],m,l;while(q>o||p>n){m=s[o];l=r[n];if(_.isUndefined(m)){m=Infinity}if(_.isUndefined(l)){l=Infinity}if(o==q){return t.concat(r.slice(n,p))}if(n==p){return t.concat(s.slice(o,q))}if(m==l){t.push(m);o++;n++}else{if(m<l){t.push(m);o++}else{t.push(l);n++}}}return t},intersect_sorted:function(s,r){var o=0,n=0,q=s.length,p=r.length,t=[],m,l;while(q>o&&p>n){m=s[o];l=r[n];if(m==l){t.push(m);o++;n++}else{if(m<l){o++}else{n++}}}return t},subtract_sorted:function(s,r){var o=0,n=0,q=s.length,p=r.length,t=[],m,l;while(q>o||p>n){m=s[o];l=r[n];if(q==o){return t}if(p==n){return t.concat(s.slice(o,q))}if(m==l){o++;n++}else{if(m<l){t.push(m);o++}else{n++}}}return t},insert_sorted:function(p,m){var o=p.length,l=0,n=p[o-1];if(m>n){p.push(m);return p}while(l<o){if(m<p[l]){return p.slice(0,l).concat([m]).concat(p.slice(l,o))}else{l++}}p.push(m);return p},build_permutation_array:function(o,m){var l=_.clone(o),n=[];if(typeof(m)==="function"){l.sort(m)}else{l.sort(function(q,p){return m.fn.call(m,q,p)})}_.each(l,function(p,q){n[p.cid]=q});return n},permute_from_array:function(n,m){var l=[];if(typeof(n[0])==="number"){_.each(n,function(o){l[m[o]]=o})}else{_.each(n,function(o){l[m[o.cid]]=o})}return _.without(l,undefined)},remove_sorted:function(o,m){var n=o.length,l=0;while(l<n){if(m==o[l]){return o.slice(0,l).concat(o.slice(l+1,n))}else{l++}}return o},bisect_by:function(l){function m(p,o,s,r){while(s<r){var q=s+r>>>1;if(l(p[q])<o){s=q+1}else{r=q}}return s}function n(p,o,s,r){while(s<r){var q=s+r>>>1;if(o<l(p[q])){r=q}else{s=q+1}}return s}n.right=n;n.left=m;return n},cacheMethods:{defaultCache:function(l){var m=this;_.each(m.possibilities,function(q){var n=_.filter(l,function(p){return m.fn(q,p)}),o=_.pluck(n,"cid");q.matching_cids=o})},defaultAddCache:function(l){var m=this;_.each(m.possibilities,function(q){var n=_.filter(l,function(p){return m.fn(q,p)}),o=_.pluck(n,"cid");q.matching_cids=PourOver.union_sorted(q.matching_cids,o)})},exactCache:function(m){var n=this,l=this.attr||this.name;_.each(m,function(o){var q=n.possibilities[o[l]];if(q&&!_.contains(q.matching_cids,o.cid)){q.matching_cids=PourOver.insert_sorted(q.matching_cids,o.cid)}})},exactAddCache:function(l){PourOver.cacheMethods.exactCache.call(this,l)},inclusionCache:function(m){var n=this,l=this.attr||this.name;_.each(m,function(o){_.each(o[l],function(q){var r=n.possibilities[q];if(r){r.matching_cids=PourOver.insert_sorted(r.matching_cids,o.cid)}})})},inclusionAddCache:function(l){PourOver.cacheMethods.inclusionCache.call(this,l)}}};var e=[];var g=e.push;var h=e.slice;var b=e.splice;var k=PourOver.Events={on:function(l,o,n){if(!f(this,"on",l,[o,n])||!o){return this}this._events||(this._events={});var m=this._events[l]||(this._events[l]=[]);m.push({callback:o,context:n,ctx:n||this});return this},once:function(m,p,n){if(!f(this,"once",m,[p,n])||!p){return this}var l=this;var o=_.once(function(){l.off(m,o);p.apply(this,arguments)});o._callback=p;return this.on(m,o,n)},off:function(m,v,n){var t,u,w,s,r,o,q,p;if(!this._events||!f(this,"off",m,[v,n])){return this}if(!m&&!v&&!n){this._events=void 0;return this}s=m?[m]:_.keys(this._events);for(r=0,o=s.length;r<o;r++){m=s[r];if(w=this._events[m]){this._events[m]=t=[];if(v||n){for(q=0,p=w.length;q<p;q++){u=w[q];if((v&&v!==u.callback&&v!==u.callback._callback)||(n&&n!==u.context)){t.push(u)}}}if(!t.length){delete this._events[m]}}}return this},trigger:function(n){if(!this._events){return this}var m=h.call(arguments,1);if(!f(this,"trigger",n,m)){return this}var o=this._events[n];var l=this._events.all;if(o){d(o,m)}if(l){d(l,arguments)}return this},stopListening:function(o,m,q){var n=this._listeningTo;if(!n){return this}var l=!m&&!q;if(!q&&typeof m==="object"){q=this}if(o){(n={})[o._listenId]=o}for(var p in n){o=n[p];o.off(m,q,this);if(l||_.isEmpty(o._events)){delete this._listeningTo[p]}}return this}};var j=/\s+/;var f=function(t,r,n,q){if(!n){return true}if(typeof n==="object"){for(var p in n){t[r].apply(t,[p,n[p]].concat(q))}return false}if(j.test(n)){var s=n.split(j);for(var o=0,m=s.length;o<m;o++){t[r].apply(t,[s[o]].concat(q))}return false}return true};var d=function(r,p){var s,q=-1,o=r.length,n=p[0],m=p[1],t=p[2];switch(p.length){case 0:while(++q<o){(s=r[q]).callback.call(s.ctx)}return;case 1:while(++q<o){(s=r[q]).callback.call(s.ctx,n)}return;case 2:while(++q<o){(s=r[q]).callback.call(s.ctx,n,m)}return;case 3:while(++q<o){(s=r[q]).callback.call(s.ctx,n,m,t)}return;default:while(++q<o){(s=r[q]).callback.apply(s.ctx,p)}return}};var a={listenTo:"on",listenToOnce:"once"};_.each(a,function(l,m){k[m]=function(p,n,r){var o=this._listeningTo||(this._listeningTo={});var q=p._listenId||(p._listenId=_.uniqueId("l"));o[q]=p;if(!r&&typeof n==="object"){r=this}p[l](n,r,this);return this}});k.bind=k.on;k.unbind=k.off;_.extend(PourOver,k);PourOver.Collection=function(l,m){if(typeof(l)=="undefined"){l=[]}this.items=[];this.filters={};this.sorts={};this.addItems(l);this.on("change",function(){_.each(this.filters,function(n){if(n.current_query){n.current_query.refresh()}});_.each(this.sorts,function(n){n.rebuild_sort(true)})});this.initialize.apply(this,arguments)};_.extend(PourOver.Collection.prototype,PourOver.Events,{initialize:function(){},refresh:function(){this.trigger("queryChange")},get:function(l){return PourOver.Collection.prototype.getBy.call(this,"cid",l,true)},getBy:function(u,t,q){if(!_.isArray(t)){var t=[t]}if(typeof(q)=="undefined"){q=false}var s=0,n=this.items.length,l=0,p=t.length,m=[],r=this.items,o;if(q==true){while(s<n&&l<p){if(t[l]==(o=r[s])[u]){m.push(o);s++;l++}else{if(t[l]<o[u]){l++}else{s++}}}}else{if(q=="reverse"){while(s<n&&l<p){if(t[l]==(o=r[s])[u]){m.push(o);s++;l++}else{if(t[l]>o[u]){l++}else{s++}}}}else{while(s<n&&l<p){if(_.include(t,(o=r[s])[u])){m.push(o);t=_.without(t,o[u]);s++;l++}else{s++}}}}return m},getByFirst:function(s,r,o){if(typeof(o)=="undefined"){o=false}var l=0,q=this.items.length,n=undefined,m=this.items,p;if(o==true){while(l<q){if(r==(p=m[l])[s]){n=p;break}else{if(r<p[s]){break}else{l++}}}}else{if(o=="reverse"){while(l<q){if(r==(p=m[l])[s]){n=p;break}else{if(r>p[s]){break}else{l++}}}}else{while(l<q){if(r==(p=m[l])[s]){n=p;break}else{l++}}}}return n},addItems:function(l){this.trigger("will_change");if(!_.isArray(l)){l=[l]}var m=this.items.length>0?_.last(this.items).cid+1:0,n;n=_.map(l,function(p){var o=PourOver.Item(p);o.cid=m++;return o});this.items=this.items.concat(n);this.regenerateFilterSets(n);this.trigger("change",_(n).pluck("cid"))},removeItems:function(p,m){this.trigger("will_change");if(typeof(m)==="undefined"){var m=false}if(!_.isArray(p)){var p=[p]}if(m){p=p.sort(function(v,u){return v.cid-u.cid});var r=[],q=this.items,n=p.length,t=this.items.length,o=0,l=0;while(l<t){if(!o<n){r=r.concat(q.slice(l));break}else{if(q[l].cid===p[o].cid){o++;l++}else{r.push(q[l]);l++}}}}else{var r=[],q=this.items,t=this.items.length,l=0,s=_.pluck(p,"cid");while(l<t&&s.length>0){if(_.include(s,q[l].cid)){}else{r.push(q[l])}l++}}this.items=r;this.regenerateFilterSets();this.trigger("change",_(p).pluck("cid"))},addFilters:function(m){var l=this,n;if(!_.isArray(m)){m=[m]}n=_.reduce(m,function(o,p){o[p.name]=c(p);o[p.name].collection=l;return o},{});this.filters=_.extend(this.filters,n);_.each(n,function(o){o.on("queryChange",function(){l.trigger("queryChange")});o.cacheResults(l.items);if(o.associated_attrs){_.each(o.associated_attrs,function(p){l.on("change:"+p,function(q){o.removeFromCache(q);o.addCacheResults(q);if(o.current_query){o.current_query.refresh()}})})}})},regenerateFilterSets:function(m){var l=this;if(typeof(m)=="undefined"){_.each(this.filters,function(n){n.cacheResults(l.items)})}else{_.each(this.filters,function(n){n.addCacheResults(m)})}},getAllItems:function(){var l=_.pluck(this.items,"cid");return new PourOver.MatchSet(l,this,["all"])},getCurrentFilteredItems:function(m,l){if(typeof(l)==="undefined"){l=false}if(this.filters[m].current_query&&this.filters[m].current_query.stack.length>0){return this.filters[m].current_query}else{if(l){return new PourOver.MatchSet([],this,[])}else{return this.getAllItems()}}},getFilteredItems:function(n,m){var l=this.filters[n],o;if(_.isUndefined(l)){throw"The filter "+n+" does not exist."}return l.getFn(m)},addSort:function(l){var m=this;this.sorts[l.name]=l;l.collection=this;l.rebuild_sort();if(l.associated_attrs){_.each(l.associated_attrs,function(n){m.on("change:"+n,function(o){l.rebuild_sort()})})}},addSorts:function(m){if(typeof(opts)==="undefined"){opts={}}if(!_.isArray(m)){m=[m]}var l=this;_.each(m,function(n){l.addSort(n)})},getSortedItems:function(l){var n=this.sorts[l],o=this,m;return n.sort(this.items)},getItemValue:function(n,m){var l=_.find(this.items,function(o){return o.cid===Number(n)});return l[m]},updateItem:function(o,m,n){this.trigger("will_incremental_change");var l=_.find(this.items,function(p){return p.cid===Number(o)});l[m]=n;this.trigger("change:"+m,[l]);this.trigger("incremental_change",[m]);this.trigger("update","updateItem");return l.guid},removeItemAttribute:function(o,m,n){this.trigger("will_incremental_change");var l=_.find(this.items,function(p){return p.cid===Number(o)});delete l[m];this.trigger("change:"+m,[l]);this.trigger("incremental_change",[m]);this.trigger("update","updateItem");return l.guid},batchUpdateItems:function(m,n,o){this.trigger("will_incremental_change");var l=this.get(m,true);_.each(l,function(p){p[n]=o});this.trigger("change:"+n,l);this.trigger("incremental_change",[n]);this.trigger("update","batchUpdate");return _.pluck(l,"guid")},updateAttributes:function(p,o,l){if(typeof(l)==="undefined"){var l=false}this.trigger("will_incremental_change");var n=_.find(this.items,function(q){return q.cid===Number(p)});var m=this;_.each(o,function(r,q){n[q]=r;m.trigger("change:"+q,[n])});this.trigger("incremental_change",_.keys(o));if(!l){this.trigger("update","updateAttribute")}return n.guid},batchUpdateAttributes:function(n,p,m){if(typeof(m)==="undefined"){var m=false}this.trigger("will_incremental_change");var l=this.get(n,true);var o=this;_.each(l,function(q){_.each(p,function(s,r){q[r]=s})});_.each(p,function(r,q){o.trigger("change:"+q,l)});this.trigger("incremental_change",_.keys(p));if(!m){this.trigger("update","batchUpdate");this.trigger("batchUpdateAttribute")}return _.pluck(l,"guid")},batchLoadItems:function(m){this.trigger("will_incremental_change");var p=[],o=_.pluck(m,"guid"),n=this.getBy("guid",o),l={};_(n).each(function(q){l[q.guid]=q});_.each(m,_.bind(function(t){var r=l[t.guid],q=this.items.length>0?_(this.items).last().cid+1:0,s;if(r){s=r;_.each(t,function(w,u){s[u]=w})}else{r=PourOver.Item(t);r.cid=q++;p.push(r.cid);this.items=this.items.concat([r]);n[r.guid]=r}},this));this.regenerateFilterSets();this.trigger("incremental_change","*");this.trigger("change",p);this.trigger("update","batchLoad");this.trigger("batchLoadItems")}});PourOver.Item=function(l){return l},PourOver.Filter=function(m,l,n){if(typeof(n)==="undefined"){n={}}this.name=m;this.possibilities=this.create_possibilities(l);this.values=_.pluck(l,"value");_.extend(this,n);this.initialize.apply(this,arguments)};_.extend(PourOver.Filter.prototype,PourOver.Events,{initialize:function(){},create_possibilities:function(m){var l={};_.each(m,function(n){var o=n.name||String(n.value);l[o]=n;l[o].matching_cids=[]});return l},cacheResults:function(l){throw"No cache function has been defined for this filter '"+this.name+"'."},addCacheResults:function(l){throw"No add cache function has been defined for this filter '"+this.name+"'."},makeQueryMatchSet:function(l,m){return new PourOver.MatchSet(l,this.getCollection(),[[this,m]])},removeFromCache:function(l){var m=_.pluck(l,"cid").sort(function(o,n){return o-n});_.each(this.possibilities,function(n){n.matching_cids=PourOver.subtract_sorted(n.matching_cids,m)})},query:function(n,l){if(typeof(l)==="undefined"){var l=false}var m=this.getFn(n);this.setQuery(m,l)},setQuery:function(m,l){if(typeof(l)==="undefined"){var l=false}this.current_query=m;if(!l){this.trigger("queryChange")}},clearQuery:function(l){if(typeof(l)==="undefined"){var l=false}this.current_query=false;if(!l){this.trigger("queryChange")}},unionQuery:function(m,l){if(typeof(l)==="undefined"){var l=false}if(typeof(m)==="string"||typeof(m)==="number"||_.isArray(m)){var m=this.getFn(m)}if(this.current_query){this.current_query=this.current_query.or(m)}else{this.current_query=m}if(!l){this.trigger("queryChange")}},intersectQuery:function(m,l){if(typeof(l)==="undefined"){var l=false}if(typeof(m)==="string"||typeof(m)==="number"||_.isArray(m)){var m=this.getFn(m)}if(this.current_query){this.current_query=this.current_query.and(m)}else{this.current_query=m}if(!l){this.trigger("queryChange")}},subtractQuery:function(m,l){if(typeof(l)==="undefined"){var l=false}if(typeof(m)==="string"||typeof(m)==="number"||_.isArray(m)){var m=this.getFn(m)}if(this.current_query){this.current_query=this.current_query.not(m)}else{this.current_query=m}if(!l){this.trigger("queryChange")}},removeSingleQuery:function(o,m){if(!this.current_query){return false}if(typeof(m)==="undefined"){var m=false}if(typeof(o)==="string"||typeof(o)==="number"||_.isArray(o)){var o=this.getFn(o)}var n=[],l=this.current_query.stack,p,r=function(q){return _.isString(q)&&q.match(/^(or|and|not)$/)};p=_.reduce(l,function(q,s){if(s[1]===o.stack[0][1]){return q}else{if(r(s[0])&&s[1][0][1]===o.stack[0][1]){return q}else{q.push(s);return q}}},n);if(p[0]&&(p[0][0]=="and"||p[0][0]=="or"||p[0][0]=="not")){p[0]=p[0][1][0]}this.current_query.stack=p;this.current_query.refresh();if(!m){this.trigger("queryChange")}},getCollection:function(){return this.collection},getByPossibilityGroups:function(){var l=this.collection;return _.reduce(this.possibilities,function(n,q,o){n[o]=l.get(q.matching_cids);return n},{})}});PourOver.Sort=function(l,m){this.name=l;_.extend(this,m);this.initialize.apply(this,arguments)};_.extend(PourOver.Sort.prototype,PourOver.Events,{initialize:function(){},view:false,sort:function(l){return PourOver.permute_from_array(l,this.permutation_array)},rebuild_sort:function(m){if(typeof(m)==="undefined"){m=false}if(this.view){var l=this.view.match_set.all()}else{var l=this.collection.items}this.permutation_array=PourOver.build_permutation_array(l,this);this.trigger("resort",m)}});PourOver.View=function(l,o,n){var m=this;this.name=l;if(typeof(n)==="undefined"){n={}}this.collection=o;this.match_set=new PourOver.MatchSet(_.pluck(this.collection.items,"cid"),this.collection,["all"]);if(n.template){this.template=n.template}this.collection.on("will_change will_incremental_change",function(){m.storeViewPosition()});this.collection.on("change",function(){m.match_set.refresh();m.setNaturalSelection();m.resetPage();m.trigger("collection-change")});this.collection.on("incremental_change",function(p){m.match_set.refresh();m.setNaturalSelection(p);m.resetPage();m.trigger("collection-incremental-change")});this.collection.on("update",function(p){m.trigger("update",p)});this.collection.on("queryChange",function(){m.setNaturalSelection();m.trigger("update","query")});this.on("sortChange",function(){this.trigger("update","sort")});this.on("pageChange",function(){this.trigger("update","page")});this.view_sorts=[];_.extend(this,n);this.initialize.apply(this,arguments)};_.extend(PourOver.View.prototype,PourOver.Events,{initialize:function(){},current_page:0,page_size:Infinity,current_sort:false,removeSort:function(){if(this.current_sort.off){this.current_sort.off("resort")}this.current_sort=false;this.trigger("sortChange")},setSort:function(l,o,m){if(typeof(o)==="undefined"){o=false}if(typeof(m)==="undefined"){m=false}var n=this;if(this.current_sort.off){this.current_sort.off("resort")}if(l&&o){this.current_sort=this.view_sorts[l];this.current_sort.on("resort",_.bind(function(p){if(!(this.silent_sort&&p)){n.trigger("sortChange")}},this))}else{if(l){this.current_sort=this.collection.sorts[l];this.current_sort.on("resort",_.bind(function(p){if(!(this.silent_sort&&p)){n.trigger("sortChange")}},this))}else{this.current_sort=false}}if(!m){this.trigger("sortChange")}},getSort:function(){if(!this.current_sort){return false}else{return this.current_sort.name}},addViewSorts:function(m){if(typeof(opts)==="undefined"){opts={}}if(!_.isArray(m)){m=[m]}var l=this;_.each(m,function(n){l.view_sorts[n.name]=n;n.collection=l.collection;n.view=l;n.rebuild_sort();l.on("selectionChange",function(o){if(n.associated_attrs==undefined||o==="*"){n.rebuild_sort()}if(n.associated_attrs&&_.intersection(n.associated_attrs,o).length>0){n.rebuild_sort()}})})},selectionFn:function(){var m=this.collection;if(_.isEmpty(m.filters)){return m.getAllItems()}var l=_.reduce(m.filters,function(n,o){var p=o.current_query;if(n&&(!p||_.isEmpty(p.stack))){return n}if(!n&&(!p||_.isEmpty(p.stack))){return m.getAllItems()}if(n){return n.and(p)}else{return p}},false);return l},setSelection:function(m,l){this.match_set=m;this.trigger("selectionChange",l)},setNaturalSelection:function(l){var m;m=this.selectionFn();this.setSelection(m,l)},clearSelection:function(){this.match_set=this.collection.getAllItems()},getCurrentItems:function(o){if(!this.match_set){return[]}if(typeof(o)==="undefined"){var o=this.current_page}if(this.page_size==Infinity){if(this.current_sort){var m=this.match_set.all_sorted(this.current_sort)}else{var m=this.match_set.all()}}else{if(this.current_sort){var m=this.match_set.all_sorted_cids(this.current_sort);m=m.slice(this.page_size*o,this.page_size*(o+1));var n=_.clone(m).sort(function(q,p){return q-p});var l=this.collection.get(n);m=_.map(m,function(p){return _.findWhere(l,{cid:p})})}else{var m=this.match_set.cids;m=m.slice(this.page_size*o,this.page_size*(o+1));m=this.collection.get(m)}}return m},storeViewPosition:function(){var l=this.getCurrentItems()[0];if(l){this.last_head_cid=l.cid}},resetPage:function(){if(this.last_head_cid){if(this.current_sort){this.current_sort.rebuild_sort()}this.pageTo(this.last_head_cid,true)}this.last_head_cid=undefined},page:function(l){var m=l+this.current_page;if(m<0){m=0}if(m>Math.ceil(this.match_set.length()/this.page_size-1)){m=Math.ceil(this.match_set.length()/this.page_size-1)}this.current_page=m;this.trigger("pageChange")},pageTo:function(p,m){if(typeof(m)=="undefined"){var m=false}if(this.current_sort){var n=_.indexOf(this.match_set.all_sorted_cids(this.current_sort),p),l=this.match_set.cids.length,o=Math.floor(n/this.page_size)}else{var n=_.indexOf(this.match_set.cids,p),l=this.match_set.cids.length,o=Math.floor(n/this.page_size)}if(n>=0){this.current_page=o;if(!m){this.trigger("pageChange")}}},setPage:function(l){if(l<0){l=0}if(l>Math.ceil(this.match_set.length()/this.page_size-1)){l=Math.ceil(this.match_set.length()/this.page_size-1)}this.current_page=l;this.trigger("pageChange")},setPageSize:function(l){this.page_size=l;this.trigger("pageChange")},render:function(){}});PourOver.MatchSet=function(m,n,l){this.cids=m;this.collection=n;this.stack=l;this.initialize.apply(this,arguments)};_.extend(PourOver.MatchSet.prototype,PourOver.Events,{initialize:function(){},refresh:function(p,r){if(typeof(p)==="undefined"){var p=this.stack||[]}if(p.length<1&&r){this.cids=r.cids;return this}else{if(p.length<1){this.cids=false;return this}}var q=p[0],n=q[0],t=function(m){return _.isString(m)&&m.match(/^(or|and|not)$/)};if(typeof(n)==="object"){r=n.getFn(q[1]);return this.refresh(_.rest(p),r)}else{if(n==="all"||q==="all"){var o=_.pluck(this.collection.items,"cid");r=new PourOver.MatchSet(o,this,["all"]);return this.refresh(_.rest(p),r)}else{if(t(n)){var l=r[n](this.refresh(q[1]))}else{var l=this.refresh(q[1])}}}return this.refresh(_.rest(p),l)},and:function(l){if(this.stack.length<1&&l){return l}else{if(!l){return this}else{var m=PourOver.intersect_sorted(this.cids,l.cids);return new PourOver.MatchSet(m,this.collection,this.stack.concat([["and",l.stack]]))}}},or:function(l){if(this.stack.length<1&&l){return l}else{if(!l){return this}else{var m=PourOver.union_sorted(this.cids,l.cids);return new PourOver.MatchSet(m,this.collection,this.stack.concat([["or",l.stack]]))}}},not:function(l){if(this.stack.length<1||!l){return this}else{var m=PourOver.subtract_sorted(this.cids,l.cids);return new PourOver.MatchSet(m,this.collection,this.stack.concat([["not",l.stack]]))}},all:function(){return this.collection.get(this.cids)},slice:function(l,m){return this.collection.get(this.cids.slice(l,m))},all_sorted:function(l){var m=this.all();if(l){return l.sort(m)}else{return m}},all_sorted_cids:function(l){var m=this.cids;if(l){return l.sort(m)}else{return m}},length:function(){return this.cids.length}});PourOver.UI={};PourOver.UI.Element=function(l){if(typeof(l)==="undefined"){var l={}}_.extend(this,l);this.initialize.apply(this,arguments)};_.extend(PourOver.UI.Element.prototype,PourOver.Events,{initialize:function(){},getMatchSet:function(){throw"No get match set function specified"},getFilterState:function(){throw"No get filter state specified"},template:function(){throw"No template specified"},render:function(){var m=this.getFilterState(),l=this.template({state:m});return l},getSimpleSelectState:function(n,m,l){if(typeof(n)==="undefined"||!n||!n.stack){return false}if(typeof(m)==="undefined"){m=n.stack}if(typeof(l)==="undefined"){l=[]}if(m.length<1){return l}else{if(typeof(m[0][0])==="object"){l.push(m[0][1]);return this.getSimpleSelectState(n,_.rest(m),l)}else{if(m[0][0]==="or"){l=l.concat(this.getSimpleSelectState(n,m[0][1]));return this.getSimpleSelectState(n,_.rest(m),l)}else{throw"This does not appear to be a valid, simple selectElement stack."}}}},getIntersectedSelectState:function(n,m,l){if(typeof(n)==="undefined"||!n||!n.stack){return false}if(typeof(m)==="undefined"){m=n.stack}if(typeof(l)==="undefined"){l=[]}if(m.length<1){return l}else{if(typeof(m[0][0])==="object"){l.push(m[0][1]);return this.getIntersectedSelectState(n,_.rest(m),l)}else{if(m[0][0]==="and"){l=l.concat(this.getIntersectedSelectState(n,m[0][1]));return this.getIntersectedSelectState(n,_.rest(m),l)}else{throw"This does not appear to be a valid, simple selectElement stack."}}}},getSimpleRangeState:function(l){if(typeof(l)==="undefined"||!l||!l.stack){return false}stack=l.stack;if(stack.length!==1||stack[0][1].length!==2){throw"The filter specified does not appear to have a simple range stack."}return stack[0][1]}});PourOver.extend=function(l,n){var m=this;var p;if(l&&_.has(l,"constructor")){p=l.constructor}else{p=function(){return m.apply(this,arguments)}}_.extend(p,m,n);var o=function(){this.constructor=p};o.prototype=m.prototype;p.prototype=new o;if(l){_.extend(p.prototype,l)}p.__super__=m.prototype;return p};PourOver.Collection.extend=PourOver.View.extend=PourOver.Filter.extend=PourOver.Sort.extend=PourOver.MatchSet.extend=PourOver.UI.Element.extend=PourOver.extend;PourOver.BufferedCollection=PourOver.Collection.extend({initialize:function(){this.buffered_items={}},stripFutures:function(l){return _.reduce(l,function(n,p,o){if(typeof(p)!="undefined"){n[o]=p}return n},{})},get:function(n,m){if(typeof(m)==="undefined"){m=false}var l=PourOver.Collection.prototype.get.call(this,n),o=this;if(m){return l}return _.map(l,function(q){var p=q.guid,r;if(o.buffered_items.hasOwnProperty(p)){return _.extend(o.buffered_items[p],o.stripFutures(q))}else{return q}})},getBy:function(q,p,m,n){if(typeof(n)==="undefined"){n=false}var l=PourOver.Collection.prototype.getBy.call(this,q,p,m),o=this;if(n){return l}return _.map(l,function(s){var r=s.guid,t;if(o.buffered_items.hasOwnProperty(r)){return _.extend(o.buffered_items[r],o.stripFutures(s))}else{return s}})},getBufferedValue:function(m,l){if(this.buffered_items.hasOwnProperty(m)){return this.buffered_items[m][l]||false}else{return false}},clearBufferedItems:function(){var m=this.buffered_items;for(var l in m){if(m.hasOwnProperty(l)){delete m[l]}}},getBufferUrl:function(l){throw"You must override getBufferUrl;"},preprocessItem:function(l){return[l.guid,l]},bufferGuids:function(n){var m=this;n=_.select(n,function(q){return q&&!m.buffered_items.hasOwnProperty(q)});var p=this.getBufferUrl(n),l=p[0],o=p[1];if(n.length>0){return $.ajax({url:l,dataType:"jsonp",cache:true}).always(function(q){if(_.isArray(q)){items=_.map(q,m.preprocessItem,m);_.each(items,function(r){m.buffered_items[r[0]]=r[1]})}})}else{return $.Deferred().resolve(false)}}});PourOver.BufferedView=PourOver.View.extend({buffer_pages:1,bufferAroundCurrentPage:function(){var q=this.current_page,l=q-this.buffer_pages>0?q-this.buffer_pages:0,n=q+this.buffer_pages,m=_.range(l,n+1),o=this;m=_.map(m,function(r){return _.pluck(o.getCurrentItems(r),"guid")});var p=_.flatten(m);buffer_deferred=this.collection.bufferGuids(p);buffer_deferred.done(function(r){if(r){o.render()}})},bufferRender:function(){var m=_.pluck(this.getCurrentItems(),"guid"),l=this.collection.bufferGuids(m);l.done(_.bind(function(){this.render()},this))},page:function(l){PourOver.View.prototype.page.call(this,l);this.bufferAroundCurrentPage()},pageTo:function(m,l){if(typeof(l)==="undefined"){l=false}PourOver.View.prototype.pageTo.call(this,m,l);this.bufferAroundCurrentPage()}});PourOver.manualFilter=PourOver.Filter.extend({cacheResults:function(){return false},addCacheResults:function(){return false},getFn:function(l){if(_.isArray(l)){l=l.sort(function(n,m){return n-m});return new PourOver.MatchSet(l,this.getCollection(),[[this,l]])}else{if(typeof(l)==="number"){return new PourOver.MatchSet([l],this.getCollection(),[[this,l]])}else{throw"Manual filters only support querying by one or more cids"}}},addItems:function(n){if(!_.isArray(n)){n=[n]}n=n.sort(function(p,o){return p-o});if(this.current_query){var l=this.current_query.cids,m=PourOver.union_sorted(l,n)}else{var m=n}this.query(m)},removeItems:function(n){if(!_.isArray(n)){n=[n]}n=n.sort(function(p,o){return p-o});var l=this.current_query.cids,m=PourOver.subtract_sorted(l,n);this.query(m)}});PourOver.makeManualFilter=function(l){var m=new PourOver.manualFilter(l,[]);return m};PourOver.exactFilter=PourOver.Filter.extend({cacheResults:PourOver.cacheMethods.exactCache,addCacheResults:PourOver.cacheMethods.exactAddCache,getFn:function(n){var l=this;if(_.isArray(n)){var m=_.reduce(n,function(p,q){if(!p){return l.getFn(q)}else{return p.or(l.getFn(q))}},false);return m}else{var o=this.possibilities[n];if(_.isUndefined(o)){throw"The filter "+this.name+" does not have a match for the query '"+n+"'."}return new PourOver.MatchSet(o.matching_cids,this.getCollection(),[[this,n]])}}});PourOver.makeExactFilter=function(n,m,o){if(typeof(o)==="undefined"){o={}}var l=o.attr||n;m=_.map(m,function(p){return{value:p}});o=_.extend({associated_attrs:[l]},o);return new PourOver.exactFilter(n,m,o)};PourOver.inclusionFilter=PourOver.exactFilter.extend({cacheResults:PourOver.cacheMethods.inclusionCache,addCacheResults:PourOver.cacheMethods.inclusionAddCache});PourOver.makeInclusionFilter=function(n,m,o){if(typeof(o)==="undefined"){o={}}var l=o.attr||n;m=_.map(m,function(p){return{value:p}});o=_.extend({associated_attrs:[l]},o);return new PourOver.inclusionFilter(n,m,o)};PourOver.rangeFilter=PourOver.Filter.extend({cacheResults:PourOver.cacheMethods.defaultCache,addCacheResults:PourOver.cacheMethods.defaultAddCache,fn:function(n,m){var l=this.attr||this.name;return n.low<=m[l]&&n.high>=m[l]},getFn:function(l){var m=this.possibilities[l.join("-")];if(_.isUndefined(m)){throw"The filter "+this.name+" does not have a match for the query '"+l+"'."}return new PourOver.MatchSet(m.matching_cids,this.getCollection(),[[this,l]])}});PourOver.makeRangeFilter=function(o,m,q){if(typeof(q)==="undefined"){q={}}var n=_.map(m,function(s){return{low:s[0],high:s[1],value:s.join("-")}}),l=q.attr||o,r=_.extend({associated_attrs:[l]},q),p=new PourOver.rangeFilter(o,n,r);return p};PourOver.dvrangeFilter=PourOver.Filter.extend({cacheResults:PourOver.cacheMethods.exactCache,addCacheResults:PourOver.cacheMethods.exactAddCache,getFn:function(q){if(!q[0]||!q[1]){return new PourOver.MatchSet([],this.getCollection(),[[this,q]])}var l,n,p,m,o;l=_.indexOf(this.values,q[0]);n=_.indexOf(this.values,q[1]);p=this;m=_.map(this.values.slice(l,n+1),function(r){return p.possibilities[r]});o=_.reduce(m,function(r,s){return PourOver.union_sorted(r,s.matching_cids)},[]);return new PourOver.MatchSet(o,this.getCollection(),[[this,q]])}});PourOver.makeDVrangeFilter=function(o,n,q){if(typeof(q)==="undefined"){q={}}var m=_.map(n,function(s){return{value:s}}),l=q.attr||o,r=_.extend({associated_attrs:[l]},q),p=new PourOver.dvrangeFilter(o,m,r);return p};PourOver.continuousRangeFilter=PourOver.Filter.extend({cacheResults:function(l){this.values=_.map(l,function(m){return{cid:m.cid,val:m[this.name]}},this);this.values.sort(function(n,m){return n.val-m.val})},addCacheResults:function(l){this.values=this.values.concat(l);this.values.sort(function(n,m){return n.val-m.val})},getFn:function(q){var l,m;var s=this.values.length;var r=PourOver.bisect_by(function(n){return n.val});if(_.isArray(q)){if(_.isUndefined(q[0])||_.isUndefined(q[1])){return new PourOver.MatchSet([],this.getCollection(),[[this,q]])}l=r.left(this.values,q[0],0,s);m=r.left(this.values,q[1],0,s)}else{if(_.isUndefined(q)){return new PourOver.MatchSet([],this.getCollection(),[[this,q]])}l=r.left(this.values,q,0,s);m=r.right(this.values,q,0,s)}var p=[];var o=l;while(o<m){p.push(this.values[o].cid);++o}p.sort(function(t,n){return t-n});return new PourOver.MatchSet(p,this.getCollection(),[[this,q]])}});PourOver.makeContinuousRangeFilter=function(m,o){if(typeof(o)==="undefined"){o={}}var l=o.attr||m,p=_.extend({associated_attrs:[l]},o),n=new PourOver.continuousRangeFilter(m,p);return n};PourOver.explicitSort=PourOver.Sort.extend({fn:function(m,l){var n=_.indexOf(this.order,m[this.attr]),o=_.indexOf(this.order,l[this.attr]);if(n===-1){n=1/0}if(o===-1){o=1/0}return n-o},reset:function(l){this.order=_.pluck(l,this.attr);this.rebuild_sort()},insert:function(l,n){if(typeof(n)==="undefined"){n=this.order.length}if(!_.isArray(l)){l=[l]}var o=_.pluck(l,this.attr),m=[n,0].concat(o);this.order.splice.apply(this.order,m);this.rebuild_sort()},remove:function(l){if(!_.isArray(l)){l=[l]}var m=_.pluck(l,this.attr);this.order=_.difference(this.order,m);this.rebuild_sort()},move:function(l,n){if(!_.isArray(l)){l=[l]}var m=_.pluck(l,this.attr);this.order=_.map(this.order,function(p){return _.include(m,p)?null:p});this.insert(l,n);this.order=_.compact(this.order)}});PourOver.makeExplicitSort=function(n,q,m,l,p){var o=new PourOver.explicitSort(n,p);o.associated_attrs=[m];o.order=l;return o};PourOver.reverseCidSort=PourOver.Sort.extend({fn:function(m,l){return l.cid-m.cid}});PourOver.makeReverseCidSort=function(l,n){var m=new PourOver.reverseCidSort(l);m.associated_attrs=["cid"];return m};PourOver.UI.SimpleSelectElement=PourOver.UI.Element.extend({initialize:function(l){if(!l.filter){throw"A simple select element must have a filter specified"}this.filter=l.filter},getMatchSet:function(){return this.filter.current_query},getFilterState:function(){var l=this.getMatchSet();return this.getSimpleSelectState(l)}});PourOver.UI.SimpleDVRangeElement=PourOver.UI.Element.extend({initialize:function(l){if(!l.filter){throw"A simple dv range element must have a filter specified"}this.filter=l.filter},getMatchSet:function(){return this.filter.current_query},getFilterState:function(){var l=this.getMatchSet();return this.getSimpleRangeState(l)}});return PourOver})();