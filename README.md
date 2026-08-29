# Precision Algorithms social assets

Public host for rendered social creative.

This repository exists for one reason: Buffer's API has no media upload endpoint. Every asset
attached to a post must be referenced by a publicly fetchable URL, so the images have to live
somewhere public before they can be scheduled.

Everything here is already destined for a public social feed. Nothing is published to this
repository that is not being posted anyway.

## What this is not

Not the content engine. The engine is private and lives in
`erickdronski/precision-algorithms-content-engine`, which is where the renderers, source records,
QA receipts and captions are. This repository holds output only, and nothing here is a source of
truth. If a file here disagrees with the engine, the engine is right.

## Layout

    <year>/<month-day>-<campaign>/<platform>-<width>x<height>.png

## URLs

    https://raw.githubusercontent.com/erickdronski/precision-algorithms-social-assets/main/<path>

Once a post is published, the network re-hosts the image on its own CDN, so these URLs are only
read by Buffer at scheduling time. They are not what an audience sees.

## Retention

Assets stay after publication. A live post can be re-fetched by the network, and deleting the
source can break it.
