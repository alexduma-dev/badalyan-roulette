// GAME STATE
let state = {
    coins: 100,
    collectedCards: [], // Array of collected card IDs
    soundEnabled: false
};

// CARD DATA (14 Cards)
const CARDS = [
    // RARE (3 cards, sell: 2 coins)
    {
        id: 1,
        name: "Чистые трусы",
        rarity: "rare",
        rarityText: "Редкий",
        image: "assets/clean_boxers.jpg",
        sellValue: 2
    },
    {
        id: 2,
        name: "Трусы с шоколадной пастой",
        rarity: "rare",
        rarityText: "Редкий",
        image: "assets/chocolate_boxers.jpg",
        sellValue: 2
    },
    {
        id: 3,
        name: "Семейники в цветочек",
        rarity: "rare",
        rarityText: "Редкий",
        image: "assets/flower_boxers.jpg",
        sellValue: 2
    },

    // SUPER RARE (2 cards, sell: 5 coins)
    {
        id: 4,
        name: "Вонючие трусы с газами вокруг",
        rarity: "super-rare",
        rarityText: "Сверхредкий",
        image: "assets/smelly_boxers.jpg",
        sellValue: 5
    },
    {
        id: 5,
        name: "Дырявые трусы с начесом",
        rarity: "super-rare",
        rarityText: "Сверхредкий",
        image: "assets/holey_boxers.jpg",
        sellValue: 5
    },

    // EPIC (2 cards, sell: 8 coins)
    {
        id: 6,
        name: "Скинни джинсы из ЦУМа",
        rarity: "epic",
        rarityText: "Эпик",
        image: "assets/tsum_skinny.jpg",
        sellValue: 8
    },
    {
        id: 7,
        name: "Стринги с леопардовым принтом",
        rarity: "epic",
        rarityText: "Эпик",
        image: "assets/leopard_thong.jpg",
        sellValue: 8
    },

    // MYTHIC (3 cards, sell: 10 coins)
    {
        id: 8,
        name: "Трусы с картой мира",
        rarity: "mythic",
        rarityText: "Мифик",
        image: "assets/world_map.jpg",
        sellValue: 10
    },
    {
        id: 9,
        name: "Трусы с автографом Рафаэля",
        rarity: "mythic",
        rarityText: "Мифик",
        image: "assets/rafael_autograph.jpg",
        sellValue: 10
    },
    {
        id: 10,
        name: "Боксеры с неоновой подсветкой",
        rarity: "mythic",
        rarityText: "Мифик",
        image: "assets/neon_boxers.jpg",
        sellValue: 10
    },

    // LEGENDARY (3 cards, sell: 15 coins)
    {
        id: 11,
        name: "Золотые трусы рафаэля",
        rarity: "legendary",
        rarityText: "Легенда",
        image: "assets/golden_boxers.jpg",
        sellValue: 15
    },
    {
        id: 12,
        name: "Трусы с зубами бабушки рафаэля",
        rarity: "legendary",
        rarityText: "Легенда",
        image: "assets/teeth_boxers.jpg",
        sellValue: 15
    },
    {
        id: 13,
        name: "Вреж",
        rarity: "legendary",
        rarityText: "Легенда",
        image: "assets/vrej_dad.jpg",
        sellValue: 15
    },

    // ULTRA LEGENDARY (1 card, sell: 100 coins)
    {
        id: 14,
        name: "Мишенька в подгузнике",
        rarity: "ultra-legendary",
        rarityText: "Ультра Лега",
        image: "assets/mishenka_target.jpg",
        sellValue: 100
    }
];

// GACHA PROBABILITIES (Must sum to 1)
const RATES = {
    ordinary: {
        "rare": 0.50,
        "super-rare": 0.25,
        "epic": 0.14,
        "mythic": 0.07,
        "legendary": 0.035,
        "ultra-legendary": 0.005
    },
    lucky: {
        "rare": 0.15,
        "super-rare": 0.25,
        "epic": 0.25,
        "mythic": 0.20,
        "legendary": 0.12,
        "ultra-legendary": 0.03
    }
};

// AUDIO SYNTHESIZER (Web Audio API)
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

