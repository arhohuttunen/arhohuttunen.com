---
title: Dead code
url: /dead-code/
type: docs
toc: true
date: 2016-01-08
author: Arho Huttunen
weight: 70
sections_weight: 70
menu:
  smells:
    name: Dead Code
    parent: Dispensables
    weight: 70
---

Dead code is a code smell. Dead code is code that has remained around but is never reached or called. It is very common to have dead code in older projects that have not been cleaned up. While being a very common code smell it is also very easy to fix.

## Symptoms

Symptoms of dead code are variables, fields, methods or classes that are not used anymore. They have usually become obsolete and are not called or reached at all.

## Causes

When requirements change or corrections have been made parts of the code have become obsolete. When nobody has cleaned up the code has become dead weight.

It is also possible that some code cannot be reached in complex conditionals thus also being dead code. This might be due to errors or changes done in the implementation.

## Solutions

The easiest way to remove dead code is to use a modern IDE. It is easy to find if a method or class is being used at all.

- **Delete unused code and unneeded files**.
- If you notice an unnecessary class, use **inline class** or **collapse hierarchy**.
- If some parameters have become obsolete, use **remove parameter**.

### Inline class

Sometimes a class does almost nothing, is not responsible for anything and there are no additional responsibilities planned for it. In this case you can just move all the features from the class to another one.

This technique might be needed if all the features of one class have been moved to other classes. The original class might be left with very little to do.

### Collapse hierarchy

Sometimes you might have a class hierarchy in which the subclass is practically the same as the superclass. In such a case you can merge the subclass and the superclass.

This might happen when the code has grown and the classes start to look alike. Something was added to the other and then to the other and finally the classes have become practically the same.

## Benefits

The benefits of removing dead code are pretty clear. The code size is reduced and supporting the code is simpler.

## Summary

Dead code is a common code smell that is easy to fix. It consists of code that is never called or reached.

Dead code might be due to change in requirements, corrections made or errors in code.

Getting rid of dead code means deleting unused code and files. Inlining classes or collapsing hierarchy can be used to get rid of unnecessary classes. Obsolete parameters can also be removed.

As a result code size is reduced and support becomes simpler.
