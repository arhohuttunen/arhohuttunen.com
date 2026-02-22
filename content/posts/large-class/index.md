---
title: "Code Smell: Large Class"
date: 2015-12-08
summary: This post examines why overly large classes make code harder to understand, maintain, and test. It outlines strategies for splitting classes, creating subclasses, or defining interfaces to clarify responsibilities. Refactoring in this way promotes better design, easier testing, and greater code reuse.
description: Large classes with too many responsibilities are hard to maintain and test. Learn how splitting them improves clarity, reusability, and reliability.
categories:
  - Software Design
tags:
  - code-smells
---

A large class is a code smell very similar to a [long method](/long-method). Some might argue that a lot of small classes make the code harder to follow. However, the exact opposite happens with proper splitting of responsibilities between the classes and naming them accordingly.

## Symptoms

A large class consists of a large number of fields, methods and lines of code.

The class most likely has **mixed responsibilities** meaning that it is trying to do too many things. It is not clear anymore what the class actually takes care of.

Another symptom of a too large class is that **it is hard to write a unit test** for it. It is more than probable that the class has **too many dependencies** and therefore the test is impossible or very hard to set up.

## Causes

Classes usually start small. However, new functionality often just gets added to existing classes.

Placing a new feature in an existing class is usually less mentally taxing than creating a new class. The same happens with long methods.

## Solutions

When a class has grown too large it is best to start thinking about splitting it up.

- **Extracting a class** helps, when part of the behavior of a class can be detached from the class.
- **Extracting a subclass** can help, if part of the behavior of a class can be implemented in different ways.
- **Extracting an interface** may help, if we need to list the behaviors that a client can use.

### Extract class

When extracting a class you first need to **decide how to split responsibilities**.

Start by **creating a class** that will contain the new functionality.

Now **create a relationship** between the old class and the new one.

Next you can **start moving fields and methods** from the old class to the new one. Try to relocate bit by bit while testing the results in between to avoid having to fix a bigger number of errors at the end.

Finally, look at the old and created classes. You can **rename the old class for added clarity** if its responsibilities have changed.

### Extract subclass

Start by **creating a subclass** from the class of interest.

Find all constructor calls to the parent class constructor. **Replace with a call to the constructor of the subclass** when the functionality of the subclass is required.

**Start moving methods and fields** from the parent class to the subclass. Modern IDEs allow you to use safe refactoring operations with **push down method** and **push down field**.

Finally, when you are ready with the subclass, you can **remove any fields that controlled the choice of functionality** in the parent class. This can now be replaced with polymorphism so that the different functionality is provided by the subclass.

### Extract interface

Start by creating an empty interface.

Now declare the common operations in the interface.

Declare classes as implementing the interface where necessary.

Change references to classes to use the new interface.

## Benefits

- Having smaller classes will help you follow the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle). Classes with a single responsibility are more reliable and tolerant to changes.
- Smaller classes are usually easier to test because they have less dependencies and tests are easier to set up.
- In many cases splitting large classes to smaller ones reduces duplication of code and functionality.

## Summary

A large class with a lot of fields, methods and lines of code is a code smell. Such class most likely has too many responsibilities and it is hard to write tests for it.

When a class has grown too large, it is possible to extract a class or a subclass from it. If a list of behaviors needs to be listed for a client then it is possible to extract an interface.

Smaller classes are more tolerant to changes and they are easier to test. Often splitting larger classes to smaller ones promotes code reuse.
