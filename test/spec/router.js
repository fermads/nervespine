describe('Router', function () {

  console.warn = jasmine.createSpy('log')

  it('Adding a single route string', function() {
    app.page.testRouter1 = Nervespine.Page({
      selector: 'main',
      route: '/test/runner.html',
      template: app.template.page,
      urls : {
        content: '/test/json/page.json',
      }
    });

    Nervespine.go(app.page.testRouter1.route);
    expect(location.href).toEqual('http://localhost/test/runner.html');
  });

  it('Adding array of routes', function() {
    app.page.testRouter2 = Nervespine.Page({
      selector: 'main',
      route: ['/test1', '/test2'],
      template: app.template.page,
      urls : {
        content: '/test/json/page.json',
      }
    });

    Nervespine.go('/test1');
    expect(location.href).toEqual('http://localhost/test1');

    Nervespine.go('/test2');
    expect(location.href).toEqual('http://localhost/test2');

    Nervespine.go('/test3')
    expect(location.href).not.toEqual('http://localhost/test3');
  });

  it('Adding invalid route', function() {
    app.page.testRouter3 = Nervespine.Page({
      selector: 'main',
      route: / /,
      template: app.template.page,
      urls : {
        content: '/test/json/page.json',
      }
    });

    expect(console.warn).toHaveBeenCalledWith('Invalid route / /')
  });

  it('Trying to go to a route that does not exist', function() {
    Nervespine.go('/404routeNotFound')
    expect(console.warn)
      .toHaveBeenCalledWith('No route found for path /404routeNotFound')
  });


  it('Adding dynamic route', function() {
    app.page.testRouter3 = Nervespine.Page({
      selector: 'main',
      route: '/test/{{product}}/{{id}}',
      template: app.template.page,
      urls : {
        content: '/test/json/{{id}}.json',
      }
    });

    Nervespine.go('/test/tv/2323')
    expect(app.page.testRouter3.params.product).toEqual('tv')
    expect(app.page.testRouter3.params.id).toEqual('2323')
    expect(location.href).toEqual('http://localhost/test/tv/2323');
    //expect(console.warn).toHaveBeenCalledWith('Not Found /test/json/2323.json')


    Nervespine.go('/test/tv/2323/error')
    expect(location.href).not.toEqual('http://localhost/test/tv/2323/error');
  });

  it('Route path is required', function() {
    Nervespine.go();
    expect(console.warn).toHaveBeenCalledWith('Path is required')
  });
});

