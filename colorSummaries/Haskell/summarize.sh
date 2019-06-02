#!/bin/bash
# https://downloads.haskell.org/~ghc/latest/docs/html/users_guide/profiling.html

# ghc -O2 --make VectorColorSummarizer.hs -rtsopts -fforce-recomp -prof -fprof-auto -fprof-cafs
# echo "Running Summarizer"
# time ./VectorColorSummarizer +RTS -sstderr -p

# rm VectorColorSummarizer.hi VectorColorSummarizer.o
# rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o
# rm VectorColorSummarizer

ghc -O2 --make VectorColorSummarizer.hs
echo "Running Summarizer"
clusters="$1"
file="$2" # "/Users/Jon/Desktop/californiaPoppy.jpg" 
time ./VectorColorSummarizer $clusters $file
rm VectorColorSummarizer.hi VectorColorSummarizer.o
rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o

python -m http.server && sleep 3000 &
open "http://localhost:8000/colorSummaries/Haskell/prisma.html"

rm VectorColorSummarizer




# EFFECTIVELY TO RUN THIS SCRIPT:
# ./summarize.sh 5 "/Users/Jon/Desktop/californiaPoppy.jpg" 