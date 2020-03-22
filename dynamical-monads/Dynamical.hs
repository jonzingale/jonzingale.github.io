{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE DeriveGeneric #-}

module Dynamical where
import GHC.Generics (Generic)

graph = [E "0" "0", E "1" "0", E "2" "0"]

type Graph s = [Edge s]

data Edge s = E { src :: s, tgt :: s} | Empty deriving (Eq, Generic)

instance Show s => Show (Edge s) where
  show (E a b) = show a ++ "->" ++show b

instance Functor Edge where
  fmap f (E s t) = E (f s) (f t)

instance Applicative Edge where
  pure s = E s s -- inclusion of points
  (<*>) (E f g) (E s t) = E (f s) (g t) 

nodes :: Graph s -> [s]
nodes [] = []
nodes (e:es) = src e : tgt e : nodes es

fixed_points :: Eq s => Graph [s] -> Graph [s]
fixed_points es = [ e | e <- es, src e == tgt e]

instance Num (Graph [s]) where
  (*) es ds = [ (++) <$> e <*> d | e <- es, d <- ds ] -- product
  (+) es ds = es ++ ds -- coproduct
  negate = map (\(E x y) -> E y x) -- dualize graph
  fromInteger = undefined
  signum = undefined
  abs = undefined
