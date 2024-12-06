class GameUI {
    constructor() {
        this.elements = {};
        this.initializeElements();
    }

    initializeElements() {
        // Cache DOM elements
        ['player', 'mob', 'status', 'log', 'gameOver', 'auctionHouse'].forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
        
        this.elements.buttons = {
            cancel: document.getElementById('cancelBtn')
        };
        
        this.elements.dangerFill = document.querySelector('.danger-fill');
        this.elements.dangerText = document.querySelector('.danger-text');
        
        // Cache spell buttons
        document.querySelectorAll('[data-spell]').forEach(btn => {
            this.elements.buttons[btn.dataset.spell] = btn;
        });
    }

    updateShadowDisplay(shadows) {
        this.elements.player.innerHTML = Array(shadows)
            .fill()
            .map((_, i) => `<div class="shadow" style="animation-delay:${i * 0.2}s"></div>`)
            .join('');
    }

    updateCancelButton(hasShadows) {
        this.elements.buttons.cancel.style.opacity = hasShadows ? '1' : '0.5';
        this.elements.buttons.cancel.style.cursor = hasShadows ? 'pointer' : 'not-allowed';
    }

    updateStatusDisplay(state) {
        this.elements.status.innerHTML = `
            <div>Shadows: ${state.shadows}</div>
            <div>Time: ${state.time.toFixed(1)}s</div>
            <div>Gil: ${state.gil}</div>
            <div>Combo: ${state.currentCombo}</div>
            <div>Highest: ${state.highestCombo}</div>
            <div>Hits Taken: ${state.stats.taken}</div>
        `;
    }

    updateDangerMeter(hits) {
        const dangerPercent = (hits / CONFIG.dangerMeterMax) * 100;
        this.elements.dangerFill.style.width = `${dangerPercent}%`;
        this.elements.dangerText.textContent = `Danger Meter: ${hits}/${CONFIG.dangerMeterMax}`;
    }

    resetDangerMeter() {
        this.elements.dangerFill.style.width = '0%';
        this.elements.dangerText.textContent = `Danger Meter: 0/${CONFIG.dangerMeterMax}`;
    }

    showGameOver(score) {
        document.getElementById('finalScore').textContent = score;
        this.elements.gameOver.style.display = 'flex';
    }

    hideGameOver() {
        this.elements.gameOver.style.display = 'none';
    }

    showShop() {
        this.elements.auctionHouse.style.display = 'block';
    }

    hideShop() {
        this.elements.auctionHouse.style.display = 'none';
    }

    updateSpellButton(type, state) {
        const btn = this.elements.buttons[type];
        if (!btn) return;

        if (state.casting) {
            btn.classList.add('casting');
        } else {
            btn.classList.remove('casting');
        }

        if (state.onCooldown) {
            btn.classList.add('on-cooldown');
        } else {
            btn.classList.remove('on-cooldown');
        }
    }

    updateCastBar(type, progress) {
        const btn = this.elements.buttons[type];
        if (!btn) return;
        btn.querySelector('.cast-progress').style.width = `${Math.min(progress, 100)}%`;
    }

    updateCooldownOverlay(type, remaining) {
        const btn = this.elements.buttons[type];
        if (!btn) return;
        const overlay = btn.querySelector('.cooldown-overlay');
        
        if (remaining > 0) {
            overlay.style.display = 'flex';
            overlay.textContent = remaining;
        } else {
            overlay.style.display = 'none';
        }
    }

    startMobAttackAnimation() {
        this.elements.mob.classList.add('attacking');
    }

    endMobAttackAnimation() {
        this.elements.mob.classList.remove('attacking');
    }

    showDamageFlash() {
        const battleScene = document.querySelector('.battle-scene');
        battleScene.style.animation = 'none';
        battleScene.offsetHeight; // Trigger reflow
        battleScene.style.animation = 'damageFlash 0.4s';
    }

    updateCancelProgress(progress) {
        this.elements.buttons.cancel.querySelector('.cast-progress').style.width = `${progress}%`;
    }

    resetCancelProgress() {
        this.elements.buttons.cancel.querySelector('.cast-progress').style.width = '0%';
    }

    unlockSpell(spellId) {
        const btn = document.getElementById(spellId);
        if (btn) {
            btn.style.display = 'block';
        }
    }

    updateShopItem(item, purchased) {
        const button = document.querySelector(`button[onclick="game.buyItem('${item}', ${CONFIG.items[item].cost})"]`);
        if (button) {
            button.disabled = purchased;
            button.textContent = purchased ? (item === 'san' ? 'Learned' : 'Equipped') : `Buy - ${CONFIG.items[item].cost} gil`;
        }
    }

    log(message, time) {
        this.elements.log.innerHTML = `[${time.toFixed(1)}s] ${message}<br>${this.elements.log.innerHTML}`;
    }
}
