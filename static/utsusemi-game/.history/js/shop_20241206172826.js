class ShopSystem {
    constructor(gameState, ui) {
        this.state = gameState;
        this.ui = ui;
    }

    buyItem(item, cost) {
        // Validate item exists in config
        if (!CONFIG.items[item]) {
            console.error(`Invalid item: ${item}`);
            return false;
        }

        // Attempt purchase
        if (this.state.purchaseItem(item)) {
            let effectMessage = '';
            
            // Add item-specific effects message
            switch(item) {
                case 'hairpin':
                    effectMessage = ` (+${CONFIG.items.hairpin.evadeBonus * 100}% Evasion)`;
                    break;
                case 'belt':
                    effectMessage = ` (-${CONFIG.items.belt.speedReduction * 100}% Cast/Recast)`;
                    break;
            }
            
            // Update UI
            this.ui.updateShopItem(item, true);
            
            // Show newly unlocked spells
            if (item === 'san') {
                this.ui.unlockSpell('sanBtn');
            }
            
            // Log purchase
            this.ui.log(
                `${item === 'san' ? 'Learned' : 'Equipped'} ${item}${effectMessage} for ${cost} gil!`, 
                this.state.time
            );
            
            return true;
        }
        
        return false;
    }

    reset() {
        // Reset all shop items to unpurchased state
        Object.keys(CONFIG.items).forEach(item => {
            this.ui.updateShopItem(item, false);
        });
    }
}
