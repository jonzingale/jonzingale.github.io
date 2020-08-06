module Helpers where

cases :: [Int]
cases = [
  322, 328, 337, 341, 352, 380, 389, 396, 407, 417, 433, 436, 456, 462, 474,
  482, 497, 510, 524, 535, 550, 561]

main = do avg cases

diffs (c:cs) = zipWith (-) cs (c:cs)

avg :: [Int] -> IO ()
avg cs = do
  let ds = diffs cs
  let total = foldr (+) 0 ds
  print $ div total (length ds)

lastFive = avg $ drop (length cases - 5) cases
