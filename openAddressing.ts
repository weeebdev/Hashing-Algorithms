import { HashElement, HashI } from './HashI'
export class HashTableO<K, V> implements HashI<K, V>{
    private g = 31;
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    hArray: HashElement<K, V>[];
    numOfCollisions: number;

    getNumOfCollisions(): number {
        return this.numOfCollisions;
    }

    constructor(tableSize: number, maxLoadFactor: number = 0.5) {
        this.tableSize = tableSize;
        this.hArray = new Array(this.tableSize);
        this.maxLoadFactor = maxLoadFactor;
        this.numElements = 0;
        this.numOfCollisions = 0;
    }

    private rehash() {
        // console.log('Rehashing')
        let newPrime: number = this.g;

        let isPrime = (x) => {
            if (x <= 1) {
                return false;
            }
            if (x <= 3) {
                return true;
            }
            if (x % 2 == 0 || x % 3 == 0) return false;

            for (let i = 5; i * i <= x; i = i + 6) {
                if (x % i == 0 || x % (i + 2) == 0)
                    return false;
            }
            return true;
        }

        newPrime++;

        while (!isPrime(newPrime)) {
            newPrime++;
        }

        this.g = newPrime;

    }

    add(key: K, value: V): boolean {

        if (this.contains(key, value)) {
            return false;
        }

        // console.log(`${key}:${value}`)

        if (this.loadFactor() > this.maxLoadFactor) {
            this.resize(this.tableSize * 2);
        }

        let hashValue = this.hashValue(key) % this.tableSize;
        if (this.hArray[hashValue] !== undefined) {
            this.numOfCollisions++;
            const oldHash = hashValue;
            let index = 1;
            do {
                hashValue = (hashValue + index) % this.tableSize;
                if (this.hArray[hashValue] === undefined) {
                    this.hArray[hashValue] = new HashElement<K, V>(key, value);
                    this.numElements++;
                    return true;
                }
                index++;
            } while (oldHash !== hashValue);

        } else {
            this.hArray[hashValue] = new HashElement<K, V>(key, value);
            this.numElements++;
            return true;
        }
        this.rehash();
        this.resize(this.tableSize);
        return this.add(key, value);
    }

    contains(key: K, value?: V): boolean {
        let hashValue = this.hashValue(key) % this.tableSize;
        const oldHash = hashValue;
        let index = 1;
        do {
            if (this.hArray[hashValue] !== undefined) {
                if (value === undefined ? this.hArray[hashValue].equalsKey(key) : this.hArray[hashValue].equals(new HashElement<K, V>(key, value))) {
                    return true;
                }
            } else {
                return false;
            }
            hashValue = (hashValue + index) % this.tableSize;
            index++;

        } while (oldHash !== hashValue);
    }

    resize(tableSize: number) {
        // console.log('Resizing')
        const temp: HashElement<K, V>[] = this.hArray;
        this.hArray = new Array(tableSize);
        this.numElements = 0;
        this.tableSize = tableSize;

        for (let i = 0; i < temp.length; i++) {
            // console.log(i)
            if (temp[i] !== undefined) {
                this.add(temp[i].key, temp[i].value);
            }
        }
        // console.log('Resized')
    }
    remove(key: K): void {
        var k = parseInt(key.toString())
        if (!this.contains(key)) {
            return;
        }

        let hashValue = this.hashValue(key) % this.tableSize;
        const oldHash = hashValue;

        let index = 1;
        do {
            if (this.hArray[hashValue].equalsKey(key)) {
                this.hArray[hashValue] = undefined;
                this.numElements--;
                this.resize(this.tableSize);
                return;
            }
            hashValue = (hashValue + index++) % this.tableSize;

        } while (oldHash !== hashValue);

    }
    getValue(key: K): V {
        let hashValue = this.hashValue(key) % this.tableSize;
        const oldHash = hashValue;

        let index = 1;
        do {
            if (this.hArray[hashValue] !== undefined) {
                if (this.hArray[hashValue].equalsKey(key)) {
                    return this.hArray[hashValue].value;
                }
            } else {
                return undefined;
            }
            hashValue = (hashValue + index) % this.tableSize;
            index++;
        } while (oldHash !== hashValue);
    }

    private hashValue(key: K): number {
        let data = key.toString();
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            let charCode = data.charCodeAt(i);
            hash += Math.pow(this.g, i) * charCode;
        }
        hash &= 0x7FFFFFFF;
        return hash;
    }

    private loadFactor() {
        return this.numElements / this.tableSize;
    }


    toString() {
        return this.hArray.join(', ');
    }
}
