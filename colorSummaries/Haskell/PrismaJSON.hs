{-# LANGUAGE DeriveGeneric #-}

module PrismaJSON where
import qualified Data.ByteString.Lazy as B
import System.Directory (getCurrentDirectory)
import GHC.Generics
import Data.Aeson
import Data.Text

getJson :: IO B.ByteString
getJson = B.readFile "prismacolors.json" -- mixed with sushiopolis
-- getJson = B.readFile "prismas.json" -- og list

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
writeJson ps = B.writeFile "summary.json" $ encode ps

writeFilename :: String -> IO()
writeFilename filename = do
  hostdir <- getCurrentDirectory
  let jsonName = Prisma {name=filename, color=[]}
  B.writeFile "filename.json" $ encode jsonName