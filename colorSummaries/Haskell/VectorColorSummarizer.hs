module Main where
import Codec.Picture -- JuicyPixel
import Math.KMeans -- kmeans-vector-0.3.2
import Conversion -- conversion-1.2.1
import Text.Printf
import Data.List (intercalate)
import qualified Data.Vector.Unboxed as U
import qualified Data.Vector.Storable as S
import qualified Data.Vector         as G
{--
  :set +s

  ColorSummaries in Haskell
  http://hackage.haskell.org/package/kmeans-0.1.3/docs/Data-KMeans.html

  Todo:
  * use Unboxed Vectors in place of lists
  * compile for main: ./summarize.sh
  * parallelize

  cs <- clusters
--}

-- filename = "/Users/jon/Downloads/flower.jpg" -- 1908 × 4032
filename = "/Users/Jon/Desktop/californiaPoppy.jpg"

main :: IO ()
main = do
  Right image <- readImage filename
  let img = convertRGB8 image
  let clusters = kPixelMeans 10 img
  let cents = unWrapAll clusters
  let formattedC = formatRGB.(U.toList)
  putStr $ intercalate "\n" $ map formattedC cents

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
  where
    add u v = U.zipWith (+) u v

kPixelMeans :: Int -> Image PixelRGB8 -> Clusters (U.Vector Double)
kPixelMeans k img =
  let width  = div (imageWidth  img - 1) 100 in
  let height = div (imageHeight img - 1) 100 in
  let f (PixelRGB8 r g b) = map p2d [r,g,b] in
  let pxs = [ U.fromList $ f $ pixelAt img w h | w <- [0..width], h <- [0..height] ] in
  kmeans id euclidSq k pxs

p2d :: Pixel8 -> Double
p2d red = fromIntegral (convert red::Integer)

-- for comparing to prismacolor pencils
distance :: [Pixel8] -> [Pixel8] -> Double
distance rgb rgb' =
  let [r, g, b] = map p2d rgb in
  let [r', g', b'] = map p2d rgb' in
  sqrt $ (r-r')^2 + (g-g')^2 + (b-b')^2 