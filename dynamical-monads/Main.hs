{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}

module DynamicalApi where

import qualified Data.ByteString.Lazy as BL
import GHC.Generics
import Data.Text (Text)
import Data.Csv

import Dynamical

dude :: Graph String
dude = [E "0" "0", E "1" "0", E "2" "0", E "3" "0", E "4" "3", E "5" "3"]

instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]

main = do
  let csv = encodeDefaultOrderedByName $  (dude) ^ 2
  BL.writeFile "./graph.csv" csv

