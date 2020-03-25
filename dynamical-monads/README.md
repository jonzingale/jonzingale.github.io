## Module for exploring monadic properties with Discrete Dynamical Systems

A Product type (M = 𝝥.𝜟) monadic dynamical system consists of:
* M takes a dynamical system and returns its cartesian square<br>
* η includes a dynamical system as the diagonal in M<br>
* 𝜇 folds a square of squares (M.M) onto its factor M

### Setup:
1. run local server: `python -m SimpleHTTPServer 8000`
2. navigate to http://localhost:8000/dyanamical.html

### Haskell:
To create new csvs for monadic dynamical systems:
1. `cd hs`
2. `ghci Main.hs`
3. `main`

#### Todo:
- prevent name spacing crashes in DynamicalExamples
