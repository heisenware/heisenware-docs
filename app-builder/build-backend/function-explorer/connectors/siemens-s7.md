# Siemens S7

This document explains how to use the S7 Connector to communicate with Siemens S7 PLCs. Think of this connector as a universal translator that allows your app to "speak" the same language as the PLC.

The process is simple:

1. **Connect** to the PLC.
2. **Define** the variables (or "tags") you want to read or write.
3. **Perform** the read or write operations.

## Finding Connection Details in TIA Portal

To connect to a PLC, you need three key pieces of information: its **IP Address**, **Rack**, and **Slot**. You can find these in your TIA Portal project.

### 1. IP Address

Select the PLC in the "Project tree" on the left. In the "Properties" tab below, go to "**PROFINET interface > Ethernet addresses**". The **IP address** is listed here.

### 2. Rack & Slot

For S7-1200 and S7-1500 series PLCs, the Rack and Slot are almost always **Rack `0`** and **Slot `1`**. For older S7-300/400 series, you can find this by clicking on "**Device configuration**". The PLC is typically on Rack `0`, and the Slot is usually `2`.

### 3. Enable PUT/GET Communication (Crucial!)

For the connector to have permission to read and write data, you must enable this setting in TIA Portal:

1. Right-click the PLC and select "**Properties**".
2. Go to "**Protection & Security > Connection mechanisms**".
3. Check the box for "**Permit access with PUT/GET communication from remote partner**".
4. Download the hardware configuration to the PLC.

## Connector Functions

You must first create an instance of the connector and then use its functions to interact with your PLC.

{% hint style="success" %}
Typically you will first install the Siemens S7 connector within an [agent](../agents/). That way you can connect your cloud platform to your shopfloor (OT), on-premises PLCs.
{% endhint %}

### connect

Establishes the connection to the target PLC using the details you found in TIA Portal.

**Example:**

```yaml
# options
host: 192.168.0.1  # IP Address from TIA Portal
port: 102
rack: 0
slot: 1            # Use 1 for S7-1200/1500, often 2 for S7-300/400
```

### Addressing PLC Variables

You have two ways to tell the connector which variables to read or write: using an **Address Dictionary** for convenience or using **Direct Addresses**. You can even use both at the same time!

**Method 1: Using an Address Dictionary (Recommended)**

An Address Dictionary lets you create a "shopping list" of all the PLC variables you want to work with. You give each variable a simple, human-readable name (an alias) and map it to its specific address in the PLC. This makes your code much easier to read and maintain.

**Method 2: Using Direct & Mixed Addresses**

If you prefer, you can use the PLC's raw memory address directly in functions like `addItems` and `writeItems`. The connector is smart enough to handle a mix of aliases and direct addresses. When it sees a string, it first checks if it's an alias in the dictionary. If not, it treats it as a direct address.

### setAddressDictionary

Configures the connector with your list of aliases.

{% hint style="danger" %}
Setting a new dictionary will clear the current list of items being monitored. Always set your dictionary **before** adding items that rely on it.
{% endhint %}

**Example:**

```yaml
# dictionary
MOTOR_SPEED: 'DB1,REAL4'
E_STOP_PRESSED: 'I0.0'
CONVEYOR_RUNNING: 'Q4.1'
PROCESS_STEP_COMPLETE: 'M10.5'
```

### addItems

Tells the connector which variables you want to actively monitor. You can provide aliases, direct addresses, or a mix of both.

**Example 1: Using Aliases**

```yaml
# items
[MOTOR_SPEED, E_STOP_PRESSED]
```

**Example 2: Using a Mix**

```yaml
# items
[MOTOR_SPEED, 'DB10,X20.4']
```

**Example 3: Using a single item**

```yaml
# items
'DB10,X20.4'
```

### readAllItems

Reads the current values of all variables you added with `addItems`. The keys in the output object will match the strings you added (aliases and/or direct addresses).

**Output from "Using a Mix" example above:**

```json
{
  "MOTOR_SPEED": 1499.98,
  "DB10,X20.4": true
}
```

### writeItems

Writes one or more new values to one or more variables in the PLC. If several values are written make sure the `items` and the `values` array are of same order and length.

{% hint style="warning" %}
You can only have one write operation running at a time.
{% endhint %}

**Example:**

```yaml
# items
CONVEYOR_RUNNING
# values
true
```

### removeItems

Removes one or more variables from the active monitoring list.

**Example: Removes a single item**

```yaml
# items
E_STOP_PRESSED
```

### removeAllItems

A convenient function to completely clear the list of monitored items.

### showAddressDictionary & showAllItems

These functions are useful for debugging by showing the current state of the connector.

* `showAddressDictionary`: Returns the currently configured address dictionary object.
* `showAllItems`: Returns an array of all item strings currently in the monitoring list.

### getStatus

Checks the current connection state.

**Output:** Returns a string: `'disconnected'`, `'connecting'`, or `'connected'`.

## Appendix: S7 Address Syntax

### Memory Areas

The first part of an address defines _where_ the data is stored in the PLC.

| **Area**         | **Name**       | **Description**                                                                             | **Example** |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------- | ----------- |
| **`DB<number>`** | Data Block     | The main area for storing program data, settings, and recipes. The most common area to use. | `DB1,REAL4` |
| **`I`**          | Inputs         | Reads the status of **physical inputs** like sensors and buttons. (Read-Only)               | `I0.0`      |
| **`Q`**          | Outputs        | Reads or controls **physical outputs** like motors and lights.                              | `Q4.1`      |
| **`M`**          | Merkers/Memory | The PLC's internal "scratchpad" memory for flags and intermediate values.                   | `M10.5`     |

### Data Types

The address format is `AREA,TYPE<BYTE_OFFSET>[.BIT_OR_LENGTH]`.

| **Data Type**              | **S7 Name** | **Description & Example**                         |
| -------------------------- | ----------- | ------------------------------------------------- |
| **Boolean** (On/Off)       | `X`         | A single bit. `DB1,X0.0`                          |
| **Byte** (0-255)           | `B`         | An 8-bit number. `DB1,B1`                         |
| **Char Array**             | `C`         | Reads raw text. `DB1,C20.10` (10 characters)      |
| **String**                 | `S`         | A standard S7 string. `DB1,S20.10` (max 10 chars) |
| **Integer** (Whole Number) | `INT`       | A 16-bit signed number. `DB1,INT2`                |
| **Word** (Unsigned)        | `WORD`      | A 16-bit positive number. `DB1,WORD4`             |
| **Double Int**             | `DINT`      | A 32-bit signed number. `DB1,DINT6`               |
| **DWord** (Unsigned)       | `DWORD`     | A 32-bit positive number. `DB1,DWORD10`           |
| **Real** (Decimal)         | `REAL`      | A 32-bit decimal number. `DB1,REAL14`             |

## Common Pitfalls & Solutions

* **Error: "Object does not exist"**
  * **Problem:** You are trying to write to a Data Block (`DB`) that either doesn't exist or is too small in the PLC.
  * **Solution:** Ensure the DB number is correct and that its size in TIA Portal is large enough to hold all your variables.
* **Reading a String Looks Garbled**
  * **Problem:** You might be using the `S` type on a raw array of characters.
  * **Solution:** Use the `C` type (Char Array) for reading raw text that doesn't have the standard S7 string header. For example: `DB1,C0.16`.
* **Working with `TIME` Values**
  * **Problem:** The S7 `TIME` data type is a special format.
  * **Solution:** Treat it as a `DINT`. The value will be the time in milliseconds. An address for a `TIME` variable would be `DB1,DINT32`.
