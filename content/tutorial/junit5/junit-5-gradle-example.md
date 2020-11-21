---
title: "JUnit 5 Gradle Example: Running Tests with Gradle"
url: /junit-5-gradle-example/
type: docs
toc: true
date: 2018-01-01
author: Arho Huttunen
menu:
  junit5:
    name: Gradle Example
    parent: Build Tools
    weight: 50
weight: 50
---

In this JUnit 5 Gradle example, we will learn how to get the required dependencies for writing JUnit 5 tests with Gradle. Also, we will learn how to configure the JUnit Gradle plugin to run the tests.

This article is part of the [JUnit 5 Tutorial](/junit-5-tutorial).

## Required dependencies

**Update 18th of June 2018**: Beginning from Gradle 4.6 there is now native support for JUnit Jupiter. This means that the configuration is now easier.

**Update 1st of March 2019**: Beginning from JUnit Jupiter 5.4.0 there is now an aggregator artifact `junit-jupiter` that transitively pulls in dependencies on `junit-jupiter-api`, `junit-jupiter-params`, and `junit-jupiter-engine` for simplified dependency management. This means that we don't need additional dependencies to be able to write parameterized tests.

First, to be able to write JUnit 5 tests we need the `junit-jupiter` artifact as a dependency in `build.gradle`:

```groovy
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.6.0")
}
```

Now all we need is to tell to use the JUnit platform in the tests:

```groovy
test {
    useJUnitPlatform()
}
```

Now we have the most basic setup for writing and running JUnit 5 tests with Gradle.

### Configuration prior to Gradle 4.6 and JUnit Jupiter 5.4.0

To be able to write JUnit 5 tests we need the `junit-jupiter-api` artifact as a dependency:

```groovy
dependencies {
    testCompile("org.junit.jupiter:junit-jupiter-api:5.3.2")
}
```

In addition, when using Gradle 4.5 or older, to be able to run JUnit 5 tests we have to configure the JUnit Gradle plugin:

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'org.junit.platform:junit-platform-gradle-plugin:1.3.2'
    }
}

apply plugin: 'org.junit.platform.gradle.plugin'
```

We also need the JUnit Jupiter test engine in the test runtime classpath like shown before.

Now we have the setup for writing and running JUnit 5 tests with older versions of Gradle.

## Running tests

The JUnit Gradle plugin discovers tests under `src/test/java` directory by default.

Let’s check if our configuration works by adding a very simple test that does nothing:

```java
class GradleExampleTest {

    @Test
    void shouldRun() {

    }
}
```

Now we can run our tests on the command line with:

```
$ gradle test
```

We should see output similar to this:

```
:test
BUILD SUCCESSFUL in 2s
```

There we go! JUnit Gradle plugin is now running our tests.

## Summary

In this JUnit 5 Gradle example we have learned how to add the required dependency for writing JUnit 5 tests and how to configure JUnit Gradle plugin to be able to run the tests.

The example code for this guide can be found on [GitHub](https://github.com/arhohuttunen/junit5-examples/tree/master/junit5-gradle).
