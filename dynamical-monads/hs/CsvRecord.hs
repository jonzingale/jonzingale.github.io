{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module CsvRecord where
import GHC.Generics
import Dynamical
import Product
import Data.Csv

-- MRecord
data MRecord s = MRecord {
  srcM :: s, tgtM :: s, diagonalName :: String
} deriving (Eq, Generic, Show)

-- write this method for realz
etaName :: Edge String -> String
etaName (E s t) | s == t = s
                | otherwise = "false"

instance ToNamedRecord (MRecord String)

instance DefaultOrdered (MRecord String) where
    headerOrder _ = header ["srcM", "tgtM", "diagonalName"]

-- MMRecord
data MMRecord s = MMRecord {
  srcMM :: s, tgtMM :: s, joinName :: String
} deriving (Eq, Generic, Show)
 
-- write this method for realz
muName :: Edge String -> String
muName (E s t) | s == t = s

instance ToNamedRecord (MMRecord String)

instance DefaultOrdered (MMRecord String) where
    headerOrder _ = header ["srcMM", "tgtMM", "joinName"]


-- Edge Record
instance ToNamedRecord (Edge String)

instance DefaultOrdered (Edge String) where
    headerOrder _ = header ["src", "tgt"]
