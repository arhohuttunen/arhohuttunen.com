---
title: "A More Practical Guide to JUnit 5 Parameterized Tests"
date: 2019-05-25
author: Arho Huttunen
summary: This tutorial teaches you how to write JUnit 5 parameterized tests. It is structured so that it also answers most asked questions about parameterized tests.
categories:
  - Testing
tags:
  - JUnit 5
featured: true
image:
  focal_point: center
---

This tutorial teaches you how to write JUnit 5 parameterized tests. It is structured so that it also answers most asked questions about parameterized tests.

This article is part of the [JUnit 5 Tutorial](/junit-5-tutorial).

{{% toc %}}

## Overview

Parameterized tests make it possible to run the same test multiple times with different arguments.
This way, you can quickly verify various conditions without writing a test for each case.

We can write JUnit 5 parameterized tests just like regular JUnit 5 tests but have to use the `@ParameterizedTest` annotation instead.
We will also have to declare an argument source for the test.
We declare these argument sources with different argument source annotations.

## Do you only need one argument?

The simplest argument source is the `@ValueSource` argument source.
It lets you specify an array of literals of primitive types (either `short`, `byte`, `int`, `long`, `float`, `double`, `char`, `boolean`, `String`, or `Class`).

Here is an example of using different strings as the test argument.

```java
@ParameterizedTest
@ValueSource(strings = { "racecar", "radar", "able was I ere I saw elba" })
void palindromeReadsSameBackward(String string) {
    assertEquals(palindrome, isPalindrome(string));
}
```

When we run the test, we can see from the output that the test method executed three times with different values of the string.

```sh
palindromeReadsSameBackward(String)
├─ [1] racecar
├─ [2] radar
└─ [3] able was I ere I saw elba
```

Here is another example, where we provide `int`s to our parameterized test.

```java
@ParameterizedTest
@ValueSource(ints = { 3, 6, 15})
void divisibleByThree(int number) {
    assertEquals(0, number % 3);
}
```

Another source of a single argument is the `@EnumSource` annotation.
The annotation takes an enum type as an argument and provides the test with the enum constants.

For example:

```java
enum Protocol {
    HTTP_1_0, HTTP_1_1, HTTP_2
}
```

```java
@ParameterizedTest
@EnumSource(Protocol.class)
void postRequestWithDifferentProtocols(Protocol protocol) {
    webServer.postRequest(protocol);
}
```

## What about null values?

The `@ValueSource` annotation doesn't accept null values.
There is one special annotation called `@NullSource` that will provide a null argument for the test.

```java
@ParameterizedTest
@NullSource
@EmptySource
@ValueSource(strings = { " " })
void nullEmptyAndBlankStrings(String text) {
    assertTrue(text == null || text.trim().isEmpty());
}
```

Another special annotation is `@EmptySource`, which provides an empty value for either a `String`, `List`, `Set`, `Map`, or an array.

## Do you need multiple arguments?

The `@ValueSource` and `@EnumSource` annotations only work when our test method takes one argument.
However, we often need more than that.

`@MethodSource` allows you to refer to a method that returns the arguments.
Such methods must return a `Stream`, `Iterable`, `Iterator`, or an array of arguments.

Let's assume that we have a class `RomanNumeral` that converts arabic to roman numerals.
We need to pass multiple parameters in our parameterized test, so we can use a `Stream` of `Arguments`.

```java
@ParameterizedTest
@MethodSource("arabicToRomanProvider")
void convertArabicToRomanNumeral(int arabic, String roman) {
    assertEquals(roman, new RomanNumeral(arabic).toString());
}

private static Stream arabicToRomanProvider() {
    return Stream.of(
            Arguments.of(1, "I"),
            Arguments.of(3, "III"),
            Arguments.of(4, "IV")
    );
}
```

Now we provide the test with different values of `arabic` and `roman` parameters.

If we don't provide a method name to the `@MethodSource` annotation, JUnit 5 will find a method with the same name instead.

```java
@ParameterizedTest
@MethodSource
void convertArabicToRomanNumeral(int arabic, String roman) {
    assertEquals(roman, new RomanNumeral(arabic).toString());
}

private static Stream convertArabicToRomanNumeral() {
    return Stream.of(
            Arguments.of(1, "I"),
            Arguments.of(3, "III"),
            Arguments.of(4, "IV")
    );
}
```

## Do you have a lot of data?

