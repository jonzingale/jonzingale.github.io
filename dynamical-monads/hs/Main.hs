{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import DynamicalExamples (g1, g2, g3, g4)
import MMRecord
import MRecord
import CsvRecord
import Dynamical
import Product

{--
TODO:
* avoid name space crashes
* multiplying complicates naming: g1 + g4. WILL BREAK MMRecord
--}

mRecords = do
  let mg = eval.unit $ [E "0" "0", E "1" "0", E "2" "1"] 
  let recs = [ MRecord n (etaName n) | n <- nodes mg ]
  let m_a = encodeDefaultOrderedByName recs
  BL.writeFile "../data/m_a_test.csv" m_a

mmRecords = do
  let mmg = eval.unit.eval.unit $ [E "0" "0", E "1" "0", E "2" "1"] 
  let recs = [ MMRecord n (muName n) | n <- nodes mmg ]
  let m_a = encodeDefaultOrderedByName recs
  BL.writeFile "../data/m_m_a_test.csv" m_a

main = do
  -- let g = g1 + g2 -- edge^2, 3-cycle with leg
  -- let g = g1 + g4 -- 2-cycle, edge^2
  let g = [E "0" "0", E "1" "0", E "2" "1"] -- tail
  let a = encodeDefaultOrderedByName g
  let m_a = encodeDefaultOrderedByName.eval.unit $ g
  let m_m_a = encodeDefaultOrderedByName $ (eval.unit).(eval.unit) $ g
  BL.writeFile "../data/dyn.csv" a
  BL.writeFile "../data/m_a_dyn.csv" m_a
  BL.writeFile "../data/m_m_a_dyn.csv" m_m_a
