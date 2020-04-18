import { LinkedList } from './LinkedList';

interface HashI<K, V> {
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
}

class Comparable<T> {
    compareTo: (o: T) => number;
    equals: (o: T) => number;
}

class HashElement<K, V> implements Comparable<HashElement<K, V>>{
    key: K;
    value: V;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }

    compareTo(o: HashElement<K, V>): number {
        return this.key.toString().localeCompare(o.toString());
    }

    equals(o: HashElement<K, V>): number {
        return this.key.toString().localeCompare(o.toString()) === 0 ? 0 : 1;
    }

    public toString(): string {
        var str: string = `${this.key.toString()}: ${this.value.toString()}`;
        return str;
    }
}

class HashTableC<K, V> implements HashI<K, V>{
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    hArray: LinkedList<HashElement<K, V>>[];

    constructor(size: number, loadFactor: number = 1) {
        this.tableSize = size;
        this.hArray = new Array(this.tableSize);
        this.maxLoadFactor = loadFactor;
        this.numElements = 0;
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

    public add(key: K, value: V): boolean {
        if (this.loadFactor() > this.maxLoadFactor) {
            this.resize(this.tableSize * 2);
        }
        var ne: HashElement<K, V> = new HashElement(key, value);

        var hashValue: number = (this.hashCode(key) & 0x7FFFFFFF) % this.tableSize;

        if (this.hArray[hashValue] === undefined) {

            this.hArray[hashValue] = new LinkedList();
        }
        this.hArray[hashValue].append(ne);
        this.numElements++;
        return true;
    }

    public remove(key: K) {
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

    public getValue(key: K): V {
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

    public toString(): string {
        var str: string;

        str = `[${this.hArray.join(', ')}]`;

        return str;
    }
}


function print(params: any) {
    console.log(params.toString())
}

var h = new HashTableC(10);
for (let i = 0; i < 100; i++) {
    h.add(i, i);
}

h.remove(1);
// h.add('Adil', 'Akhmetov');
// h.add('Akzhan', 'Akhmetova');
// h.add('Akzhan', 'Bairamov');
// h.add('31', 'Bairamov');
// h.remove('Akzhan');
print(h.tableSize);