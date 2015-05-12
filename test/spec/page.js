var callbacks = {
  persistError : false
};

describe('Page', function () {

  beforeAll(function(done) {

    app.page.test1 = Nervespine.Page({
      selector: 'main',
      route: '/test/runner.html',
      template: app.template.page,
      urls : {
        content: '/test/json/page.json',
        persist: '/test/save'
      },

      events : {
        show : 'show'
      },

      show : function() {
        this.persist({bla:12}).fail(function(){
          callbacks.persistError = true;
          done();
        }).success(function(){
          console.log('persist success callback');
        });
      }
    });

    Nervespine.go(app.page.test1.route);
  });

  it('Persist error callback should be called', function () {
    expect(callbacks.persistError).toEqual(true);
  });

  it('Content should be fetched', function() {
    expect(app.page.test1.content).not.toBe(null);
    expect(app.page.test1.content).not.toBe(undefined);
  });

  it('Selector should be main', function() {
    expect(app.page.test1.selector).toEqual('main');
    expect($(app.page.test1.selector)).toEqual(app.page.test1.$el);
  });

  it('Route should be /test/runner.html', function() {
    expect(app.page.test1.route).toEqual('/test/runner.html');
  });

  it('Handlebars template should be a function', function() {
    expect(app.page.test1.template).toEqual(jasmine.any(Function));
  });

  it('Should throw error if selector is missing', function() {
    var requiredSelector = function() {
      Nervespine.Page({});
    };
    expect(requiredSelector).toThrow(new Error('Page requires a selector'));
  });

  it('Should throw error if route is missing', function() {
    var requiredRoute = function() {
      Nervespine.Page({selector:'main'});
    };
    expect(requiredRoute)
      .toThrow(new Error('Page requires one or more routes'));
  });
});

