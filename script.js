const player={humes:10,hand:[]};
const opponent={humes:10,hand:[]};
class Card{
    constructor(card, player){
        this.image=card.image
        this.name=card.name
        this.health=card.health;
        this.mainAbility=card.mainAbility;
        this.passiveAbility=card.passiveAbility;
        this.specialAbility=card.specialAbility;
        this.trigger=card.trigger
        this.player=player;
    }
    takeDamage(damage){
        this.health-=damage
        if (this.health<=0){
            const index=this.player.hand.indexOf(this);
            this.player.hand.splice(index,1)
        }
    }
    useMainAbility(target,used){this.mainAbility(target,used);}
    checkPassive(){if (this.trigger&&this.passiveAbility){this.passiveAbility()}}
    useSpecialAbility(target){if (this.specialAbility){this.specialAbility(target)};}
}