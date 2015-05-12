describe('Template', function () {

  it('Should throw error if template is missing', function() {
    var requiredTemplate = function() {
      Nervespine.Page({selector:'main',route:'/test/runner.html',template:''});
    };
    expect(requiredTemplate)
      .toThrow(new Error('Page, Region and Partial requires a template'));
  });

  it('Should throw error if template is a string and full version of'+
    ' handlebars is not present', function() {

    var templateIsString = function() {
      Nervespine.Page({selector:'main',route:'/test/runner.html',template:'x'});
    };
    expect(templateIsString)
      .toThrow(new Error('Full version of Handlebars is required '
        +'if templates are not precompiled'));
  });
});

