---
name: yt-ideate
description: >-
  Generate a finished, ready-to-script video idea for the channel, in one of
  two modes: Autonomous (niche trend scan) or Seeded (sharpening user seed).
  Use whenever the user wants idea generation, video angles, topics, or asks
  "what should I make a video about".
---

# yt-ideate

Trigger: /yt-ideate

## Purpose
Generate a finished, ready-to-script video idea for the channel, in one of two modes.

## Mode A — Autonomous (no input given)
1. Scan what's currently working in the channel's niche (same approach as /yt-viral: find public videos outperforming their own channel's median, not just big channels).
2. From the patterns found, propose ONE specific idea — not a list, one clear pick — with: Topic, Angle (what makes this take different from what's already out there), Working Title, Thumbnail Concept, and a one-line reason this fits the trend.

## Mode B — Seeded (user gives a topic, title, rough thought, or humor angle)
1. Take the raw input as-is, however incomplete.
2. Think deeply: what's the sharpest angle hiding in this seed? What would make a viewer actually stop scrolling? Is there a stronger version of this idea than what was literally typed?
3. Output the same shape as Mode A: Topic, Angle, Working Title, Thumbnail Concept, and a one-line reason this works — now expanded/sharpened from the seed, not just repeating it back.

## Output format (both modes)
- Topic:
- Angle:
- Working Title:
- Thumbnail Concept:
- Why this works:

## Notes
- Read voice.md first so the idea fits the channel's established tone.
- This output becomes the direct input to /yt-script — hand it off in the same message or session.
- Mode A requires reading public video data the same way /yt-viral does; if that data isn't available, say so rather than inventing numbers.