The `@CsvSource` annotation allows you to use a list of comma-separated string values.
Using the annotation makes it possible to provide multiple parameters to the test method in quite a compact way.

```java
@ParameterizedTest
@CsvSource({
        "1, I",
        "3, III",
        "4, IV"
})
void convertArabicToRomanNumeral(int arabic, String roman) {
    assertEquals(roman, new RomanNumeral(arabic).toString());
}
```

If we write a lot of test data in the test code, the test quickly becomes unreadable.
One solution is to provide the data in an external CSV file using the `@CsvFileSource` annotation.

Using the previous roman numeral example, we start by creating a comma-separated list of parameters in `roman-numeral.csv` file that we will put in `src/test/resources`.
Each line from the file works as a list of parameters.

```
1, I
3, III
4, IV
```

Next, we use the `@CsvFileSource` annotation to provide the test method with the data.

```java
@ParameterizedTest
@CsvFileSource(resources = "/roman-numeral.csv")
void convertArabicToRomanNumeral(int arabic, String roman) {
    assertEquals(roman, new RomanNumeral(arabic).toString());
}
```

### How to convert strings into different types?

To better support use cases like `@CsvSource`, JUnit 5 does automatic argument conversion for primitive types, enums, and the date and time types from the `java.time` package.
The conversion depends on the type of each method parameter.

This means, for example, that it automatically converts the following date strings to `LocalDate` instances.

```java
@ParameterizedTest
@ValueSource(strings = { "2018-01-01", "2018-01-31" })
void convertStringToLocalDate(LocalDate localDate) {
    assertEquals(Month.JANUARY, localDate.getMonth());
}
```

JUnit 5 parameterized tests support many more types by default.
Instead of going through all of them here, we can check the [JUnit 5 implicit conversion](https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests-argument-conversion-implicit) documentation for a list of target types.

If JUnit 5 is not able to convert the argument, it will try to call either of the two in the target type:

1. A constructor with a single `String` argument
2. A `static` method accepting a single `String` argument, which returns an instance of the target type 

In the following example, JUnit 5 will call the constructor of `Task` to do the type conversion from `String`.

```java
public class Task {
    private final String name;

    private Task(String name) {
        this.name = name;
    }
}

@ParameterizedTest
@ValueSource(strings = "Brush teeth")
void convertWithConstructor(Task task) {
    assertEquals("Brush teeth", task.getName());
}
```

Consequently, the implementation of that `Task` class in the next example would work as well.

```java
public class Task {
    private final String name;

    public static fromName(String name) {
        return new Task(name);
    }
}
```

### How to convert your custom types?

If we need to write a custom argument converter, we need to implement the `ArgumentConverter` interface.
We can then annotate any parameters needing custom conversion with the `@ConvertWith` annotation.

For example's sake, let's write an argument converter that converts hex values into decimal values.
Instead of implementing `ArgumentConverter`, we can also extend `TypedArgumentConverter` if the converter only handles one type.

```java
class HexConverter extends TypedArgumentConverter<String, Integer> {
    protected HexConverter() {
        super(String.class, Integer.class);
    }

    @Override
    public Integer convert(String source) throws ArgumentConversionException {
        try {
            return Integer.parseInt((String) source, 16);
        } catch (NumberFormatException e) {
            throw new ArgumentConversionException("Cannot convert hex value", e);
        }
    }
}
```

Next, in our test, we need to annotate the parameter that needs custom conversion with `@ConvertWith`.

```java
@ParameterizedTest
@CsvSource({
        "15, F",
        "16, 10",
        "233, E9"
})
void convertWithCustomHexConverter(int decimal, @ConvertWith(HexConverter.class) int hex) {
    assertEquals(decimal, hex);
}
```

To make the test itself a little less technical and more readable, we can further create a meta-annotation that wraps the conversion.

```java
@Target({ ElementType.ANNOTATION_TYPE, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@ConvertWith(HexConverter.class)
public @interface HexValue {
}
```

Now we can use our new composed annotation to make the test more readable.

```java
@ParameterizedTest
@CsvSource({
        "15, F",
        "16, 10",
        "233, E9"
})
void convertWithCustomHexConverter(int decimal, @HexValue int hex) {
    assertEquals(decimal, hex);
}
```

### How to convert multiple arguments into a single object?

By default, arguments provided to a parameterized test correspond to a single method parameter.
It is possible to aggregate these arguments into a single test method argument using a `ArgumentsAccessor`.

