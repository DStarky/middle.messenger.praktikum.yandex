import { expect } from 'chai';
import type {
  SinonFakeXMLHttpRequest,
  SinonFakeXMLHttpRequestStatic,
} from 'sinon';
import sinon from 'sinon';
import { HTTPTransport, METHODS } from './HTTPTransport';
import store from './Store';

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

  it('должен обрабатывать 401 ошибку', async () => {
    const http = new HTTPTransport();
    const url = '/protected';
    const storeMock = sinon.mock(store);

    storeMock.expects('set').once().withArgs('user', null);

    const promise = http.get(url);

    expect(requests).to.have.lengthOf(1);
    const request = requests[0];

    request.respond(401, {}, 'Unauthorized');

    try {
      await promise;
      throw new Error('Ожидалась ошибка 401');
    } catch (error) {
      expect(error).to.be.instanceOf(Error);

      expect((error as Error).message).to.equal('Unauthorized');
    }

    storeMock.verify();
    storeMock.restore();
  });

  it('должен отправлять FormData', async () => {
    const http = new HTTPTransport();
    const url = '/upload';
    const formData = new FormData();
    formData.append('file', new Blob(['test']), 'test.txt');

    const promise = http.post(url, { data: formData });

    expect(requests).to.have.lengthOf(1);
    const request = requests[0];

    expect(request.method).to.equal(METHODS.POST);
    expect(request.requestBody).to.be.instanceOf(FormData);

    request.respond(
      200,
      { 'Content-Type': 'application/json' },
      '{"message":"OK"}',
    );
    const response = await promise;
    expect(response).to.deep.equal({ message: 'OK' });
  });
});
