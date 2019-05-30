module Main where
import Codec.Picture -- JuicyPixel
-- import Data.KMeans
import Math.KMeans -- hopefully faster
import Conversion
import Text.Printf
import Data.List (intercalate)
import qualified Data.Vector.Unboxed as U
import qualified Data.Vector.Storable as S
import qualified Data.Vector         as G
{--
  ColorSummaries in Haskell
  http://hackage.haskell.org/package/kmeans-0.1.3/docs/Data-KMeans.html

  Todo:
  * use Unboxed Vectors in place of lists
  * compile for main: ./summarize.sh
  * parallelize
--}

filename = "/Users/jon/Downloads/flower.jpg" -- 1908 × 4032

{--
  likely pixels written 1 at a time!!
  S.length (imageData img) == 1908 * 4032 * 3
  pixelAt img 0 0 == [(S.!) (imageData img) t | <- [0..2]]

  :set +s
--}

main = do
  Right image <- readImage filename
  let img = convertRGB8 image
  let clusters = kPixelMeans 10 img -- slow
  -- let formCentroids = map (centroid) clusters -- slow
  -- let formCentroids = map (formatRGB.centroid) clusters -- slow
  -- putStr $ intercalate "\n" formCentroids

  let vects = G.toList $ G.map elements clusters
  putStr $ show $ vects


formatRGB :: [Int] -> String
formatRGB [r,g,b] = printf "RGB(%d,%d,%d)" r g b

centroid :: [[Double]] -> [Int]
centroid rgbs = map floor $ ct rgbs [0,0,0]
  where
    ct [] cents = cents
    ct [[r,g,b]] [rs, gs, bs] = [mAvg r rs, mAvg g gs, mAvg b bs]
    ct ([r,g,b]:rgbs') [rs, gs, bs] = ct rgbs' [mAvg r rs, mAvg g gs, mAvg b bs]

-- perhaps better is to use S.Sum and S.length
-- on Stored Vector Types
mAvg :: Double -> Double -> Double
mAvg a 0 = a
mAvg t avg = α * t + (1 - α) * avg
  where α = 0.7

-- kmeans :: Int -> [[Double]] -> [[[Double]]]
-- kPixelMeans :: Int -> Image PixelRGB8 -> [[[Double]]]
kPixelMeans k img =
  let width  = div (imageWidth  img - 1) 100 in
  let height = div (imageHeight img - 1) 100 in
  let d = imageData img in

  let f (PixelRGB8 r g b) = map p2d [r,g,b] in
  let pxs = [ U.fromList $ f $ pixelAt img w h | w <- [0..width], h <- [0..height] ] in
  -- kmeans k pxs -- old kmeans package
  kmeans id euclidSq 5 pxs -- new kmeans package

{--
:: (a -> Vector Double) 
feature extraction
-> Distance 
distance function
-> Int  
the k to run k-means with (i.e number of desired clusters)
-> [a]  
input list of points
-> Clusters a 
result, hopefully k clusters of points
--}


distance :: [Pixel8] -> [Pixel8] -> Double
distance rgb rgb' =
  let [r, g, b] = map p2d rgb in
  let [r', g', b'] = map p2d rgb' in
  sqrt $ (r-r')^2 + (g-g')^2 + (b-b')^2 

p2d :: Pixel8 -> Double
p2d red = fromIntegral (convert red::Integer)

