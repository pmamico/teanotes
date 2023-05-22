#!/bin/bash

BLUE='rgb(0, 0, 255)'
GREEN='rgb(0, 200, 0)'

LIGHT_BLUE="rgba(0, 128, 255, 0.5)"
LIGHT_GREEN="rgba(32, 200, 0, 0.5)"

sed -i '' "s/$BLUE/$GREEN/g" "$1"
sed -i '' "s/$LIGHT_BLUE/$LIGHT_GREEN/g" "$1"

