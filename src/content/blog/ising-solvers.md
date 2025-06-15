---
title: Unpacking Multi-Digit Ising Mapping for Ising Solvers
description: Explore how multi-digit Ising mappings enhance low-precision solver performance with a Python implementation and visual insights.
pubDate: 2025-06-15
image: /blogs-img/ising-solvers/ising-solvers.jpeg
tags: [mathematics, pythics]
---

# Unpacking Multi-Digit Ising Mapping for Ising Solvers

### Introduction
Imagine you’ve got a super cool gadget, an Ising solver, that’s supposed to crack tough problems like optimizing a wireless network or predicting stock prices. These gadgets, like quantum annealers or the COBI chip, are awesome because they map problems to a physical system that naturally finds low-energy solutions. But here’s the catch: real-world Ising solvers are often stuck with low precision, like trying to paint a masterpiece with only a few colors. The paper by Singh and Jamieson comes up with a clever trick to make these solvers act like they have more precision, without swapping out any hardware. Let’s dive into what they’re doing, why it matters, and how we can play with it in Python.

#### Credit
All the cleverness here comes from Abhishek Kumar Singh and Kyle Jamieson. Check out their paper on arXiv (2404.05631v1) for the full scoop. Link https://arxiv.org/pdf/2404.05631

### The Theory
#### What's an Ising Solver?
At its core, an Ising solver tackles optimization problems by modeling them as a bunch of spins (think tiny magnets) that can point up (+1) or down (-1). The goal is to find the spin setup that minimizes the “energy” of the system, described by:

$$
E = - \sum_{i \neq j} J_{ij} s_i s_j
$$
Here, $s_i$ and $s_j$ are spins, and $J_{i j}$ are numbers (couplings) that define how spins interact. This setup can represent crazy-hard problems like MAX-CUT or MIMO signal detection (figuring out what signals were sent in a wireless system). Solvers like quantum annealers or the COBI chip take these $J_{i j}$
 values and spit out a spin configuration that (hopefully) gives the lowest energy.

#### The Problem: Low Precision Sucks
Here’s the bummer: while software simulations can use super precise numbers (like 3.14159), real Ising solvers are stuck with coarse ones. For example, the COBI chip can only handle integer couplings between -14 and 14 (basically, 29 options). If your problem needs a coupling like 3.7, it gets rounded to 4, and that tiny error can mess up the solution big time. This is especially bad for something like MIMO detection, where you need to solve thousands of problems in milliseconds for, say, 5G networks. The paper says these rounding errors cause a big drop in performance, like worse bit error rates (BER) in MIMO.

#### The Fix: Multi-Digit Mapping
Singh and Jamieson’s trick is to represent those couplings in a way that squeezes more precision out of the same hardware. Instead of cramming a number into a single integer (like 4), they break it into multiple “digits” in a base-q system, kind of like how we use tens and ones in base-10. This lets them represent bigger, more precise numbers.

#### 2-Digit Mapping
Let’s say the solver can handle integers up to $C_{\max} = 7$ (so couplings sum to [-14, 14]). Normally, you’d map your coupling $J_{i j}$ (say, 0.8) to an integer like:

$$
K_{ij} = round(7 \cdot 0.8) = 6
$$

That’s rough! Instead, they use a 2-digit base-q system (e.g., q=5q = 5q = 5). The max number you can represent is:

$$
M_q = (q-1)(q+1) = 4 \cdot 6 = 24
$$

So, you can now use integers from -24 to 24. They break the coupling into two parts:

$$
K_{ij}^′ = q f_{ij} + g_{ij}
$$

For example, if $J_{i j} + J_{j i} = 1.6$, they scale it to $K_{i j}^′ = \text{round}(24 \cdot 1.6 / 2) = 19$. Then:

$$
19 = 5 \cdot 3 + 4 \quad (f_y = 3, g_y = 4)
$$

To make this work on the solver, they rewrite the term $19 s_i s_j$ as:

$$
19s_i s_j = 5 \cdot 3 s_i s_j + 4 s_i s_j
$$

But the solver can’t directly handle “5” (it’s too big). So, they create copies of the spins $s_i$ and $s_j$, like $s_{i,1}$, $s_{i,2}$, and set up couplings so that $5 s_i \approx s_{i,1} + s_{i,2} + \cdots$. They add penalty terms (like $-7 s_i s_{i,k}$) to force these copies to match the original spin. This way, the solver still uses small integers, but the effective coupling is much more precise.

