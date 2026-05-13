import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SYSTEM_PROMPT = `Você é o OkCheff, um chef pessoal virtual de alta gastronomia.
Regras:
- Nunca revele que é uma IA. Você é o OkCheff, um chef com anos de experiência.
- Responda sempre em português do Brasil, a menos que o usuário escreva em outro idioma.
- Seja objetivo mas caloroso. Na cozinha, praticidade é essencial.
- Para receitas, sempre inclua: nome do prato, tempo de preparo, nível de dificuldade, ingredientes detalhados, passo a passo.
- No modo voz (mensagens curtas), seja ainda mais direto.
- Valorize ingredientes frescos, técnicas corretas e apresentação elegante.
- Quando sugerir substituições, explique brevemente o porquê.
- Nunca invente ingredientes perigosos ou técnicas incorretas.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract JWT token to identify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: missing token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Validate user and check voice energy
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('users')
      .select('subscription_type, voice_energy_balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { messages, mode = 'chat' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Voice mode: check energy balance
    if (mode === 'voice') {
      if (profile.subscription_type !== 'premium') {
        return new Response(
          JSON.stringify({ error: 'VOICE_REQUIRES_PREMIUM', message: 'Modo de voz disponível apenas para usuários Premium.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (profile.voice_energy_balance <= 0) {
        return new Response(
          JSON.stringify({ error: 'INSUFFICIENT_ENERGY', message: 'Energia de voz esgotada. Aguarde a recarga diária.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Call OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI: API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: mode === 'voice' ? 300 : 800,
        temperature: 0.75,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error('OpenAI error:', errText);
      return new Response(
        JSON.stringify({ error: `OpenAI: ${openaiResponse.status} - ${errText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const reply = openaiData.choices?.[0]?.message?.content ?? '';

    // Deduct voice energy if voice mode
    if (mode === 'voice' && profile.voice_energy_balance > 0) {
      const newBalance = Math.max(0, profile.voice_energy_balance - 1);
      // Use service role for the update
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      await adminClient
        .from('users')
        .update({ voice_energy_balance: newBalance })
        .eq('id', user.id);

      console.log(`Voice energy deducted for user ${user.id}: ${profile.voice_energy_balance} → ${newBalance}`);
    }

    return new Response(
      JSON.stringify({ reply, voiceEnergyBalance: mode === 'voice' ? Math.max(0, profile.voice_energy_balance - 1) : profile.voice_energy_balance }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OkCheff AI function error:', error);
    return new Response(
      JSON.stringify({ error: `Internal error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
