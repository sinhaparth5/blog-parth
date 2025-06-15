---
title: Quantum Computing
description: Quantum computing is based on the rules of quantum mechanics, harnessing effects that exist at the level of atoms, electrons and photons.
pubDate: 2025-06-15
image: /blogs-img/quantum/quantum-img.jpeg
tags: ["quantum", "computing", "quantum computing", "maths", "linear algebra", "algebra", "numbers"]
---

# Quantum Computing

## Lesson 1: Introduction to Imaginary and Complex Numbers

Let's say we have equation $x^2 = 4$ and so the answer will be $x = \pm 2$, but now if we take $x^2 = -4$, since the square of the number is always greater than 0. How can $x^2$ ever be negative if a number squared is always positive?

This is where imaginary number comes in, if we let $i = \sqrt{-1}$ so we can write now $x = \pm \sqrt{-4}$ and the answer will be $x = \pm 2i$, this is an imaginary number, any number that contains a factors of square root of $-1$ or $i$.

### Complex Numbers

Complex numbers are numbers which contains real number and imaginary number, for example:

$$
\text{Standard Form: } a + ib \text{, where } a, b \in \mathbf{R}
$$

where $a$ being the real part of the equation and $ib$ being the imaginary part of the number. Examples of complex numbers: $2 + 3i$, $-1-i$, $\sqrt{2}+i\sqrt{3}$.

Addition and subtraction of complex number is quite easy, as real number can be added or subtracted and similarly imaginary number should be added or subtracted. For example:

$$
(2+3i) + (4-8i) = 6-5i
$$

$$
(1-9i)+(-3-8i) = -2 -17i
$$

Multiplication of complex number is also similar as addition and subtraction, but we need to remember that $i^2 = -1$. For example:

$$
(2+3i)(4-8i) = 8 - 16i + 12i - 24i^2
$$

$$
= 8 - 4i - 24(-1) = 8 - 4i + 24 = 32 - 4i
$$

### Complex Conjugate

A complex conjugate of a complex number is another complex number that has the same real part as the original complex number and the imaginary part has the same magnitude but opposite sign. The product of a complex number and its complex conjugate is a real number. For example:

$$
\text{complex conjugate of } (a+ib) = (a+ib)^* = a - ib
$$

Examples: $(-2+3i)^* = -2 -3i$ and $(3-i)^* = 3+i$

One property of complex numbers, if we multiply any complex number by its complex conjugate, the result is always a real number, for example:

$$
(a+ib)(a-ib) = a^2-iab+iab-i^2b^2
$$

$$
= a^2-i^2b^2 = a^2-(-1)b^2 = a^2+b^2
$$

## Lesson 2: Complex Numbers on the Number Plane

Think of a complex number as a vector, real axis on the horizontal and imaginary axis on the vertical. When we represent a complex number on the number plane, we also uncover another property its magnitude which is its distance from the origin, this is denoted with vertical bars, it's calculated using Pythagoras theorem.

![Complex Number on graph 1](/blogs-img/quantum/math-equation1.png)

Calculate $|4-3i| = 5$

$$
|4-3i| = \sqrt{4^2 + (-3)^2} = \sqrt{16 + 9} = \sqrt{25} = 5
$$

We can also represent complex numbers as the magnitude and angle that is created on the positive side of the $x$ axis, using trigonometry we can also represent complex numbers:

![Complex Number on graph 2](/blogs-img/quantum/math-equation2.png)

$$
a + ib = r(\cos \theta + i \sin \theta)
$$

Where $r$ is the magnitude of the complex number and $\theta$ is the angle made on the positive $x$ axis. We can find $\theta$ using the tangent function:

$$
\tan \theta = \frac{b}{a}
$$

$$
\theta = \arctan\left(\frac{b}{a}\right)
$$

There is also another form using Euler's formula:

$$
z = re^{i\theta}
$$
