import { HashI, HashElement } from './HashI';
import { SHA256, MD5, enc } from 'crypto-js'

class CuckooHashing<K, V> implements HashI<K, V> {
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    hArray: HashElement<K, V>[];
    private h1(key: K): BigInt { return BigInt(MD5(key.toString()).toString()) };
    private h2(key: K): BigInt { return BigInt(SHA256(key.toString()).toString()) };

    private hashValue(key: K, hashFunction: (key: K) => BigInt, tableSize: number): number {
        let t: BigInt = BigInt(tableSize);
        return Number(hashFunction(key).valueOf() % t.valueOf());
    }

    private loadFactor(): number {
        return this.numElements / this.maxLoadFactor;
    }

    constructor(size: number, loadFactor: number = 1, h1?: (key: K) => BigInt, h2?: (key: K) => BigInt) {
        this.h1 = h1 === undefined ? this.h1 : h1;
        this.h2 = h2 === undefined ? this.h2 : h2;
        this.tableSize = size;
        this.maxLoadFactor = loadFactor;
    }

    add(key: K, value: V): boolean {
        var hashValue1: number = this.hashValue(key, this.h1, this.tableSize);
        let ne = new HashElement(key, value);
        if (this.hArray[hashValue1] !== undefined) {
            var hashValue2: number = this.hashValue(key, this.h2, this.tableSize);
            if (this.hArray[hashValue2] !== undefined) {

            } else {
                this.hArray[hashValue2] = ne;
                return true;
            }
        } else {
            this.hArray[hashValue1] = ne;
            return true;
        }
    }
    remove(key: K): void {
        throw new Error("Method not implemented.");
    }
    getValue(key: K): V {
        throw new Error("Method not implemented.");
    }

}