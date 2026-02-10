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
      }}},
    { name: "加西 カフ", rarity: 4, elem: "水", atk: 400, hp: 5000, 
      skill: { timing: "attack", interval: 3, action: (a, ts, ds) => {
          let alive = ts.filter(e=>e.currentHp>0);
          let t = alive[Math.floor(Math.random()*alive.length)];
          if(t) { addStatus(t, "拘束", 1, 2); log(`<span>${t.name}を拘束！</span>`); }
      }}},
    { name: "レオナ･フィボナッチ", rarity: 4, elem: "草", atk: 400, hp: 5000, 
      skill: { timing: "attack", interval: 3, action: (a, ts, ds) => {
          ds.forEach(d => d.currentHp = Math.min(d.hp + (d.rank-1)*800, d.currentHp + 1000));
          log("<span style='color:#00ff00;'>味方全員を1000回復！</span>");
      }}},
    { name: "S･スフェリコン", rarity: 4, elem: "火", atk: 200, hp: 4000, 
      skill: { timing: "attack", interval: 1, action: (a, ts, ds) => {
          ts.forEach(t => addStatus(t, "毒", 2, 2));
          log("<span style='color:#ff0088;'>敵全体に毒を撒いた！</span>");
      }}},
    { name: "フューム･カタラグーン", rarity: 5, elem: "闇", atk: 500, hp: 5500, 
      skill: { timing: "start", action: (a, ts, ds) => {
          addStatus(a, "興奮", 3, 3); ts.forEach(t => addStatus(t, "拘束", 1, 1));
          log("<span style='color:#ff00ff;'>敵全員を拘束した！</span>");
      }}},
    { name: "葛飾 コウ", rarity: 5, elem: "火", atk: 700, hp: 5000, 
      skill: { timing: "attack", interval: 1, action: (a, ts, ds) => {
          if(Math.random() < 0.75) { addStatus(a, "興奮", 4, 3); log("<span style='color:#ff4400;'>闘志が燃え上がる！</span>"); }
      }}},
    { name: "リーヴ･アレクサンダー", rarity: 5, elem: "火", atk: 999, hp: 9999 },
    { name: "ファルス･グランティカ", rarity: 5, elem: "闇", atk: 500, hp: 5000, 
      skill: { timing: "attack", interval: 1, action: (a, ts, ds) => {
          let types = ["麻痺", "拘束", "興奮", "毒"];
          ts.forEach(t => addStatus(t, types[Math.floor(Math.random()*4)], 5, 2));
          log("<span style='color:#8800ff;'>敵全員にランダムな効果を付与！</span>");
      }}},
    { name: "ナイト･ウォーダー", rarity: 5, elem: "光", atk: 700, hp: 7000, 
      skill: { timing: "attack", interval: 1, action: (a, ts, ds) => {
          let alive = ts.filter(e=>e.currentHp>0);
          let t = alive[Math.floor(Math.random()*alive.length)];
          if(t) { addStatus(t, "拘束", 1, 2); log(`<span>${t.name}の行動を封じた！</span>`); }
      }}}
];

const enemyTypes = {
    slime: { name: "スライム", hp: 3500, atk: 700, elem: "水", rarity: 3, skill: { interval: 2, action: (e, ts, ds) => { e.currentHp = Math.min(e.hp, e.currentHp + 1000); log(`${e.name}は回復した！`); }}},
    golem: { name: "ゴーレム", hp: 6500, atk: 450, elem: "草", rarity: 3, skill: { interval: 3, action: (e, ts, ds) => { addStatus(e, "興奮", 1, 3); log(`${e.name}は興奮した！`); }}},
    kurorekishi: { 
        name: "黒歴史", hp: 20000, atk: 1000, elem: "闇", rarity: 5,
        skill: { interval: 2, action: (e, ts, ds) => {
            ts.forEach(t => { addStatus(t, "麻痺", 3, 2); addStatus(t, "毒", 3, 3); });
            log("<b style='color:#ff00ff;'>黒歴史のフラッシュバック！ 全員が毒と麻痺に侵された！</b>");
        }}
    },
    nouki: { 
        name: "納期", hp: 60000, atk: 2500, elem: "闇", rarity: 5,
        skill: { interval: 2, action: (e, ts, ds) => {
            addStatus(e, "興奮", 10, 3);
            ts.forEach(t => { addStatus(t, "拘束", 1, 1); t.currentHp = Math.floor(t.currentHp * 0.5); });
            log("<b style='color:#ff0000;'>【警告】納期当日です。全員拘束＆HP半減！</b>");
        }}
    }
};

