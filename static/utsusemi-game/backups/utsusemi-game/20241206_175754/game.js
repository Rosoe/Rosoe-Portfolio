class Game {
    constructor() {
        // Initialize core systems
        this.state = new GameState();
        this.ui = new GameUI();
        this.spells = new SpellSystem(this.state, this.ui);
        this.combat = new CombatSystem(this.state, this.ui, this.spells);
        this.shop = new ShopSystem(this.state, this.ui);

        this.lastFrame = null;
        this.startTime = null;

        // Bind event handlers
        this.bindEvents();
    }

    bindEvents() {
        // Bind spell buttons
        document.querySelectorAll('[data-spell]').forEach(btn => {
            btn.addEventListener('click', () => this.castSpell(btn.dataset.spell));
        });

        // Bind cancel shadows button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (!this.state.running) this.start();
            this.combat.cancelShadows();
        });
    }

    start() {
        if (!this.state.running) {
            this.state.running = true;
            this.lastFrame = performance.now();
            requestAnimationFrame(this.gameLoop.bind(this));
            this.combat.startMobAttacks();
        }
    }

    gameLoop(timestamp) {
        if (!this.state.running) return;

        // Initialize start time on first frame
        if (!this.startTime) this.startTime = timestamp;
        this.state.time = (timestamp - this.startTime) / 1000;

        // Check status effects
        this.state.checkEffects();

        // Check for spell unlocks based on total avoided attacks
        const totalAvoided = this.state.stats.blocked + this.state.stats.evaded;
        
        ['kurayami', 'hojo', 'jubaku'].forEach(spell => {
            const threshold = spell === 'kurayami' ? CONFIG.unlockThreshold : 
                            spell === 'hojo' ? CONFIG.hojoThreshold : 70;
            
            if (totalAvoided >= threshold) {
                const btnId = `${spell}Btn`;
                this.ui.unlockSpell(btnId);
            }
        });

        // Update spell cast bars
        this.spells.updateCastBars(timestamp);

        // Update UI
        this.updateUI();

        // Continue game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    castSpell(type) {
        if (!this.state.running) this.start();
        this.spells.cast(type);
    }

    buyItem(item, cost) {
        return this.shop.buyItem(item, cost);
    }

    updateUI() {
        this.ui.updateShadowDisplay(this.state.shadows);
        this.ui.updateCancelButton(this.state.shadows > 0);
        this.ui.updateStatusDisplay(this.state);
    }

    restart() {
        // Stop all systems
        this.combat.stopMobAttacks();
        this.spells.clearAllTimers();

        // Reset state
        this.state.reset();
        this.startTime = null;

        // Reset UI
        this.ui.hideGameOver();
        this.ui.hideShop();
        this.ui.resetDangerMeter();
        this.shop.reset();

        // Reset unlockable buttons display
        ['sanBtn', 'kurayamiBtn', 'hojoBtn', 'jubakuBtn'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });

        // Update UI with reset state
        this.updateUI();
        this.ui.log('Game restarted! Cast a spell to begin!', 0);
    }
}

// Initialize game
const game = new Game();
