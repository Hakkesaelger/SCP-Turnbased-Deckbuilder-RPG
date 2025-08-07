window.player={humes:10,hand:[],out:[]};
window.opponent={humes:10,hand:[],out:[]};
const output=document.querySelector(".output");
window.start=function(player){
    const el=document.querySelector(".choice");
    el.style.visibility="visible";
    document.querySelector(".startUp").style.visibility="hidden";
    el.innerHTML="";
    for (const i of cards){
    el.innerHTML+="<div class=\"card\"><img src=\"Resources/"+i[0]+"\"><br><p>"+i[1]+"</p></div>";
    }
}
class Card{
    constructor(info, player){
        this.image=info[0];
        this.name=info[1];
        this.health=info[2];
        this.mainAbility=info[3]?.bind(this);
        this.passiveAbility=info[4]?.bind(this);
        this.specialAbility=info[5]?.bind(this);
        this.trigger=info[6]?.bind(this);
        this.specialObj=_.cloneDeep(info[7]);
        this.buffsAndDebuffs=[];
        this.player=player;
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
            this.setButton("button.specialAbility."+this.name,true);
        }else{
            if (this.specialObj.used===true){
                this.player.humes-=this.specialObj.mainHumeCost;
            }
            if (this.player.humes<this.specialObj.mainHumeCost){
                this.setButton("button.mainAbility."+this.name,true);
            }
            this.specialObj.used=true;
        }
        }
    newTurn(){
        if (this.specialObj.cooldown>0){this.specialObj.cooldown-=1};
        if (this.mainAbility){this.setButton("button.mainAbility."+this.name,false);
        if (this.specialAbility){
            if (this.specialObj.specialHumeCost<=this.player.humes && this.specialObj.cooldown===0){
                this.setButton("button.specialAbility."+this.name,true)
            }
            }
        }
    this.checkPassive();
    this.checkBuffsAndDebuffs();
    }
    checkBuffsAndDebuffs(){
        for (let i = this.buffsAndDebuffs.length - 1; i >= 0; i--){
            if (this.buffsAndDebuffs[i][0]!==0){
                this.buffsAndDebuffs[i][0]-=1;
            }else{
                this.buffsAndDebuffs[i][1]();
                this.buffsAndDebuffs.splice(i,1);
            }
        }
    }
    setButton(button,set){document.querySelector(button).disabled=set}
}
const cards=[["OhNineSix.jpeg","SCP-096",100,function main(target){
        target.takeDamage(this.specialObj.damage);
        this.onceUsed(false);
}
,undefined
,function special(...args){
    this.specialObj.damage*=2;
        this.buffsAndDebuffs=[3,()=>this.specialObj.damage/=2];
    this.onceUsed(true);
}, undefined, {mainHumeCost:1,specialHumeCost:4, damage:5,cooldown:0,maxCooldown:5,used:false}],
["OneSevenThree.jpeg","SCP-173",80,function main(target){
        target.takeDamage(this.specialObj.damage);
        this.onceUsed(false);
    }, function blink(){this.setButton("button.mainAbility.SCP-173",true)},undefined,
    function trigger(){return Math.random()<0.2},{damage:30,used:false,mainHumeCost:5}]];