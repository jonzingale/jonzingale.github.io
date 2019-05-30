module ColorSummarizer where
import Codec.Picture
import Data.KMeans
import Data.Word

file = "/Users/jon/Downloads/20190407_180710.jpg"

data PixelRGB8 = PixelRGB8 {-# UNPACK #-} !Word8 -- Red
                           {-# UNPACK #-} !Word8 -- Green
                           {-# UNPACK #-} !Word8 -- Blue
                deriving (Eq, Ord, Show)

-- https://en.wikipedia.org/wiki/Mean_of_circular_quantities
-- http://hackage.haskell.org/package/JuicyPixels-3.3.3/docs/Codec-Picture.html
-- http://hackage.haskell.org/package/kmeans-0.1.3/docs/Data-KMeans.html

-- pixelAt :: Image a -> Int -> Int -> a
-- readPixel

-- readImage :: FilePath -> IO (Either String DynamicImage)
img = readImage(file)
jpg = readJpeg(file)

dynWidth :: DynamicImage -> Int
dynWidth img = dynamicMap imageWidth img

dynData :: DynamicImage -> Data.Vector.Storable.Vector (PixelBaseComponent a)
dynData img = dynamicMap imageData img

-- kmeans :: Int -> [[Double]] -> [[[Double]]]

main = do
  Right img <- readImage(file)
  let dimg = dynWidth img
  -- let dimg = dynData img
  -- let dimg = pixelAt img 100 100
  putStr $ "\n" ++ show dimg ++ "\n"

-- main = do
--   eimg <- readImage file
--   case eimg of
--     Left err -> putStrLn ("Could not read image: " ++ err)
--     Right (ImageRGB8 img) ->
--       (savePngImage path' . ImageRGB8 . rotateImg) img
--     Right _ -> putStrLn "Unexpected pixel format"