---
title: "Migrating from JUnit 4 to JUnit 5: A Definitive Guide"
url: /junit-5-migration/
type: docs
toc: true
date: 2017-11-20
author: Arho Huttunen
summary: Learn how to migrate from JUnit 4 to JUnit 5. See how to run existing tests along with the new version, and what changes are needed to migrate the code.
menu:
  junit5:
    name: Migrating From JUnit 4
    parent: Migration
    weight: 70
weight: 70
---

In this article, we will take a look at the steps required for migrating from JUnit 4 to JUnit 5. We will see how to run existing tests along with the new version, and what changes we have to do to migrate the code.

This article is part of the [JUnit 5 Tutorial](/junit-5-tutorial).

## Overview

JUnit 5 has a modular design unlike the previous versions. The key point of the new architecture is to separate concerns between writing tests, extensions and tools.

JUnit has been split into three different sub-projects:

- The basis, **JUnit Platform** provides build plugins, and an API for writing test engines
- **JUnit Jupiter** is the new API for writing tests and extensions in JUnit 5
- Finally, **JUnit Vintage** allows us to run JUnit 4 tests with JUnit 5

One of the biggest flaws of JUnit 4 is that it does not support multiple runners (so you cannot use e.g. `SpringJUnit4ClassRunner` and `Parameterized` at the same time). In JUnit 5 this is finally possible by registering multiple extensions.

Furthermore, JUnit 5 utilizes Java 8 features like lambdas for lazy evaluation. JUnit 4 never advanced beyond Java 7 missing out on Java 8 features.

Also, JUnit 4 has shortcomings in parameterized tests and lacks nested tests. This has inspired third-party developers to create specialized runners for these situations. JUnit 5 adds better support for parameterized tests and native support for nested tests along with some other new features.

## Running Tests

Let's see what we need to do to run existing test on the new platform. In order to run both JUnit 4 and JUnit 5 tests we need:

- JUnit Jupiter to write and run JUnit 5 tests
- Vintage test engine to run JUnit 4 tests

In addition to this, to run the tests with Maven we also need the Surefire plugin. We have to add all the dependencies to `pom.xml`:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>2.22.2</version>
</plugin>

<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.6.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.vintage</groupId>
        <artifactId>junit-vintage-engine</artifactId>
        <version>5.6.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

Likewise, to run the tests with Gradle we also need to enable JUnit Platform in tests. Again, we have to add all the dependencies to `build.gradle`:

```groovy
test {
    useJUnitPlatform {
}

dependencies {
    testCompile('org.junit.jupiter:junit-jupiter:5.6.0')
    testRuntime('org.junit.vintage:junit-vintage-engine:5.6.0')
}
```

## Annotations

Annotations reside in the `org.junit.jupiter.api` package instead of `org.junit` package.

Some annotations are also different:

| JUnit 4        | JUnit 5       |
|----------------|---------------|
| `@Before`      | `@BeforeEach` |
| `@After`       | `@AfterEach`  |
| `@BeforeClass` | `@BeforeAll`  |
| `@AfterClass`  | `@AfterAll`   |
| `@Ignore`      | `@Disable`    |

In most cases, we can just find and replace the package and class names.

## Exceptions

We can not use `expected` attribute with the `@Test` annotation anymore.

The `expected` attribute in JUnit 4 can be replaced with the `assertThrows()` method in Junit 5:

```java
public class JUnit4ExceptionTest {
    @Test(expected = IllegalArgumentException.class)
    public void shouldThrowAnException() {
        throw new IllegalArgumentException();
    }
}
```

```java
class JUnit5ExceptionTest {
    @Test
    void shouldThrowAnException() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            throw new IllegalArgumentException();
        });
    }
}
```

## Timeouts

We cannot use `timeout` attribute with the `@Test` annotation anymore.

The `timeout` attribute in JUnit can be replaced with the `assertTimeout()` method in JUnit 5:

```java
public class JUnit4TimeoutTest {
    @Test(timeout = 1)
    public void shouldTimeout() throws InterruptedException {
        Thread.sleep(5);
    }
}
```

