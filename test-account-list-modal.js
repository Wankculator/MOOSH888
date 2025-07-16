// Comprehensive Test for AccountListModal
console.log('=== AccountListModal Functionality Test ===\n');

function testAccountListModal() {
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        errors: []
    };

    function test(name, testFn) {
        testResults.total++;
        try {
            const result = testFn();
            if (result) {
                console.log(`✅ ${name}`);
                testResults.passed++;
            } else {
                console.log(`❌ ${name}`);
                testResults.failed++;
                testResults.errors.push(name);
            }
        } catch (error) {
            console.log(`❌ ${name} - Error: ${error.message}`);
            testResults.failed++;
            testResults.errors.push(`${name}: ${error.message}`);
        }
    }

    console.log('1. Basic Modal Tests');
    test('AccountListModal class exists', () => window.AccountListModal !== undefined);
    test('Can instantiate AccountListModal', () => {
        if (!window.app) return false;
        const modal = new AccountListModal(window.app);
        return modal !== undefined;
    });

    console.log('\n2. Modal Structure Tests');
    test('Modal has show method', () => {
        return typeof AccountListModal.prototype.show === 'function';
    });
    test('Modal has close method', () => {
        return typeof AccountListModal.prototype.close === 'function';
    });
    test('Modal has createHeader method', () => {
        return typeof AccountListModal.prototype.createHeader === 'function';
    });
    test('Modal has createToolbar method', () => {
        return typeof AccountListModal.prototype.createToolbar === 'function';
    });
    test('Modal has createAccountGrid method', () => {
        return typeof AccountListModal.prototype.createAccountGrid === 'function';
    });
    test('Modal has filterAccounts method', () => {
        return typeof AccountListModal.prototype.filterAccounts === 'function';
    });
    test('Modal has sortAccounts method', () => {
        return typeof AccountListModal.prototype.sortAccounts === 'function';
    });

    console.log('\n3. Account Management Features');
    test('Modal has saveAccountName method', () => {
        return typeof AccountListModal.prototype.saveAccountName === 'function';
    });
    test('Modal has deleteAccount method', () => {
        return typeof AccountListModal.prototype.deleteAccount === 'function';
    });
    test('Modal has exportAccount method', () => {
        return typeof AccountListModal.prototype.exportAccount === 'function';
    });
    test('Modal has switchToAccount method', () => {
        return typeof AccountListModal.prototype.switchToAccount === 'function';
    });

    console.log('\n4. UI Integration Tests');
    test('Dashboard has showMultiAccountManager method', () => {
        return window.app && window.app.dashboard && 
               typeof window.app.dashboard.showMultiAccountManager === 'function';
    });
    test('Manage button exists in dashboard', () => {
        const buttons = document.querySelectorAll('.dashboard-btn');
        let hasManageButton = false;
        buttons.forEach(btn => {
            if (btn.textContent.includes('Manage')) {
                hasManageButton = true;
            }
        });
        return hasManageButton;
    });

    console.log('\n5. Functional Tests');
    test('Can open AccountListModal', () => {
        if (!window.app) return false;
        try {
            const modal = new AccountListModal(window.app);
            modal.show();
            const modalElement = document.querySelector('.account-list-modal');
            const result = modalElement !== null;
            modal.close();
            return result;
        } catch (e) {
            console.error('Error opening modal:', e);
            return false;
        }
    });

    test('Modal displays account count', () => {
        if (!window.app) return false;
        try {
            const modal = new AccountListModal(window.app);
            modal.show();
            const headerText = document.querySelector('.terminal-header span');
            const result = headerText && headerText.textContent.includes('account');
            modal.close();
            return result;
        } catch (e) {
            return false;
        }
    });

    test('Modal has search input', () => {
        if (!window.app) return false;
        try {
            const modal = new AccountListModal(window.app);
            modal.show();
            const searchInput = document.querySelector('.account-toolbar input[type="text"]');
            const result = searchInput !== null;
            modal.close();
            return result;
        } catch (e) {
            return false;
        }
    });

    test('Modal has sort dropdown', () => {
        if (!window.app) return false;
        try {
            const modal = new AccountListModal(window.app);
            modal.show();
            const sortSelect = document.querySelector('.account-toolbar select');
            const result = sortSelect !== null;
            modal.close();
            return result;
        } catch (e) {
            return false;
        }
    });

    test('Modal closes properly', () => {
        if (!window.app) return false;
        try {
            const modal = new AccountListModal(window.app);
            modal.show();
            modal.close();
            const modalElement = document.querySelector('.account-list-modal');
            return modalElement === null;
        } catch (e) {
            return false;
        }
    });

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    if (testResults.failed > 0) {
        console.log('\n⚠️  Failed Tests:');
        testResults.errors.forEach(error => {
            console.log(`- ${error}`);
        });
    }

    if (testResults.passed === testResults.total) {
        console.log('\n🎉 All tests passed! AccountListModal is functioning correctly.');
    }

    return testResults;
}

// Run tests after delay to ensure app is loaded
setTimeout(() => {
    console.log('Running AccountListModal tests...\n');
    const results = testAccountListModal();
    
    console.log('\n=== Recommendations ===');
    console.log('1. AccountListModal provides comprehensive account management');
    console.log('2. Features include search, sort, rename, delete, and export');
    console.log('3. Modal integrates with existing MultiAccountModal for create/import');
    console.log('4. Mobile-optimized with responsive grid layout');
    console.log('5. Accessible via "Manage" button or AccountSwitcher dropdown');
    
    if (results.failed === 0) {
        console.log('\n✅ AccountListModal is ready for production use!');
    } else {
        console.log('\n⚠️  Please fix the failed tests before proceeding.');
    }
}, 1000);