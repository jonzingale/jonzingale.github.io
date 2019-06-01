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
file="$1" # "/Users/Jon/Desktop/californiaPoppy.jpg" 
time ./VectorColorSummarizer $file
rm VectorColorSummarizer.hi VectorColorSummarizer.o
rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o
rm VectorColorSummarizer


# EFFECTIVELY TO RUN THIS SCRIPT:
# ./summarize.sh "/Users/Jon/Desktop/californiaPoppy.jpg" 