let stage=1, coin=6, deck=[], shop=[], enemies=[], nextEnemies=[], battleQueue=[];
const ui_start=document.getElementById("start"), ui_shop=document.getElementById("shop"), ui_battle=document.getElementById("battle"), ui_clear=document.getElementById("clearScreen"), ui_over=document.getElementById("gameOverScreen"), shopCards=document.getElementById("shopCards"), deckDiv=document.getElementById("deck"), sellZone=document.getElementById("sellZone"), coinText=document.getElementById("coinText"), stageText=document.getElementById("stageText"), nextEnemyInfo=document.getElementById("nextEnemyInfo"), enemyArea=document.getElementById("enemyArea"), allyArea=document.getElementById("allyArea"), logDiv=document.getElementById("log");

function hideAllScreens() { [ui_start, ui_shop, ui_battle, ui_clear, ui_over].forEach(div => div && div.classList.add("hidden")); }
window.onload=()=>{ hideAllScreens(); ui_start.classList.remove("hidden"); };
function startGame(){ stage=1; coin=6; deck=[]; hideAllScreens(); ui_shop.classList.remove("hidden"); refreshShop(); }
function log(t){ logDiv.innerHTML += `<div>${t}</div>`; logDiv.scrollTop = logDiv.scrollHeight; }
function cost(r){return r==3?2:r==4?3:4;}
function copyChar(c){return {...c,rank:1,currentHp:c.hp,status:[],skillCount:0};}
function getIcon(t){ switch(t){ case "麻痺": return "⚡"; case "拘束": return "⛓️"; case "興奮": return "💥"; case "毒": return "🤢"; default: return ""; } }
function getAffinity(a, t) { const tab = { "火": "草", "草": "水", "水": "火", "光": "闇", "闇": "光" }; if (tab[a] === t) return 1.5; if (tab[t] === a) return 0.5; return 1.0; }

function createCardHtml(c, isEnemy = false) {
    const stars = "★".repeat(c.rarity || 3);
    const maxHp = isEnemy ? c.hp : (c.hp + (c.rank - 1) * 800);
    const currentHp = Math.ceil(c.currentHp);
    const atk = calcAtk(c);
    const skillProgress = (c.skill && c.skill.interval) ? `<div style="position:absolute;top:2px;right:2px;font-size:10px;background:rgba(0,0,0,0.5);padding:1px 3px;border-radius:4px;">${c.skillCount}/${c.skill.interval}</div>` : "";
    const statusIcons = (c.status || []).map(s => `<span>${getIcon(s.type)}${s.turn}</span>`).join("");
    return `
        ${skillProgress}
        <div class="elem-circle elem-${c.elem}">${isEnemy ? "" : (c.rank || 1)}</div>
        <div class="rarity-stars">${stars}</div>
        <div class="card-status-icons" style="position:absolute;top:25px;right:5px;font-size:12px;">${statusIcons}</div>
        <div class="card-img-space"><img src="img/${c.name}.png" draggable="false" onerror="this.style.visibility='hidden'"></div>
        <div class="card-name">${c.name}</div>
        <div class="card-atk">⚔️${atk}</div>
        <div class="card-hp">♥${currentHp}</div>
    `;
}

