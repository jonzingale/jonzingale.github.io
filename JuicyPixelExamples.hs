module JuicyPixelExamples where
import Codec.Picture

filename = "/Users/jon/Downloads/flower.jpg"

-- No Conversion
isMiddlePixelRed' :: FilePath -> IO (Maybe Bool)
isMiddlePixelRed' fp = do
    image <- readImage fp
    case image of
        Left _ -> return Nothing
        Right image' -> return (go image')
  where
    go :: DynamicImage -> Maybe Bool
    go (ImageYCbCr8 image@(Image w h _)) =
        Just (isRed (pixelAt image (w `div` 2) (h `div` 2)))
    go _ = Nothing
    isRed :: PixelYCbCr8 -> Bool
    isRed (PixelYCbCr8 r g b) = r == maxBound && g == 0 && b == 0

-- With Conversion
isMiddlePixelRed :: FilePath -> IO (Maybe Bool)
isMiddlePixelRed fp = do
    image <- readImage fp
    case image of
        Left _ -> return Nothing
        Right image' -> return (go (convertRGB8 image'))

  where
    go (image@(Image w h _)) =
      Just (isRed (pixelAt image (w `div` 2) (h `div` 2)))

    isRed :: PixelRGB8 -> Bool
    isRed (PixelRGB8 r g b) = r == maxBound && g == 0 && b == 0

thing = do
    Right image <- readImage filename
    let img = convertRGB8 image
    let px = pixelAt img 0 0
    putStr $ show px
