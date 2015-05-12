(function(global, $, hb) {

  var Nervespine = {

    configs: {
      cacheContent: true,
      baseContentUrl: '',
      basePersistUrl: '',
      pageSelector: '',
      linkSelector: ''
    },

    Helper: function(ns) {
      if (!ns.name)
        throw Error('Helper requires a name');

      if (!ns[ns.name])
        throw Error('Helper requires a "'+ ns.name +'" function');

      hb.registerHelper(ns.name, ns[ns.name]);

      return ns;
    },

    Partial: function(ns) {
      if (!ns.name)
        throw Error('Partial requires a name');

      Template.init(ns);

      hb.registerPartial(ns.name,
        ns.content ? ns.template(ns.content) : ns.template);

      return ns;
    },

    Region: function(ns) {
      // if (ns.route)
      //   throw Error('Region should not have routes');

      if (!ns.selector)
        throw Error('Region requires a selector');

      ns.$el = $(ns.selector);

      Template.init(ns);
      Content.init(ns);
      Event.trigger(ns, 'init');

      // region does not exist yet. Save it for later
      if (ns.$el.length === 0)
        Template.regions[ns.selector] = ns;
      else
        ns.render();

      return ns;
    },

    Page: function(ns) {
      ns.selector = ns.selector || this.configs.pageSelector;

      if (!ns.selector)
        throw Error('Page requires a selector');

      if (!ns.route)
        throw Error('Page requires one or more routes');

      ns.$el = $(ns.selector);

      if (ns.$el.length === 0)
        throw Error('Page element "'+ ns.selector +'" does not exist');

      Template.init(ns);
      Content.init(ns);
      Router.add(ns);
      Event.trigger(ns, 'init');

      return ns;
    }
  };

  var Content = {
    init: function(ns) {
      if (!ns.fetch)
        ns.fetch = Content.fetch;
      if (!ns.persist)
        ns.persist = Content.persist;
    },

    fetch: function() {
      var url = Nervespine.configs.baseContentUrl
        + Router.parse(this.urls.content, this.params);

      return $.get(url, function _fetch(content) {
        this.content = content;
        this.render();
      }.bind(this)).fail(function(jqxhr, status, error) {
        Event.trigger(this, 'error', arguments);
        console.warn(error, url);
      }.bind(this));
    },

    persist: function(content) {
      if (!this.urls || !this.urls.persist)
        throw Error('Persist requires a url');

      var url = Nervespine.configs.basePersistUrl
        + Router.parse(this.urls.persist, this.params);

      return $.post(url, content || this.content)
      .fail(function(jqxhr, status, error) {
        Event.trigger(this, 'error', arguments);
        console.warn(error, url);
      }.bind(this));
    }
  };

  var Template = {
    regions: {},

    init: function(ns) {
      if (!ns.template)
        throw Error('Page, Region and Partial requires a template');

      if (typeof ns.template == 'string') {
        if (!hb.compile) {
          throw Error('Full version of Handlebars is required '
            +'if templates are not precompiled');
        }
        else {
          ns.template = hb.compile(ns.template);
        }
      }

      if (!ns.render)
        ns.render = Template.render;
    },

    render: function() {
      // no content. Get it!
      if (this.urls && this.urls.content && !this.content)
        return this.fetch();

      Event.trigger(this, 'parse');

      this.$el.html(this.template(this.content))
        .css('visibility', 'visible');

      if (Nervespine.configs.cacheContent === false
          && this.urls && this.urls.content)
        this.content = '';

      Event.delegate(this);
      Event.trigger(this, 'show');

      // retry to render regions wich does not existed before
      // TO-DO: remove region from Template.regions after render?
      for (var r in Template.regions) {
        var nsr = Template.regions[r];
        if (this.selector != r && $(r).length) {
          nsr.$el = $(r);
          nsr.render();
        }
      }
    }
  };

  var Router = {
    routes: {},
    params: {},

    parse: function(url, params) {
      if (url.indexOf('{{') === 0)
        return url;

      for (var p in params) {
        url = url.replace('{{' + p + '}}', params[p]);
      }

      return url;
    },

    add: function(ns) {
      if (typeof ns.route == 'string') {
        this.routes[ns.route] = ns;
      }
      else if ($.isArray(ns.route)) {
        for (var r in ns.route) {
          this.routes[ns.route[r]] = ns;
        }
      }
      else {
        console.warn('Invalid route ' + ns.route);
      }
    },

    match: function(path) {
      var params = {},
        key, routeParts, pathParts;

      if (!path)
        return console.warn('Path is required');

      pathParts = path.split('/').filter(Boolean);

      for (var route in this.routes) {
        routeParts = route.split('/').filter(Boolean);

        if (routeParts.length != pathParts.length)
          continue;

        for (var i = 0, found = true; i < routeParts.length; i++) {
          if (routeParts[i].indexOf('{{') == -1
              && routeParts[i] != pathParts[i]) {
            found = false;
            break;
          }
          else if (routeParts[i] != pathParts[i]) {
            key = routeParts[i].replace('{{', '').replace('}}', '');
            params[key] = pathParts[i];
          }
        }

        if (found) {
          if (Object.keys(params).length)
            this.routes[route].params = params;
          return this.routes[route];
        }
      }

      if(this.routes['*']) // the 'else' route - a.k.a. 404 not found
          return this.routes['*'];

      return false;
    },

    go: function(path) {
      var ns = Router.match(path);

      if (ns) {
        history.pushState({}, '', path);
        Event.trigger(ns, 'match', path);
        ns.render();
      }
      else {
        console.warn('No route found for path '+ path);
      }
    }
  };

  var Event = {
    trigger: function(ns, name, args) {
      var handler = this.handler(ns, name);
      if(handler)
        handler.bind(ns)(args);
    },

    handler: function(ns, name) {
      if(!ns.events || !name)
        return false;

      var handler = ns.events[name];

      if(!handler)
        return false;

      if(typeof handler == 'function')
        return handler;

      var callback = ns[handler];

      if(typeof handler == 'string' && typeof callback == 'function')
        return callback;

      return console.warn('Invalid handler for event', name);
    },

    link: function() {
      if (Nervespine.configs.linkSelector) {
        $(document).on('click', Nervespine.configs.linkSelector, function(e) {
          e.preventDefault();
          var href = $(e.currentTarget).attr('href');
          if (href)
            Router.go(href);
        });
      }
    },

    delegate: function(ns) {
      // clear bound events for this selector
      ns.$el.off('.'+ ns.selector);

      for (var e in ns.events) {
        var i = e.indexOf(' ');

        if (i != -1) {
          var event = e.slice(0, i),
            selector = e.slice(i + 1),
            callback = this.handler(ns, e);

          if(!callback)
            continue;

          var specials = {
            'document': document,
            'window': window,
            'body': 'body',
            'html': 'html'
          };

          if(specials[selector]) {
            $(specials[selector])[event](callback.bind(ns));
          }
          else {
            ns.$el.on(event + '.'+ ns.selector,
              ns.selector == selector ? null : selector,
              callback.bind(ns));
          }
        }
      }
    }
  };

  $(document).ready(function() {
    if (!hb || !$)
      throw Error('jQuery and Handlebars are required!');

    Event.link();
    Router.go(location.pathname);
  });

  global.Nervespine = Nervespine;
  global.Nervespine.go = Router.go;

})(window, jQuery, Handlebars);