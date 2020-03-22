{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import Dynamical
import Product

g1, g2 :: Graph String
g1 = [ E "0" "0", E "1" "0", E "3" "0", E "9" "0" ]
g2 = [ E "a" "b", E "b" "c", E "c" "a", E "g" "b" ]

instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]

main = do
  let g = g1 + g2
  let a = encodeDefaultOrderedByName g
  let m_a = encodeDefaultOrderedByName $ eval.unit $ g
  -- let m_m_a = encodeDefaultOrderedByName $ eval.unit.unit $ g -- Not sure!!!
  BL.writeFile "./graph_factor.csv" a
  BL.writeFile "./graph.csv" m_a
