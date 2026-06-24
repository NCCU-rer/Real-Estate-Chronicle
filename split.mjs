import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/data/sourceData.ts', 'utf8');

// Find RawEvent interface
const rawEventMatch = content.match(/export interface RawEvent \{[\s\S]*?\}/);
if (!rawEventMatch) {
  console.error("Could not find RawEvent interface!");
  process.exit(1);
}
const rawEventInterface = rawEventMatch[0];

const configs = [
  { key: "oldLabelData", file: "national.ts", export: "nationalEvents" },
  { key: "taipeiData", file: "taipei.ts", export: "taipeiEvents" },
  { key: "newtaipeiData", file: "newTaipei.ts", export: "newTaipeiEvents" },
  { key: "taoyuanData", file: "taoyuan.ts", export: "taoyuanEvents" },
  { key: "hsinchuData", file: "hsinchu.ts", export: "hsinchuEvents" },
  { key: "taichungData", file: "taichung.ts", export: "taichungEvents" },
  { key: "tainanData", file: "tainan.ts", export: "tainanEvents" },
  { key: "kaohsiungData", file: "kaohsiung.ts", export: "kaohsiungEvents" },
];

fs.mkdirSync('src/data/events', { recursive: true });

// Write types.ts
fs.writeFileSync('src/data/events/types.ts', `${rawEventInterface}\n`);

for (const config of configs) {
  // Find key name, e.g. "oldLabelData"
  // It might be followed by whitespace, colon, whitespace, '['
  const regex = new RegExp(`"${config.key}"\\s*:\\s*\\[`);
  const match = content.match(regex);
  if (!match) {
    console.error(`Could not find key: ${config.key}`);
    process.exit(1);
  }
  const keyIndex = match.index;
  
  // Find the opening '['
  const startBracketIndex = content.indexOf('[', keyIndex);
  if (startBracketIndex === -1) {
    console.error(`Could not find [ for key: ${config.key}`);
    process.exit(1);
  }
  
  let bracketCount = 0;
  let endBracketIndex = -1;
  
  for (let i = startBracketIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '[') {
      bracketCount++;
    } else if (char === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        endBracketIndex = i;
        break;
      }
    }
  }
  
  if (endBracketIndex === -1) {
    console.error(`Could not find matching ] for key: ${config.key}`);
    process.exit(1);
  }
  
  const arrayContent = content.slice(startBracketIndex, endBracketIndex + 1);
  
  // Create file content
  const fileContent = `import { RawEvent } from "./types";

export const ${config.export}: RawEvent[] = ${arrayContent};
`;
  
  fs.writeFileSync(path.join('src/data/events', config.file), fileContent);
  console.log(`Successfully split ${config.key} to ${config.file}`);
}

// Write index.ts
const indexContent = `import { nationalEvents } from "./national";
import { taipeiEvents } from "./taipei";
import { newTaipeiEvents } from "./newTaipei";
import { taoyuanEvents } from "./taoyuan";
import { hsinchuEvents } from "./hsinchu";
import { taichungEvents } from "./taichung";
import { tainanEvents } from "./tainan";
import { kaohsiungEvents } from "./kaohsiung";

export const rawData = {
  oldLabelData: nationalEvents,
  taipeiData: taipeiEvents,
  newtaipeiData: newTaipeiEvents,
  taoyuanData: taoyuanEvents,
  hsinchuData: hsinchuEvents,
  taichungData: taichungEvents,
  tainanData: tainanEvents,
  kaohsiungData: kaohsiungEvents,
};
`;

fs.writeFileSync('src/data/events/index.ts', indexContent);
console.log('Successfully wrote index.ts');
