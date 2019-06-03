#!/bin/bash
# https://downloads.haskell.org/~ghc/latest/docs/html/users_guide/profiling.html

# DEV AND PROFILING
# ghc -O2 --make ColorSummarizer.hs -rtsopts -fforce-recomp -prof -fprof-auto -fprof-cafs
# echo "Running Summarizer"
# time ./ColorSummarizer +RTS -sstderr -p

# rm ColorSummarizer.hi ColorSummarizer.o
# rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o
# rm ColorSummarizer


# TOWARDS PRODUCTION CODE
# ghc -O2 --make ColorSummarizer.hs -rtsopts -fforce-recomp
echo "Running Summarizer"
clusters="$1" # 12
file="$2" # "/Users/Jon/Desktop/californiaPoppy.jpg" 
time ./ColorSummarizer $clusters $file
# rm ColorSummarizer.hi ColorSummarizer.o
# rm PrismaJSON.hi PrismaJSON.o PrismaMatcher.hi PrismaMatcher.o

# seems to work, needs a kill to clean the process.
# cd ./../..
# python -m http.server &
open "http://localhost:8000/colorSummaries/Haskell/prisma.html"
# & fg

# rm ColorSummarizer


# EFFECTIVELY TO RUN THIS SCRIPT:
# throw image in /images and then ...
#./summarize.sh 3 tetris.jpg
