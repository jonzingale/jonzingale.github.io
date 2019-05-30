module ColorSummarizer where
import Codec.Picture
import Data.KMeans
import Conversion

filename = "/Users/jon/Downloads/flower.jpg"

main = do
  Right image <- readImage filename
  let img = convertRGB8 image
  putStr $ show $ pixels img

pixels :: Image PixelRGB8 -> [[Pixel8]]
pixels img = let f (PixelRGB8 r g b) = [r,g,b] in
  [f $ pixelAt img t 0 | t <- [0..1000]]

distance :: [Pixel8] -> [Pixel8] -> Double
distance rgb rgb' =
  let [r, g, b] = map p2d rgb in
  let [r', g', b'] = map p2d rgb' in
  sqrt $ (r-r')^2 + (g-g')^2 + (b-b')^2 

p2d :: Pixel8 -> Double
p2d red = fromIntegral (convert red::Integer)

-- kmeans :: Int -> [[Double]] -> [[[Double]]]