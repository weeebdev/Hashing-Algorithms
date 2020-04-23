import { HashElement, HashI } from './HashI'
class HashTableO<K, V> implements HashI<K, V>{
    private g = 31;
    numElements: number;
    tableSize: number;
    maxLoadFactor: number;
    hArray: HashElement<K, V>[];

    constructor(tableSize: number, maxLoadFactor: number = 0.5) {
        this.tableSize = tableSize;
        this.hArray = new Array(this.tableSize);
        this.maxLoadFactor = maxLoadFactor;
        this.numElements = 0;
    }

    private rehash() {
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

        if (this.loadFactor() > this.maxLoadFactor) {
            this.resize(this.tableSize * 2);
        }

        let hashValue = this.hashValue(key) % this.tableSize;
        if (this.hArray[hashValue] !== undefined) {
            console.log('OMG! Collision!')
            const oldHash = hashValue;
            let c = 0;
            do {
                console.log(c++)
                hashValue = (hashValue * 2) % this.tableSize;
                if (this.hArray[hashValue] === undefined) {
                    this.hArray[hashValue] = new HashElement<K, V>(key, value);
                    this.numElements++;
                    return true;
                }
            } while (oldHash !== hashValue);

        } else {
            this.hArray[hashValue] = new HashElement<K, V>(key, value);
            this.numElements++;
            return true;
        }

        this.rehash();
        this.resize(this.tableSize);
    }

    contains(key: K, value?: V): boolean {
        //  do later after remove method

        let hashValue = this.hashValue(key) % this.tableSize;
        const oldHash = hashValue;

        do {
            if (this.hArray[hashValue] !== undefined) {
                if (value === undefined ? this.hArray[hashValue].equalsKey(key) : this.hArray[hashValue].equals(new HashElement<K, V>(key, value))) {
                    return true;
                }
            } else {
                return false;
            }
            hashValue = (hashValue * 2) % this.tableSize;

        } while (oldHash !== hashValue);
    }

    resize(tableSize: number) {
        console.log('Resizing')
        const temp: HashElement<K, V>[] = this.hArray;
        this.hArray = new Array(tableSize);
        this.numElements = 0;
        this.tableSize = tableSize;

        for (let i = 0; i < temp.length; i++) {
            console.log(i)
            if (temp[i] !== undefined) {
                this.add(temp[i].key, temp[i].value);
            }
        }
    }
    remove(key: K): void {
        if (this.contains(key)) {
            return;
        }

        let hashValue = this.hashValue(key) % this.tableSize;

        if (this.hArray[hashValue] !== undefined) {
            this.hArray[hashValue] = undefined;
            this.numElements--;
            this.resize(this.tableSize);
        }

    }
    getValue(key: K): V {
        let hashValue = this.hashValue(key) % this.tableSize;
        const oldHash = hashValue;

        do {
            if (this.hArray[hashValue] !== undefined) {
                if (this.hArray[hashValue].equalsKey(key)) {
                    return this.hArray[hashValue].value;
                }
            } else {
                return undefined;
            }
            hashValue = (hashValue * 2) % this.tableSize;

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

var d = new HashTableO(10);
d.add('a', 'b');

for (let i = 0; i < 100; i++) {
    d.add(i, i);
}


console.log(d.toString());
console.log(d.contains('c'));