module ColorSummarizer where
import Codec.Picture
import Data.KMeans
import Data.Word
import Codec.Picture.RGBA8
-- import Codec.Picture.Jpg

file = "/Users/jon/Downloads/20190407_180710.jpg"

-- https://en.wikipedia.org/wiki/Mean_of_circular_quantities
-- http://hackage.haskell.org/package/JuicyPixels-3.3.3/docs/Codec-Picture.html
-- http://hackage.haskell.org/package/kmeans-0.1.3/docs/Data-KMeans.html

img = readImage(file)
jpg = readJpeg(file)

dynWidth :: DynamicImage -> Int
dynWidth img = dynamicMap imageWidth img

-- kmeans :: Int -> [[Double]] -> [[[Double]]]

main = do
  Right img <- readImage(file)
  let jpg = fromDynamicImage img
  let dimg = pixelAt (jpg) 10 10
  putStr $ "\n" ++ show dimg ++ "\n"

dynSquare :: DynamicImage -> DynamicImage
dynSquare = dynamicPixelMap squareImage

squareImage :: Pixel a => Image a -> Image a
squareImage img = generateImage (\x y -> pixelAt img x y) edge edge
   where edge = min (imageWidth img) (imageHeight img)



