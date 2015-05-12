describe('Partial', function () {

  it('Partial should have a name and a template', function() {
    app.partial.test1 = Nervespine.Partial({
      name: 'testPartial',
      template: app.template.page
    });

    expect(app.partial.test1.name).toEqual('testPartial');
    expect(app.partial.test1.template).toEqual(jasmine.any(Function));
  });

  it('Partial should have been registered with Handlebars', function() {
    app.partial.test2 = Nervespine.Partial({
      name: 'testPartial',
      template: app.template.page
    });

    expect(Handlebars.partials.testPartial).toEqual(jasmine.any(Function));
  });

  it('Should throw if partial does not have a name', function() {
    var requiredName = function() {
      app.partial.test3 = Nervespine.Partial({
      });
    };

    expect(requiredName).toThrow(new Error('Partial requires a name'));
  });

  it('Should throw if partial does not have a template',
      function() {
    var requiredTemplate = function() {
      app.partial.test4 = Nervespine.Partial({
        name: 'testPartial',
      });
    };

    expect(requiredTemplate).toThrow(
      new Error('Page, Region and Partial requires a template'));
  });
});
