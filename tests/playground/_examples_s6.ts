/*
TEST：

npx tsx core/playground/__test__/_examples_s6.ts
*/

import {
    discoverPlaygroundEntries,
} from '../../core/playground/discover-entries.ts';

const siteRoot = 'sites/default-site';

const entries = discoverPlaygroundEntries(siteRoot);

console.log('\n========== Playground Entries ==========\n');

console.log(entries);

console.log('\nTotal:', Object.keys(entries).length);