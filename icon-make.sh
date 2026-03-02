#!/usr/bin/env bash

set -e

SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

SRC_ICON_PATH="$SCRIPTPATH/resources/icon.png"
SRC_ICONSET_PATH="$SCRIPTPATH/resources/icon.iconset"

magick "$SRC_ICON_PATH" -resize 512x512 "$SCRIPTPATH/build/icon.png"

magick -background transparent "$SRC_ICON_PATH" -define icon:auto-resize=16,24,32,48,64,72,96,128,256 "$SCRIPTPATH/build/icon.ico"

rm -rf $SRC_ICONSET_PATH
mkdir $SRC_ICONSET_PATH

magick "$SRC_ICON_PATH" -resize 16x16 "$SRC_ICONSET_PATH/icon_16x16.png"
magick "$SRC_ICON_PATH" -resize 32x32 "$SRC_ICONSET_PATH/icon_16x16@2x.png"
magick "$SRC_ICON_PATH" -resize 32x32 "$SRC_ICONSET_PATH/icon_32x32.png"
magick "$SRC_ICON_PATH" -resize 64x64 "$SRC_ICONSET_PATH/icon_32x32@2x.png"
magick "$SRC_ICON_PATH" -resize 128x128 "$SRC_ICONSET_PATH/icon_128x128.png"
magick "$SRC_ICON_PATH" -resize 256x256 "$SRC_ICONSET_PATH/icon_128x128@2x.png"
magick "$SRC_ICON_PATH" -resize 256x256 "$SRC_ICONSET_PATH/icon_256x256.png"
magick "$SRC_ICON_PATH" -resize 512x512 "$SRC_ICONSET_PATH/icon_256x256@2x.png"
magick "$SRC_ICON_PATH" -resize 512x512 "$SRC_ICONSET_PATH/icon_512x512.png"
cp $SRC_ICON_PATH "$SRC_ICONSET_PATH/icon_512x512@2x.png"

iconutil -c icns -o "$SCRIPTPATH/build/icon.icns" $SRC_ICONSET_PATH

rm -rf $SRC_ICONSET_PATH