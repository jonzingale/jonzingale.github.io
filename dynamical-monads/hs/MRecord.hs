{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module MRecord where
import GHC.Generics
import Data.Csv

import Dynamical
import Product

data MRecord =
  MRecord { node :: String, diagNode :: String } deriving (Eq, Generic, Show)

etaName :: String -> String
etaName str | eqHalves str = half take str
            | otherwise = "false"
  where
    half f s = f (div (length s) 2) s
    eqHalves ss = half take ss == half drop ss

instance ToNamedRecord MRecord

instance DefaultOrdered MRecord where
    headerOrder _ = header ["node", "diagNode"]