```java
class JUnit5TimeoutTest {
    @Test
    void shouldTimeout() {
        Assertions.assertTimeout(Duration.ofMillis(1), () -> Thread.sleep(5));
    }
}
```

We can also see that neither test classes nor test methods need to be public in JUnit 5. We might actually get an IDE warning that they can be made package-private.

## Assertions

Methods for asserting reside in the `org.junit.jupiter.api.Assertions` class instead of `org.junit.Assert` class.

In most cases, we can just find and replace the package names.

However, if we have provided the assertion with a custom message we will get compiler errors. The optional assertion message is now the last parameter. This order of parameters feels more natural:

```java
class JUnit4AssertionTest {
    @Test
    public void shouldFailWithMessage() {
        Assert.assertEquals("numbers " + 1 + " and " + 2 + " are not equal", 1, 2);
    }
}
```

```java
class JUnit5AssertionTest {
    @Test
    void shouldFailWithMessage() {
        Assertions.assertEquals(1, 2, () -> "numbers " + 1 + " and " + 2 + " are not equal");
    }
}
```

It is also possible to lazily evaluate assertion messages like in the example. This avoids constructing complex messages unnecessarily.

There is also another issue when asserting `String` objects with a custom assertion message. The order of the parameters is different, but we won't get a compiler error because all the parameters are `String` type. We can easily spot these cases because the tests will fail when we run them.

Furthermore, we might also have legacy tests that use Hamcrest assertions provided via JUnit 4 `Assert.assertThat()` method. JUnit 5 does not provide `Assertions.assertThat()` method like JUnit 4 does. Instead, we have to import the method from Hamcrest `MatcherAssert`:

```java
public class JUnit4HamcrestTest {
    @Test
    public void numbersNotEqual() {
        Assert.assertThat("numbers 1 and 2 are not equal", 1, is(not(equalTo(2))));
    }
}
```

```java
class JUnit5HamcrestTest {
    @Test
    void numbersNotEqual() {
        MatcherAssert.assertThat("numbers 1 and 2 are not equal", 1, is(not(equalTo(2))));
    }
}
```

## Assumptions

Assumption methods reside in `org.junit.jupiter.Assumptions` class instead of `org.junit.Assume` class.

These methods have similar changes to assertions. The assumption message is now the last parameter:

```java
@Test
public class JUnit4AssumptionTest {
    public void shouldOnlyRunInDevelopmentEnvironment() {
        Assume.assumeTrue("Aborting: not on developer workstation",
                "DEV".equals(System.getenv("ENV")));
    }
}
```

```java
class JUnit5AssumptionTest {
    @Test
    void shouldOnlyRunInDevelopmentEnvironment() {
        Assumptions.assumeTrue("DEV".equals(System.getenv("ENV")),
                () -> "Aborting: not on developer workstation");
    }
}
```

## Categories

The `@Category` annotation from JUnit 4 has been replaced with a `@Tag` annotation in JUnit 5. Also, we no longer use marker interfaces but instead pass the annotation a string parameter.

In JUnit 4 we use categories whereas in JUnit 5 we use tags:

```java
public interface IntegrationTest {}

@Category(IntegrationTest.class)
public class JUnit4CategoryTest {}
```

```java
@Tag("integration")
class JUnit5TagTest {}
```

We can configure filtering of tests by tags in Maven `pom.xml`:

```xml
<plugin>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>2.22.2</version>
    <configuration>
        <groups>acceptance</groups>
        <excludedGroups>integration</excludedGroups>
    </configuration>
</plugin>
```

Correspondingly, we can configure filtering in Gradle `build.gradle`:

```groovy
test {
    useJUnitPlatform {
        includeTags 'acceptance'
        excludeTags 'integration'
    }
}
```

## Runners

The `@RunWith` annotation from JUnit 4 does not exist in JUnit 5. We can implement the same functionality by using the new extension model in the `org.junit.jupiter.api.extension` package and the `@ExtendWith` annotation.

### Spring Runner

One of the popular runners used together with JUnit 4 is the Spring test runner. Using JUnit 5 we have to replace the runner with a Spring extension.

If we are using Spring 5 the extension comes bundled with Spring Test:

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringTestConfiguration.class)
public class JUnit4SpringTest {

}
```

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = SpringTestConfiguration.class)
class JUnit5SpringTest {

}
```

