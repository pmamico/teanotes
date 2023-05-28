#!/bin/bash

BLUE='rgb(0, 0, 255)'
YELLOW='rgb(200, 200, 0)'

LIGHT_BLUE="rgba(0, 128, 255, 0.5)"
LIGHT_YELLOW="rgba(230, 230, 0, 0.5)"

sed -i '' "s/$BLUE/$YELLOW/g" "$1"
sed -i '' "s/$LIGHT_BLUE/$LIGHT_YELLOW/g" "$1"

