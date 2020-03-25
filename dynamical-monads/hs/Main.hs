module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import Data.Csv

import DynamicalExamples (g1, g2, g3, g4)
import MMRecord
import MRecord
import Dynamical
import Product

{--
TODO:
* avoid name space crashes
* multiplying complicates naming: g1 + g4. WILL BREAK MMRecord
--}

main = do
  -- let g = g1 + g2 -- edge^2, 3-cycle with leg
  -- let g = g1 + g4 -- 2-cycle, edge^2
  let g = [E "0" "0", E "1" "0", E "2" "1"] -- tail

  let a = encodeDefaultOrderedByName (g::[Edge String])
  BL.writeFile "../data/dyn.csv" a

  let mg = eval.unit $ [E "0" "0", E "1" "0", E "2" "1"] 
  let recs = [ MRecord s t (etaName s) (show (s == t)) | E s t <- mg ]
  let m_a = encodeDefaultOrderedByName recs
  BL.writeFile "../data/m_a_dyn.csv" m_a

  let mmg = eval.unit.eval.unit $ [E "0" "0", E "1" "0", E "2" "1"] 
  let recs = [ MMRecord s t (muName s) (show (s == t)) (diag s) | E s t <- mmg ]
  let m_a = encodeDefaultOrderedByName recs
  BL.writeFile "../data/m_m_a_dyn.csv" m_a

