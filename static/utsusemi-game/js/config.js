const CONFIG = {
    spells: {
        ichi: { 
            castTime: 4000, 
            cooldown: 30000, 
            shadows: 3 
        },
        ni: { 
            castTime: 1500, 
            cooldown: 40000, 
            shadows: 4 
        },
        san: { 
            castTime: 500, 
            cooldown: 60000, 
            shadows: 5 
        },
        kurayami: { 
            castTime: 4000, 
            cooldown: 30000, 
            duration: 60000, 
            missBonus: 0.15 
        },
        hojo: { 
            castTime: 4000, 
            cooldown: 30000, 
            shortDuration: 30000, 
            longDuration: 60000, 
            speedPenalty: 0.15 
        },
        jubaku: { 
            castTime: 4000, 
            cooldown: 30000, 
            shortDuration: 30000, 
            longDuration: 60000, 
            failChance: 0.20 
        }
    },
    baseEvade: 0.05,
    mobAttackInterval: 3750,
    unlockThreshold: 20,
    hojoThreshold: 29,
    speedReduction: 0.06,
    dangerMeterMax: 5,
    comboMilestone: 10,
    shopUnlockGil: 10,
    items: {
        hairpin: {
            cost: 40,
            evadeBonus: 0.10
        },
        belt: {
            cost: 80,
            speedReduction: 0.06
        },
        san: {
            cost: 140
        }
    }
};
