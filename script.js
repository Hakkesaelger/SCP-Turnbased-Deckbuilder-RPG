window.player={humes:10,hand:[],out:[]};
window.opponent={humes:10,hand:[],out:[]};
const output=document.querySelector(".output");
window.start=function(player){
    const el=document.querySelector(".choice");
    el.style.visibility="visible";
    document.querySelector(".startUp").style.visibility="hidden";
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
    useMainAbility(target,used){this.mainAbility(target,used)};
    checkPassive(){if (this.trigger&&this.passiveAbility){this.passiveAbility()}};
    useSpecialAbility(target){if (this.specialAbility){this.specialAbility(target)}};
}
const cards=[["OhNineSix.jpeg","SCP-096",100,function main(target, used){
    if (used){
        if (!(this.specialObj.mainHumeCost<=this.player.humes)){
            output.innerHTML="Not enough humes";
        }else{
            this.player.humes-=this.specialObj.mainHumeCost;
            target.takeDamage(this.specialObj.damage);
        }
        }else{target.takeDamage(this.specialObj.damage);
        }

    }
,function returnFromRage(){
    if (0<this.specialObj.power){
        this.specialObj.power-=1;
    } else{
        this.specialObj.damage/=2;
        this.specialObj.power=4;
    }
}
,function special(target){
    if (!(this.specialObj.specialHumeCost<=this.player.humes)){
        output.innerHTML="Not enough humes";
    }else if (this.specialObj.power===4){
        output.innerHTML="Can't rage while raging";
    }else{this.specialObj.damage*=2;
        this.specialObj.power=3;
    }
}, function trigger(){return this.specialObj.power<4}, {mainHumeCost:1,specialHumeCost:4, damage:5,power:4}]];