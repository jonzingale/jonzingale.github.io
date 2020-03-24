{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import DynamicalExample (g1, g2, g3, g4)
import CsvRecord (M_Record)
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
--   -- let mmg = eval.unit $ mg
--   let recs = [M1 s1 t1 s2 t2 | ((E s1 t1), E st2 t2) <- zip g (???)]
--   BL.writeFile "./dynamical_record.csv"

-- Perhaps instead of the above make a M1_Record which includes the unit name
-- and make an M2_record which includes both unit name and mu name.

main = do
  -- let g = g1 + g2 -- edge^2, 3-cycle with leg
  -- let g = g1 + g4 -- 2-cycle, edge^2
  let g = [E "0" "0", E "1" "0", E "2" "1"]
  let a = encodeDefaultOrderedByName g
  let m_a = encodeDefaultOrderedByName.eval.unit $ g
  let m_m_a = encodeDefaultOrderedByName $ (eval.unit).(eval.unit) $ g
  BL.writeFile "./graph_factor.csv" a
  BL.writeFile "./graph.csv" m_a
  BL.writeFile "./m_m_a.csv" m_m_a
