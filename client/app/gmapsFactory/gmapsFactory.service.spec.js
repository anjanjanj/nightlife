'use strict';

describe('Service: gmapsFactory', function () {

  // load the service's module
  beforeEach(module('nightlife2App'));

  // instantiate service
  var gmapsFactory;
  beforeEach(inject(function (_gmapsFactory_) {
    gmapsFactory = _gmapsFactory_;
  }));

  it('should do something', function () {
    expect(!!gmapsFactory).toBe(true);
  });

});
