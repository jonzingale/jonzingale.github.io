#!/bin/bash
# https://downloads.haskell.org/~ghc/latest/docs/html/users_guide/profiling.html

# DEV AND PROFILING
# ghc -O2 --make VectorColorSummarizer.hs -rtsopts -fforce-recomp -prof -fprof-auto -fprof-cafs
# echo "Running Summarizer"
# time ./VectorColorSummarizer +RTS -sstderr -p

# rm VectorColorSummarizer.hi VectorColorSummarizer.o
# rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o
# rm VectorColorSummarizer


# TOWARDS PRODUCTION CODE
ghc -O2 --make VectorColorSummarizer.hs -rtsopts -fforce-recomp
echo "Running Summarizer"
clusters="$1" # 12
file="$2" # "/Users/Jon/Desktop/californiaPoppy.jpg" 
time ./VectorColorSummarizer $clusters $file
rm VectorColorSummarizer.hi VectorColorSummarizer.o
rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o

# cd ./../..
# python -m http.server &
open "http://localhost:8000/colorSummaries/Haskell/prisma.html"
# & fg
# rm VectorColorSummarizer


# EFFECTIVELY TO RUN THIS SCRIPT:
# throw image in /images and then ...
#./summarize.sh 3 tetris.jpg
