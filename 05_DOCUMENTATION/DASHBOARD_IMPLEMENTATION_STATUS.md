# 📊 MOOSH WALLET DASHBOARD - DETAILED IMPLEMENTATION PLAN v4.0

## 🎯 **PROJECT GOAL**
Rebuild a professional, feature-rich wallet dashboard inside `server.js` by enhancing the `openWalletDashboard` function. The implementation will be based on a detailed analysis of the `REFERENCE BUILD THAT WAS BROKEN.html` file, porting its advanced features into the existing JavaScript-driven server architecture.

---

## 🔬 **ANALYSIS COMPLETE**
- [x] **Reference HTML Analysis**: Full review of `REFERENCE BUILD THAT WAS BROKEN.html` (10,000+ lines) is complete.
- [x] **Feature Set Identified**: All major features, including multi-account management, Ordinals gallery, live data APIs, and security protocols have been documented.
- [x] **Architecture Understood**: Confirmed that all HTML, CSS, and JS will be generated via template literals within a single function in `server.js`.
- [x] **Existing `server.js` Preserved**: Plan ensures that no part of the existing, working wallet generation flow is modified.

---

## 🏗️ **STEP-BY-STEP IMPLEMENTATION ROADMAP**

### **Phase 1: Foundation & Dashboard Shell (ETA: 20-30 minutes)**
-   [ ] **Enhance `openWalletDashboard`**: Replace placeholder with a function that renders the basic dashboard HTML structure (container, header, content areas).
-   [ ] **Integrate Core CSS**: Migrate essential CSS (color variables, typography, layout) from the reference file into the function's template literal.
-   [ ] **Add "Back to Wallet" Button**: Implement a clear and functional button to return to the original wallet generation pages, preserving existing flows.

### **Phase 2: Professional Header & Status (ETA: 30-45 minutes)**
-   [ ] **Implement Dashboard Header**: Create the terminal-style header `<Moosh_Spark_Wallet_Dashboard />` with a blinking cursor.
-   [ ] **Add Header Action Buttons**: Implement placeholders for `+ Accounts`, `Refresh`, and `Hide/Show Balance` buttons.
-   [ ] **Create Status Banner**: Add the "Spark Protocol Active" banner beneath the header.

### **Phase 3: Balance Display & Wallet Selection (ETA: 45-60 minutes)**
-   [ ] **Build Balance Card Grid**: Create the static HTML and CSS for the 5-card layout (Bitcoin, Lightning, Stablecoins, Ordinals, Network).
-   [ ] **Implement Wallet Type Selector**: Add the `<select>` dropdown for `Taproot`, `SegWit`, `Legacy`, and `Spark` wallet types.
-   [ ] **Implement Conditional Ordinals Logic**: Add the JavaScript logic to dynamically show or hide the "Ordinals" balance card based on the wallet type selection (visible only for Taproot).

### **Phase 4: Core Actions & Initial Modals (ETA: 60-90 minutes)**
-   [ ] **Implement Quick Action Buttons**: Style and add the primary "Send," "Receive," "Swap," and "Settings" buttons.
-   [ ] **Build "Receive" Modal**: Create the full HTML, CSS, and JS for the "Receive Payment" modal. This includes the QR code generation canvas and logic for both on-chain and Lightning.
-   [ ] **Build "Send" Modal**: Create the "Send Payment" modal with fields for recipient, amount, and fee selection, and a transaction preview area.

### **Phase 5: Advanced Features & Live Data (ETA: 90-120 minutes)**
-   [ ] **Transaction History Modal**: Build the modal UI. Implement the `fetch` logic to call a public blockchain API (e.g., Blockstream) and populate the history.
-   [ ] **Token Menu Modal**: Build the comprehensive token menu UI. Implement `fetch` to call the CoinGecko API for live price data.
-   [ ] **Secure Wallet Settings Modal**:
    -   [ ] Build the password verification modal that must be passed first.
    -   [ ] Build the main settings modal to display the seed phrase and private keys.

### **Phase 6: Multi-Account Management (ETA: 60-90 minutes)**
-   [ ] **Implement Account State Management**: Add JavaScript logic to create and manage an array of wallet accounts in memory.
-   [ ] **Create Account Management UI**: Build the modal for adding, renaming, and switching between accounts.
-   [ ] **Implement Account Switching Logic**: Connect the UI to a function that can change the active wallet, re-rendering the dashboard with the selected account's data.

### **Phase 7: Final Polish & Integration (ETA: 30 minutes)**
-   [ ] **Review and Refine**: Thoroughly test all UI elements, buttons, and modals for correct functionality and styling.
-   [ ] **Ensure Seamless Flow**: Verify that the dashboard integrates perfectly with the original wallet creation pages via the "Back to Wallet" button.
-   [ ] **Code Cleanup**: Format and comment the new functions within `server.js` for clarity.

---

## 🚨 **CRITICAL REQUIREMENTS**
- **Surgical Implementation**: ONLY the `openWalletDashboard` function in `server.js` will be modified. All other functions will remain untouched.
- **No New Files**: The entire dashboard will be built within the existing `server.js` file.
- **Preserve Existing UI**: The original wallet creation, import, and confirmation flows must remain 100% functional.
- **Follow Build Rules**: All development must adhere to the `ENHANCED_BUILD_RULES_v5.md`.

**Implementation Status: READY FOR PHASE 1**
**Next Action: Begin implementation of the Dashboard Foundation & Shell.**

*Dashboard Implementation Status - Updated: January 4, 2025*