#### 3-Digit Mapping
For even more precision, they use three digits:
$$
K_{ij}^′= q^2e_{ij} + qf_{ij} + g_{ij}
$$

With $q = 5$, the max is $M_q = 4 \cdot (25 + 5 + 1) = 124$. So, couplings can go from -124 to 124—way more precise! They create more spin copies and set up a bigger Hamiltonian with similar penalty terms to keep everything in sync. It’s like using more digits to represent a number like 123 instead of just 12.

#### Why It Matters
This trick lets low-precision hardware act like it’s high-precision. For MIMO detection, the paper shows that 2-digit (base-8) and 3-digit (base-8) mappings drastically cut down errors compared to the native approach. It’s like upgrading your calculator without buying a new one—just by being smarter about how you use it.

### Python Code: Let’s Play with It

#### Code Walkthrough: What’s Happening Here?

```python
# Simulated Annealing: Our fake Ising solver
def simulated_annealing(J, num_spins, num_steps=10000, T_start=10.0, T_end=0.01):
    spins = np.random.choice([-1, 1], num_spins)
    
    def calculate_energy(spins, J):
        energy = 0
        for i in range(len(spins)):
            for j in range(i + 1, len(spins)):
                energy -= J[i, j] * spins[i] * spins[j]
        return energy
    
    energy = calculate_energy(spins, J)
    energies = [energy]
    
    for step in range(num_steps):
        # Exponential cooling schedule
        T = T_start * (T_end / T_start) ** (step / num_steps)
        
        # Flip a random spin
        i = np.random.randint(num_spins)
        old_spin = spins[i]
        spins[i] *= -1
        
        # Calculate new energy
        new_energy = calculate_energy(spins, J)
        delta_E = new_energy - energy
        
        # Accept or reject the move
        if delta_E < 0 or np.random.rand() < np.exp(-delta_E / T):
            energy = new_energy
        else:
            spins[i] = old_spin  # Revert the flip
            
        energies.append(energy)
    
    return spins, energy, energies
```
**Simulated Annealing**: This is our stand-in for an Ising solver. It starts with random spins (+1 or -1) and flips them one by one, keeping changes that lower the energy or sometimes accepting worse ones to avoid getting stuck (based on a “temperature” that cools down over time). It’s like shaking a box of marbles until they settle into the lowest spot. We track the energy at each step to see how it converges.

```python
# Native Mapping: The basic, low-precision way
def native_mapping(J, C_max=7):
    K = np.zeros_like(J)
    for i in range(len(J)):
        for j in range(len(J)):
            if i != j:
                # Scale and round to nearest integer within [-C_max, C_max]
                scaled = J[i, j] * C_max
                K[i, j] = np.clip(np.round(scaled), -C_max, C_max)
    return K
```

**Native Mapping**: This is the basic approach. We take our problem’s couplings $J_{i j}$ (random numbers between -1 and 1) and squash them into integers between -7 and 7, mimicking the COBI chip’s limits. For example, if $J_{i j} + J_{j i} = 1.2$, we get $K_{i j} = \text{ceil}(7 \cdot 1.2 / 2) = 5$. This rounding loses precision, which can lead to a worse solution.

```python
# 2-Digit Mapping: More precision with spin copies
def two_digit_mapping(J, q=5, C_max=7):
    M_q = (q - 1) * (q + 1)  # Maximum representable value
    num_spins = len(J)
    new_spins = num_spins * (q + 1)
    K_prime = np.zeros((new_spins, new_spins))
    
    for i in range(num_spins):
        for j in range(num_spins):
            if i != j:
                # Quantize the coupling to the available precision
                J_ij = J[i, j]
                quantized = np.round(J_ij * M_q) / M_q
                
                # Decompose into integer and fractional parts
                integer_part = int(quantized * q)
                fractional_part = quantized - integer_part / q
                
                # Map to auxiliary spins
                # Original spin interactions
                K_prime[i * (q + 1), j * (q + 1)] = fractional_part
                
                # Auxiliary spin interactions for integer part
                if integer_part != 0:
                    for k in range(1, min(abs(integer_part) + 1, q + 1)):
                        K_prime[i * (q + 1) + k, j * (q + 1)] = np.sign(integer_part) / q
        
        # Add penalty terms to ensure auxiliary spins behave correctly
        penalty = -C_max / M_q
        for k in range(1, q + 1):
            K_prime[i * (q + 1), i * (q + 1) + k] = penalty
            for l in range(k + 1, q + 1):
                K_prime[i * (q + 1) + k, i * (q + 1) + l] = penalty
    
    return K_prime
```

