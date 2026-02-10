// ====== 基本データ ======
let deck = [];
let enemies = [];
let turnQueue = [];

function log(msg){
    const el = document.getElementById("log");
    el.innerHTML += msg + "<br>";
    el.scrollTop = el.scrollHeight;
}

// ====== カード描画 ======
function createCardHtml(c){
    const skillText = c.skill
        ? `${Math.min(c.skillCount||0,c.skill.interval)}/${c.skill.interval}`
        : "";

    return `
    <div class="card rarity-${c.rarity||1}">
        <div class="card-name">${c.name}</div>
        <div class="card-img-space">
            <img src="${c.img||""}">
        </div>
        <div class="card-atk">⚔${c.atk}</div>
        <div class="card-hp">❤${c.hp}</div>
        ${c.skill ? `<div class="skill-tag">${skillText}</div>`:""}
    </div>`;
}

function drawAllies(){
    const area = document.getElementById("allyArea");
    area.innerHTML = deck.map(createCardHtml).join("");
}

function drawEnemy(){
    const area = document.getElementById("enemyArea");
    area.innerHTML = enemies.map(createCardHtml).join("");
}

// ====== ダメージ表示 ======
function showDamage(targetEl, dmg){
    const num = document.createElement("div");
    num.className="damage-number";
    num.textContent=dmg;
    num.style.left="40px";
    num.style.top="40px";

    targetEl.appendChild(num);
    setTimeout(()=>num.remove(),900);

    targetEl.classList.add("damage-flash","shake");
    setTimeout(()=>{
        targetEl.classList.remove("damage-flash","shake");
    },300);
}

// ====== 攻撃処理 ======
function attack(attacker, defender){
    if(!attacker || !defender) return;

    defender.hp -= attacker.atk;
    log(`${attacker.name} → ${defender.name} に ${attacker.atk}ダメージ`);

    if(defender.hp<=0){
        log(`${defender.name}撃破`);
        removeUnit(defender);
    }
}

function removeUnit(unit){
    deck = deck.filter(c=>c!==unit);
    enemies = enemies.filter(c=>c!==unit);
}

// ====== スキル処理 ======
function handleSkill(actor, side){
    if(!actor.skill) return false;

    actor.skillCount = (actor.skillCount||0)+1;

    if(actor.skillCount >= actor.skill.interval){
        log(`★ ${actor.name}のスキル発動`);

        const targets = side==="ally" ? enemies : deck;
        const allies = side==="ally" ? deck : enemies;

        actor.skill.action(actor,targets,allies);

        actor.skillCount = 0;
        drawAllies();
        drawEnemy();
        return true; // 発動した
    }
    return false;
}

// ====== ターン処理 ======
function nextTurn(){
    if(deck.length===0 || enemies.length===0){
        log("戦闘終了");
        return;
    }

    const actorSide = Math.random()<0.5?"ally":"enemy";
    const group = actorSide==="ally"?deck:enemies;
    const targetGroup = actorSide==="ally"?enemies:deck;

    const actor = group[Math.floor(Math.random()*group.length)];
    const target = targetGroup[Math.floor(Math.random()*targetGroup.length)];

    if(!actor || !target) return;

    // スキル優先
    if(handleSkill(actor,actorSide)) return;

    // 通常攻撃
    attack(actor,target);

    drawAllies();
    drawEnemy();
}

// ====== 敵生成（重要） ======
function loadEnemies(data){
    // JSONコピー禁止。関数が死にます。
    enemies = data.map(e=>({...e,skillCount:0}));
}

// ====== テスト用初期化 ======
function initBattle(){
    deck=[
        {name:"騎士",atk:5,hp:20,rarity:3,skill:{
            interval:3,
            action:(self,targets)=>{
                if(targets[0]){
                    targets[0].hp-=10;
                    log("スキル10ダメージ！");
                }
            }
        }}
    ];

    loadEnemies([
        {name:"スライム",atk:3,hp:15,rarity:1,skill:{
            interval:2,
            action:(self,targets)=>{
                if(targets[0]){
                    targets[0].hp-=4;
                    log("敵スキル4ダメ！");
                }
            }
        }}
    ]);

    drawAllies();
    drawEnemy();
}
