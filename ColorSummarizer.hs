module ColorSummarizer where
import Codec.Picture
import Data.KMeans

file = "~/Downloads/20190407_180710.jpg"

-- pixelAt :: Image a -> Int -> Int -> a

-- readImage :: FilePath -> IO (Either String DynamicImage)
img = readImage(file)
jpg = readJpeg(file)

dynWidth :: DynamicImage -> Int
dynWidth img = dynamicMap imageWidth img

-- kmeans :: Int -> [[Double]] -> [[[Double]]]


main = do
  img <- readImage(file)
  show (dynWidth img)


-- import qualified Data.ByteString.Lazy.Char8 as L
-- import qualified Data.Vector.Unboxed as U

-- test = "./Tests/dataAllOnes100"

-- fileToAry :: FilePath -> IO (U.Vector Double)
-- fileToAry file = do
--   s <- L.readFile file
--   return $ U.fromList $ readDouble s

-- readDouble :: L.ByteString -> [Double]
-- readDouble bs = map (read.(L.unpack)) $ L.lines $ bs