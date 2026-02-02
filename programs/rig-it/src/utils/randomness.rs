use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;
use anchor_lang::solana_program::sysvar::slot_hashes::SlotHashes;

use crate::state::RIGS_PER_EXPLORATION;

/// Generate commit hash from secret and target slot
pub fn generate_commit_hash(secret: &[u8; 32], target_slot: u64) -> [u8; 32] {
    let mut data = Vec::with_capacity(40);
    data.extend_from_slice(secret);
    data.extend_from_slice(&target_slot.to_le_bytes());
    hash(&data).to_bytes()
}

/// Verify reveal matches commit
pub fn verify_reveal(secret: &[u8; 32], target_slot: u64, commit_hash: &[u8; 32]) -> bool {
    let computed = generate_commit_hash(secret, target_slot);
    computed == *commit_hash
}

/// Generate final random value from secret and slot hash
pub fn generate_random_value(secret: &[u8; 32], slot_hash: &[u8; 32]) -> [u8; 32] {
    let mut data = Vec::with_capacity(64);
    data.extend_from_slice(secret);
    data.extend_from_slice(slot_hash);
    hash(&data).to_bytes()
}

/// Get slot hash from SlotHashes sysvar
/// Note: SlotHashes only stores the last 512 slots
pub fn get_slot_hash(slot_hashes_data: &[u8], target_slot: u64) -> Option<[u8; 32]> {
    // SlotHashes is a vector of (Slot, Hash) tuples
    // Format: length (8 bytes) + repeated (slot: 8 bytes, hash: 32 bytes)
    
    if slot_hashes_data.len() < 8 {
        return None;
    }
    
    let len = u64::from_le_bytes(slot_hashes_data[0..8].try_into().ok()?) as usize;
    let entry_size = 8 + 32; // slot (u64) + hash ([u8; 32])
    
    let mut offset = 8;
    for _ in 0..len {
        if offset + entry_size > slot_hashes_data.len() {
            break;
        }
        
        let slot = u64::from_le_bytes(
            slot_hashes_data[offset..offset + 8].try_into().ok()?
        );
        
        if slot == target_slot {
            let hash_start = offset + 8;
            let hash_bytes: [u8; 32] = slot_hashes_data[hash_start..hash_start + 32]
                .try_into()
                .ok()?;
            return Some(hash_bytes);
        }
        
        offset += entry_size;
    }
    
    None
}

/// Select winning rig based on random value and ticket distribution
/// Returns rig index (0-35)
pub fn select_winning_rig(
    random_value: &[u8; 32],
    rig_tickets: &[u128; RIGS_PER_EXPLORATION],
) -> Option<u8> {
    // Calculate total tickets
    let total_tickets: u128 = rig_tickets.iter().sum();
    
    if total_tickets == 0 {
        return None;
    }
    
    // Convert random bytes to u128 (take first 16 bytes)
    let random_u128 = u128::from_le_bytes(random_value[0..16].try_into().unwrap());
    
    // Get winning ticket number (modulo total)
    let winning_ticket = random_u128 % total_tickets;
    
    // Find which rig contains this ticket
    let mut cumulative: u128 = 0;
    for (i, tickets) in rig_tickets.iter().enumerate() {
        cumulative = cumulative.saturating_add(*tickets);
        if winning_ticket < cumulative {
            return Some(i as u8);
        }
    }
    
    // Fallback to last rig (should never happen if tickets > 0)
    Some((RIGS_PER_EXPLORATION - 1) as u8)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_commit_reveal_cycle() {
        let secret = [42u8; 32];
        let target_slot = 12345u64;
        
        let commit_hash = generate_commit_hash(&secret, target_slot);
        assert!(verify_reveal(&secret, target_slot, &commit_hash));
        
        // Wrong secret should fail
        let wrong_secret = [43u8; 32];
        assert!(!verify_reveal(&wrong_secret, target_slot, &commit_hash));
        
        // Wrong slot should fail
        assert!(!verify_reveal(&secret, target_slot + 1, &commit_hash));
    }

    #[test]
    fn test_winning_rig_selection() {
        let mut rig_tickets = [0u128; 36];
        rig_tickets[0] = 100;
        rig_tickets[1] = 200;
        rig_tickets[2] = 300;
        // Total: 600
        
        // Random value that maps to ticket 50 should select rig 0
        let mut random = [0u8; 32];
        random[0] = 50; // Will give small number mod 600
        let winner = select_winning_rig(&random, &rig_tickets);
        assert!(winner.is_some());
        
        // All zeros should return None
        let empty_tickets = [0u128; 36];
        assert!(select_winning_rig(&random, &empty_tickets).is_none());
    }
}
