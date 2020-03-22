module Product where
import Prelude hiding (Monad, (>>=))
import Dynamical

data Product s = TT { pr1::s, pr2 ::s } deriving (Show)

instance Functor Product where
  fmap f (TT p q) = TT (f p) (f q)

instance Applicative Product where
  pure x = TT x x
  (TT f g) <*> (TT x y) = TT (f x) (g y)

class Functor m => Monad m where
  unit :: a -> m a
  join :: m (m a) -> m a
  (>>=) :: m a -> (a -> m b) -> m b 

instance Monad Product where
  unit x = pure x
  join (TT x y) = TT (pr1 x) (pr2 y)
  x >>= f = join (f <$> x)

unitGraph :: Product (Graph String)
unitGraph = unit graph
joinGraph = join $ unit unitGraph
appendGraph = (unit graph) >>= (\g -> TT graph g)
