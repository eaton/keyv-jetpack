# KeyvJetpack

Simple filesystem based storage for the [Keyv](https://keyv.org) key-value store; [FS-Jetpack](https://github.com/szwacz/)fs-jetpack is used due to unadulterated laziness.

The existing [keyv-file](https://github.com/zaaack/keyv-file) module had some quirky decisions — in particular, every namespace was stored in a single JSON file, making large piles of data a little punishing.

## Usage

Create a new KeyV instance and use a KeyFsStore instance as its `store` option. That's it.

```js
import { KeyvFsStore } from 'keyv-jetpack';
import { Keyv } from 'keyv';

const kv = new Keyv({ store: new KeyFsStore() });

await kv.set('key', { data: 'stuff goes here…' });
console.log(await kv.get('key')); // { data: 'stuff goes here…' };

await kv.clear(); // Directory deleted
```

Thanks to KeyV, things like expiring values and such are handled transparently. A custom storage directory can be used, or multiple namespaces to avoid collisions.

```js
import { KeyvFsStore } from 'keyv-fs';
import { Keyv } from 'keyv';

const kv = new Keyv({ store: new KeyFsStore({
  rootDir: './custom/storage'
}) });
```

By default, a `keyv` directory in the systemp temp dir will be used.
