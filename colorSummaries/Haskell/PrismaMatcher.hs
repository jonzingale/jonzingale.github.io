module PrismaMatcher (closestPrisma) where
import PrismaJSON (Prisma, name, color)
import Text.Printf -- formatRGB 

-- ps <- prismas

distance :: [Double] -> [Double] -> Double
distance [r, g, b] [r', g', b'] =
  sqrt $ (r-r')^2 + (g-g')^2 + (b-b')^2

closestPrisma :: [Prisma] -> [Double] -> Prisma
closestPrisma ps rgb = ff rgb ps 255 (head ps)
  where
    ff cs [] dist prisma = prisma
    ff cs (p:ps) dist prisma
      | distance cs (color p) < dist =
        ff cs ps (distance cs (color p)) p
      | otherwise = ff cs ps dist prisma

-- not in use
closestPrismaStr :: [Prisma] -> [Double] -> String
closestPrismaStr ps rgb = ff rgb ps 255 "name"
  where
    ff cs [] dist str = str
    ff cs (p:ps) dist str
      | distance cs (color p) < dist =
        ff cs ps (distance cs (color p)) (name p)
      | otherwise = ff cs ps dist str

formatRGB :: [Double] -> String
formatRGB rgb = let [r,g,b] = map floor rgb in
  printf "RGB(%d,%d,%d)" (r::Int) (g::Int) (b::Int)