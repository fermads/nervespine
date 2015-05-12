describe('Helper', function () {

  it('Helper should have a name', function() {
    app.helper.test1 = Nervespine.Helper({
      name: 'testHelper',

      testHelper: function() {
        return true;
      }
    });

    expect(app.helper.test1.name).toEqual('testHelper');
  });

  it('Helper should have been registered with Handlebars', function() {
    app.helper.test1 = Nervespine.Helper({
      name: 'testHelper',

      testHelper: function() {
        return true;
      }
    });

    expect(Handlebars.helpers.testHelper).toEqual(jasmine.any(Function));
  });

  it('Should throw if helper does not have a name', function() {
    var requiredName = function() {
      app.helper.test2 = Nervespine.Helper({

        testHelper: function() {
          return true;
        }
      });
    };

    expect(requiredName).toThrow(new Error('Helper requires a name'));
  });

  it('Should throw if helper does not have a function with the same name',
      function() {
    var requiredFunction = function() {
      app.helper.test3 = Nervespine.Helper({
        name: 'testHelper3'
      });
    };

    expect(requiredFunction).toThrow(
      new Error('Helper requires a "testHelper3" function')
    );
  });
});
