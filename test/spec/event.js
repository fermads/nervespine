var events = {
  init: false,
  match: false,
  show: false,
  parse: false,
  error: false,
  init2: false,
  click: false,
  divClick: false,
  documentReady: false
};

describe('Event', function () {

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
        init : 'init',
        show : 'show',
        parse : 'parse',
        error : 'error',
        match : 'match',
        'click main' : function() {
          events.click = true;
        },
        'click div:eq(0)': function() {
          console.log(2233223);
          events.divClick = true;
        },
        'ready document': function() {
          events.documentReady = true;
        }
      },

      init : function() {
        events.init = true;
      },

      match : function() {
        events.match = true;
      },

      show : function() {
        $('main').click();
        $('main div:eq(0)').click();
        events.show = true;

        this.persist({bla:12}).fail(function(){
          done();
        }).success(function(){
          console.log('persist success callback');
        });
      },

      parse : function() {
        events.parse = true;
      },

      error : function() {
        events.error = true;
      }
    });

    Nervespine.go('/test/runner.html');
  });

  it('Events should be an object', function() {
    expect(app.page.test1.events).toEqual(jasmine.any(Object));
  });

  it('Init event should be executed', function () {
    expect(events.init).toEqual(true);
  });

  it('Show event should be executeda', function () {
    expect(events.show).toEqual(true);
  });

  it('Show event should trigger after content load', function () {
    expect($('main div').length).toEqual(2);
  });

  it('Parse event should be executed', function () {
    expect(events.parse).toEqual(true);
  });

  it('Match event should be executed', function () {
    expect(events.match).toEqual(true);
  });

  it('Error event should be executed', function () {
    expect(events.error).toEqual(true);
  });

  it('Click event should be executed', function () {
    expect(events.click).toEqual(true);
  });

  it('Click event on element inside loaded content should be executed',
      function () {
    expect(events.divClick).toEqual(true);
  });

  it('Document ready event should be executed', function () {
    expect(events.documentReady).toEqual(true);
  });

  it('Init event is a function and should be executed', function () {
    app.page.test2 = Nervespine.Page({
      selector: 'footer',
      route: '/test/runner.html',
      template: app.template.page,

      urls : {
        content: '/test/json/page.json'
      },

      events : {
        init : function() {
          events.init2 = true;
        },
        show : / /
      }
    });

    expect(events.init2).toEqual(true);
  });

});