However, if we are using Spring 4 it does not come bundled with `SpringExtension`. We can still use it but it requires an extra dependency from the JitPack repository.

To use `SpringExtension` with Spring 4 we have to add the dependency in Maven `pom.xml`:

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.github.sbrannen</groupId>
        <artifactId>spring-test-junit5</artifactId>
        <version>1.5.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

Same way, we have to add the dependency in `build.gradle` when using Gradle:

```groovy
repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    testCompile('com.github.sbrannen:spring-test-junit5:1.5.0')
}
```

### Mockito Runner

Another popular runner used in JUnit 4 is the Mockito runner. When using JUnit 5 we need to replace this runner with the Mockito JUnit 5 extension.

In order to use the Mockito extension we have to add the `mockito-junit-jupiter` dependency in Maven `pom.xml`:

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>2.28.2</version>
    <scope>test</scope>
</dependency>
```

Respectively, when using Gradle we have to add the dependency in `build.gradle`:

```groovy
testCompile('org.mockito:mockito-junit-jupiter:2.28.2')
```

Now we can simply replace the `MockitoJUnitRunner` with the `MockitoExtension`:

```java
@RunWith(MockitoJUnitRunner.class)
public class JUnit4MockitoTest {

    @InjectMocks
    private Example example;

    @Mock
    private Dependency dependency;

    @Test
    public void shouldInjectMocks() {
        example.doSomething();
        verify(dependency).doSomethingElse();
    }
}
```

```java
@ExtendWith(MockitoExtension.class)
class JUnit5MockitoTest {

    @InjectMocks
    private Example example;

    @Mock
    private Dependency dependency;

    @Test
    void shouldInjectMocks() {
        example.doSomething();
        verify(dependency).doSomethingElse();
    }
}
```

## Rules

The `@Rule` and `@ClassRule` annotations from JUnit 4 do not exist in JUnit 5. We can implement the same functionality by using the new extension model in the `org.junit.jupiter.api.extension` package and the `@ExtendWith` annotation.

However, to provide a gradual migration path there is support for a subset of JUnit 4 rules and their subclasses in `junit-jupiter-migrationsupport` module:

* `ExternalResource` (including e.g. `TemporaryFolder`)
* `Verifier` (including e.g`. ErrorCollector`)
* `ExpectedException`

Existing code using these rules can be left unchanged by using the class level annotation `@EnableRuleMigrationSupport` in the `org.junit.jupiter.migrationsupport.rules` package.

To enable the support in Maven we have to add the dependency in `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-migrationsupport</artifactId>
        <version>5.6.0</version>
    </dependency>
</dependencies>
```

To enable the support in Gradle we have to add the dependency in `build.gradle`:

```groovy
dependencies {
    testCompile('org.junit.jupiter:junit-jupiter-migrationsupport:5.6.0')
}
```

### Custom Rules

Migrating custom JUnit 4 rules requires re-writing the code as a JUnit 5 extension.

The rule logic applied as a `@Rule` can be reproduced by implementing the `BeforeEachCallback` and `AfterEachCallback` interfaces.

For example, if we have a JUnit 4 rule that does performance logging:

```java
public class JUnit4PerformanceLoggerTest {

    @Rule
    public PerformanceLoggerRule logger = new PerformanceLoggerRule();
}
```

```java
public class PerformanceLoggerRule implements TestRule {

    @Override
    public Statement apply(Statement base, Description description) {
        return new Statement() {
            @Override
            public void evaluate() throws Throwable {
                // Store launch time
                base.evaluate();
                // Store elapsed time
            }
        };
    }
}
```

In turn, we can write the same rule as a JUnit 5 extension:

```java
@ExtendWith(PerformanceLoggerExtension.class)
public class JUnit5PerformanceLoggerTest {

}
```

```java
public class PerformanceLoggerExtension
        implements BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) throws Exception {
        // Store launch time
    }

    @Override
    public void afterEach(ExtensionContext context) throws Exception {
        // Store elapsed time
    }
}
```

### Custom Class Rules

Respectively, we can reproduce rule logic applied as a `@ClassRule` by implementing the `BeforeAllCallback` and `AfterAllCallback` interfaces.

In some cases we might have written a class rule in JUnit 4 as an inner anonymous class. In the following example, we have a server resource that we want to easily setup for different tests:

```java
public class JUnit4ServerBaseTest {
    static Server server = new Server(9000);

