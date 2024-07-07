# Squareup

When you want to publish a non-square picture on Instagram without photoshopping too much.
A script to convert a non-square picture to a square one filling the gaps with a blur.

## Requirements

- node 20.x
- yarn

## Install

```sh
yarn
```

## Usage

Manually for a single file

```sh
./src/index.ts path-to-file.jpg
```

For a batch of files. A script in Automator App

```sh
cd /Path/to/squareup
for f in "$@"
do
	/Path/to/squareup/src/index.ts "$f"
done
```