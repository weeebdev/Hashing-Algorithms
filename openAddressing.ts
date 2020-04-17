class HashTable {
    private data = null;
    private capacity = 0;
    private g = 31;
    private size = 0;

    constructor(capacity) {
        this.capacity = capacity;
        this.data = new Array(this.capacity)
    }

    private hash(data) {
        data = data.toString();
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            let charCode = data.charCodeAt(i);
            hash += Math.pow(this.g, i) * charCode;
        }
        hash &= 0x7FFFFFFF;
        return hash;
    }

    private loadFactor() {
        return this.size / this.data.length;
    }

    insert(key, value) {
        let hash = this.hash(key);
        hash %= this.capacity;
        if (this.data[hash] === undefined) {
            this.data[hash] = value;
        } else {
            for (let i = hash + 1; i < this.data.length; i++) {
                if (i === hash) {
                    // do resize
                }
                if (this.data[i] === undefined) {
                    this.data[i] = value;
                    break;
                } else {
                    hash %= this.capacity;
                }
            }
        }
    }

    delete(key) {

    }

    find(key) {
        let hash = this.hash(key);
        hash %= this.capacity;
        if (this.data[hash] === undefined) {
            return undefined;
        } else {
            return this.data[hash];
        }
    }

    toString() {
        return this.data;
    }
}

var d = new HashTable(10);
d.insert('a', 'b');
d.insert('c', 'd');
console.log(d);
console.log("Hello");