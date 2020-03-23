{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import Dynamical
import DynamicalExample (g1, g2, g3, g4)
import Product

{--
TODO:
* avoid name space crashes
* fix corresponding colors
--}

instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]

main = do
  -- let g = g1 + g2 -- edge^2, 3-cycle with leg
  let g = g4 + g1
  let a = encodeDefaultOrderedByName g
  let m_a = encodeDefaultOrderedByName.eval.unit $ g
  let m_m_a = encodeDefaultOrderedByName $ (eval.unit).(eval.unit) $ g
  BL.writeFile "./graph_factor.csv" a
  BL.writeFile "./graph.csv" m_a
  BL.writeFile "./m_m_a.csv" m_m_a
