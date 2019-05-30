module Main where
import Codec.Picture -- JuicyPixel
import Data.KMeans
import Conversion
import Text.Printf
import Data.List (intercalate)
import qualified Data.Vector.Unboxed as U
import qualified Data.Vector.Storable as S
{--
  ColorSummaries in Haskell
  http://hackage.haskell.org/package/kmeans-0.1.3/docs/Data-KMeans.html

  Todo:
  * use Unboxed Vectors in place of lists
  * compile for main:
  * parallelize
    ghc -O2 --make ColorSummarizer.hs -threaded -rtsopts
    time ./ColorSummarizer +RTS -N8
--}

filename = "/Users/jon/Downloads/flower.jpg" -- 1908 × 4032

main = do
  Right image <- readImage filename
  let img = convertRGB8 image
  let clusters = kPixelMeans 10 img
  let formCentroids = map (formatRGB.centroid) clusters -- slow
  putStr $ intercalate "\n" formCentroids

main2 = do
  Right image <- readImage filename
  let img = convertRGB8 image
  let val = (S.!) (imageData img) 0
  putStr $ show val

centroid :: [[Double]] -> [Int]
centroid rgbs = map floor $ ct rgbs [0,0,0]
  where
    ct [] cents = cents
    ct [[r,g,b]] [rs, gs, bs] = [mAvg r rs, mAvg g gs, mAvg b bs]
    ct ([r,g,b]:rgbs') [rs, gs, bs] = ct rgbs' [mAvg r rs, mAvg g gs, mAvg b bs]

kPixelMeans :: Int -> Image PixelRGB8 -> [[[Double]]]
kPixelMeans k img =
  let w = div (imageWidth img) 100 in
  let h = div (imageHeight img) 100 in
  let d = imageData img in -- what format is this?

  let f (PixelRGB8 r g b) =  map p2d [r,g,b] in
  let pxs = [f $ pixelAt img (mod t w) (div t h) | t <- [0..(w*h)]] in
  kmeans k pxs

distance :: [Pixel8] -> [Pixel8] -> Double
distance rgb rgb' =
  let [r, g, b] = map p2d rgb in
  let [r', g', b'] = map p2d rgb' in
  sqrt $ (r-r')^2 + (g-g')^2 + (b-b')^2 

p2d :: Pixel8 -> Double
p2d red = fromIntegral (convert red::Integer)

formatRGB :: [Int] -> String
formatRGB [r,g,b] = printf "RGB(%d,%d,%d)" r g b

mAvg :: Double -> Double -> Double
mAvg a 0 = a
mAvg t avg = α * t + (1 - α) * avg
  where α = 0.7