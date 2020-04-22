export interface HashI<K, V> {
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    add(key: K, value: V): boolean;
    remove(key: K): void;
    getValue(key: K): V;
}
class Comparable<T> {
    compareTo: (o: T) => number;
    equals: (o: T) => boolean;
}
export class HashElement<K, V> implements Comparable<HashElement<K, V>> {
    key: K;
    value: V;
    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
    compareTo(o: HashElement<K, V>): number {
        return this.key.toString().localeCompare(o.toString());
    }
    equals(o: HashElement<K, V>): boolean {
        return o.key === this.key && o.value === this.value;
    }

    equalsKey(key: K) {
        return this.key === key;
    }

    toString(): string {
        var str: string = `${this.key.toString()}: ${this.value.toString()}`;
        return str;
    }
}
