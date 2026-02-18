import { T_SOLID, T_STEEL } from '../terrain.js';
const W = 1600, H = 320;
function lvl(meta, build) { return { ...meta, build }; }

export const TRICKY = [
  lvl({ name: 'This Should Be A Doddle!', num:1, category:'TRICKY', lemmings:100, mustSave:50, timeSecs:6*60, releaseRate:50,
    skills:{builder:10,basher:3,blocker:2,bomber:2}, palette:'dirt' }, (t,e,x)=>{
    t.fillRect(0,160,400,20,T_SOLID); t.fillRect(500,160,20,140,T_SOLID);
    t.fillRect(520,200,400,20,T_SOLID); t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:80,y:160,w:24,h:10}); x.push({x:700,y:182,w:20,h:18});
  }),
  lvl({ name:'We All Fall Down (2)', num:2, category:'TRICKY', lemmings:15, mustSave:15, timeSecs:4*60, releaseRate:50,
    skills:{digger:15}, palette:'snow' }, (t,e,x)=>{
    t.fillRect(0,80,W,15,T_SOLID); t.fillRect(0,145,W,15,T_SOLID);
    t.fillRect(0,210,W,15,T_SOLID); t.fillRect(0,275,W,45,T_SOLID);
    e.push({x:400,y:80,w:24,h:10}); x.push({x:700,y:257,w:20,h:18});
  }),
  lvl({ name:'A Ladder Would Be Handy', num:3, category:'TRICKY', lemmings:100, mustSave:50, timeSecs:8*60, releaseRate:50,
    skills:{climber:5,floater:5,builder:15,basher:5,blocker:3}, palette:'dirt' }, (t,e,x)=>{
    t.fillRect(0,200,200,20,T_SOLID); t.fillRect(200,200,20,100,T_SOLID);
    t.fillRect(400,200,20,100,T_SOLID); t.fillRect(420,200,W-420,20,T_SOLID);
    t.fillRect(600,140,200,20,T_SOLID); t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:60,y:200,w:24,h:10}); x.push({x:900,y:122,w:20,h:18});
  }),
  lvl({ name:"Here's One I Prepared Earlier", num:4, category:'TRICKY', lemmings:100, mustSave:20, timeSecs:11*60, releaseRate:50,
    skills:{climber:5,builder:15,basher:5,blocker:3,bomber:2}, palette:'crystal' }, (t,e,x)=>{
    t.fillRect(0,240,W,60,T_SOLID); t.fillRect(0,100,20,160,T_SOLID);
    t.fillRect(200,100,20,160,T_SOLID); t.fillRect(400,100,20,160,T_SOLID);
    t.fillRect(600,100,20,160,T_SOLID);
    e.push({x:60,y:100,w:24,h:10}); x.push({x:900,y:222,w:20,h:18});
  }),
  lvl({ name:'Careless Clicking Cost Lives', num:5, category:'TRICKY', lemmings:100, mustSave:50, timeSecs:7*60, releaseRate:50,
    skills:{basher:8,builder:10}, palette:'dirt' }, (t,e,x)=>{
    t.fillRect(0,120,W,20,T_SOLID);
    for(let rx=200;rx<1000;rx+=200) t.fillRect(rx,100,40,40,T_SOLID);
    t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:60,y:120,w:24,h:10}); x.push({x:1200,y:102,w:20,h:18});
  }),
  lvl({ name:'Lemmingology', num:6, category:'TRICKY', lemmings:5, mustSave:4, timeSecs:7*60, releaseRate:50,
    skills:{climber:3,builder:10,basher:5}, palette:'brick' }, (t,e,x)=>{
    t.fillRect(0,80,200,20,T_SOLID); t.fillRect(200,80,20,160,T_SOLID);
    t.fillRect(300,160,200,20,T_SOLID); t.fillRect(500,160,20,140,T_SOLID);
    t.fillRect(550,200,300,20,T_SOLID); t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:60,y:80,w:24,h:10}); x.push({x:700,y:182,w:20,h:18});
  }),
  lvl({ name:'Been There, Seen It, Done It', num:7, category:'TRICKY', lemmings:75, mustSave:55, timeSecs:7*60, releaseRate:50,
    skills:{builder:20,blocker:3,basher:5,digger:3,miner:3}, palette:'snow' }, (t,e,x)=>{
    t.fillRect(0,100,200,20,T_SOLID);
    for(let px=200;px<1200;px+=160) t.fillRect(px,60,20,260,T_SOLID);
    t.fillRect(1200,100,200,20,T_SOLID); t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:60,y:100,w:24,h:10}); x.push({x:1280,y:82,w:20,h:18});
  }),
  lvl({ name:'Lemming Sanctuary in Sight', num:8, category:'TRICKY', lemmings:100, mustSave:60, timeSecs:11*60, releaseRate:50,
    skills:{builder:20,blocker:3}, palette:'dirt' }, (t,e,x)=>{
    t.fillRect(0,200,W,20,T_SOLID); t.fillRect(400,280,W-400,20,T_SOLID);
    t.fillRect(400,260,20,40,T_SOLID); t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:60,y:200,w:24,h:10}); x.push({x:1200,y:262,w:20,h:18});
  }),
  lvl({ name:'They Just Keep On Coming', num:9, category:'TRICKY', lemmings:75, mustSave:70, timeSecs:7*60, releaseRate:50,
    skills:{builder:10,basher:3,blocker:3,floater:5}, palette:'crystal' }, (t,e,x)=>{
    t.fillRect(0,120,400,20,T_SOLID); t.fillRect(500,160,300,20,T_SOLID);
    t.fillRect(900,120,20,200,T_SOLID); t.fillRect(920,200,W-920,20,T_SOLID);
    t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:80,y:120,w:24,h:10}); x.push({x:1200,y:182,w:20,h:18});
  }),
  lvl({ name:"There's A Lot of Them About", num:10, category:'TRICKY', lemmings:100, mustSave:94, timeSecs:11*60, releaseRate:50,
    skills:{builder:20,blocker:4,basher:5,bomber:3}, palette:'brick' }, (t,e,x)=>{
    // Two drop points, one exit
    t.fillRect(0,100,300,20,T_SOLID); t.fillRect(1300,100,300,20,T_SOLID);
    t.fillRect(600,200,400,20,T_SOLID); t.fillRect(0,285,W,35,T_SOLID);
    e.push({x:100,y:100,w:24,h:10}); e.push({x:1350,y:100,w:24,h:10});
    x.push({x:750,y:182,w:20,h:18});
  }),
  // Levels 11-30: stubs with varied terrain
  ...Array.from({length:20},(_, i)=>{
    const num = i+11;
    const names = [
      'Lemmings in the Attic','Bitter Lemming','Lemming Drops','MENACING !!',
      'Ozone Friendly Lemming','Luvly Jubly','Diet Lemmingaid',"It's Lemmingentry Watson",
      'Postcard from Lemmingland','One Way Digging to Freedom',"All the 6's",
      'Turn Around Young Lemmings!','From The Boundary Line','Tightrope City',
      'Cascade','I Have a Cunning Plan','The Island of the Wicker People',
      'Lost Something?','Rainbow Island','The Crankshaft'
    ];
    return lvl({
      name: names[i], num, category:'TRICKY',
      lemmings:80, mustSave:60, timeSecs:8*60, releaseRate:50,
      skills:{builder:10,basher:5,blocker:3,climber:3,floater:3,miner:2,digger:2,bomber:2},
      palette: ['dirt','snow','brick','crystal'][i%4],
    }, (t,e,x)=>{
      const offset = num * 40;
      t.fillRect(0,100+offset%80,300,20,T_SOLID);
      t.fillRect(400+offset%200,80,30,200,T_SOLID);
      t.fillRect(700,200,300,20,T_SOLID);
      t.fillRect(0,285,W,35,T_SOLID);
      e.push({x:80,y:100+offset%80,w:24,h:10});
      x.push({x:800,y:182,w:20,h:18});
    });
  }),
];
