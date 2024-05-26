import jetpack from 'fs-jetpack';
import { Store } from 'keyv';
import os from 'node:os';

export interface KeyvFsStoreOptions {
  rootDir?: string | typeof jetpack;
  namespace?: string;
}

const defaults: Required<KeyvFsStoreOptions> = {
  rootDir: os.tmpdir(),
  namespace: 'keyv',
};

export class KeyvFsStore implements Store<unknown> {
  protected root = jetpack;

  constructor(options: KeyvFsStoreOptions = {}) {
    const opt = { ...defaults, ...options };
    if (typeof opt.rootDir === 'undefined') {
      this.root = jetpack.dir('./keyv').dir(opt.namespace);
    } else if (typeof opt.rootDir === 'string') {
      this.root = jetpack.dir(opt.rootDir).dir(opt.namespace);
    } else {
      this.root = opt.rootDir.dir(opt.namespace);
    }
  }

  get dir() {
    return this.root.path();
  }

  private keyToPath(key: string) {
    return key.split(':').join('/') + '.json';
  }

  async get(key: string) {
    return this.root.readAsync(this.keyToPath(key));
  }

  async getMany(keys: string[]) {
    return Promise.all(keys.map(k => this.get(k))).then(values =>
      values.filter(v => v !== undefined),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: any) {
    this.root.write(this.keyToPath(key), value);
  }

  async delete(key: string) {
    return this.root.removeAsync(this.keyToPath(key)).then(() => true);
  }

  async clear() {
    return this.root.removeAsync();
  }

  async has(key: string) {
    return this.root.existsAsync(this.keyToPath(key)).then(exists => !!exists);
  }
}
