import { HashI, HashElement } from './HashI';
import { SHA256, SHA224, SHA384, SHA3, SHA512, RIPEMD160, MD5 } from 'crypto-js';

const hashFunctions = [SHA256, SHA224, SHA384, SHA3, SHA512, RIPEMD160, MD5];

class CuckooHashing<K, V> implements HashI<K, V> {
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    hArray: HashElement<K, V>[];
    public h1(key: K): BigInt { return 0n; };
    public h2(key: K): BigInt { return 0n; };

    // May be a problem with the same hash functions
    private rehash(h1?: (key: K) => BigInt, h2?: (key: K) => BigInt): void {
        if (h1 === undefined) {
            this.h1 = (key: K) => { return BigInt(`0x${hashFunctions[Math.floor(Math.random() * hashFunctions.length)](key.toString()).toString()}`) }
        } else {
            this.h1 = h1;
        }
        if (h2 === undefined) {
            this.h2 = (key: K) => { return BigInt(`0x${hashFunctions[Math.floor(Math.random() * hashFunctions.length)](key.toString()).toString()}`) }
        } else {
            this.h2 = h2;
        }
    }
    private hashValue(key: K, hashFunction: (key: K) => BigInt, tableSize: number): number {
        let t: BigInt = BigInt(tableSize);
        let h: BigInt = hashFunction(key);
        return Number(h.valueOf() % t.valueOf());
    }

    private loadFactor(): number {
        return this.numElements / this.maxLoadFactor;
    }

    constructor(size: number, loadFactor: number = 1, h1?: (key: K) => BigInt, h2?: (key: K) => BigInt) {
        this.rehash(h1, h2);
        this.tableSize = size;
        this.maxLoadFactor = loadFactor;
        this.hArray = new Array(this.tableSize);
    }

    private resize(newSize: number): void {
        // performs resizing and rehashing
    }


    add(key: K, value: V): boolean {
        if (this.loadFactor() > this.maxLoadFactor) {
            this.resize(this.tableSize * 2);
        }
        var hashValue1: number = this.hashValue(key, this.h1, this.tableSize);
        let ne = new HashElement(key, value);
        if (this.hArray[hashValue1] !== undefined) {
            var hashValue2: number = this.hashValue(key, this.h2, this.tableSize);
            if (this.hArray[hashValue2] !== undefined) {
                var oldArray: HashElement<K, V>[];
                let firstTime = true;
                while (1) {
                    let prevNe = this.hArray[hashValue1]; //remember old value
                    this.hArray[hashValue1] = ne; //put new
                    if (firstTime) {
                        oldArray = this.hArray;
                        firstTime = false;
                    }
                    var hashValue1 = this.hArray[this.hashValue(prevNe.key, this.h2, this.tableSize)] === undefined ? this.hashValue(prevNe.key, this.h2, this.tableSize) : this.hashValue(prevNe.key, this.h1, this.tableSize); // find second hash of the old value 
                    if (this.hArray[hashValue1] !== undefined) {
                        // check if it is a cycle
                        if (oldArray === this.hArray) {
                            this.rehash();
                            this.resize(this.tableSize);
                        }
                    } else {
                        this.hArray[hashValue1] = prevNe; //base case
                        return true;
                    }
                    ne = prevNe;
                }
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
    toString(): string {
        return this.hArray.join(', ');
    }
}


var cH = new CuckooHashing(10);
for (let i = 0; i < 10; i++) {
    cH.add(i, i);
}
console.log(cH.toString());
// console.log(cH.h1('Hello').toString());
// console.log(cH.h2('Hello').toString());