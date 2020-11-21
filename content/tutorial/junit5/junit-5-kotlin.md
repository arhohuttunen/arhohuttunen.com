---
title: JUnit 5 with Kotlin
url: /junit-5-kotlin/
type: docs
toc: true
date: 2019-04-14
author: Arho Huttunen
menu:
  junit5:
    name: JUnit 5 with Kotlin
    parent: Kotlin
    weight: 60
weight: 60
---

In this article, we will learn the differences between writing JUnit 5 tests in Kotlin and Java. We will also learn how to configure JUnit 5 in our build script using the Gradle Kotlin DSL.

This article is part of the [JUnit 5 Tutorial](/junit-5-tutorial).

## Configuration

We write traditional Gradle build scripts as `build.gradle` files using the Groovy DSL. Gradle's Kotlin DSL provides an alternative syntax to this with several improvements such as better content assist and refactoring. The build script written in Kotlin DSL is named `build.gradle.kts`.

To be able to write JUnit 5 tests in Kotlin we first need the `junit-jupiter` artifact as a dependency in `build.gradle.kts` file and need to tell to use JUnit platform in the tests:

```groovy
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.6.0")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

## Basic Functionality

Most of the JUnit 5 functionality works in Kotlin just like it would in Java. Everything works out of the box.

One notable difference is how we can customize the display names of methods that will be displayed in test reports or IDEs.

In Java, we could use the `@DisplayName` annotation to make the method name readable. However, in Kotlin we can use backtick identifiers for variables and methods:

```kotlin
@Test
fun `1 + 2 = 3`() {
    assertEquals(3, calculator.add(1, 2))
}
```

This makes both the code and the test results more readable. Normally this is not recommended but for this purpose it is quite handy.

## Lazy Evaluation

One thing that was added in JUnit 5 was lazy evaluation of error messages using lambdas. This avoids constructing expensive error messages unnecessarily.

In Kotlin, there is a convention that if the last parameter of a function accepts a function, a lambda expression that is passed as the corresponding argument can be placed outside the parentheses:

```kotlin
@Test
fun `1 + 2 = 3`() {
    assertEquals(3, calculator.add(1, 2)) {
        "1 + 2 should equal 3"
    }
}
```

Compared to Java, this makes the syntax even cleaner when writing assertions in Kotlin.

## Assertions

Any JUnit 5 assertions in Java work in Kotlin as well. However, there are a couple of Kotlin specific assertion methods that are more suitable for the language. These assertion methods are top-level functions in the `org.junit.jupiter.api` package.

Here is an example of asserting an exception is thrown. In Java, we would pass a lambda inside of the `assertThrows()` call. In Kotlin we can once again make this more readable by adding a block after the assertion call:

```kotlin
@Test
fun `Divide by zero should throw ArithmeticException`() {
    assertThrows<ArithmeticException> {
        calculator.divide(1, 0)
    }
}
```

This applies to grouped assertions as well. Grouped assertions make it possible to perform multiple assertions at a time and report failures together.

In Java, we would write lambdas inside the `assertAll()` call, but in Kotlin it is enough to use blocks:

```kotlin
@Test
fun `Square of a number should equal the number multiplied by itself`() {
    assertAll(
            { assertEquals(1, calculator.square(1)) },
            { assertEquals(4, calculator.square(2)) },
            { assertEquals(9, calculator.square(3)) }
    )
}
```

Compared to Java this is once again a little less verbose and more readable.

## Lifecycle Methods

The [JUnit 5 lifecycle methods](/junit-5-test-lifecycle/) all work in Kotlin as well.

However, by default, the methods annotated with `@BeforeAll` and `@AfterAll` need to be static. This is because JUnit 5 creates a new test instance per test method, and there is no other way to share state between all tests.

Luckily, it is possible to create a test instance per class instead in JUnit 5 by annotating the test class with `@TestInstance(Lifecycle.PER_CLASS)`. This removes the requirement for static methods:

```kotlin
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LifecycleTest {
    @BeforeAll
    fun beforeAll() {
        println("Before all")
    }

    @AfterAll
    fun afterAll() {
        println("After all")
    }

    @Test
    fun firstTest() {
        println("First test")
    }

    @Test
    fun secondTest() {
        println("Second test")
    }
}
``` 

Since this now shares instance state between tests, you might need to reset state in `@BeforeEach` or `@AfterEach`, if your test methods rely on state stored in instance variables. In general, try to avoid writing tests that rely on such state. 

## Parameterized Tests

There are several ways to write [JUnit 5 parameterized tests](/junit-5-parameterized-tests/). Most of these approaches work without any changes in Kotlin as well.

That being said, there is a difference when using the `@MethodSource` annotation. The annotation expects a static method inside the class as the source of the parameters.

To achieve the same in Kotlin, we have to create a companion object and annotate the method with `@JvmStatic`. This will make the method exist as a Java static method:

```kotlin
companion object {
    @JvmStatic
    fun squares() = listOf(
            Arguments.of(1, 1),
            Arguments.of(2, 4),
            Arguments.of(3, 9)
    )
}

