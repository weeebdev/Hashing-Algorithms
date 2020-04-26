import { LinkedList } from './LinkedList';
import { HashI, HashElement } from './HashI';

export class HashTableC<K, V> implements HashI<K, V>{
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    hArray: LinkedList<HashElement<K, V>>[];
    numOfCollisions: number;

    getNumOfCollisions(): number {
        return this.numOfCollisions;
    }

    constructor(size: number, loadFactor: number = 1) {
        this.tableSize = size;
        this.hArray = new Array(this.tableSize);
        this.maxLoadFactor = loadFactor;
        this.numElements = 0;
        this.numOfCollisions = 0;
    }
    contains(key: K, value: V): boolean {
        var hashValue: number = (this.hashCode(key) & 0x7FFFFFFF) % this.tableSize;

        if (this.hArray[hashValue] !== undefined) {
            for (var ne of this.hArray[hashValue].toArray()) {
                if (ne.equals(new HashElement<K, V>(key, value))) {
                    return true;
                }
            }
        }
        return false;
    }

    private loadFactor(): number {
        return this.numElements / this.tableSize;
    }

    // Override this if you want another hash code
    private hashCode(key: any, g: number = 31): number {
        key = key.toString();
        let hash: number = 0;
        for (let i = 0; i < key.length; i++) {
            hash += Math.pow(key.charCodeAt(i) * g, key.length - i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    private resize(newSize: number) {
        var newArray: LinkedList<HashElement<K, V>>[] = new Array(newSize);
        // rehashing
        for (let i = 0; i < this.hArray.length; i++) {
            if (this.hArray[i] !== undefined) {
                for (var he of this.hArray[i].toArray()) {
                    var key: K = he.key;
                    var hashValue: number = (this.hashCode(key) & 0x7FFFFFFF) % newSize;
                    if (newArray[hashValue] === undefined) {
                        newArray[hashValue] = new LinkedList();
                    }
                    newArray[hashValue].append(he);
                }
            }
        }

        this.hArray = newArray;
        this.tableSize = newSize;
    }

    add(key: K, value: V): boolean {
        if (this.loadFactor() > this.maxLoadFactor) {
            this.resize(this.tableSize * 2);
        }
        var ne: HashElement<K, V> = new HashElement(key, value);

        var hashValue: number = (this.hashCode(key) & 0x7FFFFFFF) % this.tableSize;

        if (this.hArray[hashValue] === undefined) {

            this.hArray[hashValue] = new LinkedList();
        } else {
            this.numOfCollisions++;
        }
        this.hArray[hashValue].append(ne);
        this.numElements++;
        return true;
    }

    remove(key: K): void {
        var hashValue: number = (this.hashCode(key) & 0x7FFFFFFF) % this.tableSize;

        if (this.hArray[hashValue] !== undefined) {
            for (var ne of this.hArray[hashValue].toArray()) {
                if (ne.key.toString().localeCompare(key.toString()) === 0) {
                    this.hArray[hashValue].delete(ne);
                    this.numElements--;
                }
            }
        }
    }

    getValue(key: K): V {
        var hashValue: number = (this.hashCode(key) & 0x7FFFFFFF) % this.tableSize;
        var he: HashElement<K, V>;
        if (this.hArray[hashValue] !== undefined) {
            for (he of this.hArray[hashValue].toArray()) {
                if (he.key.toString().localeCompare(key.toString()) === 0) {
                    return he.value;
                }
            }
        }
        return undefined;
    }

    toString(): string {
        var str: string;

        str = `[${this.hArray.join(', ')}]`;

        return str;
    }
}

// function generate(n: number): number[] {
//     return Array.from({ length: n }, () => Math.floor(Math.random() * n));;
// }

// let n = 50;

// let arr = generate(n);

// let cH = new HashTableC(n);

// for (let i of arr) {
//     cH.add(i, i);
// }

// console.log(cH.toString());