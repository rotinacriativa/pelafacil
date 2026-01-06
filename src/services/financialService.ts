import { supabase } from './supabase';
import { MatchExpense, MatchPayment } from '../types';

export const financialService = {
    /**
     * Get the expense for a match (Single expense for MVP)
     */
    async getExpense(matchId: string): Promise<MatchExpense | null> {
        const { data, error } = await supabase
            .from('match_expenses')
            .select('*')
            .eq('match_id', matchId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"
        return data;
    },

    /**
     * Create or Update the match expense
     */
    async upsertExpense(matchId: string, amount: number, userId: string): Promise<void> {
        // Check if exists
        const { data: existing } = await supabase
            .from('match_expenses')
            .select('id')
            .eq('match_id', matchId)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('match_expenses')
                .update({ total_amount: amount })
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('match_expenses')
                .insert({
                    match_id: matchId,
                    total_amount: amount,
                    created_by: userId,
                    description: 'Custo da Partida'
                });
            if (error) throw error;
        }
    },

    /**
     * Get all payments for a match
     */
    async getPayments(matchId: string): Promise<MatchPayment[]> {
        const { data, error } = await supabase
            .from('match_payments')
            .select(`
        *,
        profile:profiles(name, avatar_url, position)
      `)
            .eq('match_id', matchId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Toggle Payment Status (Admin only)
     */
    async togglePaymentStatus(paymentId: string, currentStatus: 'PENDING' | 'PAID'): Promise<void> {
        const newStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
        const paidAt = newStatus === 'PAID' ? new Date().toISOString() : null;

        const { error } = await supabase
            .from('match_payments')
            .update({ status: newStatus, paid_at: paidAt })
            .eq('id', paymentId);

        if (error) throw error;
    }
};
