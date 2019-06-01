{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

module PrismaJSON where
import qualified Data.ByteString.Lazy as B
import GHC.Generics
import Data.Aeson
import Data.Text

getJSON :: IO B.ByteString
getJSON = B.readFile "prismas.json"

data Prisma =
  Prisma { name  :: !String, color :: ![Double]} deriving (Show,Generic)

instance FromJSON Prisma
instance ToJSON Prisma

prismas :: IO [Prisma]
prismas = do
 d <- (eitherDecode <$> getJSON) :: IO (Either String [Prisma])
 let Right prismas = d
 return prismas