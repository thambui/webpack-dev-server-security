'use strict';

const runBonjour = require('../../../lib/utils/runBonjour');

jest.mock('os', () => {
  return {
    hostname: () => 'hostname',
  };
});

describe('runBonjour', () => {
  let mock;
  let publish = jest.fn();
  let unpublishAll = jest.fn();

  beforeAll(() => {
    mock = jest.mock('bonjour', () => () => {
      return {
        publish,
        unpublishAll,
      };
    });
  });

  afterEach(() => {
    publish = jest.fn();
    unpublishAll = jest.fn();
  });

  afterAll(() => {
    mock.mockRestore();
  });

  it('should call bonjour.publish', () => {
    runBonjour({
      port: 1111,
    });

    expect(publish.mock.calls[0][0]).toMatchSnapshot();
  });

  it('should call bonjour.publish with different name for different ports', () => {
    runBonjour({
      port: 1111,
    });
    runBonjour({
      port: 2222,
    });

    const calls = publish.mock.calls;

    expect(calls[0][0].name).not.toEqual(calls[1][0].name);
  });
});
