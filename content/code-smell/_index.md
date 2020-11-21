---
summary: Learn how to detect code smells and how to refactor the code to be better.

title: Code Smells
url: /code-smell/
toc: false
type: book
---

This is a tutorial series for code smells.

A code smell is a noticeable indication that there might be something wrong with the code. Code smells should be quick and easy to spot. They do not always indicate a problem but they point you to a direction to look deeper.

Each of the code smells have some kind of symptoms, cause, suggested solutions and benefits. The solutions described here include refactoring which might be a topic for a completely different tutorial. However, simple examples of refactoring are provided here also.

Here are the articles in this series:

## Bloaters

Bloater smells represents something that has grown so large that it cannot be effectively handled.

- [Long method](/long-method)
- [Primitive obsession](/primitive-obsession)
- [Large class](/large-class)
- [Long parameter list](/long-parameter-list)

## Object-orientation abusers

The common denominator for the smells in the Object-Orientation Abuser category is that they represent cases where the solution does not fully exploit the possibilities of object-oriented design.

- [Switch statements](/switch-statements)

## Dispensables

The common thing for the Dispensable smells is that they all represent something unnecessary that should be removed from the source code.

- [Code comments](/code-comments)
- [Dead code](/dead-code)
