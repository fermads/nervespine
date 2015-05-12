describe('Content', function () {

  it('Fetch and persist content should be a property of nervespine object',
      function (done) {

    app.content.test1 = Nervespine.Page({
      selector: 'main',
      route: '/test/runner.html',
      template: app.template.page,
      urls : {
        content: '/test/json/page.json'/*,
        persist: '/test/save'*/
      },

      events : {
        show : 'show'
      },

      show : function() {
        done();
      }
    });

    Nervespine.go(app.content.test1.route);

    expect(app.content.test1.fetch).toEqual(jasmine.any(Function));
    expect(app.content.test1.persist).toEqual(jasmine.any(Function));
  });

  it('Nervespine.content should be the contents of fetched json', function() {
    expect(JSON.stringify(app.content.test1.content))
      .toEqual('{"title":"COOL"}');
  })

  it('Fetch of 404 url should set content to undefined',
      function (done) {

    app.content.test1 = Nervespine.Page({
      selector: 'main',
      route: '/test/runner.html',
      template: app.template.page,
      urls : {
        content: '/test/json/page2.json'/*,
        persist: '/test/save'*/
      },

      events : {
        error : 'error'
      },

      error : function() {
        done();
      }
    });

    Nervespine.go(app.content.test1.route);
    expect(app.content.test1.content).toBe(undefined);
  });

  it('Persist of 404 url should fail', function (done) {

    var persistError = false;
    app.content.test1 = Nervespine.Page({
      selector: 'main',
      route: '/test/runner.html',
      template: app.template.page,
      urls : {
        content: '/test/json/page.json',
        persist: '/test/save404'
      },

      events : {
        show : 'show',
        error : 'error'
      },

      show : function() {
        this.persist({bla:12}).fail(function(){
          persistError = true;
          expect(persistError).toBe(true);
          done();
        }).success(function(){
          console.log('persist success callback');
        });
      }
    });

    Nervespine.go(app.content.test1.route);

  });

});