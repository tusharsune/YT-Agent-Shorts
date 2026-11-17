import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NAV_ITEMS,
  isValidScreenId,
  filterPromptItems,
  filterLibraryAssets,
  PromptItemFilterable,
  LibraryAssetFilterable,
} from './navigation';

test('NAV_ITEMS contains all 8 required screens in order', () => {
  assert.equal(NAV_ITEMS.length, 8);
  assert.deepEqual(
    NAV_ITEMS.map((item) => item.id),
    [
      'overview',
      'prompt-queue',
      'episode-tracker',
      'history-and-library',
      'script-viewer',
      'calendar',
      'publish-log',
      'settings',
    ]
  );
  assert.equal(isValidScreenId('overview'), true);
  assert.equal(isValidScreenId('settings'), true);
  assert.equal(isValidScreenId('unknown-screen'), false);
});

test('filterPromptItems filters by status, type, and search query', () => {
  const sample: PromptItemFilterable[] = [
    {
      id: '1',
      title: "God's Number Blindfold",
      prompt: 'Macro hyper-detailed camera zoom into a GAN 12 MagLev speedcube',
      type: 'video',
      status: 'pending',
      model: 'Runway Gen-3',
    },
    {
      id: '2',
      title: 'Mirror Blocks Speed Run',
      prompt: 'Monochrome brushed silver mirror cube',
      type: 'image',
      status: 'fulfilled',
      model: 'Midjourney v6',
    },
    {
      id: '3',
      title: 'The Impossible 1x1 Parody',
      prompt: 'Deadpan instructional narrator',
      type: 'voice',
      status: 'pending',
      model: 'ElevenLabs',
    },
  ];

  assert.equal(filterPromptItems(sample, 'all', 'all', '').length, 3);
  assert.equal(filterPromptItems(sample, 'pending', 'all', '').length, 2);
  assert.equal(filterPromptItems(sample, 'fulfilled', 'all', '').length, 1);
  assert.equal(filterPromptItems(sample, 'all', 'video', '').length, 1);
  assert.equal(filterPromptItems(sample, 'pending', 'voice', '').length, 1);
  assert.equal(filterPromptItems(sample, 'all', 'all', 'maglev').length, 1);
});

test('filterLibraryAssets filters by episode, asset type, and search text', () => {
  const assets: LibraryAssetFilterable[] = [
    {
      id: 'a1',
      episode: '142',
      type: 'video',
      title: 'Hyper-speed 3x3 F2L finger tricks',
      model: 'Runway Gen-3',
      promptOrDetail: 'Close-up high angle hyperlapse',
    },
    {
      id: 'a2',
      episode: '141',
      type: 'image',
      title: 'Metallic mirror cube extreme close up',
      model: 'Midjourney v6.1',
      promptOrDetail: 'Seed #884920',
    },
  ];

  assert.equal(filterLibraryAssets(assets, 'all', 'all', '').length, 2);
  assert.equal(filterLibraryAssets(assets, '142', 'all', '').length, 1);
  assert.equal(filterLibraryAssets(assets, 'all', 'image', '').length, 1);
  assert.equal(filterLibraryAssets(assets, 'all', 'all', '884920').length, 1);
});
