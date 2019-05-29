module ColorSummarizer where
import Codec.Picture
import Data.KMeans

file = "/Users/jon/Downloads/20190407_180710.jpg"

-- https://en.wikipedia.org/wiki/Mean_of_circular_quantities
-- http://hackage.haskell.org/package/JuicyPixels-3.3.3/docs/Codec-Picture.html
-- http://hackage.haskell.org/package/kmeans-0.1.3/docs/Data-KMeans.html

-- pixelAt :: Image a -> Int -> Int -> a

-- readImage :: FilePath -> IO (Either String DynamicImage)
img = readImage(file)
jpg = readJpeg(file)

dynWidth :: DynamicImage -> Int
dynWidth img = dynamicMap imageWidth img

-- kmeans :: Int -> [[Double]] -> [[[Double]]]

main = do
  Right img <- readImage(file)
  let dimg = dynWidth img
  putStr $ "\n" ++ show dimg ++ "\n"
