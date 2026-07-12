# Counter

The `Counter` class is a simple utility for maintaining a numerical count. It allows for incrementing, decrementing, and resetting the count.

You must create an instance of the counter to use it.

***

### create

Creates a new counter instance, optionally starting from an initial value.

Parameters

* `initial`: The number to start counting from. Defaults to `0`.

Example

```yaml
# initial
10
```

***

### increment

Increments the counter's value by one.

Output

The new, incremented count.

***

### decrement

Decrements the counter's value by one.

Output

The new, decremented count.

***

### reset

Resets the counter back to its initial value. You can optionally provide a new initial value to use for this and all future resets.

Parameters

* `initial`: An optional new initial value.

Example: Reset to a new initial value

```yaml
# initial
100
```

***

### getCount

Retrieves the current value of the counter.

Output

An integer representing the current count.
