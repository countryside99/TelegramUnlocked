(function() {
    if (!window.location.hostname.includes("telegram.org")) return;

    let config = {
        bypassRestrictions: localStorage.getItem('tgu_bypassRestrictions') !== 'false',
        ghostMode: localStorage.getItem('tgu_ghostMode') !== 'false',
        blockTyping: localStorage.getItem('tgu_blockTyping') !== 'false'
    };
    
    if (config.bypassRestrictions) enableRestrictionsBypass();
    enableNetworkModifications();
    
    setInterval(injectFloatingTrigger, 1000);

    function enableRestrictionsBypass() {
        const events = ['contextmenu', 'copy', 'selectstart', 'dragstart'];
        events.forEach(ev => {
            document.addEventListener(ev, (e) => { e.stopImmediatePropagation(); }, true);
        });
    }

    function enableNetworkModifications() {
        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
            try {
                if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
                    const buffer = data instanceof ArrayBuffer ? data : data.buffer;
                    if (buffer.byteLength >= 4) {
                        const view = new DataView(buffer);
                        for (let i = 0; i <= buffer.byteLength - 4; i += 4) {
                            const constructorId = view.getUint32(i, true);
                            if (config.blockTyping && (constructorId === 0x19158c53 || constructorId === 0x59fd1e0b || constructorId === 0x9b5ae75c || constructorId === 0x01cb5c2a || constructorId === 0xb6634d00 || constructorId === 0x9a3e2a0f || constructorId === 0x0ec202cf)) {
                                return;
                            }
                            if (config.ghostMode && (constructorId === 0x4a449a3a || constructorId === 0x306ddc2c || constructorId === 0x0ec202cf || constructorId === 0x0e302525 || constructorId === 0xb304a623 || constructorId === 0x2f2f2121 || constructorId === 0x66617465)) {
                                return;
                            }
                        }
                    }
                }
            } catch (e) {}
            return originalSend.apply(this, arguments);
        };

        const preventTypingPropagation = function(e) {
            if (config.blockTyping) {
                const target = e.target;
                if (target && (target.classList.contains('input-message-input') || target.id === 'editable-message-text' || target.getAttribute('contenteditable') === 'true')) {
                    e.stopImmediatePropagation();
                }
            }
        };

        window.addEventListener('input', preventTypingPropagation, true);
        window.addEventListener('beforeinput', preventTypingPropagation, true);
        window.addEventListener('keydown', function(e) {
            if (config.blockTyping && (e.key === 'Backspace' || e.key === 'Delete')) {
                preventTypingPropagation(e);
            }
        }, true);

        const originalIntersectionObserver = window.IntersectionObserver;
        window.IntersectionObserver = function(callback, options) {
            const modifiedCallback = function(entries, observer) {
                if (config.ghostMode) {
                    const mockedEntries = entries.map(entry => {
                        return Object.create(Object.getPrototypeOf(entry), {
                            isIntersecting: { value: false },
                            intersectionRatio: { value: 0 },
                            target: { value: entry.target },
                            boundingClientRect: { value: entry.boundingClientRect },
                            intersectionRect: { value: entry.intersectionRect },
                            rootBounds: { value: entry.rootBounds },
                            time: { value: entry.time }
                        });
                    });
                    return callback(mockedEntries, observer);
                }
                return callback(entries, observer);
            };
            return new originalIntersectionObserver(modifiedCallback, options);
        };
        Object.assign(window.IntersectionObserver, originalIntersectionObserver);
    }

    function injectFloatingTrigger() {
        if (document.getElementById('tgu-floating-trigger')) return;

        const anchorTarget = document.body;
        if (!anchorTarget) return;

        const trigger = document.createElement('div');
        trigger.id = 'tgu-floating-trigger';
        trigger.innerHTML = 'MOD';
        anchorTarget.appendChild(trigger);

        trigger.addEventListener('click', openModPanel);
    }

    function openModPanel() {
        if (document.getElementById('tgu-options-popup')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'tgu-options-backdrop';
        backdrop.className = 'tgu-backdrop';

        const popup = document.createElement('div');
        popup.id = 'tgu-options-popup';
        popup.className = 'tgu-modal';
        
        popup.innerHTML = `
            <div class="tgu-modal-title">TelegramUnlocked</div>
            <div class="tgu-option">
                <span>Restrictions bypass</span>
                <label class="tgu-switch">
                    <input type="checkbox" id="tgu-bypass" ${config.bypassRestrictions ? 'checked' : ''}>
                    <span class="tgu-slider"></span>
                </label>
            </div>
            <div class="tgu-option">
                <span>Ghost Mode</span>
                <label class="tgu-switch">
                    <input type="checkbox" id="tgu-ghost" ${config.ghostMode ? 'checked' : ''}>
                    <span class="tgu-slider"></span>
                </label>
            </div>
            <div class="tgu-option">
                <span>Hide Typing Status</span>
                <label class="tgu-switch">
                    <input type="checkbox" id="tgu-typing" ${config.blockTyping ? 'checked' : ''}>
                    <span class="tgu-slider"></span>
                </label>
            </div>
            <button class="tgu-modal-btn" id="tgu-close-options">Save & Close</button>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(popup);

        document.getElementById('tgu-bypass').addEventListener('change', (e) => {
            config.bypassRestrictions = e.target.checked;
            localStorage.setItem('tgu_bypassRestrictions', e.target.checked);
        });
        document.getElementById('tgu-ghost').addEventListener('change', (e) => {
            config.ghostMode = e.target.checked;
            localStorage.setItem('tgu_ghostMode', e.target.checked);
        });
        document.getElementById('tgu-typing').addEventListener('change', (e) => {
            config.blockTyping = e.target.checked;
            localStorage.setItem('tgu_blockTyping', e.target.checked);
        });

        document.getElementById('tgu-close-options').addEventListener('click', () => {
            backdrop.remove();
            popup.remove();
        });
    }
})();
