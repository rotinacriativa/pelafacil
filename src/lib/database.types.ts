export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            financial_records: {
                Row: {
                    amount: number
                    created_at: string | null
                    description: string
                    group_id: string | null
                    id: string
                    match_id: string | null
                    type: string
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    description: string
                    group_id?: string | null
                    id?: string
                    match_id?: string | null
                    type: string
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    description?: string
                    group_id?: string | null
                    id?: string
                    match_id?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "financial_records_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "financial_records_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                ]
            }
            group_members: {
                Row: {
                    group_id: string
                    joined_at: string | null
                    position: string | null
                    rating: number | null
                    role: string | null
                    user_id: string
                }
                Insert: {
                    group_id: string
                    joined_at?: string | null
                    position?: string | null
                    rating?: number | null
                    role?: string | null
                    user_id: string
                }
                Update: {
                    group_id?: string
                    joined_at?: string | null
                    position?: string | null
                    rating?: number | null
                    role?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "group_members_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "group_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            groups: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    invite_code: string | null
                    location: string | null
                    name: string
                    owner_id: string
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    invite_code?: string | null
                    location?: string | null
                    name: string
                    owner_id: string
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    invite_code?: string | null
                    location?: string | null
                    name?: string
                    owner_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "groups_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            match_expenses: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    id: string
                    match_id: string | null
                    total_amount: number
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    match_id?: string | null
                    total_amount?: number
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    match_id?: string | null
                    total_amount?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "match_expenses_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "match_expenses_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: true
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                ]
            }
            match_payments: {
                Row: {
                    amount: number
                    id: string
                    match_id: string | null
                    paid_at: string | null
                    player_id: string | null
                    status: string | null
                }
                Insert: {
                    amount?: number
                    id?: string
                    match_id?: string | null
                    paid_at?: string | null
                    player_id?: string | null
                    status?: string | null
                }
                Update: {
                    amount?: number
                    id?: string
                    match_id?: string | null
                    paid_at?: string | null
                    player_id?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "match_payments_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "match_payments_player_id_fkey"
                        columns: ["player_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            match_players: {
                Row: {
                    created_at: string | null
                    is_paid: boolean | null
                    match_id: string
                    status: string | null
                    team: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    is_paid?: boolean | null
                    match_id: string
                    status?: string | null
                    team?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    is_paid?: boolean | null
                    match_id?: string
                    status?: string | null
                    team?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "match_players_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "match_players_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            match_stats: {
                Row: {
                    assists: number | null
                    goals: number | null
                    id: string
                    match_id: string | null
                    mvp: boolean | null
                    rating: number | null
                    user_id: string | null
                }
                Insert: {
                    assists?: number | null
                    goals?: number | null
                    id?: string
                    match_id?: string | null
                    mvp?: boolean | null
                    rating?: number | null
                    user_id?: string | null
                }
                Update: {
                    assists?: number | null
                    goals?: number | null
                    id?: string
                    match_id?: string | null
                    mvp?: boolean | null
                    rating?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "match_stats_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "match_stats_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            match_team_players: {
                Row: {
                    created_at: string | null
                    id: string
                    match_team_id: string | null
                    player_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    match_team_id?: string | null
                    player_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    match_team_id?: string | null
                    player_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "match_team_players_match_team_id_fkey"
                        columns: ["match_team_id"]
                        isOneToOne: false
                        referencedRelation: "match_teams"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "match_team_players_player_id_fkey"
                        columns: ["player_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            match_teams: {
                Row: {
                    created_at: string | null
                    id: string
                    match_id: string | null
                    team_number: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    match_id?: string | null
                    team_number: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    match_id?: string | null
                    team_number?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "match_teams_match_id_fkey"
                        columns: ["match_id"]
                        isOneToOne: false
                        referencedRelation: "matches"
                        referencedColumns: ["id"]
                    },
                ]
            }
            matches: {
                Row: {
                    created_at: string | null
                    date_time: string
                    group_id: string | null
                    id: string
                    location: string
                    max_players: number | null
                    price_per_person: number | null
                    status: string | null
                }
                Insert: {
                    created_at?: string | null
                    date_time: string
                    group_id?: string | null
                    id?: string
                    location: string
                    max_players?: number | null
                    price_per_person?: number | null
                    status?: string | null
                }
                Update: {
                    created_at?: string | null
                    date_time?: string
                    group_id?: string | null
                    id?: string
                    location?: string
                    max_players?: number | null
                    price_per_person?: number | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "matches_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    id: string
                    name: string
                    position: string | null
                    rating: number | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    id: string
                    name: string
                    position?: string | null
                    rating?: number | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    id?: string
                    name?: string
                    position?: string | null
                    rating?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_group_by_invite: {
                Args: {
                    invite_code: string
                }
                Returns: {
                    id: string
                    name: string
                    description: string
                    owner_id: string
                    created_at: string
                }[]
            }
            handle_new_user: {
                Args: Record<PropertyKey, never>
                Returns: unknown
            }
            invalidate_match_teams: {
                Args: Record<PropertyKey, never>
                Returns: unknown
            }
            is_member_of: {
                Args: {
                    _group_id: string
                }
                Returns: boolean
            }
            join_group_via_invite: {
                Args: {
                    invite_code: string
                }
                Returns: string
            }
            recalculate_match_payments: {
                Args: {
                    target_match_id: string
                }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
