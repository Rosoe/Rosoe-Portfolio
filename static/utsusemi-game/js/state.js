class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.cancelClicks = 0;
        this.running = false;
        this.time = 0;
        this.shadows = 0;
        this.shadowType = '-';
        this.gil = 0;
        this.currentCombo = 0;
        this.highestCombo = 0;
        this.lastComboReward = 0;
        this.consecutiveHits = 0;
        this.shopUnlocked = false;
        
        this.inventory = {
            hairpin: false,
            belt: false,
            san: false
        };
        
        this.stats = { 
            blocked: 0, 
            evaded: 0, 
            taken: 0 
        };
        
        this.spells = { 
            ichi: {}, 
            ni: {}, 
            kurayami: {}, 
            hojo: {}, 
            jubaku: {} 
        };
        
        this.effects = {
            blind: { 
                active: false, 
                endTime: 0 
            },
            slow: { 
                active: false, 
                endTime: 0, 
                value: 0 
            },
            paralysis: { 
                active: false, 
                endTime: 0 
            }
        };
    }

    incrementCancelClicks() {
        this.cancelClicks++;
        return this.cancelClicks;
    }

    resetCancelClicks() {
        this.cancelClicks = 0;
    }

    addGil(amount) {
        this.gil += amount;
        if (!this.shopUnlocked && this.gil >= CONFIG.shopUnlockGil) {
            this.shopUnlocked = true;
            return true; // Indicates shop was just unlocked
        }
        return false;
    }

    incrementCombo() {
        this.currentCombo++;
        if (this.currentCombo > this.highestCombo) {
            this.highestCombo = this.currentCombo;
        }
        return Math.floor(this.currentCombo / CONFIG.comboMilestone) * CONFIG.comboMilestone;
    }

    resetCombo() {
        this.currentCombo = 0;
        this.lastComboReward = 0;
    }

    updateShadows(amount, type) {
        this.shadows = amount;
        this.shadowType = type;
    }

    canOverwriteShadows(newType) {
        if (this.shadows === 0) return true;
        if (this.shadowType === 'san') return newType === 'san';
        if (this.shadowType === 'ni') return newType === 'san';
        return true;
    }

    removeShadow() {
        if (this.shadows > 0) {
            this.shadows--;
            return true;
        }
        return false;
    }

    clearShadows() {
        this.shadows = 0;
        this.shadowType = '-';
    }

    addSpellState(type, state) {
        this.spells[type] = state;
    }

    clearSpellState(type) {
        this.spells[type] = {};
    }

    isSpellCasting() {
        return Object.values(this.spells).some(spell => spell.casting);
    }

    isSpellOnCooldown(type) {
        return this.spells[type].onCooldown;
    }

    addEffect(type, duration) {
        this.effects[type] = {
            active: true,
            endTime: Date.now() + duration
        };
        if (type === 'slow') {
            this.effects.slow.value = CONFIG.spells.hojo.speedPenalty;
        }
    }

    checkEffects() {
        Object.entries(this.effects).forEach(([effect, state]) => {
            if (state.active && Date.now() > state.endTime) {
                state.active = false;
                if (effect === 'slow') {
                    state.value = 0;
                }
            }
        });
    }

    incrementHits() {
        this.consecutiveHits++;
        return this.consecutiveHits;
    }

    resetHits() {
        this.consecutiveHits = 0;
    }

    addStat(type) {
        this.stats[type]++;
    }

    purchaseItem(item) {
        if (this.gil >= CONFIG.items[item].cost && !this.inventory[item]) {
            this.gil -= CONFIG.items[item].cost;
            this.inventory[item] = true;
            return true;
        }
        return false;
    }
}
