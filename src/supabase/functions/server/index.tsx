import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-78aacda0/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-78aacda0/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Failed to sign up" }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-78aacda0/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Signin error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      access_token: data.session?.access_token,
      user: data.user
    });
  } catch (error) {
    console.log(`Signin error: ${error}`);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Submit donation endpoint (requires auth)
app.post("/make-server-78aacda0/donate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - Please login first" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log(`Authorization error while submitting donation: ${authError?.message}`);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const { donorName, age, gender, bloodGroup, weight } = await c.req.json();
    
    if (!donorName || !age || !gender || !bloodGroup || !weight) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Validate age and weight
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(weightNum)) {
      return c.json({ error: "Invalid age or weight format" }, 400);
    }

    const isEligible = ageNum >= 18 && weightNum >= 60;

    const donation = {
      userId: user.id,
      userEmail: user.email,
      donorName,
      age: ageNum,
      gender,
      bloodGroup,
      weight: weightNum,
      isEligible,
      timestamp: new Date().toISOString(),
    };

    // Store donation only if eligible
    if (isEligible) {
      await kv.set(`donation:${user.id}:${Date.now()}`, donation);
    }

    return c.json({ 
      success: true, 
      isEligible,
      message: isEligible 
        ? "Thanks for filling data. You are eligible to donate!" 
        : "You aren't eligible to give blood."
    });
  } catch (error) {
    console.log(`Donation submission error: ${error}`);
    return c.json({ error: "Failed to submit donation" }, 500);
  }
});

// Get donation stats
app.get("/make-server-78aacda0/stats", async (c) => {
  try {
    const donations = await kv.getByPrefix("donation:");
    const eligibleDonations = donations.filter((d: any) => d.isEligible);
    
    return c.json({ 
      totalDonations: eligibleDonations.length,
      allDonations: donations.length
    });
  } catch (error) {
    console.log(`Stats error: ${error}`);
    return c.json({ error: "Failed to get stats" }, 500);
  }
});

// Get recent donors (this week)
app.get("/make-server-78aacda0/recent-donors", async (c) => {
  try {
    const donations = await kv.getByPrefix("donation:");
    
    // Get donations from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentDonations = donations
      .filter((d: any) => {
        const donationDate = new Date(d.timestamp);
        return d.isEligible && donationDate >= oneWeekAgo;
      })
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10); // Top 10 recent donors
    
    return c.json({ donors: recentDonations });
  } catch (error) {
    console.log(`Recent donors error: ${error}`);
    return c.json({ error: "Failed to get recent donors" }, 500);
  }
});

Deno.serve(app.fetch);