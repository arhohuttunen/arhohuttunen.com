---
title: "JUnit 5 Parameterized Tests: Using Different Input"
url: /junit-5-parameterized-tests/
type: docs
toc: true
date: 2019-05-25
author: Arho Huttunen
menu:
  junit5:
    name: Parameterized Tests
    parent: Getting Started
    weight: 30
weight: 30
---

In this article, we will learn how to remove duplication from test code by writing JUnit 5 parameterized tests. We will see how parameterized tests work and look at ways of providing different parameters to test methods.

This article is part of the [JUnit 5 Tutorial](/junit-5-tutorial).

## When and why?

While testing, it is common to run a series of tests which **differ only by input values and expected results**. We could write separate tests for separate cases but that would result in a lot of code duplication.

We can **execute the same test several times using different input** using a parameterized test. To do that, we add some parameters to a test method and run it with different variations of parameter values.

Usually we first make sure the code handles the happy path. We can use parameterized tests to **ensure the edge cases also work**. Parameterization helps making sure that empty, null, zero, and other kinds of boundary conditions work as well.

It is worth mentioning that we shouldn’t necessarily start with parameterized tests in mind when writing tests. Instead, we can think of parameterization as a way to refactor test code to remove duplication.

Now, we know the basic idea behind parameterized tests, so let’s take a look at what we need to get started with JUnit 5 parameterized tests.

## Dependencies

**Update 18th of June 2018**: Beginning from Maven Surefire 2.22.0 there is now native support for JUnit Jupiter. This means that the configuration is now easier.

**Update 1st of March 2019**: Beginning from JUnit Jupiter 5.4.0 there is is now an aggregator artifact `junit-jupiter` that transitively pulls in dependencies on `junit-jupiter-api`, `junit-jupiter-params`, and `junit-jupiter-engine` for simplified dependency management. This means that additional dependencies are note required to be able to write parameterized tests.

## First parameterized test

To run JUnit 5 parameterized tests we have to annotate our test with the `@ParameterizedTest` annotation instead of the `@Test` annotation. To variate data, we also add some parameters to a test method. Furthermore, we provide different values of parameters to the test method.

This examples uses `@ValueSource`. For now, it’s enough to know that it will provide different values for the test.

```java
@ParameterizedTest
@ValueSource(strings = { "racecar", "radar", "able was I ere I saw elba" })
void palindromeReadsSameBackward(String string) {
    assertEquals(palindrome, isPalindrome(string));
}
```

When we run the test we can see from the output that the test method executed three times with different values of string:

```
palindromeReadsSameBackward(String)
├─ [1] racecar
├─ [2] radar
└─ [3] able was I ere I saw elba
```

Next, let’s take a loot at different parameter sources JUnit 5 provides.

## Argument sources

JUnit 5 provides several source annotations that provide parameters to test methods. Let’s take a look at how those can be used.

### Single parameter

`@ValueSource` can only be used to provide a single parameter per test method. It lets you specify an array of literals of primitive types (either `String`, `int`, `long`, or `double`).

For example, to provide `int`s to our parameterized test we can do:

```java
@ParameterizedTest
@ValueSource(ints = { 3, 6, 15})
void divisibleByThree(int number) {
    assertEquals(0, number % 3);
}
```

Another source of single parameter is the @EnumSource annotation. The annotation takes an enum type as an argument and provides the test with the enum constants. For example:

```java
enum Protocol {
    HTTP_1_0, HTTP_1_1, HTTP_2
}

@ParameterizedTest
@EnumSource(Protocol.class)
void postRequestWithDifferentProtocols(Protocol protocol) {
    webServer.postRequest(protocol);
}
```

The `@ValueSource` and `@EnumSource` annotations work when our test method only takes one parameter. However, we often need more than that. Let’s take a look at the other parameter sources to find out how to provide multiple parameters.

### Parameters from factory methods

`@MethodSource` allows us to refer to one or more factory methods of the test class. Such methods must return a `Stream`, `Iterable`, `Iterator`, or an array of parameters.

Let’s assume that we have a class `RomanNumeral` that is used to convert arabic to roman numerals. We need to pass multiple parameters in our parameterized test, so we can use a `Stream` of `Arguments`:

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

If we only need a single parameter for the test method, we can also return a `Stream` that contains primitive types.

