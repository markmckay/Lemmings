import { T_SOLID, T_STEEL } from '../terrain.js';
const W = 1600, H = 320;
function lvl(meta, build) { return { ...meta, build }; }

const TAXING_NAMES = [
  'It Crowds!', 'Rent-a-Lemming', 'One way or another',
  'Classic lemming', 'Lemming Friendly','Going up...', 'Every Lemming for Himself!',
  "We All Fall Down (3)",'How do you do it?', 'Lights Out!',
  'The Steel Mines of Kessel', 'Across the Gap', "I Have a Cunning Plan (2)",
  'Steel Works', 'Mayhem and Madness', 'King of the Castle',
  'The Far Side', 'No Way Forward', 'Triple Trouble', 'Waltz of the Lemmings',
  'Ice Ice Lemming', 'Lemming United', 'The Lemming Learning Curve',
  'Compression Method 1', 'What an Assortment!', 'Lemmings on the Move',
  'Down, down, down...', 'X marks the spot', "We All Fall Down (4)",
  'Dangerous Journey'
];

export const TAXING = Array.from({length:30},(_,i)=>{
  const num = i+1;
  return lvl({
    name: TAXING_NAMES[i]||`Taxing ${num}`, num, category:'TAXING',
    lemmings:80, mustSave:60, timeSecs:9*60, releaseRate:50,
    skills:{builder:10,basher:5,blocker:3,climber:3,floater:3,miner:3,digger:3,bomber:3},
    palette:['dirt','brick','snow','crystal'][i%4],
  }, (t,e,x)=>{
    const seed = num * 73;
    t.fillRect(0, 285, W, 35, T_SOLID);
    t.fillRect(0, 100 + (seed%60), 250, 20, T_SOLID);
    t.fillRect(400 + (seed%100), 80, 30, 200+( seed%40), T_SOLID);
    t.fillRect(700, 180 + (seed%40), 300, 20, T_SOLID);
    if (num%3===0) t.fillRect(1000, 140, 20, 160, T_STEEL);
    e.push({x:80, y:100+(seed%60), w:24, h:10});
    x.push({x:1100, y:162+(seed%40), w:20, h:18});
  });
});
