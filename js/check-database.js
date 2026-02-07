
// Quick script to check if database is working
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log("🔍 Checking database connection...");
  
  try {
    // Try to query the applications table
    const { data, error, count } = await supabase
      .from('applications')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error("❌ Database error:", error.message);
      
      // Check if table doesn't exist
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log("📋 Table doesn't exist. You need to run the SQL setup script.");
        console.log("Run this SQL in Supabase SQL Editor:");
        console.log(`
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  discord_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  answers TEXT,
  score TEXT,
  total_questions INTEGER DEFAULT 8,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  test_results JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
        `);
      }
    } else {
      console.log(`✅ Database connected! Found ${count} applications.`);
      console.log("Sample data:", data?.slice(0, 3));
    }
    
  } catch (err) {
    console.error("🔥 Critical error:", err.message);
  }
}

checkDatabase();