const SoundFX = {
    playClick() {
        if (!state.soundEnabled) return;
        try {
            initAudio();
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.08);
            
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch(e) { console.log(e); }
    },
    
    playShake() {
        if (!state.soundEnabled) return;
        try {
            initAudio();
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.25);
            
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } catch(e) { console.log(e); }
    },
    
    playFlash() {
        if (!state.soundEnabled) return;
        try {
            initAudio();
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.4);
            
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        } catch(e) { console.log(e); }
    },
    
    playFanfare(isLegendary) {
        if (!state.soundEnabled) return;
        try {
            initAudio();
            const now = audioCtx.currentTime;
            
            if (isLegendary) {
                // Majestic legendary fanfare arpeggio
                const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
                notes.forEach((freq, idx) => {
                    let osc = audioCtx.createOscillator();
                    let gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                    
                    // Add some vibrato
                    let lfo = audioCtx.createOscillator();
                    let lfoGain = audioCtx.createGain();
                    lfo.frequency.setValueAtTime(12, now);
                    lfoGain.gain.setValueAtTime(8, now);
                    lfo.connect(lfoGain);
                    lfoGain.connect(osc.frequency);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
                    
                    lfo.start(now + idx * 0.12);
                    osc.start(now + idx * 0.12);
                    
                    lfo.stop(now + 1.6);
                    osc.stop(now + 1.6);
                });
            } else {
                // Short happy ordinary fanfare
                const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
                notes.forEach((freq, idx) => {
                    let osc = audioCtx.createOscillator();
                    let gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    
                    osc.start(now + idx * 0.08);
                    osc.stop(now + 0.6);
                });
            }
        } catch(e) { console.log(e); }
    }
};

// DOM ELEMENTS (Unconditional)
const coinsCountEl = document.getElementById("coins-count");
const autoclickerBtn = document.getElementById("autoclicker-btn");
const clickerCooldownEl = document.getElementById("clicker-cooldown");
const cooldownTimerEl = document.getElementById("cooldown-timer");
const soundToggleBtn = document.getElementById("sound-toggle-btn");

// PAGE-SPECIFIC DOM ELEMENTS

// 1. Gacha page elements (if they exist)
const rollOrdinaryBtn = document.getElementById("roll-ordinary-btn");
const rollLuckyBtn = document.getElementById("roll-lucky-btn");
const ratesAccordionBtn = document.getElementById("rates-accordion-btn");
const ratesAccordionContent = document.getElementById("rates-accordion-content");
const openingOverlay = document.getElementById("opening-overlay");
const animatingBox = document.getElementById("animating-box");
const flashEffect = document.getElementById("flash-effect");
const cardRevealContainer = document.getElementById("card-reveal-container");
const revealedCardWrapper = document.getElementById("revealed-card-wrapper");
const revealCardTitle = document.getElementById("reveal-card-title");
const revealCardRarity = document.getElementById("reveal-card-rarity");
const revealDuplicateNotice = document.getElementById("reveal-duplicate-notice");
const soldCoinsCountEl = document.getElementById("sold-coins-count");
const claimBtn = document.getElementById("claim-btn");

// 2. Inventory page elements (if they exist)
const inventoryGridEl = document.getElementById("inventory-grid");
const collectedCountEl = document.getElementById("collected-count");
const inventoryProgressFill = document.getElementById("inventory-progress-fill");
const zoomOverlay = document.getElementById("zoom-overlay");
const zoomedCardWrapper = document.getElementById("zoomed-card-wrapper");
const zoomCloseBtn = document.getElementById("zoom-close-btn");

// LOCAL STORAGE INTEGRATION
function loadGame() {
    const savedCoins = localStorage.getItem("badalyan_coins");
    const savedCards = localStorage.getItem("badalyan_cards");
    const savedSound = localStorage.getItem("badalyan_sound");

    if (savedCoins !== null) {
        state.coins = parseInt(savedCoins);
    }
    
    // Safety check parsing localStorage
    state.collectedCards = [];
    if (savedCards !== null) {
        try {
            state.collectedCards = JSON.parse(savedCards);
        } catch(e) {
            state.collectedCards = [];
        }
    }
    
    // CRITICAL BUGFIX: Ensure collectedCards is always a valid Array
    if (!Array.isArray(state.collectedCards)) {
        state.collectedCards = [];
    }
    
    if (savedSound !== null) {
        state.soundEnabled = savedSound === "true";
    }
    
    updateUI();
    
    // Render inventory if we are on the inventory page
    if (inventoryGridEl) {
        renderInventory();
    }
    
    updateSoundButton();
}

function saveGame() {
    localStorage.setItem("badalyan_coins", state.coins);
    localStorage.setItem("badalyan_cards", JSON.stringify(state.collectedCards));
    localStorage.setItem("badalyan_sound", state.soundEnabled);
}

