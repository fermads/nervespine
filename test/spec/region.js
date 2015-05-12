var callbacks = {
  persistError : false
};

describe('Region', function () {

  it('Should throw error if selector is missing', function() {
    var requiredSelector = function() {
      Nervespine.Region({});
    };
    expect(requiredSelector)
      .toThrow(new Error('Region requires a selector'));
  });

  it('Should throw error if template is missing', function() {
    var requiredTemplate = function() {
      Nervespine.Region({selector:'footer'});
    };
    expect(requiredTemplate)
      .toThrow(new Error('Page, Region and Partial requires a template'));
  });

  it('Selector element should not exist and be saved it for later', function() {
    app.region.test1 = Nervespine.Region({
      template:app.template.page,
      selector:'.inexist'
    });
    expect(app.region.test1.$el.length).toEqual(0);
  });

  it('Selector element  exists now and should be rendered', function() {
    $('body').append('<div class="inexist"></div>');

    Nervespine.go('/test/runner.html');
    expect(app.region.test1.$el.length).toEqual(1);
  });

  it('Region init event should be called', function(done) {
    var called = false
    app.region.test1 = Nervespine.Region({
      template:app.template.page,
      selector:'footer',
      urls: {
        content: '/test/json/page.json',
      },
      events : {
        show : function() {
          console.log(22);
          done()
        },
        init : 'init'
      },
      init : function() {
        console.log(11);
        called = true
      }
    });
    expect(called).toEqual(true)
  });

});

