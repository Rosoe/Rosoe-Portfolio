class SpellSystem {
    constructor(gameState, ui) {
        this.state = gameState;
        this.ui = ui;
        this.activeTimers = new Map();
    }

    cast(type) {
        if (!this.state.running) return false;
        
        // Reset cancel progress when casting
        this.state.resetCancelClicks();
        this.ui.resetCancelProgress();

        // Check if any spell is already casting or this spell is on cooldown
        if (this.state.isSpellCasting() || this.state.isSpellOnCooldown(type)) {
            return false;
        }

        const spellConfig = CONFIG.spells[type];
        const castTime = spellConfig.castTime * (this.state.inventory.belt ? (1 - CONFIG.speedReduction) : 1);

        // Start casting
        this.state.addSpellState(type, {
            casting: true,
            castStart: performance.now()
        });

        this.ui.updateSpellButton(type, { casting: true });
        this.ui.log(`Casting ${type}`, this.state.time);

        // Set up cast completion timer
        const timerId = setTimeout(() => {
            if (!this.state.running || !this.state.spells[type].casting) return;
            
            this.completeCast(type);
            this.startCooldown(type);
        }, castTime);

        this.activeTimers.set(`cast_${type}`, timerId);
        return true;
    }

    completeCast(type) {
        const spellConfig = CONFIG.spells[type];

        switch(type) {
            case 'kurayami':
                this.state.addEffect('blind', spellConfig.duration);
                this.ui.log('Enemy blinded!', this.state.time);
                break;
                
            case 'hojo':
                const duration = Math.random() < 0.75 ? spellConfig.longDuration : spellConfig.shortDuration;
                this.state.addEffect('slow', duration);
                this.ui.log('Enemy slowed!', this.state.time);
                break;
                
            case 'jubaku':
                if (!this.state.effects.paralysis.active) {
                    const duration = Math.random() < 0.75 ? spellConfig.longDuration : spellConfig.shortDuration;
                    this.state.addEffect('paralysis', duration);
                    this.ui.log('Enemy paralyzed!', this.state.time);
                } else {
                    this.ui.log('Enemy is already paralyzed!', this.state.time);
                }
                break;
                
            default: // Shadow spells
                if (this.state.canOverwriteShadows(type)) {
                    this.state.updateShadows(spellConfig.shadows, type);
                    this.ui.log(`Gained ${spellConfig.shadows} shadows`, this.state.time);
                } else {
                    this.ui.log(`Cannot overwrite ${this.state.shadowType} shadows`, this.state.time);
                }
                break;
        }
    }

    startCooldown(type) {
        const spellConfig = CONFIG.spells[type];
        const cooldownTime = spellConfig.cooldown * (this.state.inventory.belt ? (1 - CONFIG.speedReduction) : 1);

        this.state.addSpellState(type, {
            onCooldown: true,
            cooldownStart: Date.now()
        });

        this.ui.updateSpellButton(type, { casting: false, onCooldown: true });

        const updateCooldown = () => {
            if (!this.state.running) return;
            
            const remaining = Math.ceil((cooldownTime - 
                (Date.now() - this.state.spells[type].cooldownStart)) / 1000);
            
            this.ui.updateCooldownOverlay(type, remaining);

            if (remaining > 0) {
                requestAnimationFrame(updateCooldown);
            } else {
                this.state.clearSpellState(type);
                this.ui.updateSpellButton(type, { onCooldown: false });
                this.ui.updateCooldownOverlay(type, 0);
            }
        };

        updateCooldown();
    }

    interruptCast(type) {
        const spell = this.state.spells[type];
        if (!spell.casting) return;

        // Clear the cast completion timer
        clearTimeout(this.activeTimers.get(`cast_${type}`));
        this.activeTimers.delete(`cast_${type}`);

        const remainingTime = CONFIG.spells[type].castTime - 
            (performance.now() - spell.castStart) + 100;

        this.ui.updateSpellButton(type, { casting: false });
        this.ui.log(`${type} cast interrupted!`, this.state.time);

        // Start lockout period
        this.state.addSpellState(type, {
            onCooldown: true,
            cooldownStart: Date.now(),
            lockoutTime: remainingTime
        });

        const updateLockout = () => {
            if (!this.state.running) return;
            
            const remaining = Math.ceil((remainingTime - 
                (Date.now() - this.state.spells[type].cooldownStart)) / 1000);
            
            this.ui.updateCooldownOverlay(type, remaining);

            if (remaining > 0) {
                requestAnimationFrame(updateLockout);
            } else {
                this.state.clearSpellState(type);
                this.ui.updateSpellButton(type, { onCooldown: false });
                this.ui.updateCooldownOverlay(type, 0);
            }
        };

        updateLockout();
    }

    updateCastBars(timestamp) {
        Object.entries(this.state.spells).forEach(([type, spell]) => {
            if (spell.casting) {
                const progress = ((timestamp - spell.castStart) / CONFIG.spells[type].castTime) * 100;
                this.ui.updateCastBar(type, progress);
            }
        });
    }

    clearAllTimers() {
        this.activeTimers.forEach(timerId => clearTimeout(timerId));
        this.activeTimers.clear();
    }
}