Providing multiple parameters via a factory method is nice, but can be a bit laborious. Let’s take a look at a more compact way of providing simple parameters.

### Parameters in CSV format

The `@CsvSource` annotation allows us to use a list of comma separated string values. This makes it possible to provide multiple parameters to the test method with a single annotation in quite a compact way:

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

This looks quite clean but sometimes we need a lot of test data. If we write a lot of test data in the test code, the test easily becomes unreadable. Next, we will see how to externalize that data in a CSV file.

### Parameters from CSV file

If we have to write a lot of test data in the test code it can make test less readable. One solution to this is to provide the data in an external CSV file.

Using the previous roman numeral example, we start by creating a comma separated list of parameters in `roman-numeral.csv` file that we will put in `src/test/resources`. Each line from the file works as a list of parameters:

```
1, I
3, III
4, IV
```

Next, we use the `@CsvFileSource` annotation to provide the test method with the data:

```java
@ParameterizedTest
@CsvFileSource(resources = "/roman-numeral.csv")
void convertArabicToRomanNumeral(int arabic, String roman) {
    assertEquals(roman, new RomanNumeral(arabic).toString());
}
```

To better support use cases like this, JUnit 5 does automatic argument conversion from strings to certain target types. For cases where we want conversion to custom types, we have to write the argument conversion ourselves. Next, let’s find out how argument conversion works.

## Argument conversion

To better support use cases like `@CsvSource`, JUnit 5 does automatic argument conversion for primitive types, enums as well as date and time types from the java.time package. The conversion depends on the type of each method parameter.

This means, for example, that it automatically converts the following date strings to `LocalDate` instances:

```java
@ParameterizedTest
@ValueSource(strings = { "2018-01-01", "2018-01-31" })
void convertStringToLocalDate(LocalDate localDate) {
    assertEquals(Month.JANUARY, localDate.getMonth());
}
```

If we need to write a custom argument converter, we need to implement the `ArgumentConverter` interface. We can then annotate any parameters needing custom conversion with the `@ConvertWith` annotation.

For examples sake, let’s write an argument converter that converts hex values into decimal values. First we need to create a class that implements the `ArgumentConverter` interface and throws an `ArgumentConversionException` if the conversion fails:

```java
class HexConverter implements ArgumentConverter {

    @Override
    public Object convert(Object source, ParameterContext context)
            throws ArgumentConversionException {
        try {
            return Integer.parseInt((String) source, 16);
        } catch (NumberFormatException e) {
            throw new ArgumentConversionException("Cannot convert hex value", e);
        }
    }
}
```

Next, in our test we need to annotate the parameter that needs custom conversion with `@ConvertWith`:

```java
@ParameterizedTest
@CsvSource({
        "15, F",
        "16, 10",
        "233, E9"
})
void convertWithCustomHexConverter(int expected,
        @ConvertWith(HexConverter.class) int actual) {
    assertEquals(expected, actual);
}
```

To make the test itself a little less technical and more readable, we can further create a meta annotation that wraps the conversion:

```java
@Target({ ElementType.ANNOTATION_TYPE, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@ConvertWith(HexConverter.class)
public @interface HexValue {
}
```

Now we can use our new composed annotation to make the test more readable:

```java
@ParameterizedTest
@CsvSource({
        "15, F",
        "16, 10",
        "233, E9"
})
void convertWithCustomHexConverter(int expected, @HexValue int actual) {
    assertEquals(expected, actual);
}
```

## Customizing display names

By default, the display names of JUnit 5 parameterized tests include the invocation index and String representation of all the parameters. However, we can customize the display name via the name attribute of the `@ParameterizedTest` annotation.

Taking the roman numeral example again:

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

Parameterized tests allow us to remove duplication from test code. They make it possible to execute the same test several times using different input.

JUnit 5 parameterized tests can be provided with arguments from:

- `@ValueSource` or `@EnumSource` for single parameters
- Factory methods via `@MethodSource`
- In CSV format either inline with `@CsvSource` or in a file via `@CsvFileSource`

We can also write argument converters for our custom types. Furthermore, it’s possible to customize the display names of parameterized tests.

The example code for this guide can be found on [GitHub](https://github.com/arhohuttunen/junit5-examples/tree/master/junit5-parameterized-tests).
