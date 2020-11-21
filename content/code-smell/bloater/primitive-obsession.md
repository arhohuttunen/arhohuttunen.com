---
title: Primitive Obsession
url: /primitive-obsession/
type: book
date: 2015-04-20
author: Arho Huttunen
weight: 20
sections_weight: 20
---

Primitive obsession is a code smell. Primitive in this context refers to programming language primitive data types. Obsession refers to always using these data types to represent domain ideas.

The concept of primitive can be extended to include language base classes. Just because you can represent something as a `String`, an `Integer`, or even a `Map` does not mean you always should. Primitive obsession and a strongly typed language results in weak typing.

## Symptoms

Primitive obsession is easy to spot. While it is easy to spot, it is also very easy to slip on. Symptoms of primitive obsession include:

- Using primitive types instead of small classes for small tasks like ranges, currency, addresses or telephone numbers.
- Using type codes for coding information.
- Using arrays, maps or dictionaries to represent a specific object.
- Having utility code to handle different scenarios related to the aforementioned types like handling ranges or verifying address formats.

## Causes

The causes for primitive obsession are usually a result of momentary laziness.

- It is easy to just use a primitive for storing a field instead of making a new class for it.
- Often the primitives are used to simulate a type. Instead of a separate object you have a set of acceptable numbers or strings that are given understandable names via constants.
- Sometimes instead of creating a new field or an object data might be just inserted into a data collection.

## Solutions

Primitive obsession can be easy to fix when caught early. Later on it will become much more difficult because the primitives have spread widely and replacement will be laborious.

- If there are primitive fields that belong logically together you can **replace data value with object**. While grouping the field data into their own class, you can also move the behavior associated with the data.
- If primitives are being used as parameters, use [introduce parameter object](/long-parameter-list) or [preserve whole object](/long-parameter-list).
- If data is coded in variables, use [replace type code with subclasses](/switch-statements) or [replace type code with state or strategy](/switch-statements).
- If there are arrays or other collections in the variables, use **replace array with object**.

### Replace data value with object

Seemingly simple data fields can have associated data and behavior.

```java
public class Person {
  private String firstName;
  private String lastName;
  private boolean isFemale;
}
```

After refactoring you can move related behavior inside the class. This improves relatedness.

```java
public class Person {
  private Name name;
  private Gender gender;
}

public class Name {
  private String firstName;
  private String lastName;
}

public enum Gender {
  FEMALE, MALE;
}
```

### Replace array with object

```java
Object[] result = new Object[3];
result[0] = "Error calculating statistics";
result[1] = succeededCount;
result[2] = failedCount;
```

The fields of a class are much easier to read than indexing an array.

```java
public class Result {
  private String errorMessage;
  private int succeededCount;
  private int failedCount;
}
```

## Benefits

- Improves relatedness of data and operations. It is easier to understand and manage the behavior when it's in one place.
- Makes typing stronger. You can ensure that the new objects only accept certain kind of data.
- Can reduce code duplication. You are no longer repeatedly doing the same operations all over the place.

## Summary

Primitive obsession refers to using primitive data types to represent domain ideas. Often times it is a result of momentary laziness. Instead of creating a new class for fields it is easy to use strings, integers or collections to simulate types.

Fields that logically belong together can be combined by replacing data value with object. Parameters can be replaced by introducing parameter objects or preserving whole objects. Type codes can be replaced with polymorphism.

Refactoring results into improved relatedness of data and operations. It also makes typing stronger and can remove duplication.
