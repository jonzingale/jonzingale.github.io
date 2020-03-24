{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module CsvRecord where
import GHC.Generics
import Dynamical
import Product
import Data.Csv

-- CSV Record
{-- TODO: work out the details for join_src and join_tgt --}
data M_Record s = M1 {
  src :: s, tgt :: s,
  unit_src :: s, unit_tgt :: s -- values which map to src/tgt
  -- join_src :: [s], join_tgt :: [s] -- all values which collapse to src/tgt
} deriving (Eq, Generic)

instance ToNamedRecord (M_Record String)

instance DefaultOrdered (M_Record String) where
    headerOrder _ = header ["src", "tgt", "unit src", "unit tgt"]

-- M_RECORD helpers


-- Edge Record
instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]
