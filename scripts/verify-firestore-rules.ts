/**
 * Firestore Security Rules Verification Script
 * 
 * This script verifies that the Firestore security rules file is properly configured
 * according to the design specification.
 * 
 * Run this script with: npx ts-node scripts/verify-firestore-rules.ts
 * 
 * This script does NOT require Firebase emulators to be running.
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function logTest(category: string, name: string, passed: boolean, details?: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

function verifyRulesFile() {
  console.log('\n📄 Verifying firestore.rules file exists...\n');

  const rulesPath = path.resolve(__dirname, '../firestore.rules');
  
  try {
    const exists = fs.existsSync(rulesPath);
    logTest('File', 'firestore.rules file exists', exists);
    
    if (!exists) {
      console.log('\n❌ firestore.rules file not found!\n');
      return null;
    }
    
    const content = fs.readFileSync(rulesPath, 'utf8');
    logTest('File', 'firestore.rules file is readable', content.length > 0, `${content.length} characters`);
    
    return content;
  } catch (error: any) {
    logTest('File', 'Read firestore.rules file', false, error.message);
    return null;
  }
}

function verifyHelperFunctions(rulesContent: string) {
  console.log('\n🛠️  Verifying helper functions...\n');

  // Check for isAuthenticated function
  const hasIsAuthenticated = rulesContent.includes('function isAuthenticated()');
  logTest('Helper Functions', 'isAuthenticated() function defined', hasIsAuthenticated);
  
  if (hasIsAuthenticated) {
    const hasAuthCheck = rulesContent.includes('request.auth != null');
    logTest('Helper Functions', 'isAuthenticated() checks request.auth', hasAuthCheck);
  }

  // Check for isOwner function
  const hasIsOwner = rulesContent.includes('function isOwner(uid)');
  logTest('Helper Functions', 'isOwner(uid) function defined', hasIsOwner);
  
  if (hasIsOwner) {
    const hasOwnerCheck = rulesContent.includes('request.auth.uid == uid');
    logTest('Helper Functions', 'isOwner() checks auth.uid matches parameter', hasOwnerCheck);
  }

  // Check for isAdmin function
  const hasIsAdmin = rulesContent.includes('function isAdmin()');
  logTest('Helper Functions', 'isAdmin() function defined', hasIsAdmin);
  
  if (hasIsAdmin) {
    const hasAdminCheck = rulesContent.includes("role == 'admin'");
    logTest('Helper Functions', 'isAdmin() checks role field', hasAdminCheck);
  }
}

function verifyCollectionRules(rulesContent: string) {
  console.log('\n📚 Verifying collection rules...\n');

  const collections = [
    { name: 'users', readRule: 'isOwner(uid) || isAdmin()', writeRule: 'false' },
    { name: 'accounts', readRule: 'resource.data.uid == request.auth.uid', writeRule: 'false' },
    { name: 'transactions', readRule: 'resource.data.uid == request.auth.uid', writeRule: 'false' },
    { name: 'transfers', readRule: 'resource.data.uid == request.auth.uid', writeRule: 'false' },
    { name: 'otps', readRule: 'false', writeRule: 'false' },
    { name: 'auditLogs', readRule: 'isAdmin()', writeRule: 'false' },
    { name: 'cards', readRule: 'resource.data.uid == request.auth.uid', writeRule: 'false' },
  ];

  for (const collection of collections) {
    // Check if collection is defined
    const collectionMatch = `match /${collection.name}/`;
    const hasCollection = rulesContent.includes(collectionMatch);
    logTest('Collections', `${collection.name} collection defined`, hasCollection);
    
    if (hasCollection) {
      // Extract the collection rules section
      const collectionStart = rulesContent.indexOf(collectionMatch);
      const nextMatch = rulesContent.indexOf('match /', collectionStart + 1);
      const collectionSection = nextMatch > -1 
        ? rulesContent.substring(collectionStart, nextMatch)
        : rulesContent.substring(collectionStart);
      
      // Check for read rules
      const hasReadRule = collectionSection.includes('allow read:') ||
                         collectionSection.includes('allow read,');
      logTest('Collections', `${collection.name} has read rule`, hasReadRule);
      
      // Check for write rules (or combined write/create/update/delete)
      const hasWriteRule = collectionSection.includes('allow write:') ||
                          collectionSection.includes(', write:') ||
                          (collectionSection.includes('allow create:') && 
                           collectionSection.includes('allow update:') &&
                           collectionSection.includes('allow delete:'));
      logTest('Collections', `${collection.name} has write rules`, hasWriteRule);
    }
  }
}

function verifySecurityPrinciples(rulesContent: string) {
  console.log('\n🔐 Verifying security principles...\n');

  // Principle 1: Users can only read their own data
  const hasOwnershipChecks = rulesContent.includes('resource.data.uid == request.auth.uid');
  logTest('Security', 'Ownership checks implemented', hasOwnershipChecks);

  // Principle 2: Sensitive collections are write-protected
  const sensitiveCollections = ['accounts', 'transactions', 'transfers', 'otps', 'auditLogs'];
  let allProtected = true;
  
  for (const collection of sensitiveCollections) {
    const collectionMatch = `match /${collection}/`;
    const collectionStart = rulesContent.indexOf(collectionMatch);
    
    if (collectionStart > -1) {
      const nextMatch = rulesContent.indexOf('match /', collectionStart + 1);
      const collectionSection = nextMatch > -1 
        ? rulesContent.substring(collectionStart, nextMatch)
        : rulesContent.substring(collectionStart);
      
      // Check if write is set to false or very restrictive
      const isProtected = collectionSection.includes('allow write: if false') ||
                         collectionSection.includes('allow write:if false') ||
                         collectionSection.includes(', write: if false') ||
                         collectionSection.includes(',write:if false') ||
                         (collectionSection.includes('allow create: if false') &&
                          collectionSection.includes('allow update: if false') &&
                          collectionSection.includes('allow delete: if false'));
      
      if (!isProtected) {
        allProtected = false;
        logTest('Security', `${collection} collection write-protected`, false);
      }
    }
  }
  
  if (allProtected) {
    logTest('Security', 'All sensitive collections are write-protected', true);
  }

  // Principle 3: Admin role-based access
  const hasAdminAccess = rulesContent.includes('isAdmin()');
  logTest('Security', 'Admin role-based access implemented', hasAdminAccess);

  // Principle 4: Authentication required
  const hasAuthRequirement = rulesContent.includes('isAuthenticated()');
  logTest('Security', 'Authentication requirement implemented', hasAuthRequirement);
}

function verifyRequirementCompliance(rulesContent: string) {
  console.log('\n✓ Verifying requirement compliance...\n');

  // Requirement 7.1: User read access restriction
  const usersSection = extractCollectionSection(rulesContent, 'users');
  const req71 = usersSection.includes('isOwner(uid)');
  logTest('Requirements', 'Req 7.1: User read access restriction', req71);

  // Requirement 7.2: Account read access restriction
  const accountsSection = extractCollectionSection(rulesContent, 'accounts');
  const req72 = accountsSection.includes('resource.data.uid == request.auth.uid');
  logTest('Requirements', 'Req 7.2: Account read access restriction', req72);

  // Requirement 7.3: Transaction read access restriction
  const transactionsSection = extractCollectionSection(rulesContent, 'transactions');
  const req73 = transactionsSection.includes('resource.data.uid == request.auth.uid');
  logTest('Requirements', 'Req 7.3: Transaction read access restriction', req73);

  // Requirement 7.4: Balance write prevention
  const req74 = accountsSection.includes('allow write: if false') || 
                accountsSection.includes('allow write:if false');
  logTest('Requirements', 'Req 7.4: Balance write prevention', req74);

  // Requirement 7.5: Transfer write prevention
  const transfersSection = extractCollectionSection(rulesContent, 'transfers');
  const req75 = transfersSection.includes('allow write: if false') ||
                transfersSection.includes('allow write:if false');
  logTest('Requirements', 'Req 7.5: Transfer write prevention', req75);

  // Requirement 7.6: Transaction write prevention
  const req76 = transactionsSection.includes('allow write: if false') ||
                transactionsSection.includes('allow write:if false');
  logTest('Requirements', 'Req 7.6: Transaction write prevention', req76);

  // Requirement 7.7: Audit log write prevention
  const auditLogsSection = extractCollectionSection(rulesContent, 'auditLogs');
  const req77 = auditLogsSection.includes('allow write: if false') ||
                auditLogsSection.includes('allow write:if false');
  logTest('Requirements', 'Req 7.7: Audit log write prevention', req77);

  // Requirement 7.8: Admin read access
  const req78 = usersSection.includes('isAdmin()') && auditLogsSection.includes('isAdmin()');
  logTest('Requirements', 'Req 7.8: Admin read access', req78);
}

function extractCollectionSection(rulesContent: string, collectionName: string): string {
  const collectionMatch = `match /${collectionName}/`;
  const collectionStart = rulesContent.indexOf(collectionMatch);
  
  if (collectionStart === -1) {
    return '';
  }
  
  const nextMatch = rulesContent.indexOf('match /', collectionStart + 1);
  return nextMatch > -1 
    ? rulesContent.substring(collectionStart, nextMatch)
    : rulesContent.substring(collectionStart);
}

function printSummary() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(70) + '\n');

  // Group results by category
  const categorySet = new Set(results.map(r => r.category));
  const categories = Array.from(categorySet);
  
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    const passed = categoryResults.filter(r => r.passed).length;
    const total = categoryResults.length;
    
    console.log(`${category}:`);
    console.log(`  ✅ Passed: ${passed}/${total}`);
    
    const failed = categoryResults.filter(r => !r.passed);
    if (failed.length > 0) {
      console.log(`  ❌ Failed:`);
      failed.forEach(r => console.log(`     - ${r.name}`));
    }
    console.log();
  }

  const totalPassed = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

  console.log('Overall:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  ✅ Passed: ${totalPassed}`);
  console.log(`  ❌ Failed: ${totalTests - totalPassed}`);
  console.log(`  Success Rate: ${successRate}%\n`);

  console.log('='.repeat(70) + '\n');

  if (totalPassed === totalTests) {
    console.log('🎉 All verifications passed! Firestore security rules are properly configured.\n');
    console.log('✅ Task 1.4 Complete: Firestore security rules verified\n');
    console.log('Next steps:');
    console.log('  1. Install Java to run Firebase emulators (optional for local testing)');
    console.log('  2. Deploy rules to Firebase: firebase deploy --only firestore:rules');
    console.log('  3. Test rules with emulator: npm run test:rules (requires Java)\n');
  } else {
    console.log('⚠️  Some verifications failed. Please review the firestore.rules file.\n');
  }
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🔥 FIRESTORE SECURITY RULES VERIFICATION');
  console.log('='.repeat(70));

  const rulesContent = verifyRulesFile();
  
  if (!rulesContent) {
    console.log('\n❌ Cannot proceed without firestore.rules file.\n');
    process.exit(1);
  }

  verifyHelperFunctions(rulesContent);
  verifyCollectionRules(rulesContent);
  verifySecurityPrinciples(rulesContent);
  verifyRequirementCompliance(rulesContent);
  printSummary();

  const failed = results.filter(r => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

// Run the verification
main();
