// --- キャラクターデータ ---
const baseChars = [
    { name: "喜ヶ楽 スウ", rarity: 3, elem: "光", atk: 300, hp: 3000, 
      skill: { timing: "attack", interval: 3, action: (a, ts, ds) => {
          ts.forEach(t => addStatus(t, "麻痺", 1, 2));
          log("<span style='color:#ffff00;'>敵全体に麻痺を付与！</span>");
      }}},
    { name: "イグノア･フラクタル", rarity: 3, elem: "光", atk: 100, hp: 2000, 
      skill: { timing: "start", action: (a, ts, ds) => {
          ds.forEach(d => addStatus(d, "興奮", 3, 5));
          log("<span style='color:#ffffaa;'>全味方にレベル3の興奮付与！</span>");
      }}},
    { name: "ルーファス･θ･S", rarity: 3, elem: "火", atk: 200, hp: 3000, 
      skill: { timing: "attack", interval: 3, action: (a, ts, ds) => {
          ds.forEach(d => addStatus(d, "興奮", 2, 2));
          log("<span style='color:#ff4400;'>味方全体に興奮を付与！</span>");
      }}},
    { name: "役握 キョウ", rarity: 3, elem: "闇", atk: 200, hp: 2000, 
      skill: { timing: "attack", interval: 2, action: (a, ts, ds) => {
          let t = ts.find(e => e.currentHp > 0);
          if(t) { addStatus(t, "麻痺", 1, 2); log(`<span>${t.name}に麻痺を付与！</span>`); }
      }}},
    { name: "リゲル", rarity: 3, elem: "水", atk: 300, hp: 3000, 
      skill: { timing: "start", action: (a, ts, ds) => {
          let target = ds[Math.floor(Math.random()*ds.length)];
          target.currentHp = Math.max(1, target.currentHp - 500);
          ds.forEach(d => addStatus(d, "興奮", 2, 2));
          log(`<span style='color:#00ffff;'>${target.name}を犠牲に全員を奮起させた！</span>`);
      }}},
    { name: "莢豆 塩豆", rarity: 3, elem: "草", atk: 400, hp: 4000, 
      skill: { timing: "start", action: (a, ts, ds) => {
          addStatus(a, "興奮", 2, 3); addStatus(a, "毒", 2, 2);
          log("<span style='color:#00ff00;'>自身に毒と興奮を付与！</span>");
      }}}
];

// --- 以下そのまま全部貼り付け ---
