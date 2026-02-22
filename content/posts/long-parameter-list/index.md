---
title: "Code Smell: Long Parameter List"
date: 2015-03-23
summary: This post explores how methods with many parameters can reduce readability and increase confusion. It outlines practical strategies to simplify calls, such as grouping related data or replacing parameters with explicit methods. Refactoring in this way improves clarity and can also reveal hidden duplication.
description: Long parameter lists make methods hard to read and use. Learn ways to simplify calls, group data, and improve clarity without changing behavior.
categories:
  - Software Design
tags:
  - code-smells
---

Long parameter list in a method call is a code smell. It indicates that there might be something wrong with the implementation.

There is no single rule for how many is too many parameters. Usually more than three or four is considered too many. Here is explained why and how to refactor such cases.

## Symptoms

A long parameter list is easy to spot. Symptoms of too many parameters include:

- It is hard to use a method call or to get the parameters in correct order.
- It is hard to read and interpret what a method call does.
- A method call has boolean parameters.
- A method call has null parameters as optional parameters.

Consider the following example:

```java
calculateStatistics(customer, unit, null, true, false);
```

It is not really clear what each parameter does. To find out you are forced to read the documentation.

## Causes

There is usually a cause for the symptoms described. Maybe you needed more data in a method. Maybe you tried to make a method generic and handle different scenarios. Having a long parameter list can come down to:

- Trying to do too many things in a method.
- Trying to minimize dependencies between objects.

## Solutions

Depending on the situation there are different ways to make it better. These simple techniques show how to refactor the code in each case. Keep in mind that the examples are very simple on purpose!

- If the parameter can be obtained from another object, replace parameter with a method call. The object can be a field in the class or passed as a parameter.
- If the parameters belong to a single object, preserve whole object.
- If the parameters come from different objects, introduce a parameter object.
- If there is a boolean parameter, consider replacing the parameter with explicit methods.

### Replace parameter with method call

Before:

```java
int price = quantity * itemPrice;
discountLevel = getDiscountLevel();
double finalPrice = discountedPrice(price, discountLevel);
```

After:

```java
int basePrice = quantity * itemPrice;
double finalPrice = discountedPrice(basePrice);
```

### Preserve whole object

Before:

```java
int x = point.getX();
int y = point.getY();
window.setLocation(x, y);
```

After:

```java
window.setLocation(point);
```

### Introduce parameter object

Before:

```java
account.balanceBetween(startDate, endDate);
```

After:

```java
account.balanceBetween(new DateRange(startDate, endDate));
```

### Replace parameter with explicit methods

Before:

```java
setValue("visible", true);
```

After:

```java
show();
```

## Benefits

These kind of changes are not made just for fun. Benefits of refactoring include:

- Improving code readability.
- Possibly reducing duplication that was not noticed before.

## Exceptions

This code smell is something that does not guarantee a problem. Sometimes you might decide to go with a long parameter list.

- Sometimes passing a whole object would cause an unwanted dependency between objects.
- In some cases the parameters can be unrelated. Grouping them in a parameter object does not make sense.

## Summary

Long parameter list makes the code harder to use and understand.

Long parameter list can be caused by too complex methods. Another reason is avoiding dependencies.

One way to reduce number of parameters is to replace a parameter with a method call. You can also preserve a whole object or introduce a parameter object. Another way of reducing parameters is replacing a parameter with explicit methods.

Refactoring makes the code easier to read. It may also help to get rid of duplication.