To create a more readable and reusable arguments aggregator, we can write our own.

```java
public class TaskAggregator implements ArgumentsAggregator {
    @Override
    public Object aggregateArguments(
            ArgumentsAccessor accessor,
            ParameterContext context
    ) throws ArgumentsAggregationException {

        return new Task(
                accessor.getString(0),
                accessor.get(1, Status.class),
                accessor.get(2, LocalDate.class)
        );
    }
}
```

```java
@ParameterizedTest
@CsvSource({
        "Write a blog post, IN_PROGRESS, 2020-12-20",
        "Wash the car, OPENED, 2020-12-15"
})
void aggregateArgumentsWithAggregator(@AggregateWith(TaskAggregator.class) Task task) {
    System.out.println(task);
}
```

Just like with the custom argument converter, we can also create a shorthand annotation for the aggregator.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
@AggregateWith(TaskAggregator.class)
public @interface CsvToTask {
}
```

```java
@ParameterizedTest
@CsvSource({
        "Write a blog post, IN_PROGRESS, 2020-12-20",
        "Wash the car, OPENED, 2020-12-15"
})
void aggregateArgumentsWithAnnotation(@CsvToTask Task task) {
    System.out.println(task);
}
```

Now we can use the aggregator annotation anywhere we want to.

### How to provide empty CSV arguments?

If `@CsvSource` has an empty value, JUnit 5 will always treat it as `null`.

```java
@ParameterizedTest
@CsvSource(value = {"John, "})
void nullArgument(String name, String address) {
    assertNull(address);
}
```

The string needs to be quoted with single quotes, so that it becomes an empty string.

```java
@ParameterizedTest
@CsvSource({"John, ''"})
void emptyArgument(String name, String address) {
    assertTrue(address.isEmpty());
}
```

If we would like to replace some specific string with null values, we can use the `nullValues` argument of `@CsvSource`.

```java
@ParameterizedTest
@CsvSource(value = {"Jane, NULL"}, nullValues = "NULL")
void customNullArgument(String name, String address) {
    assertNull(address);
}
```

## How to customize display names?

By default, JUnit 5 parameterized tests' display names include the invocation index and String representation of all the parameters.
However, we can customize the display name via the name attribute of the `@ParameterizedTest` annotation.

Let's take a look at the roman numeral example again.

```java
@ParameterizedTest(name = "{index} => arabic={0}, roman={1}")
@CsvFileSource(resources = "/roman-numeral.csv")
void convertArabicToRomanNumeral(int arabic, String roman) {
    assertEquals(roman, new RomanNumeral(arabic).toString());
}
```

The name attribute holds placeholders for `{index}` that is the index of the current test invocation and `{0}`, `{1}`, … that is the actual parameter value.

Now when we run the test we get output similar to this:

```
 convertArabicToRomanNumeral(int, String)
├─ 1 => arabic=1, roman=I
├─ 2 => arabic=3, roman=III
└─ 3 => arabic=4, roman=IV
```

## Summary

JUnit 5 parameterized tests allow you to remove duplication from test code.
They make it possible to execute the same test several times using different inputs.

Here is a summary of the annotations for a single argument.

| Annotation            | Type / Value Accepted                                                                   |
| --------------------- | --------------------------------------------------------------------------------------- |
| `@ValueSource`        | `short`, `byte`, `int`, `long`, `float`, `double`, `char`, `boolean`, `String`, `Class` |
| `@EnumSource`         | `enum`                                                                                  |
| `@NullSource`         | `null` value                                                                            |
| `@EmptySource`        | *empty* value for `String`, `List`, `Set`, `Map`, or primitive arrays                   |
| `@NullAndEmptySource` | both `null` and *empty* values                                                          |

Second, here is a summary of the annotations for multiple arguments.

| Annotation            | Provision Style                                        |
| --------------------- | ------------------------------------------------------ |
| `@MethodSource`       | a method returning a stream of arguments               |
| `@CsvSource`          | a string of comma separated values                     |
| `@CsvFileSource`      | comma separated values in a file                       |
| `@ArgumentsSource`    | a class implementing the `ArgumentsProvider` interface |

JUnit 5 also allows us to write argument converters and aggregators for our custom types.

The example code for this guide can be found in [GitHub](https://github.com/arhohuttunen/junit5-examples/tree/master/junit5-parameterized-tests).
