{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import DynamicalExample (g1, g2, g3, g4)
import CsvRecord (DynamicalRecord)
import Dynamical
import Product

{--
TODO:
* avoid name space crashes
--}

-- TODO: make DynamicalRecord work
-- dynamicalCsv = do
--   let g = g1 + g4
--   let mg = eval.unit $ g
--   let mmg = eval.unit $ mg
--   let recs = [DynamicalRecord (E gs gt) ]
--   BL.writeFile "./dynamical_record.csv"

main = do
  -- let g = g1 + g2 -- edge^2, 3-cycle with leg
  let g = g1 + g4 -- 2-cycle, edge^2
  let a = encodeDefaultOrderedByName g
  let m_a = encodeDefaultOrderedByName.eval.unit $ g
  let m_m_a = encodeDefaultOrderedByName $ (eval.unit).(eval.unit) $ g
  BL.writeFile "./graph_factor.csv" a
  BL.writeFile "./graph.csv" m_a
  BL.writeFile "./m_m_a.csv" m_m_a
