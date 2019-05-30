#!/bin/bash

ghc -O2 --make VectorColorSummarizer.hs -threaded -rtsopts
time ./VectorColorSummarizer +RTS -N8
rm VectorColorSummarizer.hi VectorColorSummarizer.o VectorColorSummarizer
