module Main where
import qualified Data.Vector.Unboxed as U
import qualified Data.Vector as G
import Data.List (intercalate)
import Codec.Picture -- JuicyPixel
import Math.KMeans -- kmeans-vector-0.3.2
import Conversion -- conversion-1.2.1
import Text.Printf
import System.Environment
import PrismaJSON
import PrismaMatcher

{--
  :set +s

  TODO:
  - repackage as JSON
  - parse as HTML with d3
  - show image beside summary
--}

-- filename = "/Users/jon/Downloads/flower.jpg" -- 1908 × 4032
filename = "/Users/Jon/Desktop/californiaPoppy.jpg" -- 2448 × 3264

p2d :: Pixel8 -> Double
p2d color = fromIntegral (convert color::Integer)
getRGB (PixelRGB8 r g b) = U.fromList [p2d r, p2d g, p2d b]

main :: IO ()
main = do
  [s] <- getArgs
  Right image <- readImage s --filename
  ps <- prismas
  let img = convertRGB8 image
  let clusters = kPixelMeans 10 img
  let cents = unWrapAll clusters
  let listC = map (U.toList) cents
  let formattedC = (closestPrisma ps).(U.toList)
  putStr $ intercalate "\n" $ map formattedC cents
  putStr "\n"

kPixelMeans :: Int -> Image PixelRGB8 -> Clusters (U.Vector Double)
kPixelMeans k img =
  let 𝜆 = 65 in
  let width  = [0..div (imageWidth  img - 1) 𝜆] in
  let height = [0..div (imageHeight img - 1) 𝜆] in
   -- pxs :: [U.Vector Double]
  let pxs = [ getRGB $ pixelAt img (𝜆*w) (𝜆*h) | w <- width, h <- height] in
  -- kmeans :: (a -> U.Vector Double) -> Distance -> Int -> [a] -> Clusters a
  kmeans id euclidSq k pxs

unWrapAll :: G.Vector (Cluster (U.Vector Double)) -> [U.Vector Double]
unWrapAll = G.toList . G.map (centroid.elements)

formatRGB :: [Double] -> String
formatRGB rgb = let [r,g,b] = map floor rgb in
  printf "RGB(%d,%d,%d)" (r::Int) (g::Int) (b::Int)

centroid :: [U.Vector Double] -> U.Vector Double
centroid cs = let ll = fromIntegral.length $ cs in
  U.map (/ ll) (sumV cs)

sumV :: [U.Vector Double] -> U.Vector Double
sumV = foldr add $ U.replicate 3 0
  where add u v = U.zipWith (+) u v

