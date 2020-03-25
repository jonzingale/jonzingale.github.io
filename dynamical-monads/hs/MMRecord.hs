{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module MMRecord where
import GHC.Generics
import Data.Csv

import Dynamical
import Product

data MMRecord =
  MMRecord { node :: String, joinNode :: String } deriving (Eq, Generic, Show)

muName :: String -> String
muName str = left str ++ right str
  where
    half s = div (length s) 2
    left s = take (half s - 1) s
    right s = drop (half s + 1) s

instance ToNamedRecord MMRecord

instance DefaultOrdered MMRecord where
    headerOrder _ = header ["node", "joinNode"]
