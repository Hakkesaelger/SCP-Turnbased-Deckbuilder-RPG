import _ from "lodash";
const player={humes:10,hand:[],out:[]};
const opponent={humes:10,hand:[],out:[]};
const output=document.querySelector(".output");
class Card{
    constructor(image,name,health,mainAbility,passiveAbility,specialAbility,trigger,specialObj){
        this.image=image;
        this.name=name;
        this.health=health;
        this.mainAbility=mainAbility?.bind(this);
        this.passiveAbility=passiveAbility?.bind(this);
        this.specialAbility=specialAbility?.bind(this);
        this.trigger=trigger;
        this.specialObj=_.cloneDeep(specialObj);
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
    assignPlayer(player){this.player=player};
    useMainAbility(target,used){this.mainAbility(target,used)};
    checkPassive(){if (this.trigger&&this.passiveAbility){this.passiveAbility()}};
    useSpecialAbility(target){if (this.specialAbility){this.specialAbility(target)}};
}
const cards=[new Card("OhNineSix.jpeg","SCP-096",100,function main(target, used){
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
    if (0<this.specialObj.power && this.specialObj.power<4){
        this.specialObj.power-=1;
    } else if (this.specialObj.power===0){
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
}, true, {mainHumeCost:1,specialHumeCost:4, damage:5,power:4})];