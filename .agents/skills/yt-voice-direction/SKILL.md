---
name: yt-voice-direction
description: >-
  Take a script from /yt-script and add per-scene voice and delivery direction
  so dialogue carries real emotional intent instead of flat narration. Use when
  prepping voiceover or dialogue for Flow, ElevenLabs, or any voice synthesis tool.
---

# yt-voice-direction

Trigger: /yt-voice-direction

## Purpose
Take a script (from /yt-script, with its scene-by-scene visual notes) and add per-scene voice/delivery direction, so that when the script is later given to Flow or any voice tool, the generated dialogue carries real emotional intent instead of flat narration.

## Input
A script with scenes already broken out (from /yt-script).

## For each scene, output
- Tone: (e.g. playful, urgent, awed, deadpan)
- Pacing: (e.g. rushed, measured, building)
- Character voice: (if a recurring character/persona is used, describe it consistently across scenes — age-feel, energy, accent-feel if relevant)
- Delivery cue: (e.g. "pause half a second before the reveal," "emphasize the number," "let this line land quieter than the rest")

## Output format
One block per scene, in script order:
- Scene N:
  - Tone:
  - Pacing:
  - Character voice:
  - Delivery cue:

## Notes
- Read voice.md so delivery stays consistent with the channel's established voice across episodes.
- This output is meant to be handed to Flow alongside the script text itself — both together, not voice-direction alone.
- Don't invent a character voice that contradicts anything already established in a prior episode's voice-direction output, if one exists in this project.
