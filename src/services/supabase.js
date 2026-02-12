
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vpkowvenlqwbnfjizcts.supabase.co'

const supabaseKey = "sb_publishable_nkNGMi7hAAiMp8KVwszfWA_IcouLFMR"
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase;