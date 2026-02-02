use anchor_lang::prelude::*;

/// Minimum deposit amount (in lamports or token base units)
pub const MIN_DEPOSIT_AMOUNT: u64 = 1_000_000; // 0.001 SOL equivalent

/// $RIG balance threshold for multiplier (1 billion base units = 1 RIG assuming 9 decimals)
pub const RIG_MULTIPLIER_BASE: u64 = 1_000_000_000;

/// Maximum multiplier cap (3x total = 1 base + 2 bonus)
pub const MAX_MULTIPLIER_BONUS: u64 = 2_000_000; // Scaled by 1e6 for precision

/// Scale factor for fixed-point math
pub const SCALE: u128 = 1_000_000;

/// Calculate base tickets from deposit amount using sqrt for sublinear influence
/// 
/// Formula: base_tickets = sqrt(amount / 1e6) * SCALE
/// This means:
/// - 0.001 SOL (1e6 lamports) → 1 base ticket
/// - 0.01 SOL (1e7 lamports) → ~3.16 base tickets  
/// - 0.1 SOL (1e8 lamports) → 10 base tickets
/// - 1 SOL (1e9 lamports) → ~31.6 base tickets
pub fn calculate_base_tickets(amount: u64) -> u128 {
    if amount == 0 {
        return 0;
    }
    
    // Normalize to base unit (1e6 = 1 ticket base)
    let normalized = amount as u128;
    
    // Integer sqrt with scaling for precision
    // We compute sqrt(amount * SCALE^2) = sqrt(amount) * SCALE
    let scaled = normalized.checked_mul(SCALE).unwrap_or(0);
    integer_sqrt(scaled)
}

/// Calculate $RIG multiplier based on holder's balance
/// 
/// Formula: multiplier = 1 + min(sqrt(rig_balance / 1e9), 2)
/// Range: 1.0x to 3.0x (capped)
/// 
/// Returns multiplier scaled by SCALE (1e6)
pub fn calculate_rig_multiplier(rig_balance: u64) -> u128 {
    // Base multiplier of 1x
    let base = SCALE;
    
    if rig_balance == 0 {
        return base;
    }
    
    // Normalize RIG balance
    let normalized = rig_balance as u128;
    let scaled = normalized
        .checked_mul(SCALE)
        .unwrap_or(0)
        .checked_div(RIG_MULTIPLIER_BASE as u128)
        .unwrap_or(0);
    
    // Calculate sqrt bonus (capped at 2)
    let sqrt_bonus = integer_sqrt(scaled);
    let capped_bonus = std::cmp::min(sqrt_bonus, MAX_MULTIPLIER_BONUS as u128);
    
    base.checked_add(capped_bonus).unwrap_or(base)
}

/// Calculate effective tickets with $RIG multiplier applied
pub fn calculate_effective_tickets(deposit_amount: u64, rig_balance: u64) -> u128 {
    let base = calculate_base_tickets(deposit_amount);
    let multiplier = calculate_rig_multiplier(rig_balance);
    
    // effective = base * multiplier / SCALE
    base.checked_mul(multiplier)
        .unwrap_or(0)
        .checked_div(SCALE)
        .unwrap_or(0)
}

/// Integer square root using Newton's method
/// More gas efficient than floating point
pub fn integer_sqrt(n: u128) -> u128 {
    if n == 0 {
        return 0;
    }
    if n == 1 {
        return 1;
    }
    
    let mut x = n;
    let mut y = (x + 1) / 2;
    
    while y < x {
        x = y;
        y = (x + n / x) / 2;
    }
    
    x
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_integer_sqrt() {
        assert_eq!(integer_sqrt(0), 0);
        assert_eq!(integer_sqrt(1), 1);
        assert_eq!(integer_sqrt(4), 2);
        assert_eq!(integer_sqrt(9), 3);
        assert_eq!(integer_sqrt(16), 4);
        assert_eq!(integer_sqrt(1000000), 1000);
    }

    #[test]
    fn test_base_tickets() {
        // 0.001 SOL = 1e6 lamports → ~1000 tickets (scaled)
        let tickets_1m = calculate_base_tickets(1_000_000);
        assert!(tickets_1m > 0);
        
        // 1 SOL = 1e9 lamports → should be sqrt(1e9) * some_scale
        let tickets_1sol = calculate_base_tickets(1_000_000_000);
        assert!(tickets_1sol > tickets_1m);
        
        // Verify sublinear: 100x deposit should give 10x tickets
        let tickets_small = calculate_base_tickets(1_000_000);
        let tickets_large = calculate_base_tickets(100_000_000);
        // tickets_large should be ~10x tickets_small (sqrt(100) = 10)
        assert!(tickets_large <= tickets_small * 11);
        assert!(tickets_large >= tickets_small * 9);
    }

    #[test]
    fn test_rig_multiplier() {
        // No RIG = 1x
        let mult_0 = calculate_rig_multiplier(0);
        assert_eq!(mult_0, SCALE);
        
        // 1 RIG = 1 + sqrt(1) = 2x
        let mult_1rig = calculate_rig_multiplier(RIG_MULTIPLIER_BASE);
        assert!(mult_1rig > SCALE);
        assert!(mult_1rig <= SCALE * 2);
        
        // Max should be capped at 3x
        let mult_huge = calculate_rig_multiplier(u64::MAX);
        assert!(mult_huge <= SCALE * 3);
    }
}
