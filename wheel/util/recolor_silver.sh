#!/bin/bash

BLUE='rgb(0, 0, 255)'
SILVER='rgb(192, 192, 192)'

LIGHT_BLUE="rgba(0, 128, 255, 0.5)"
LIGHT_SILVER="rgba(192, 192, 192, 0.5)"

sed -i '' "s/$BLUE/$SILVER/g" "$1"
sed -i '' "s/$LIGHT_BLUE/$LIGHT_SILVER/g" "$1"