// UI RENDERING
function updateUI() {
    if (coinsCountEl) {
        coinsCountEl.textContent = state.coins;
    }
    
    // Disable chest buttons if on gacha page and not enough coins
    if (rollOrdinaryBtn) {
        rollOrdinaryBtn.disabled = state.coins < 10;
    }
    if (rollLuckyBtn) {
        rollLuckyBtn.disabled = state.coins < 50;
    }
    
    // Update progress numbers if on inventory page
    if (collectedCountEl && inventoryProgressFill) {
        const count = Array.isArray(state.collectedCards) ? state.collectedCards.length : 0;
        collectedCountEl.textContent = count;
        const progressPercent = (count / CARDS.length) * 100;
        inventoryProgressFill.style.width = `${progressPercent}%`;
    }
}

function updateSoundButton() {
    if (soundToggleBtn) {
        if (state.soundEnabled) {
            soundToggleBtn.textContent = "🔊 Звук: ВКЛ (Синтезатор)";
            soundToggleBtn.classList.add("enabled");
        } else {
            soundToggleBtn.textContent = "🔇 Звук: ВЫКЛ";
            soundToggleBtn.classList.remove("enabled");
        }
    }
}

function renderInventory() {
    if (!inventoryGridEl) return;
    inventoryGridEl.innerHTML = "";
    
    CARDS.forEach(card => {
        const isOwned = Array.isArray(state.collectedCards) && state.collectedCards.includes(card.id);
        
        const cardEl = document.createElement("div");
        cardEl.className = `game-card ${isOwned ? card.rarity : 'locked'}`;
        cardEl.id = `inv-card-${card.id}`;
        
        let cardHTML = `
            <span class="card-rarity-tag">${card.rarityText}</span>
            <div class="card-img-container">
                <img src="${card.image}" alt="${card.name}" class="card-art">
            </div>
            <div class="card-name">${card.name}</div>
            <div class="card-coins-val">
                <span>Дубликат:</span>
                <span>🪙 ${card.sellValue}</span>
            </div>
        `;
        
        cardEl.innerHTML = cardHTML;
        
        // Add zoom popup trigger for unlocked cards
        if (isOwned) {
            cardEl.addEventListener("click", () => {
                openZoomModal(card);
            });
        }
        
        inventoryGridEl.appendChild(cardEl);
    });
}

// ZOOM MODAL LOGIC
function openZoomModal(card) {
    if (!zoomOverlay || !zoomedCardWrapper) return;
    
    initAudio();
    SoundFX.playClick();
    
    zoomedCardWrapper.innerHTML = "";
    
    const zoomedCard = document.createElement("div");
    zoomedCard.className = `game-card ${card.rarity}`;
    zoomedCard.innerHTML = `
        <span class="card-rarity-tag">${card.rarityText}</span>
        <div class="card-img-container">
            <img src="${card.image}" alt="${card.name}" class="card-art">
        </div>
        <div class="card-name">${card.name}</div>
        <div class="card-coins-val">
            <span>Дубликат:</span>
            <span>🪙 ${card.sellValue}</span>
        </div>
    `;
    
    zoomedCardWrapper.appendChild(zoomedCard);
    zoomOverlay.classList.remove("hidden");
}

if (zoomCloseBtn && zoomOverlay) {
    zoomCloseBtn.addEventListener("click", () => {
        initAudio();
        SoundFX.playClick();
        zoomOverlay.classList.add("hidden");
    });
    
    // Close zoom overlay by clicking background
    zoomOverlay.addEventListener("click", (e) => {
        if (e.target === zoomOverlay) {
            initAudio();
            SoundFX.playClick();
            zoomOverlay.classList.add("hidden");
        }
    });
}

// AUTOCLICKER ACTION (No Cooldown!)
if (autoclickerBtn) {
    autoclickerBtn.addEventListener("click", () => {
        initAudio();
        SoundFX.playClick();
        
        // Add coins
        state.coins += 5;
        updateUI();
        saveGame();
    });
}

// SOUND TOGGLE ACTION
if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;
        if (state.soundEnabled) {
            initAudio();
            SoundFX.playClick();
        }
        updateSoundButton();
        saveGame();
    });
}

// ACCORDION DROPDOWN TOGGLE
if (ratesAccordionBtn && ratesAccordionContent) {
    ratesAccordionBtn.addEventListener("click", () => {
        ratesAccordionBtn.classList.toggle("active");
        ratesAccordionContent.classList.toggle("show");
    });
}

// RNG ALGORITHM
function rollGacha(chestType) {
    const rates = RATES[chestType];
    const rand = Math.random();
    let cumulative = 0;
    let selectedRarity = "rare";
    
    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (rand < cumulative) {
            selectedRarity = rarity;
            break;
        }
    }
    
    // Filter cards by selected rarity
    const matchingCards = CARDS.filter(card => card.rarity === selectedRarity);
    // Return a random card from matching cards
    const randomCard = matchingCards[Math.floor(Math.random() * matchingCards.length)];
    return randomCard;
}

