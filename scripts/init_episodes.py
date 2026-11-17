import json
from pathlib import Path

episodes_file = Path('data/episodes.json')
prompts_file = Path('data/prompts.json')

with open(episodes_file, 'r', encoding='utf-8') as f:
    episodes = json.load(f)

with open(prompts_file, 'r', encoding='utf-8') as f:
    prompts = json.load(f)

for ep in episodes:
    ep_dir = Path('episodes') / f"{ep['id']}_{ep['slug']}"
    media_dir = ep_dir / 'media'
    media_dir.mkdir(parents=True, exist_ok=True)
    
    with open(ep_dir / 'meta.json', 'w', encoding='utf-8') as mf:
        json.dump(ep, mf, indent=2)
        
    ep_prompts = [p for p in prompts if p.get('episode_id') == ep['id']]
    with open(ep_dir / 'prompts.json', 'w', encoding='utf-8') as pf:
        json.dump(ep_prompts, pf, indent=2)
        
    script_content = f"""# {ep['title']} (Episode {ep['episode_number']})
Topic: {ep['topic']}
Angle: {ep['angle']}
Target Duration: {ep['target_duration']}
Status: {ep['script_status']}

## Hook (Formula: The Impossible Mystery / Curiosity)
Score: {ep['score']}/100

Have you ever wondered if there's an absolute limit to disorder? In mathematics, there is.
They call it God's Number.

## Scene 1 — The Scramble
Visual: Fast vertical zoom on scrambled cube.
Voice: No matter how hopelessly scrambled a Rubik's cube appears, it is never more than 20 moves from being solved.
Delivery: [Calm, awe-struck, melodic]

## Scene 2 — The Sensory Deprivation
Visual: Hands blindfolded reaching for the cube.
Voice: But what if you take away your sight? What if all you have left is the memory of where the colors were?
Delivery: [0.5s pause before reveal]

## Scene 3 — The Payoff
Visual: Rapid turns snapping into place.
Voice: Twenty moves. Under total darkness. And then... stillness.
Delivery: [Gentle swell, quiet emotional landing]
"""
    with open(ep_dir / 'script.md', 'w', encoding='utf-8') as sf:
        sf.write(script_content)

print("Initialized episode folders successfully")
