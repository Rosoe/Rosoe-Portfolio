class CombatSystem {
    constructor(gameState, ui, spellSystem) {
        this.state = gameState;
        this.ui = ui;
        this.spellSystem = spellSystem;
        this.mobAttackTimer = null;
    }

    startMobAttacks() {
        this.scheduleMobAttack();
    }

    stopMobAttacks() {
        if (this.mobAttackTimer) {
            clearTimeout(this.mobAttackTimer);
            this.mobAttackTimer = null;
        }
    }

    scheduleMobAttack() {
        if (!this.state.running) return;

        const attackInterval = CONFIG.mobAttackInterval * 
            (this.state.effects.slow.active ? (1 + this.state.effects.slow.value) : 1);

        this.mobAttackTimer = setTimeout(() => {
            this.executeMobAttack();
            this.scheduleMobAttack();
        }, attackInterval);
    }

    executeMobAttack() {
        if (!this.state.running) return;

        this.ui.startMobAttackAnimation();

        setTimeout(() => {
            // Check for paralysis
            if (this.state.effects.paralysis.active && 
                Math.random() < CONFIG.spells.jubaku.failChance) {
                this.ui.log('The enemy is paralysed.', this.state.time);
                this.ui.endMobAttackAnimation();
                return;
            }

            // Calculate evasion
            const baseEvadeChance = CONFIG.baseEvade + 
                (this.state.inventory.hairpin ? CONFIG.items.hairpin.evadeBonus : 0);
            const missChance = baseEvadeChance + 
                (this.state.effects.blind.active ? CONFIG.spells.kurayami.missBonus : 0);

            // Check for evade
            if (Math.random() < missChance) {
                this.state.addStat('evaded');
                this.handleSuccessfulAvoid('Attack evaded!');
                this.ui.endMobAttackAnimation();
                return;
            }

            // Check for shadow block
            if (this.state.shadows > 0) {
                this.state.removeShadow();
                this.state.addStat('blocked');
                this.handleSuccessfulAvoid('Attack blocked by shadow!');
            } else {
                this.handleHit();
            }

            this.ui.endMobAttackAnimation();
        }, 500);
    }

    handleSuccessfulAvoid(message) {
        this.state.resetHits();
        this.ui.resetDangerMeter();
        
        // Handle combo and rewards
        const currentMilestone = this.state.incrementCombo();
        
        if (currentMilestone >= CONFIG.comboMilestone && 
            currentMilestone > this.state.lastComboReward) {
            
            const gilEarned = currentMilestone;
            const shopJustUnlocked = this.state.addGil(gilEarned);
            this.state.lastComboReward = currentMilestone;
            
            this.ui.log(
                `<span class="gil-gain">${currentMilestone} Combo! Earned ${gilEarned} gil!</span>`, 
                this.state.time
            );
            
            if (shopJustUnlocked) {
                this.ui.showShop();
                this.ui.log('The Auction House has opened!', this.state.time);
            }
        }

        this.ui.log(message, this.state.time);
    }

    handleHit() {
        this.state.addStat('taken');
        this.state.resetCombo();
        const hits = this.state.incrementHits();
        
        this.ui.updateDangerMeter(hits);
        this.ui.showDamageFlash();
        this.ui.log('Hit taken!', this.state.time);

        // Interrupt any casting spells
        Object.entries(this.state.spells).forEach(([type, spell]) => {
            if (spell.casting) {
                this.spellSystem.interruptCast(type);
            }
        });

        if (hits >= CONFIG.dangerMeterMax) {
            this.state.running = false;
            this.ui.showGameOver(this.state.highestCombo);
        }
    }

    cancelShadows() {
        if (!this.state.running || !this.state.shadows) return;

        const clicks = this.state.incrementCancelClicks();
        const progress = (clicks / 3) * 100;
        this.ui.updateCancelProgress(progress);
        
        if (clicks === 3) {
            this.state.clearShadows();
            this.state.resetCancelClicks();
            this.ui.resetCancelProgress();
            this.ui.log('Shadows cancelled', this.state.time);
        }
    }
}
