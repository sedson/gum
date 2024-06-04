#!/bin/bash
for filename in js/*; do
    name="$(basename "$filename" .js)"
    echo "$name"
    npx jsdoc-to-markdown "$filename" > "docs/$name.md"
done

