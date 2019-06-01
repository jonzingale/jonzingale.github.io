module PrismaMatcher (closestPrisma) where
import Conversion -- conversion-1.2.1
import Codec.Picture -- JuicyPixel
import PrismaJSON

distance :: [Double] -> [Double] -> Double
distance [r, g, b] [r', g', b'] =
  sqrt $ (r-r')^2 + (g-g')^2 + (b-b')^2

-- ps <- prismas
closestPrisma :: [Prisma] -> [Double] -> String
closestPrisma ps rgb = ff rgb ps 255 "name"
  where
    ff cs [] dist str = str
    ff cs (p:ps) dist str
      | distance cs (color p) < dist =
        ff cs ps (distance cs (color p)) (name p)
      | otherwise = ff cs ps dist str