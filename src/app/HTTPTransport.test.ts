import { expect } from 'chai';
import type {
  SinonFakeXMLHttpRequest,
  SinonFakeXMLHttpRequestStatic,
} from 'sinon';
import sinon from 'sinon';
import { HTTPTransport, METHODS } from './HTTPTransport';

describe('HTTPTransport', () => {
  let requests: SinonFakeXMLHttpRequest[] = [];
  let originalXHR: typeof global.XMLHttpRequest;
  let fakeXHR: SinonFakeXMLHttpRequestStatic;

  before(() => {
    originalXHR = global.XMLHttpRequest;

    fakeXHR = sinon.useFakeXMLHttpRequest();
    fakeXHR.onCreate = xhr => {
      requests.push(xhr);
    };

    global.XMLHttpRequest = fakeXHR as unknown as typeof global.XMLHttpRequest;
  });

  after(() => {
    global.XMLHttpRequest = originalXHR;
    fakeXHR.restore();
  });

  beforeEach(() => {
    requests = [];
  });

  it('должен выполнять GET-запрос с query-параметрами', async () => {
    const http = new HTTPTransport();
    const url = '/test';
    const data = { param1: 'value1', param2: 123 };

    const promise = http.get(url, { data });

    expect(requests).to.have.lengthOf(1);

    const request = requests[0];
    expect(request.method).to.equal(METHODS.GET);
    expect(request.url).to.equal(`${url}?param1=value1&param2=123`);

    request.respond(200, { 'Content-Type': 'application/json' }, '{}');

    await promise;
  });

  it('должен выполнять POST-запрос с JSON данными', async () => {
    const http = new HTTPTransport();
    const url = '/post';
    const data = { title: 'Test', content: 'Hello World' };

    const promise = http.post(url, {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(requests).to.have.lengthOf(1);
    const request = requests[0];

    expect(request.method).to.equal(METHODS.POST);

    expect(request.requestHeaders['Content-Type']).to.match(
      /^application\/json(;charset=utf-8)?$/,
    );

    expect(request.requestBody).to.equal(JSON.stringify(data));

    request.respond(
      200,
      { 'Content-Type': 'application/json' },
      '{"status":"ok"}',
    );
    const response = await promise;
    expect(response).to.deep.equal({ status: 'ok' });
  });
});
