player={humes:10,hand:[], visibleHand:document.querySelector(".hand#player")};
opponent={humes:10,hand:[], visibleHand:document.querySelector(".hand#opponent")};
const blueCard=document.createElement("div");
blueCard.classList.add("card");
blueCard.innerHTML="<p class=\"hp\">hp</p><img><br><p></p>";
const blueInfo=document.createElement("div");
blueInfo.classList.add("info");
blueCard.insertBefore(blueInfo, blueCard.lastChild);

function initOpponent(i){
    const card=blueCard.cloneNode(true);
    const info=card.querySelector(".info")
    card.lastChild.innerHTML=cards[i][1]
    const el=document.getElementById("opponent");
    card.firstChild.innerHTML=cards[i][2]+"hp";
    card.querySelector("img").src=cards[i][0];
    card.classCard=new Card(cards[i],opponent,card);
    el.appendChild(card);
    if (cards[i][3]){
        const main=document.createElement("button");
        main.innerHTML="Use main ability on self"
        info.appendChild(main);
    }
    if (cards[i][5]){
        const special=document.createElement("button");
        special.innerHTML="Use special ability"
        info.appendChild(special);
    }
}
window.start=function(){
    initOpponent(1);
    const el=document.querySelector(".choice");
    el.style.visibility="visible";
    document.getElementById("startUp").style.visibility="hidden";
    el.innerHTML="";
    function eventStuff(){
        window.player.hand.push(this.classCard);
        el.removeChild(this);
        document.querySelector(".hand#player").appendChild(this);
        this.removeEventListener("click", eventStuff);
        const buttons=this.querySelectorAll("button")
        for (const i of buttons){
            i.disabled=false;
        }}
    for (let i=0; i<cards.length; i++){
    const card=blueCard.cloneNode(true)
    const info=card.querySelector(".info")
    card.classCard=new Card(cards[i],player,card);
    card.addEventListener("click", eventStuff);
    card.querySelector("img").src=cards[i][0];
    card.firstChild.innerHTML=cards[i][2]+"hp";
    el.appendChild(card);
    if (cards[i][3]){
        const main=document.createElement("button");
        main.innerHTML="Use main ability on self"
        main.classList.add("mainAbility");
        main.disabled=true;
        main.addEventListener("click",()=>card.classCard.useMainAbility(card.classCard));
        info.appendChild(main);
    }
    if (cards[i][5]){
        const special=document.createElement("button");
        special.innerHTML="Use special ability"
        special.classList.add("specialAbility");
        special.disabled=true;
        special.addEventListener("click",()=>card.classCard.useSpecialAbility());
        info.appendChild(special);
    }
    }
}
class Card{
    constructor(info, player, domElement){
        this.image=info[0];
        this.name=info[1];
        this.health=info[2];
        this.mainAbility=info[3]?.bind(this);
        this.passiveAbility=info[4]?.bind(this);
        this.specialAbility=info[5]?.bind(this);
        this.trigger=info[6]?.bind(this);
        this.specialObj=_.cloneDeep(info[7]);
        this.buffsAndDebuffs={};
        this.player=player;
        this.domElement=domElement;
        this.info=this.domElement.querySelector(".info");
        this.flavortexts=info[8];
        
    }
    takeDamage(damage){
        this.health-=damage;
        this.domElement.querySelector(".hp").innerHTML=this.health+"hp";
        if (this.health<=0){
            this.player.visibleHand.removeChild(this.domElement);
            const index=this.player.hand.indexOf(this);
            this.player.hand.splice(index,1);
        }
    }
    useMainAbility(target){this.mainAbility(target)};
    checkPassive(){if (this.trigger()&&this.passiveAbility){this.passiveAbility()}};
    useSpecialAbility(target){this.specialAbility(target)};
    onceUsed(isSpecial){
        if (isSpecial){
            this.player.humes-=this.specialObj.specialHumeCost;
            this.specialObj.cooldown=this.specialObj.maxCooldown
            this.setButton(".specialAbility",true)
        }else{
            if (this.specialObj.used){this.player.humes-=this.specialObj.mainHumeCost};
            this.specialObj.used=true;
        }
        for (let i of this.player.hand){
            if (i.player.humes<i.specialObj.mainHumeCost&&i.specialObj.used){
                i.setButton(".mainAbility",true);
            }if(i.player.humes<i.specialObj.specialHumeCost){
            i.setButton(".specialAbility", true);
            }
        }
    }
    newTurn(){
        if (this.mainAbility){this.setButton("button.mainAbility",false)};
        if (this.specialAbility){
            if (this.specialObj.specialHumeCost<=this.player.humes && this.specialObj.cooldown===0){
                this.setButton("button.specialAbility",false)
            }
        if (this.specialObj.cooldown>0){this.specialObj.cooldown-=1};
            }
    this.checkPassive();
    this.checkBuffsAndDebuffs();
    }
    checkBuffsAndDebuffs(){
        for (const [key, i] of Object.entries(this.buffsAndDebuffs)){
            if (i[0]!==0){
                i[0]-=1;
            }else{
                i[1]();
                delete this.buffsAndDebuffs[key];
            }
        }
    }
    setButton(button,set){this.domElement.querySelector(button).disabled=set}
}
const cards=[
    ["Resources/OhNineSix.jpeg",
    "SCP-096",
    100,
    function main(target){
        target.takeDamage(this.specialObj.damage);
        this.onceUsed(false)
    },
    undefined,
    function special(...args){
        this.specialObj.damage*=2;
        this.buffsAndDebuffs.rage=[3,()=>this.specialObj.damage/=2];
        this.onceUsed(true);
    }, 
    undefined, 
    {mainHumeCost:1,specialHumeCost:4, damage:5,cooldown:0,maxCooldown:5,used:false},
    {}
    ],
    ["Resources/OneSevenThree.jpeg",
    "SCP-173",
    80,
    function main(target){
        target.takeDamage(this.specialObj.damage);
        this.onceUsed(false);},
         function blink(){this.setButton("button.mainAbility",true)},
         undefined,
        function trigger(){return Math.random()<0.2},
        {damage:30,used:false,mainHumeCost:5},
        {}
    ]
]