function refreshShop(){
    if(stageText) stageText.innerText="Stage "+stage; 
    coinText.innerText=coin; 
    shop=[];
    nextEnemies = generateNextEnemies();
    nextEnemyInfo.innerText = `次: ${nextEnemies.map(e=>e.name).join(", ")}`;
    let pool= (stage<=3) ? [3] : (stage<=6) ? [3,4] : [3,4,5];
    for(let i=0;i<6;i++){
        let r=pool[Math.floor(Math.random()*pool.length)];
        let list=baseChars.filter(c=>c.rarity==r);
        shop.push(copyChar(list[Math.floor(Math.random()*list.length)]));
    }
    drawShop(); drawDeck();
}

function generateNextEnemies() {
    if(stage===5) return [copyChar(enemyTypes.kurorekishi)];
    if(stage===10) return [copyChar(enemyTypes.nouki)];
    let pool = [enemyTypes.slime, enemyTypes.golem];
    let result = [];
    let count = Math.min(4, Math.floor(stage / 2) + 1);
    while(result.length < count) { result.push(copyChar(pool[Math.floor(Math.random()*pool.length)])); }
    return result;
}

function drawShop(){ 
    shopCards.innerHTML=""; 
    shop.forEach((c,i)=>{ 
        let d=document.createElement("div"); 
        d.className=`card rarity-${c.rarity}`; 
        d.draggable=true; 
        d.innerHTML=createCardHtml(c); 
        d.ondragstart=e=>e.dataTransfer.setData("shopIndex",i); 
        shopCards.appendChild(d); 
    }); 
}
function drawDeck(){ 
    deckDiv.innerHTML=""; 
    deck.forEach((c,i)=>{ 
        let d=document.createElement("div"); 
        d.className=`card rarity-${c.rarity}`; 
        d.draggable=true; 
        d.innerHTML=createCardHtml(c); 
        d.ondragstart=e=>e.dataTransfer.setData("deckIndex",i); 
        deckDiv.appendChild(d); 
    }); 
}
function drawEnemy(){ 
    enemyArea.innerHTML = ""; 
    enemies.forEach(e => { 
        if(e.currentHp > 0) { 
            let d = document.createElement("div"); 
            d.className = `card rarity-${e.rarity || 3}`; 
            d.innerHTML = createCardHtml(e, true); 
            enemyArea.appendChild(d); 
        }
    }); 
}
function drawAllies(){ 
    allyArea.innerHTML=""; 
    deck.forEach(c=>{ 
        if(c.currentHp>0) { 
            let d = document.createElement("div"); 
            d.className = `card rarity-${c.rarity}`; 
            d.innerHTML = createCardHtml(c); 
            allyArea.appendChild(d); 
        }
    }); 
}

deckDiv.ondragover=e=>e.preventDefault();
deckDiv.ondrop=e=>{ let i=e.dataTransfer.getData("shopIndex"); if(i!=="") buy(Number(i)); };
sellZone.ondragover=e=>e.preventDefault();
sellZone.ondrop=e=>{ let i=e.dataTransfer.getData("deckIndex"); if(i!=="") { let c=deck[i]; coin+=cost(c.rarity); deck.splice(i,1); coinText.innerText=coin; drawDeck(); } };

function buy(i){
    let c = shop[i], p = cost(c.rarity), sameChar = deck.find(dc => dc.name === c.name);
    if(coin < p) return;
    if(sameChar) { if(sameChar.rank < 5) { coin -= p; sameChar.rank += 1; shop.splice(i,1); } }
    else { if(deck.length >= 5) return; coin -= p; deck.push(copyChar(c)); shop.splice(i,1); }
    coinText.innerText = coin; drawShop(); drawDeck();
}
function reroll(){ if(coin>0) { coin--; refreshShop(); } }
function battle(){ if(deck.length>0) { hideAllScreens(); ui_battle.classList.remove("hidden"); startBattle(); } }

