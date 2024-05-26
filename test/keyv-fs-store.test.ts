import test from 'ava';
import Keyv from 'keyv'
import { KeyvFsStore } from '../src/index.js';
import os from 'os';

test.before('instantiation', t => {
  t.notThrows(() => new Keyv({ store: new KeyvFsStore({ rootDir: './test' }) }));
});

test('crud', async t => {
  const keyv = new Keyv({ store: new KeyvFsStore({ rootDir: './test' }) });

  await keyv.set('foo', 'bar');
  t.is(await keyv.get('foo'), 'bar');

  await keyv.set('bar', { test: 1 });
  t.deepEqual(await keyv.get('bar'), { test: 1 });

  await keyv.set('baz', 12345);
  t.is(await keyv.get('baz'), 12345);
});

test('expiration', async t => {
  const keyv = new Keyv({ store: new KeyvFsStore({ rootDir: './test' }) });

  // Negative expiration time will always be gone once we check for it.
  await keyv.set('old', 'text', -1);
  t.is(await keyv.get('old'), undefined);
});

test('namespace', async t => {
  const subKeyValue = new Keyv({
    store: new KeyvFsStore({ rootDir: './test' }),
    namespace: 'subdata'
  });

  await subKeyValue.set('baz', 12345);
  t.is(await subKeyValue.get('baz'), 12345);
});

test('default dir', async t => {
  const store = new KeyvFsStore();
  const kv = new Keyv({ store });

  await kv.set('baz', 12345);
  t.is(await kv.get('baz'), 12345);

  t.is(store.dir, os.tmpdir() + '/keyv');
  await kv.clear();
});

test.after('cleanup', async () => {
  const keyv = new Keyv({ store: new KeyvFsStore({ rootDir: './test' }) });
  await keyv.clear();

  const subKeyValue = new Keyv({
    store: new KeyvFsStore({ rootDir: './test' }),
    namespace: 'subdata'
  });
  await subKeyValue.clear()
});