    @ClassRule
    public static ExternalResource resource = new ExternalResource() {
        @Override
        protected void before() throws Throwable {
            server.start();
        }

        @Override
        protected void after() {
            server.stop();
        }
    };
}

public class JUnit4ServerInheritedTest extends JUnit4ServerBaseTest {
    @Test
    public void serverIsRunning() {
        Assert.assertTrue(server.isRunning());
    }
}
```

We can write the rule as an JUnit 5 extension. Unfortunately, if we use the extension with the `@ExtendWith` annotation, we no way to access the resource provided by the extension. However, we can use the `@RegisterExtension` annotation instead:

```java
public class ServerExtension implements BeforeAllCallback, AfterAllCallback {
    private Server server = new Server(9000);

    public Server getServer() {
        return server;
    }

    @Override
    public void beforeAll(ExtensionContext context) throws Exception {
        server.start();
    }

    @Override
    public void afterAll(ExtensionContext context) throws Exception {
        server.stop();
    }
}

class JUnit5ServerTest {
    @RegisterExtension
    static ServerExtension extension = new ServerExtension();

    @Test
    void serverIsRunning() {
        Assertions.assertTrue(extension.getServer().isRunning());
    }
}
```

## Parameterized Tests

In JUnit 4 writing parameterized tests required using a `Parameterized` runner. In addition, we needed to provide parameterized data via a method annotated with the `@Parameterized.Parameters` annotation: 

```java
@RunWith(Parameterized.class)
public class JUnit4ParameterizedTest {
    @Parameterized.Parameters
    public static Collection<Object[]> data() {
        return Arrays.asList(new Object[][] {
                { 1, 1 }, { 2, 1 }, { 3, 2 }, { 4, 3 }, { 5, 5 }, { 6, 8 }
        });
    }

    private int input;
    private int expected;

    public JUnit4ParameterizedTest(int input, int expected) {
        this.input = input;
        this.expected = expected;
    }

    @Test
    public void fibonacciSequence() {
        assertEquals(expected, Fibonacci.compute(input));
    }
}
```

Writing JUnit 4 parameterized tests had a lot of shortcomings and there were community runners like [JUnitParams](https://github.com/Pragmatists/JUnitParams) that described themselves as *parameterized tests that don't suck*.

Unfortunately, there is no direct replacement to the JUnit 4 parameterized runner. Instead, in JUnit 5 there is a `@ParameterizedTest` annotation. Data can be provided with various data source annotations. Out of these the closest one to JUnit 4 is the `@MethodSource` annotation: 

```java
class JUnit5ParameterizedTest {
    private static Stream<Arguments> data() {
        return Stream.of(
                Arguments.of(1, 1),
                Arguments.of(2, 1),
                Arguments.of(3, 2),
                Arguments.of(4, 3),
                Arguments.of(5, 5),
                Arguments.of(6, 8)
        );
    }

    @ParameterizedTest
    @MethodSource("data")
    void fibonacciSequence(int input, int expected) {
        assertEquals(expected, Fibonacci.compute(input));
    }
}
```

{{% callout note %}}
In JUnit 5, the closest thing to JUnit 4 parameterized tests is using `@ParameterizedTest` with a `@MethodSource` data source. However, there are several improvements to parameterized tests in JUnit 5.
  
**Additional reading:**

[JUnit 5 Parameterized Tests: Using Different Input](/junit-5-parameterized-tests/)
{{% /callout %}}

## Summary

Migrating from JUnit 4 to JUnit 5 requires some work depending on how the existing tests have been written.

- We can run JUnit 4 tests along with the JUnit 5 tests to allow for gradual migration.
- In a lot of cases, we only have to find and replace package and class names.
- We might have to convert custom runners and rules to extensions.
- To convert parameterized tests, we might have to do some rework.

The example code for this guide can be found on [GitHub](https://github.com/arhohuttunen/junit5-examples/tree/master/junit5-migration).
