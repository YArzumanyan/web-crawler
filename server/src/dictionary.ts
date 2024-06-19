class Dictionary<K, V> {
  private static instances: Map<string, Dictionary<any, any>> = new Map();
  private map: Map<K, V>;

  private constructor() {
    this.map = new Map<K, V>();
  }

  public static getInstance<T, U>(instanceName: string): Dictionary<T, U> {
    if (!this.instances.has(instanceName)) {
      this.instances.set(instanceName, new Dictionary<T, U>());
    }
    return this.instances.get(instanceName) as Dictionary<T, U>;
  }

  public set(key: K, value: V): void {
    this.map.set(key, value);
  }

  public get(key: K): V | undefined {
    return this.map.get(key);
  }

  public delete(key: K): boolean {
    return this.map.delete(key);
  }

  public clear(): void {
    this.map.clear();
  }

  public getAll(): Map<K, V> {
    return new Map(this.map);
  }

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public keys(): IterableIterator<K> {
    return this.map.keys();
  }

  public values(): IterableIterator<V> {
    return this.map.values();
  }
}

export default Dictionary;
