#!/bin/bash

BLUE='rgb(0, 0, 255)'
RED='rgb(255, 0, 0)'

LIGHT_BLUE="rgba(0, 128, 255, 0.5)"
LIGHT_RED="rgba(255, 32, 0, 0.5)"

sed -i '' "s/$BLUE/$RED/g" "$1"
sed -i '' "s/$LIGHT_BLUE/$LIGHT_RED/g" "$1"

