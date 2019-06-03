module Main where
import qualified Data.Vector.Unboxed as U
import qualified Data.Vector as G
import Data.List (intercalate)
import Codec.Picture -- JuicyPixel
import Math.KMeans -- kmeans-vector-0.3.2
import Conversion -- conversion-1.2.1
import System.Environment (getArgs)
import System.Directory (getCurrentDirectory)
import PrismaJSON (writeFilename, writeJson, prismas)
import PrismaMatcher

{--
  :set +s

  TODO:
  - calculateSizes
--}

filenameStub = "/colorSummaries/Haskell/images/"
defaultStub  = "californiaPoppy.jpg"

arguments = do
  args <- getArgs
  let defaults =  ["12", defaultStub]
  return $ if args == [] then defaults else args

p2d :: Pixel8 -> Double
p2d color = fromIntegral (convert color::Integer)
getRGB (PixelRGB8 r g b) = U.fromList [p2d r, p2d g, p2d b]

main :: IO ()
main = do
  directory <- getCurrentDirectory
  [clusters, filename] <- arguments
  let k = (read clusters)::Int
  Right image <- readImage (directory++filename)
  ps <- prismas

  let img = convertRGB8 image
  let clusters = kPixelMeans k img
  let cents = unWrapAll clusters
  let listC = map (U.toList) cents
  let formattedC = (closestPrisma ps).(U.toList)
  writeJson.map formattedC $ cents
  writeFilename (filenameStub++filename)

kPixelMeans :: Int -> Image PixelRGB8 -> Clusters (U.Vector Double)
kPixelMeans k img =
  let (𝜆, width, height) = calculateSizes img in
   -- pxs :: [U.Vector Double]
  let pxs = [ getRGB $ pixelAt img (𝜆*w) (𝜆*h) | w <- width, h <- height] in
  -- kmeans :: (a -> U.Vector Double) -> Distance -> Int -> [a] -> Clusters a
  kmeans id euclidSq k pxs

unWrapAll :: G.Vector (Cluster (U.Vector Double)) -> [U.Vector Double]
unWrapAll = G.toList . G.map (centroid.elements)

centroid :: [U.Vector Double] -> U.Vector Double
centroid cs = let ll = fromIntegral.length $ cs in
  U.map (/ ll) (sumV cs)

sumV :: [U.Vector Double] -> U.Vector Double
sumV = foldr add $ U.replicate 3 0
  where add u v = U.zipWith (+) u v

-- Limits sample sizes based on image size
-- best would be to skip ~40 for small images
-- skip ~65 for larger.
calculateSizes :: Image PixelRGB8 -> (Int, [Int], [Int])
calculateSizes img 
  | width*height < 1*10^6 = (1, [0..width - 1], [0..height - 1])
  | otherwise = (𝜆, [0..div (width - 1) 𝜆], [0..div (height - 1) 𝜆])
  where
    maxImgSize = 5*10^6
    𝜆=65
    -- 𝜆 = div (width*height) (10^5)
    -- 𝜆 = (* (4::Int)).floor.log.fromIntegral $ width * height
    width = imageWidth img
    height = imageHeight img
