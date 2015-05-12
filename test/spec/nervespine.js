this.app = this.app || {};
this.app.page = {};
this.app.helper = {};
this.app.partial = {};
this.app.content = {};
this.app.region = {};

describe('Nervespine', function () {

  it('Should have default configs set properly', function(){
    expect(Nervespine.configs.cacheContent).toEqual(true);
    expect(Nervespine.configs.baseContentUrl).toEqual('');
    expect(Nervespine.configs.basePersistUrl).toEqual('');
    expect(Nervespine.configs.pageSelector).toEqual('');
    expect(Nervespine.configs.linkSelector).toEqual('');
  });
});
