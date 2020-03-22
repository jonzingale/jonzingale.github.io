{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import Dynamical

g1, g2 :: Graph String
g1 = [ E "0" "0", E "1" "0", E "3" "0", E "9" "0" ]
g2 = [ E "a" "b", E "b" "c", E "c" "a", E "g" "b" ]

instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]

main = do
  let g = g1 + g2
  let csv1 = encodeDefaultOrderedByName g
  let csv = encodeDefaultOrderedByName (g^2)
  BL.writeFile "./graph_factor.csv" csv1
  BL.writeFile "./graph.csv" csv