// ROLL / OPENING FLOW
function openChest(chestType) {
    const cost = chestType === 'ordinary' ? 10 : 50;
    if (state.coins < cost) {
        return;
    }
    
    initAudio();
    
    // Deduct coins
    state.coins -= cost;
    updateUI();
    saveGame();
    
    // Setup vector cardboard box styling in opening modal
    const boxLabel = animatingBox.querySelector(".box-label");
    const animatingBoxWrapper = animatingBox.parentElement;
    animatingBoxWrapper.style.display = "flex"; // Ensure visible at start
    
    if (chestType === 'lucky') {
        animatingBox.classList.remove("normal-box");
        animatingBox.classList.add("lucky-box");
        boxLabel.textContent = "🍀";
        animatingBoxWrapper.classList.add('lucky-bg');
    } else {
        animatingBox.classList.remove("lucky-box");
        animatingBox.classList.add("normal-box");
        boxLabel.textContent = "📦";
        animatingBoxWrapper.classList.remove('lucky-bg');
    }
    
    animatingBox.classList.remove("hide");
    cardRevealContainer.classList.add("hidden");
    revealDuplicateNotice.classList.add("hidden");
    flashEffect.classList.remove("flash");
    
    // Show overlay
    openingOverlay.classList.remove("hidden");
    
    // Step 1: Shake animation and sound (shakes for ~0.8s)
    animatingBox.classList.add("shake");
    
    // Shake sound loops or triggers twice
    SoundFX.playShake();
    setTimeout(() => {
        SoundFX.playShake();
    }, 300);
    
    // Step 2: Stop shake, trigger bright full-screen flash (0.5s duration)
    setTimeout(() => {
        animatingBox.classList.remove("shake");
        animatingBox.classList.add("hide");
        animatingBoxWrapper.style.display = "none"; // Hide wrapper (removes background)
        
        flashEffect.classList.add("flash");
        SoundFX.playFlash();
    }, 800);
    
    // Step 3: Flash clears, reveal the card
    setTimeout(() => {
        // Determine rolled card
        const card = rollGacha(chestType);
        const isDuplicate = Array.isArray(state.collectedCards) && state.collectedCards.includes(card.id);
        
        // Update state based on duplicate or new card
        if (isDuplicate) {
            state.coins += card.sellValue;
            // Show duplicate text
            revealDuplicateNotice.classList.remove("hidden");
            soldCoinsCountEl.textContent = card.sellValue;
        } else {
            state.collectedCards.push(card.id);
            revealDuplicateNotice.classList.add("hidden");
        }
        
        // Save and update GUI behind modal
        saveGame();
        updateUI();
        
        // Render card preview in modal
        revealedCardWrapper.innerHTML = "";
        const revealedCard = document.createElement("div");
        revealedCard.className = `game-card ${card.rarity}`;
        
        revealedCard.innerHTML = `
            <span class="card-rarity-tag">${card.rarityText}</span>
            <div class="card-img-container">
                <img src="${card.image}" alt="${card.name}" class="card-art">
            </div>
            <div class="card-name">${card.name}</div>
            <div class="card-coins-val">
                <span>Дубликат:</span>
                <span>🪙 ${card.sellValue}</span>
            </div>
        `;
        revealedCardWrapper.appendChild(revealedCard);
        
        // Rarity text style
        if (revealCardTitle) revealCardTitle.textContent = card.name;
        if (revealCardRarity) {
            revealCardRarity.textContent = card.rarityText;
            revealCardRarity.className = `rarity-text ${card.rarity}-text`;
        }
        
        // Play fanfare sound based on rarity
        const isLeg = card.rarity === 'legendary' || card.rarity === 'ultra-legendary';
        SoundFX.playFanfare(isLeg);
        
        // Display card reveal block
        cardRevealContainer.classList.remove("hidden");
        
    }, 1300); // 0.8s shake + 0.5s flash
}

// ATTACH ROLL EVENTS
if (rollOrdinaryBtn) {
    rollOrdinaryBtn.addEventListener("click", () => openChest("ordinary"));
}
if (rollLuckyBtn) {
    rollLuckyBtn.addEventListener("click", () => openChest("lucky"));
}

// CLAIM CARD (CLOSE OVERLAY)
if (claimBtn && openingOverlay) {
    claimBtn.addEventListener("click", () => {
        SoundFX.playClick();
        openingOverlay.classList.add("hidden");
    });
}

// START THE GAME
loadGame();
