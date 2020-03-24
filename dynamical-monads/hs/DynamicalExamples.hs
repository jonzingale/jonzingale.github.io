module DynamicalExamples where
import Dynamical
import Product
import Data.List
{--
TODO:
* avoid name space crashes
--}

g1, g2, g3, g4, e1 :: Graph String
g1 = [ E "0" "0", E "1" "0" ] ^ 2
g2 = [ E "a" "b", E "b" "c", E "c" "a", E "d" "b" ] -- 3 cycle with leg
g3 = [ E "a" "b", E "b" "c", E "c" "c"] -- *-*-o
g4 = [ E "a" "b", E "b" "a" ] -- 2 cycle
e1 = [ E "x" "y" ] -- edge

validateDyns = all validateDyn [g1, g2, g3, g4]

{--
- same number of nodes as edges
- no two edges leave one node
- has limit cycle
--}
validateDyn :: Graph String -> Bool
validateDyn g =
  all (\f -> f g1) [nodesEqEdges, wellDefinedArrows, hasLimit]
  where
    unique = reverse . nub . reverse
    nodesEqEdges g = length g == (length.unique.nodes) g
    wellDefinedArrows g = (map src) g == (unique.map src) g
    hasLimit g = length g > 0

