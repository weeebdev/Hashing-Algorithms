import { HashI, HashElement } from './HashI';
import { SHA256, SHA224, SHA384, SHA3, SHA512, RIPEMD160, MD5 } from 'crypto-js';

const hashFunctions = [MD5, MD5, SHA256, SHA224, SHA384, SHA3, SHA512, RIPEMD160];


export class CuckooHashing<K, V> implements HashI<K, V> {
    numElements: number; // size
    tableSize: number; // capacity
    maxLoadFactor: number; //load factor

    k: number; // number of hash function
    hArray: HashElement<K, V>[][]; // each location (row) can have k spots/cells

    threshold: number; // limit for number of replacement on collision

    constructor(tableSize: number, k: number = 3) {
        this.tableSize = tableSize;
        this.k = k % hashFunctions.length;
        this.numElements = 0;
        this.hArray = new Array(this.tableSize);
        for (let i = 0; i < this.hArray.length; i++) {
            this.hArray[i] = new Array(this.k);

        }
        this.threshold = Math.floor(Math.log(this.tableSize));
        // console.log(this.threshold);
    }

    indexFor(h: number, length: number): number {
        return h & (length - 1);
    }

    private hashFunction(i: number, key: K): number {
        // i = (i % this.k) + 1; // possible to delete
        let hashValue: BigInt = BigInt(`0x${hashFunctions[i](key.toString()).toString()}`);
        let c: BigInt = BigInt('0x7FFFFFFF');
        return Number(hashValue.valueOf() & c.valueOf()) % this.tableSize;
    }

    private loadFactor(): number {
        return this.numElements / this.tableSize;
    }

    add(key: K, value: V): boolean {
        let loadFactor: number = 0;

        if (this.contains(key, value)) return false;

        let i: number = 1;
        let cell: number = i - 1;
        let location: number = this.hashFunction(i, key);

        while (i <= this.k) {
            cell = i - 1;
            location = this.hashFunction(i++, key);

            if (this.hArray[location][cell] === undefined) {
                this.hArray[location][cell] = new HashElement(key, value);
                this.numElements++;
                loadFactor = this.loadFactor();

                if (loadFactor > this.maxLoadFactor) {
                    this.rehash();
                }

                return true;
            }
        }

        i = 1;
        let count: number = 0;
        while (count < this.threshold) {
            count++;
            cell = i - 1;
            location = this.hashFunction(i, key);

            if (this.hArray[location][cell] === undefined) {
                this.hArray[location][cell] = new HashElement(key, value);
                this.numElements++;
                loadFactor = this.loadFactor();
                if (loadFactor > this.maxLoadFactor) {
                    this.rehash();
                }
                return true;
            } else {
                let temp: HashElement<K, V> = this.hArray[location][cell];
                this.hArray[location][cell] = new HashElement(key, value);
                key = temp.key;
                value = temp.value;
            }
            i = (i == this.k) ? 1 : (i + 1)
        }

        // possible infinite loop
        loadFactor = this.loadFactor();
        if (loadFactor > this.maxLoadFactor) {
            this.rehash();
        }
        return false;
    }

    private rehash() {
        let temp: HashElement<K, V>[][] = this.hArray;
        this.numElements = 0;
        this.tableSize *= 2;
        this.hArray = new Array(this.tableSize);
        for (let i = 0; i < this.hArray.length; i++) {
            this.hArray[i] = new Array(this.k);
        }
        this.threshold = Math.floor(Math.log(this.tableSize));

        let location: number = 0;
        let cell: number = 0;
        let ne: HashElement<K, V> = undefined;

        while (location < temp.length) {
            cell = 0;
            while (cell < this.k) {
                ne = temp[location][cell++];
                if (ne !== undefined) {
                    this.add(ne.key, ne.value);
                }
            }
            location++;
        }

    }

    contains(key: K, value: V): boolean {
        let i: number = 1;
        let cell: number = 0;
        let location: number = this.hashFunction(i, key);

        // add smth

        while (i <= this.k) {
            cell = i - 1;
            location = this.hashFunction(i++, key);

            if (this.hArray[location][cell] !== undefined && this.hArray[location][cell].equals(new HashElement(key, value))) {
                return true;
            }
        }
        return false;
    }

    remove(key: K): void {
        let i: number = 1;
        let cell: number = 0;
        let location: number = this.hashFunction(i, key);

        while (i <= this.k) {
            cell = i - 1;
            location = this.hashFunction(i++, key);

            if ((this.hArray[location][cell] !== undefined) && (this.hArray[location][cell].equalsKey(key))) {
                this.hArray[location][cell] = undefined;
                this.numElements--;
                return;
            }
        }
    }

    toString(): string {
        return this.hArray.join(', ');
    }

    getValue(key: K): V {
        let i: number = 1;
        let cell: number = 0;
        let location: number = this.hashFunction(i, key);

        // add smth

        while (i <= this.k) {
            cell = i - 1;
            location = this.hashFunction(i++, key);

            if (this.hArray[location][cell] !== undefined && this.hArray[location][cell].equalsKey(key)) {
                return this.hArray[location][cell].value;
            }
        }
        return undefined;
    }
}