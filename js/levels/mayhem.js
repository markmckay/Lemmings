import { T_SOLID, T_STEEL } from '../terrain.js';
const W = 1600, H = 320;
function lvl(meta, build) { return { ...meta, build }; }

const MAYHEM_NAMES = [
  'Steel Works', 'The Fast and the Furriest', 'Curse of the Pharaohs',
  'The Steel Mines of Kessel', 'Wicked', 'A Matter of Life and Death',
  'If at first you don\'t succeed...', 'The Great Lemming Caper',
  'The Lemming Learning Curve', 'All Falls Down', 'No Easy Way',
  'Cascade (2)', 'The Lab', 'They\'re everywhere!', 'Downunder',
  'Last Lemming to Lemming land', 'The Dig', 'It\'s Hero Time!',
  'Lemmingland', 'The Final Destination',
  'Mayhem 21','Mayhem 22','Mayhem 23','Mayhem 24','Mayhem 25',
  'Mayhem 26','Mayhem 27','Mayhem 28','Mayhem 29','Mayhem 30'
];

export const MAYHEM = Array.from({length:30},(_,i)=>{
  const num = i+1;
  return lvl({
    name: MAYHEM_NAMES[i]||`Mayhem ${num}`, num, category:'MAYHEM',
    lemmings:100, mustSave:80, timeSecs:6*60, releaseRate:80,
    skills:{builder:10,basher:5,blocker:3,climber:4,floater:4,miner:3,digger:3,bomber:3},
    palette:['crystal','brick','snow','dirt'][i%4],
  }, (t,e,x)=>{
    const seed = num * 97 + 31;
    t.fillRect(0, 285, W, 35, T_SOLID);
    t.fillRect(0, 80+(seed%50), 200, 20, T_SOLID);
    for(let s=0;s<3;s++) {
      t.fillRect(300+s*300+(seed%50), 60, 20, 240, T_SOLID);
    }
    t.fillRect(1200, 120+(seed%60), 200, 20, T_SOLID);
    if(num%2===0) t.fillRect(800, 200, 100, 10, T_STEEL);
    e.push({x:60, y:80+(seed%50), w:24, h:10});
    x.push({x:1300, y:102+(seed%60), w:20, h:18});
  });
});
