---
title: "Code Smell: Long method"
date: 2015-03-30
summary: This post explores why long methods reduce readability and make understanding code harder. It outlines strategies for breaking large methods into smaller, self-explanatory units, including extracting methods, using parameter objects, and decomposing conditionals. Refactoring in this way improves clarity, maintainability, and can uncover hidden duplication.
description: Long methods are hard to read and maintain. Learn how breaking them into smaller, well-named units improves clarity and reveals hidden duplication.
categories:
  - Software Design
tags:
  - code-smells
---

A long method is a code smell. It is a well known fact that the longer a method is, the harder it is to understand. Smaller methods might be harder to follow because there are deep sequences of delegation. The key to make it easy to understand is not the method length but naming.

## Symptoms

A long method is easy to spot. If you need to read the actual implementation of a method to understand it, you probably have a too long method. This may come as a shock if you are used to writing longer methods but is key to self documenting code.

## Causes

Since it is easier to write code than to read it, something is always being added to a method but never taken out. A long method can start smelling when it already has grown into monstrous proportions.

## Solutions

As a general rule of thumb whenever you feel like adding a comment to code you should take that code and make it a method. Some might argue that smaller methods are harder to follow. However, the key is to make method names descriptive enough so that you do not need to look at the code at all.

- If you need to make a long method shorter, in majority of cases, just extract a method. Modern IDE tools make this very easy.
- If there are local variables or parameters that prevent extracting a method, replace temp with query, introduce a parameter object, or preserve whole object.
- If all of the above rules fail, try to replace entire method with a method object. This means moving the entire method into a separate object.
- If there are conditional operators, you can try to decompose the conditional.

### Extract method

Before:

```java
void printOwing() {
  printBanner();

  // print details
  System.out.println("name: " + name);
  System.out.println("amount: " + getOutstanding());
}
```

After:

```java
void printOwing() {
  printBanner();
  printDetails(getOutstanding());
}

void printDetails(double outstanding) {
  System.out.println("name: " + name);
  System.out.println("amount: " + outstanding);
}
```

### Replace temp with query

In this example keep in mind that the local variable is preventing us from using extract method. The goal here is to present how to make it possible.

Before:

```java
double basePrice = quantity * itemPrice;
if (basePrice > 1000)
  return basePrice * 0.95;
else
  return basePrice * 0.98;
```

After:

```java
if (basePrice() > 1000)
  return basePrice() * 0.95;
else
  return basePrice() * 0.98;

double basePrice() {
  return quantity * itemPrice;
}
```

### Replace method with method object

Before:

```java
class Order {
  double price() {
    double primaryBasePrice;
    double secondaryBasePrice;
    double tertiaryBasePrice;
    // long computation;
    // ...
  }
}
```

After:

```java
class Order {
  public double price() {
    return new PriceCalculator(this).compute();
  }
}

class PriceCalculator {
  private double primaryBasePrice;
  private double secondaryBasePrice;
  private double tertiaryBasePrice;

  public PriceCalculator(Order order) {
    //...
  }

  public double compute() {
    // long computation.
    //...
  }
}
```

### Decompose conditional

Before:

```java
if (date.before(SUMMER_START) || date.after(SUMMER_END))
  charge = quantity * winterRate + winterServiceCharge;
else
  charge = quantity * summerRate;
```

After:

```java
if (notSummer(date))
  charge = winterCharge(quantity);
else
  charge = summerCharge (quantity);
```

## Benefits

Simply put, your code will become much more readable. It is also possible that you can remove duplicate code hidden in a long method.

## Summary

A long method is hard to understand. The key to make it easy to understand is not the method length but naming. You should not have to read the actual implementation to understand what a method does.

Methods grow large because it is easier to write code than to read it. Whenever you feel like adding a comment to code you should take that code and make it a method.

When you find a large method, you should refactor it. In most cases you can just extract a method. Sometimes a local variable or parameter prevents doing this. You can then try to replace temp with query, introduce a parameter object, or preserve whole object. If that fails, replace method with a method object.
