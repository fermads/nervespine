# Nervespine

"Anti-MVC" framework for single page apps inspired by Handlebars, Marionette
and Backbone
* Router and events based on Backbone's
* Handlebars partials, helpers and template engine
* Marionette regions

## Install

Download `dist/nervespine-[version].min.js` and add it to your HTML
after jQuery and Handlebars

If templates are pre-compiled, Handlebars runtime can be used instead of
the full version.


## Example

[Nervespine example project](https://github.com/fermads/nervespine-project)

## API

### Page
Creates a page

- **route** (_required_):  This page's route as a string or array. Page will be
  rendered when a URL is opened and is a match for this route
- **selector** (_required_): CSS selector. Template and content will be
  inserted into this selector when page renders
- **template** (_required_): Handlebars pre-compile template or a string with
  a Handlebars template/HTML
- **url.content** (_optional_): Content URL pointing to a service that returns a
  JSON. JSON will be rendered with template using Handlebars
- **url.persist** (_optional_): URL to post data when calling `persist()`
- **events** (_optional_): Events to bind to the page when it is rendered

```js
app.page.Search = Nervespine.Page({
  selector : 'main',
  route : '/product/search/{{term}}',
  template : app.template.search, // Handlebars template for search
  urls : {
    content : '/rest/1.0/search/product/{{term}}' // get JSON search results
  },
  events : {
    show : 'show'
  },
  show : function() {
    console.log(this.content); // print search result
  }
});
```

### Region
Creates a region.

- **selector** (_required_): CSS selector. Template and content will be inserted
  into this selector when the region renders. If selector's element does not
  exist yet, it'll be stored to render later
- **template** (_required_): Handlebars pre-compile template or a string with
  a Handlebars template/HTML
- **url.content** (_optional_): Content URL pointing to a service that returns a
  JSON. JSON will be rendered with the template using Handlebars
- **url.persist** (_optional_): URL to post data when calling `persist()`
- **events** (_optional_): Events to bind to the region when it is rendered

```js
app.region.Menu = Nervespine.Region({
  selector : 'nav',
  template : app.template.menu, // Handlebars template for menu
  urls : {
    content : 'content/menu.json' // get JSON with menu items
  }
});
```

### Partial
Creates a Handlebars partial

- **name** (_required_): Partials's name
- **template** (_required_): Handlebars partial template

```js
app.partial.ProductItem = Nervespine.Partial({
  name: 'productItem',
  template: app.template.productItem
});
```

Use like any Handlebars partial
```html
<section>
  <h3>Featured products</h3>
  <ul class="featuredProducts">
    {{#each this}}
      {{> productItem}}
    {{/each}}
  </div>
</section>
```


### Helper
Creates a Handlebars helper

- **name** (_required_): Helper's name
- **nameFunction** (_required_): Function with the helper's name

```js
app.helper.linkToProduct = Nervespine.Helper({
  name: 'linkToProduct',
  linkToProduct: function(id) {
    return '/product/'+ id;
  }
});
```

Use like any Handlebars helper
```html
<li>
  <a href="{{linkToProduct id}}">
    <div class="thumbnail">{{id}}</div>
    <h5>{{name}}</h5>
    <div class="description">{{description}}</div>
    <div class="price">{{price}}</div>
  </a>
</li>
```

### Events
Events are bound and unbound automatically when pages or regions load or unload.
List of events:
- **init**: Trigger on pages and regions initialization
- **parse**: Trigger before a template is merged with its content
- **show**: Trigger after a template and its content was added to the DOM
- **match**: Trigger when a URL matches a page's route
- **error**: Trigger when fetching ($.get) or persisting ($.post) content fails
- **'event selector'**: Any other browser event and selector (see example below)

```js
 app.page.Home = Nervespine.Page({
  selector: 'main',
  route: '/test/runner.html',
  template: app.template.home,
  events : {
    init : 'init',
    parse : 'parse',
    show : 'show',
    match : 'match',
    error : 'error',
    'click div:eq(0)' : 'divClick',
    'ready document' : 'ready',
    'click main' : function() {
      console.log('main clicked');
    }
  },

  // codensed for brevity
  init : function() { console.log('init'); },
  parse : function() { console.log('template parse'); },
  show : function() { console.log('content + template show'); },
  match : function(route) { console.log('route match', route); },
  error : function(error) { console.log('error', error); },
  divClick : function() { console.log('div was clicked'); },
  ready : function() { console.log('DOM is ready'); }
});
```

### Template
It is a string containing a Handlebars template or a pre-compile Handlebars
template. Usually pre-compiled Handlebars templates are generated with an
automation tool like Grunt or Gulp.
[See example](https://github.com/fermads/nervespine-project).

### Content
Content is usually a JSON. On pages and regions, if `urls.content` exists,
then content is automatically fetched.

#### fetch()
Get content (JSON) from `urls.content` using jQuery.get() and save it
at `this.content`. Can be overwritten. Returns jqXHR.

#### persist()
Post a JSON to `urls.persist` using jQuery.post(). Can be overwritten.

```js
 app.page.Home = Nervespine.Page({
  selector: 'main',
  route: '/test/runner.html',
  template: app.template.home,
  urls : {
    content: '/test/page.json',
    persist: '/test/save'
  },
  events : {
    show : 'show'
  },
  show : function() {
    console.log(this.content); // content get is automatic
    this.persist({test:true}).success(function(){ // persist must be called
      console.log('persist success');
  }).fail(function(){
      console.log('persist fail);
    });
  }
});
```

### Router
Routes are URLs. When a route matches the corresponding page is loaded.
Routes can have variables. Variables are stored on `this.params` and
can be used on other urls.

```js
app.page.Product = Nervespine.Page({
  selector: 'main',
  route: '/products/{{product}}/{{id}}',
  template: app.template.product,
  urls : {
    content: '/get/{{id}}.json',
    persist: '/save/product/{{id}}'
  },
  showParams: function() {
    console.log(this.params); // output: {id:'someProductId', product:'someProductName'}
  }
});
```
#### Nervespine.go(url)
As a single page app, using this method to go from page to page will avoid
page reloads.

### Configs
- **Nervespine.cacheContent** (_defaults true_): fetched content will be
  cached "forever" on `this.content`
- **Nervespine.baseContentUrl**: base URL to prepend to `urls.content`
- **Nervespine.basePersistUrl**: base URL to prepend to `urls.persist`
- **Nervespine.pageSelector**: Usually on single page apps all pages render on
  the same selector. This will set one as default
- **Nervespine.linkSelector**: Elements that match this selector will use
  `Nervespine.go()` automatically on click
