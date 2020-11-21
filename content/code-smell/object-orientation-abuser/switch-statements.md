---
title: Switch Statements
url: /switch-statements/
type: book
date: 2015-04-07
author: Arho Huttunen
weight: 50
sections_weight: 50
---

Switch statements are a code smell. Complex conditionals can be hard to read. The same pattern of `switch` statements might be repeating in several locations.

## Symptoms

There is a complex `switch` statement or a long sequence of `if` statements. The problem is not necessarily the `switch` itself but duplication. The code can be spread in different places. Adding a new condition means finding all the `switch` statements and changing them.

## Solutions

Most of times when you see `switch` statements you should think of polymorphism. It is typical that the conditional uses some kind of type code.

- If you need to isolate a `switch`, **extract a method** and possibly **move the method**.
- If the `switch` is based on a type code, the simplest thing to do is to **replace the type code with subclasses**.
- If you update the type code after the object is created, or already subclass this class for another reason, you have to **replace the type code with state or strategy**.
- Once you have the inheritance structure in place, you can **replace conditional with polymorphism**.
- If one of the conditional options is `null`, **introduce a null object**.

### Replace type code with subclasses

Here we have a set of numbers that form a list of allowable values for a type code. The numbers are given understandable names via constants.

```java
public class Shape {
  public static final int SQUARE = 0;
  public static final int CIRCLE = 1;
  public static final int TRIANGLE = 2;

  private int type;

  public Shape(int type) {
    this.type = type;
  }
}
```

Create a subclass for each value of type code. There will be a static factory method that has a switch statement but at least it will be the only one.

```java
public abstract class Shape {
  public static final int SQUARE = 0;
  public static final int CIRCLE = 1;
  public static final int TRIANGLE = 2;

  public abstract int getType();

  public static create(int type) {
    switch (type) {
    case SQUARE:
      return new Square();
    case CIRCLE:
      return new Circle();
    case TRIANGLE:
      return new Triangle();
    }
  }
}

public class Square extends Shape {
  @Override
  public int getType() {
    return Shape.SQUARE;
  }
}

public class Circle extends Shape {
  @Override
  public int getType() {
    return Shape.CIRCLE;
  }
}

public class Triangle extends Shape {
  @Override
  public int getType() {
    return Shape.TRIANGLE;
  }
}
```

### Replace type code with state or strategy

Here we have a same kind of example but let's assume that we cannot create subclasses for the coded types.

```java
public class Shape {
  public static final int SQUARE = 0;
  public static final int CIRCLE = 1;
  public static final int TRIANGLE = 2;

  private int type;

  public Shape(int type) {
    this.type = type;
  }
}
```

Create a new class and give it a name that fits the purpose of the type code. Then create subclasses for each of the types.

```java
public class Shape {
  private ShapeType type;

  public Shape(int type) {
    setTypeCode(type);
  }
  public int getTypeCode() {
    return type.getTypeCode();
  }
  public void setTypeCode(int type) {
    type = ShapeType.create(type);
  }
}

public abstract class ShapeType {
  static final int SQUARE = 0;
  static final int CIRCLE = 1;
  static final int TRIANGLE = 2;

  public abstract int getTypeCode();

  public static ShapeType create(int code) {
    switch (code) {
    case SQUARE:
      return new Square();
    case CIRCLE:
      return new Circle();
    case TRIANGLE:
      return new Triangle();
    }
  }
}

public class Square extends ShapeType {
  @Override
  public int getTypeCode() {
    return ShapeType.SQUARE;
  }
}

public class Circle extends ShapeType {
  @Override
  public int getTypeCode() {
    return ShapeType.CIRCLE;
  }
}

public class Triangle extends ShapeType {
  @Override
  public int getTypeCode() {
    return ShapeType.TRIANGLE;
  }
}
```

### Replace conditional with polymorphism

Let's assume that we have already replaced a type code with subclasses and the inheritance structure is in place.

```java
public class Shape {
  // ...
  public double width;
  public double height;
  public double radius;

  public double area() {
    switch (getType()) {
    case ShapeType.SQUARE:
      return width * height;
    case ShapeType.CIRCLE:
      return PI * radius * radius;
    case ShapeType.TRIANGLE:
      return width * height / 2.0;
    }
  }
}
```

For each of the subclasses redefine the method that has the conditional. Then delete the branch from the conditional until all conditionals have been removed.

```java
public abstract class Shape {
  // ...

  public abstract double area();
}

public class Square extends Shape {
  // ...
  public int width;
  public int height;

  @Override
  public double area() {
    return width * height;
  }
}

public class Circle extends Shape {
  // ...
  public double radius;

  @Override
  public double area() {
    return PI * radius * radius;
  }
}

public class Triangle extends Shape {
  // ...
  public int width;
  public int height;

  @Override
  public double area() {
    return width * height / 2.0;
  }
}
```

### Introduce a null object

Having a method possibly return `null` means that you have to do `null` checks.

```java
public class User {
  private boolean authenticated;

  public boolean isAuthenticated() {
    return authenticated;
  }
}

// Somewhere in the code
public User getCurrentUser() {
  return user;
}

// ...

User user = getCurrentUser();
if (user != null &amp;&amp; !user.isAuthenticated())
  redirectToUnauthorizedPage();
```

Instead of `null` we can return an object that has some kind of default behavior.

```java
public class NullUser extends User {
  @Override
  public boolean isAuthenticated() {
    return false;
  }
}

// Somewhere in the code
public User getCurrentUser() {
  if (user != null)
    return user;
  else
    return new NullUser();
}

// ...

User user = getCurrentUser();
if (!user.isAuthenticated())
  redirectToUnauthorizedPage();
```

## Benefits

Replacing `switch` statements has several benefits:

- Control flow code can be bulky. Moving code to subclasses follows the _Single Responsibility Principle_.
- If you need to add a new type code, you can just add a new subclass without touching the existing code. This follows the _Open/Closed Principle_.
- Instead of asking an object for its state and performing actions based on that it is easier to let the object decide what to do. This means following the _Tell, Don't Ask Principle_.
- In addition, removes duplicate code when you have several similar conditions.

## Exceptions

In some cases replacing `switch` statements is not necessary:

- If the `switch` operator performs very simple actions, there is no reason to change it.
- A factory method or an abstract factory might use switch statements to create classes.

## Summary

Switch statements are a code smell. Duplicated conditionals make changing the code hard.

Usually when you see `switch` statements operating on type codes you should think of replacing them with subclasses. If this is not possible, try replacing the type code with state or strategy. Null conditionals should be replaced with `null` objects.

Refactoring the `switch` statements make the code follow several object-oriented programming principles.

In very simple cases or when implementing factories, there is no reason to change the `switch` statements.
