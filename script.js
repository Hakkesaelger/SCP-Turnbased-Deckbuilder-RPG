window.player={humes:10,hand:[],out:[]};
window.opponent={humes:10,hand:[],out:[]};
window.start=function(){
    const el=document.querySelector(".choice");
    el.style.visibility="visible";
    document.getElementById("startUp").style.visibility="hidden";
    el.innerHTML="";
        function eventStuff(){
        window.player.hand.push(new Card(cards[Number(this.dataset.card)],window.player,this))
        el.removeChild(this)
        document.querySelector(".hand#player").appendChild(this);
        this.removeEventListener("click", eventStuff)}
    for (let i=0; i<cards.length; i++){
    const card=document.createElement("div");
    card.classList.add("card");
    card.dataset.card=i;
    card.innerHTML="<p class=\"hp\">"+cards[i][2]+"hp</p><img src=\"Resources/"+cards[i][0]+"\"><br><p>"+cards[i][1]+"</p>";
    card.addEventListener("click", eventStuff);
    el.appendChild(card);
    const info=document.createElement("div");
    info.classList.add("info");
    card.insertBefore(info, card.lastElementChild);
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
        if (this.health<=0){
            if (this.player.hand.includes(this)){
            const index=this.player.hand.indexOf(this);
            this.player.hand.splice(index,1);
        }else{
            const index=this.player.out.indexOf(this);
            this.player.out.splice(index,1);

        }
        }
    }
    useMainAbility(target){this.mainAbility(target)};
    checkPassive(){if (this.trigger()&&this.passiveAbility){this.passiveAbility()}};
    useSpecialAbility(target){if (this.specialAbility){this.specialAbility(target)}};
    onceUsed(isSpecial){
        if (isSpecial){
            this.player.humes-=this.specialObj.specialHumeCost;
            this.specialObj.cooldown=this.specialObj.maxCooldown;
            this.setButton("button.specialAbility");
        }else{
            if (this.specialObj.used===true){
                this.player.humes-=this.specialObj.mainHumeCost;
            }
            if (this.player.humes<this.specialObj.mainHumeCost){
                this.setButton("button.mainAbility");
            }
            this.specialObj.used=true;
        }
        }
    newTurn(){
        if (this.specialObj.cooldown>0){this.specialObj.cooldown-=1};
        if (this.mainAbility){this.setButton("button.mainAbility"+this.name,false);
        if (this.specialAbility){
            if (this.specialObj.specialHumeCost<=this.player.humes && this.specialObj.cooldown===0){
                this.setButton("button.specialAbility")
            }
            }
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
    ["OhNineSix.jpeg",
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
    ["OneSevenThree.jpeg",
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