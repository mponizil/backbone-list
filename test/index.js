(function($) {

  var View = Quilt.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var models = [{id: 1}, {id: 2}];
  var collection = new Collection();

  module('List', {

    setup: function() {
      delete collection.comparator;
      collection.reset(models);
    }

  });

  test('Create views from collection.', function() {
    var view = new List({
      collection: collection,
      view: Quilt.View.extend({
        render: function(){
          this.$el.html(this.model.id);
          return this;
        }
      })
    }).render();
    strictEqual(view.$el.children().length, 2);
    strictEqual(view.views.length, 2);
    strictEqual(view.views[0].model.id, 1);
    strictEqual(view.views[1].model.id, 2);

    ok(view.findView(1) === view.views[0]);
    ok(view.findView(2) === view.views[1]);

    strictEqual(view.findView(1).$el.html(), '1');
    strictEqual(view.findView(2).$el.html(), '2');
  });

  test('Add a model.', function() {
    var view = new List({collection: collection}).render();
    var model = new Model({id: 4});
    collection.add(model);
    strictEqual(view.views.length, 3);

    var child = view.views[2];
    ok(child.model === model);
    ok(view.findView(model.cid) === child);
    ok(view.findView(child.cid) === child);

    model.set({id: 50});
    ok(view.findView(50) === child);
  });

  test('Insert elements in order.', function() {
    var view = new List({collection: collection}).render();
    collection.comparator = function(model) { return model.id; };
    collection.add({id: 3});

    var $el = view.findView(3).$el;
    ok($el.is(':nth-child(3)'));
    ok($el.parent().is(view.el));

    collection.add({id: -5});
    $el = view.findView(-5).$el;
    ok($el.is(':nth-child(1)'));
    ok($el.parent().is(view.el));

    collection.add({id: -1});
    $el = view.findView(-1).$el;
    ok($el.is(':nth-child(2)'));
    ok($el.parent().is(view.el));
  });

  test('Remove a model.', 5, function() {
    var view = new List({collection: collection}).render();
    var child = view.findView(1);
    child.destroy = function() { ok(true); };

    var model = collection.at(0);
    collection.remove(model);

    strictEqual(view.views.length, 1);
    ok(!view.findView(1));
    ok(!view.findView(model.cid));
    ok(!view.findView(child.cid));
  });

  test('Reset', function() {
    var view = new List({collection: collection}).render();
    strictEqual(view.views.length, 2);

    collection.reset([collection.at(1), {id: 3}]);

    strictEqual(view.views.length, 2);
    ok(!view.findView(1));
    ok(view.findView(2).model === collection.at(0));
    ok(view.findView(3).model === collection.at(1));
  });

  test('Keep views through reset.', function() {
    var view = new List({collection: collection}).render();
    var child = view.findView(2);
    collection.reset([child.model]);
    ok(view.findView(2) === child);
  });

  test('Reorder views after reset.', function() {
    var view = new List({collection: collection}).render();
    collection.reset(collection.models.reverse());
    strictEqual(view.views[0].model.id, 2);
    strictEqual(view.views[1].model.id, 1);
  });

})(jQuery);