**2-Digit Mapping**: Here’s where it gets cool. We use base-5 $(q=5)$ to represent couplings up to 24. For a coupling like 19, we break it into $19 = 5 \cdot 3 + 4$. We create extra spins (up to 5 copies per original spin) and set up couplings so the solver “sees” the equivalent of 19. Penalty terms (big negative couplings like -7) make sure the spin copies stay aligned. We try different ways to split the term (using $\alpha, \beta, \gamma$) to use the fewest extra spins possible.

```python
# 3-Digit Mapping: Even more precision
def three_digit_mapping(J, q=5, C_max=7):
    M_q = (q - 1) * (q**2 + q + 1)  # Maximum representable value
    num_spins = len(J)
    new_spins = num_spins * (q + 1)
    K_prime = np.zeros((new_spins, new_spins))
    
    for i in range(num_spins):
        for j in range(num_spins):
            if i != j:
                # Quantize the coupling
                J_ij = J[i, j]
                quantized = np.round(J_ij * M_q) / M_q
                
                # Three-digit decomposition: a*q^2 + b*q + c
                temp = quantized * M_q
                a = int(temp // (q**2))
                b = int((temp % (q**2)) // q)
                c = temp % q
                
                # Normalize back
                a_coeff = a / M_q
                b_coeff = b / M_q
                c_coeff = c / M_q
                
                # Map to interaction matrix
                K_prime[i * (q + 1), j * (q + 1)] = c_coeff
                
                # Higher order terms
                if a != 0:
                    for k in range(1, min(abs(a) + 1, q + 1)):
                        for l in range(1, min(abs(a) + 1, q + 1)):
                            K_prime[i * (q + 1) + k, j * (q + 1) + l] = np.sign(a) * a_coeff / (q**2)
                
                if b != 0:
                    for k in range(1, min(abs(b) + 1, q + 1)):
                        K_prime[i * (q + 1) + k, j * (q + 1)] = np.sign(b) * b_coeff / q
        
        # Add penalty terms
        penalty = -C_max / M_q
        for k in range(1, q + 1):
            K_prime[i * (q + 1), i * (q + 1) + k] = penalty
            for l in range(k + 1, q + 1):
                K_prime[i * (q + 1) + k, i * (q + 1) + l] = penalty
    
    return K_prime
```

**3-Digit Mapping**: This cranks it up a notch, allowing couplings up to 124 in base-5. We break a coupling into three parts (e.g., $100 = 5^2 \cdot 4 + 5 \cdot 0 + 0$) and use more spin copies. It’s more complex and needs more spins, but it’s super precise. The penalty terms are beefier to keep all the copies in line.

**Main Experiment**: We set up a tiny problem with 2 spins, run all three mappings, and use simulated annealing to find the best spin setup. We plot how the energy drops over time and print the final energies.

![Complex Number on graph 1](/blogs-img/ising-solvers/ising_mappings_plot.png)

**The Plot**: The graph shows how the energy decreases for each mapping. Lower energy means a better solution. You’ll likely see the 3-digit mapping hitting the lowest energy, followed by 2-digit, then native, because they can represent the original problem more accurately.

#### Wrapping It Up
Singh and Jamieson’s multi-digit mapping is like giving your old smartphone a software upgrade to make it run like a new one. By cleverly using extra spins, they make low-precision Ising solvers perform way better, which is huge for real-world problems like 5G signal detection. Playing with the code shows this in action—higher precision leads to lower energies, meaning better solutions. For your blog, you can toss in this code, the graph, and maybe a sketch of how spins and their copies interact (like a family of magnets working together).

#### Thanks to: 
Abhishek Kumar Singh and Kyle Jamieson for this awesome idea. Their paper (arXiv:2404.05631v1) is a must-read if you’re into optimization or hardware hacks.

### APENDIX
GILAB LINK: https://gitlab.com/sinhaparth5/ising-solvers.git