// --- キャラクターデータ、enemyTypes, 変数定義などは変更なしのため省略 ---
// (baseChars, enemyTypes, 各種UI要素の宣言はそのまま保持してください)

let isProcessing = false;

function startBattle() {
    logDiv.innerHTML = "<b>--- 戦闘開始 ---</b><br>";
    battleQueue = [];
    isProcessing = false;
    enemies = JSON.parse(JSON.stringify(nextEnemies));
    
    deck.forEach(c => {
        c.currentHp = c.hp + (c.rank - 1) * 800;
        c.status = [];
        c.skillCount = 0;
    });

    // 開幕スキル
    deck.forEach(c => {
        if (c.skill && c.skill.timing === "start") {
            battleQueue.push({ type: "skill", actor: c, side: "ally" });
        }
    });

    prepareTurn();
    drawEnemy();
    drawAllies();
    if(battleQueue.length > 0) nextTurn();
}

function prepareTurn() {
    let aliveAllies = deck.filter(c => c.currentHp > 0);
    let aliveEnemies = enemies.filter(e => e.currentHp > 0);
    if (aliveEnemies.length === 0 || aliveAllies.length === 0) return;

    let turnActions = [];
    aliveAllies.forEach(c => turnActions.push({ type: "action", actor: c, side: "ally" }));
    aliveEnemies.forEach(e => turnActions.push({ type: "action", actor: e, side: "enemy" }));
    
    turnActions.sort(() => Math.random() - 0.5);
    battleQueue.push(...turnActions);
}

// --- コアロジック: nextTurn ---
function nextTurn() {
    if (isProcessing && battleQueue.length > 0) return;
    
    if (battleQueue.length === 0) {
        if (enemies.every(e => e.currentHp <= 0) || deck.every(c => c.currentHp <= 0)) {
            finishBattle();
        } else {
            [...deck, ...enemies].forEach(u => {
                if (u.currentHp > 0) {
                    let d = (u.status || []).find(s => s.type === "毒");
                    if (d) {
                        let dmg = d.level * 200;
                        u.currentHp -= dmg;
                        log(`<span style='color:#00ff00;'>${u.name}は毒で ${dmg} ダメージ！</span>`);
                    }
                    applyStatus(u);
                }
            });
            log("<hr style='border:0.5px solid #444;'>");
            prepareTurn();
            drawEnemy();
            drawAllies();
        }
        return;
    }

    isProcessing = true;
    let task = battleQueue.shift();
    let actor = task.actor;

    if (actor.currentHp <= 0) {
        isProcessing = false;
        return nextTurn();
    }

    if (isStunned(actor)) {
        log(`${actor.name}は拘束されて動けない！`);
        finishAction();
        return;
    }

    // 行動分岐
    if (task.type === "skill") {
        // 開幕スキル処理
        executeSkillEffect(actor, task.side);
    } else {
        // 通常アクション (攻撃 ＋ スキル判定)
        executeAttackEffect(actor, task.side);

        if (actor.skill && actor.skill.interval) {
            actor.skillCount++;
            if (actor.skillCount >= actor.skill.interval) {
                // 攻撃の0.3秒後にスキル発動
                setTimeout(() => {
                    executeSkillEffect(actor, task.side);
                    actor.skillCount = 0; 
                }, 300);
                return; // executeSkillEffect 内の finishAction で次へ
            }
        }
        finishAction();
    }
}

// --- 独立させた実行関数 ---

function executeAttackEffect(a, side) {
    let targets = (side === "ally") ? enemies.filter(e => e.currentHp > 0) : deck.filter(c => c.currentHp > 0);
    if (targets.length > 0) {
        let t = targets[Math.floor(Math.random() * targets.length)];
        log(`<span>${a.name}の攻撃！</span>`);
        dealDamage(a, t, calcAtk(a));
    }
}

