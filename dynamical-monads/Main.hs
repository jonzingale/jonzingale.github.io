{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import Dynamical
import Product

{--
TODO:
* Validate dynamicals
- must have terminating cycle
- mustn't have two arrows leaving a state
- list with indices is prototypical [0,3,2,1]

* Avoid name space crashes

* fix corresponding colors
--}

g1, g2, g3, g4, g5, g6, g7 :: Graph String
g1 = [ E "0" "0", E "1" "0", E "3" "0", E "4" "0" ]
g2 = [ E "a" "b", E "b" "c", E "c" "a", E "g" "b" ]
g3 = [ E "a" "b", E "b" "c", E "c" "a", E "g" "b", E "h" "a"]
g4 = [ E "a" "b", E "b" "c", E "c" "c"]
g5 = [ E "a" "b", E "b" "a" ]
g6 = graphFromList [1,2,0]
g7 = graphFromList [1,0]

graphFromList :: [Int] -> Graph String
graphFromList ns = f ns 0
  where
    f [] i = [] 
    f (t:ts) i = (show <$> (E i t)) : f ts (i+1) 

instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]

main = do
  let g = g2 + g1
  let a = encodeDefaultOrderedByName g
  let m_a = encodeDefaultOrderedByName.eval.unit $ g
  let m_m_a = encodeDefaultOrderedByName $ (eval.unit).(eval.unit) $ g
  BL.writeFile "./graph_factor.csv" a
  BL.writeFile "./graph.csv" m_a
  BL.writeFile "./m_m_a.csv" m_m_a