@ParameterizedTest(name = "Square of {0} should equal {1}")
@MethodSource("squares")
fun `Square of a number`(input: Int, expected: Int) {
    assertEquals(expected, calculator.square(input))
}
```

This is ok but not as convenient as in Java. Another thing to note is that there can be only one companion object per class so all parameter providing methods need to be together.

## Dynamic Tests

JUnit 5 introduces a new programming model that allows us to generate _dynamic tests_ at runtime by a factory method annotated by the `@TestFactory` annotation.

Normally we would provide a list of `DynamicTest` instances. Using the calculator from previous examples:

```kotlin
@TestFactory
fun `Square of a number`() = listOf(
        DynamicTest.dynamicTest("Square of 1 should equal 1") {
            assertEquals(1, calculator.square(1))
        },
        DynamicTest.dynamicTest("Square of 2 should equal 4") {
            assertEquals(4, calculator.square(2))
        },
        DynamicTest.dynamicTest("Square of 3 should equal 9") {
            assertEquals(9, calculator.square(3))
        }
)
```

Each of the dynamic tests would appear as their own tests. However, this is not very clean and has some duplication.

Yet again there is a way to make this more readable. We can use some functional mapping to remove the duplication:

```kotlin
@TestFactory
fun `Square of a number`() = listOf(
        1 to 1,
        2 to 4,
        3 to 9
).map { (input, expected) ->
    DynamicTest.dynamicTest("Square of $input should equal $expected") {
        assertEquals(expected, calculator.square(input))
    }
}
```

This is pretty close to what we did with parameterized tests but with a slightly different syntax.

## Repeatable Annotations

Currently, Kotlin does not support repeatable annotations. This means that using multiple extensions or tags for a test is slightly more complex than in Java.

For example, in Java we can just repeat the `@Tag` annotation to give multiple tags to a test:

```java
@Tag("first")
@Tag("second")
class RepeatableAnnotationTest {}
```

In Kotlin, however, we cannot have multiple `@Tag` annotations. Instead, we have to use a `@Tags` annotation to wrap the repeated tags:

```kotlin
@Tags(
        Tag("first"),
        Tag("second")
)
class RepeatableAnnotationTest
```

The same happens with multiple extensions, so we cannot use multiple `@ExtendWith` annotations directly. Instead, we need to wrap the extensions with an `@Extensions` annotation:

```kotlin
@Extensions(
        ExtendWith(FirstExtension::class),
        ExtendWith(SecondExtension::class)
)
class RepeatableAnnotationTest
```


## Summary

Most of the JUnit 5 features work perfectly well in Kotlin although there are some cases where the syntax is somewhat different than in Java. However, due to the way Kotlin language works we can often make the code more readable.

The example code for this guide can be found on [GitHub](https://github.com/arhohuttunen/junit5-examples/tree/master/junit5-gradle-kotlin).
