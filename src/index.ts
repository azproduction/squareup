#!/usr/local/bin/node --loader ts-node/esm.mjs --experimental-top-level-await
import sharp from 'sharp';
import assert from 'assert';
import path from 'path';
import { promises as fs, existsSync } from 'fs';

const [, , fileName] = process.argv;

assert(fileName, 'fileName is required');

const content = await fs.readFile(fileName);
const { width = 0, height = 0 } = await sharp(content).metadata();

assert(width !== 0, 'width is 0');
assert(height !== 0, 'width is 0');

const ext = path.extname(fileName);
const outputFile = path.join(
    path.dirname(fileName),
    `${path.basename(fileName, ext)}-s${ext}`
);

assert(!existsSync(outputFile), `target file ${outputFile} already exists`);

const biggestDimension = Math.max(width, height);

const imageLayer = await sharp(content)
    .withMetadata()
    .extend({
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        bottom: Math.floor((biggestDimension - height) / 2),
        top: Math.ceil((biggestDimension - height) / 2),
        left: Math.floor((biggestDimension - width) / 2),
        right: Math.ceil((biggestDimension - width) / 2),
    })
    .toFormat('png')
    .toBuffer();

await sharp(content)
    .withMetadata()
    .resize(biggestDimension, biggestDimension, {
        fit: 'cover',
    })
    .blur(24)
    .composite([
        {
            input: imageLayer,
            gravity: 'centre',
        },
    ])
    .jpeg({
        quality: 95,
        force: false,
    })
    .toFile(outputFile);

console.log(`Written to ${outputFile}`);