function executeSkillEffect(a, side) {
    log(`<b style="color:#ffeb3b;">★ ${a.name}のスキル発動！</b>`);
    // ターゲットの定義を明確化
    // ts: スキルを当てる相手, ds: スキルを使う側の味方
    const ts = (side === "ally") ? enemies : deck;
    const ds = (side === "ally") ? deck : enemies;
    
    if (a.skill && typeof a.skill.action === "function") {
        a.skill.action(a, ts, ds);
    }
    
    drawEnemy();
    drawAllies();
    finishAction();
}

function finishAction() {
    drawEnemy();
    drawAllies();
    setTimeout(() => {
        isProcessing = false;
        nextTurn();
    }, 500); 
}

function dealDamage(a, t, d) {
    const af = getAffinity(a.elem, t.elem);
    const fd = Math.floor(d * af);
    t.currentHp = Math.max(0, t.currentHp - fd);
    let color = af > 1 ? "#ff4444" : af < 1 ? "#aaa" : "#fff";
    log(`<span style="color:${color}">${t.name}に ${fd} ダメージ！</span>`);
}

// --- 補助系（変更なし） ---
function addStatus(u, type, level, turn) {
    if (!u.status) u.status = [];
    let s = u.status.find(s => s.type === type);
    if(s) { s.turn = Math.max(s.turn, turn); s.level = Math.max(s.level, level); }
    else { u.status.push({ type, level, turn }); }
}
function finishBattle() {
    if (enemies.every(e => e.currentHp <= 0)) {
        coin += 10; stage++;
        if (stage > 10) { hideAllScreens(); ui_clear.classList.remove("hidden"); }
        else { hideAllScreens(); ui_shop.classList.remove("hidden"); refreshShop(); }
    } else { hideAllScreens(); ui_over.classList.remove("hidden"); }
}
function calcAtk(u){
    let b = u.atk + (u.rank ? (u.rank - 1) * 80 : 0);
    let m = 1.0;
    if(u.status) u.status.forEach(s=>{
        if(s.type === "麻痺") m -= 0.3;
        if(s.type === "興奮") m += (0.3 * s.level);
    });
    return Math.floor(b * Math.max(0.1, m));
}
function isStunned(c){ return c.status && c.status.some(s=>s.type==="拘束"); }
function applyStatus(u){ if(u.status) u.status.forEach(s=>s.turn--); u.status = u.status.filter(s => s.turn > 0); }

ui_battle.addEventListener("click", () => {
    if (!isProcessing && battleQueue.length > 0) nextTurn();
});


function addStatus(u, type, level, turn) {
    if (!u.status) u.status = [];
    let s = u.status.find(s => s.type === type);
    if(s) { s.turn = Math.max(s.turn, turn); s.level = Math.max(s.level, level); }
    else { u.status.push({ type, level, turn }); }
}
function finishBattle() {
    if (enemies.every(e => e.currentHp <= 0)) { coin += 10; stage++; if (stage > 10) { hideAllScreens(); ui_clear.classList.remove("hidden"); } else { hideAllScreens(); ui_shop.classList.remove("hidden"); refreshShop(); }} 
    else { hideAllScreens(); ui_over.classList.remove("hidden"); }
}
function calcAtk(u){
    let b = u.atk + (u.rank ? (u.rank - 1) * 80 : 0); let m = 1.0;
    if(u.status) u.status.forEach(s=>{ if(s.type === "麻痺") m -= 0.3; if(s.type === "興奮") m += (0.3 * s.level); });
    return Math.floor(b * Math.max(0.1, m));
}
function isStunned(c){ return c.status && c.status.some(s=>s.type==="拘束"); }
function applyStatus(u){ if(u.status) u.status.forEach(s=>s.turn--); u.status = u.status.filter(s => s.turn > 0); }

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    if (!startButton) return;

    startButton.addEventListener("click", () => {
        startGame();
    });
});
