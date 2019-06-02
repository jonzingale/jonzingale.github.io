{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

module PrismaJSON where
import qualified Data.ByteString.Lazy as B
import GHC.Generics
import Data.Aeson
import Data.Text

getJson :: IO B.ByteString
getJson = B.readFile "prismas.json"

data Prisma =
  Prisma { name  :: !String,
           color :: ![Double]
         } deriving (Show,Generic)

instance FromJSON Prisma
instance ToJSON Prisma

prismas :: IO [Prisma]
prismas = do
 d <- (eitherDecode <$> getJson) :: IO (Either String [Prisma])
 let Right prismas = d
 return prismas

writeJson :: [Prisma] -> IO()
writeJson ps = B.writeFile "tmp.json" $ encode ps
