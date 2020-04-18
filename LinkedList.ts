type TFunction<T, R> = (t: T) => R;

interface INode<T> {
    value: T;
    next?: INode<T>;
}

export class LinkedList<T>{
    private head: INode<T> = null;
    private tail: INode<T> = null;
    private EMPTY_NODE: INode<T> = { value: null, next: null };

    public append = (value: T): LinkedList<T> => {
        const node = this.forgeNode(value);

        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
            return this;
        }

        this.appendToTheEndOfTheList(node);
        return this;
    };

    public isEmpty = () => !this.head;

    public toArray = (): T[] => {
        const result: T[] = [];
        let node = this.head;
        while (node) {
            result.push(node.value);
            node = node.next;
        }
        return result;
    };

    public fromArray = (values: T[]): LinkedList<T> => {
        values.forEach(v => this.append(v));
        return this;
    };

    private appendToTheEndOfTheList = (node: INode<T>) => {
        this.tail.next = node;
        this.tail = node;
    };

    private forgeNode = (value: T): INode<T> => {
        return { value, next: null };
    };

    public delete = (value: T): boolean => {
        let deleted: boolean = false;
        if (this.isEmpty()) {
            return deleted;
        }

        deleted = this.deleteFromHead(value);

        let current = this.head || this.EMPTY_NODE;
        while (current.next) {
            if (current.next.value === value) {
                deleted = true;
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }

        if (this.tail.value === value) {
            this.tail = current;
        }
        return deleted;
    };

    private deleteFromHead = (value: T): boolean => {
        let deleted: boolean = false;
        while (this.head && this.head.value === value) {
            deleted = true;
            this.head = this.head.next;
        }
        return deleted;
    };

    public find = (compare: TFunction<T, boolean>): INode<T> => {
        if (this.isEmpty()) {
            return null;
        }

        let node = this.head;
        while (node) {
            if (compare(node.value)) {
                return node;
            }
            node = node.next;
        }
        return null;
    };

    public insert = (value: T): LinkedList<T> => {
        const node = this.forgeNode(value);
        node.next = this.head;
        this.head = node;

        if (!this.tail) {
            this.tail = node;
        }

        return this;
    };

    public toString(): string {
        var str: string;
        str = `{${this.toArray().join(', ')}}`;
        return str;
    }
}
