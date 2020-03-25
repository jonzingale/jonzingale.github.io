{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module MMRecord where
import GHC.Generics (Generic)
import Data.Csv

import Dynamical
import Product

data MMRecord =
  MMRecord {
    source :: String,
    target :: String,
    joinNode :: String,
    fixedPoint :: String,
    dNode :: String
  } deriving (Eq, Generic, Show)

muName :: String -> String
muName str = left str ++ right str
  where
    half s = div (length s) 2
    left s = take (half s - 1) s
    right s = drop (half s + 1) s

diag :: String -> String
diag (s:ss) | all (== s) ss = (s:ss)
            | otherwise = "false"

instance ToNamedRecord MMRecord

instance DefaultOrdered MMRecord where
    headerOrder _ =
      header ["source", "target", "joinNode", "fixedPoint", "dNode"]
