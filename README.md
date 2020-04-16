$?$
>_odd  
remove  
lookup/find  
change_ 

$O(n)$
>_all entries  
all keys  
all values_  

$O(1)$
>size  
isEmpty  
isFull  
loadFactor()  

<!-- ## Associative arrays ## -->
```
hashCode(String id)
    remove cssc
    covert to int
    return int
```

## Hash functions ##
- property of the data
- be fast to compute
- if two things are "equal" the should return the same value
- Always return the same value for an object during an one run of the code
- possible to return different values for an object in separate runs (hardly believe)
- minimize collisions

## Collisions ##
$E.g.$
We have a phone number $6195551212$  
And our hash function takes the number and sums up the different parts of it
$$619+555+1212=2386$$
That's nice, but what if we have another number $619 550 1217$?
It is also
$$619+550+1217=2386$$
**This is a collision**  
*Btw the way we summed up the number is called **Folding***

## Strings ##
Let's hash the string 'this'  
We may represent it as ASCII code  
| t   | h   | i   | s   |
| --- | --- | --- | --- |
| 116 | 104 | 105 | 115 |
  
The problem is if we are going to just sum up their codes we will have a collisions with strings like:
- hits
- tish
- shi.. O.O

So, just adding the numbers is not a good way of hashing the string  
But we may take some constant $g$ and multiply it like
$$g^0*116+g^1*104+g^2*105+g^3*115$$  
code may look like  
```java
public int hashCode(String s) {
    int g = 31;
    int hash = 0;
    for (int i = 0; i < s.length; i++) {
        hash = g * hash + s.charAt(i);
    }
    return hash;
}
```  

## Compressing hashCode() ##
- odd sized table
- table size is a prime number  
$-10\mod3 = -1$  
*There are a lot of stuff with two's complement*
```java
    int hashVal = data.hashCode() & 0x7FFFFFFF; // make int positive
    hashVal = hashVal % tableSize;
```
## Load factor ##
$$\lambda = \frac{\text{number of entries}}{\text{total size of array}}$$
$$\lambda = 0 \text{ - then data structure is empty}$$
$$\lambda = 0.5 \text{ - then data structure is half full}$$
$$\lambda = 1 \text{ - the data structure is full}$$

When it full we have to resize the array.

## Resolve collisions in a hash ##
Linear probing  
 - If cell is full, let's go to the next one

Quadratic probing
 - If cell is full, let's go to the +n^2 cell

Double hashing
 - Two different hashCode functions
 - 2nd must be different from the 1st
 - 2nd mustn't return 0
 - ```e.hashCode() + e.hashTwo()```

## Chaining ##
Approach using linked lists.  
- Constant time: add, remove, find (?) 
- Unlimited size  
- Doesn't need resizing (Unlimited size)

$\lambda = \frac{\text{num entries}}{\text{num possible chains}}$  

We may allow $\lambda$ may be $\ge$ to the 1  

*This is a best approach*

**BUT**  
Worst case: $O(n)$  
Best case: $O(1)$

## Rehashing ##
The problem is that we can't just copy nodes from old array to the new one. THUS, we have to rehash all the elements.