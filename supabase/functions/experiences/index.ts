import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const experienceId = pathParts[pathParts.length - 1];

    if (experienceId && experienceId !== 'experiences') {
      const { data: experience, error: expError } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', experienceId)
        .maybeSingle();

      if (expError) throw expError;
      if (!experience) {
        return new Response(
          JSON.stringify({ error: 'Experience not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: slots, error: slotsError } = await supabase
        .from('slots')
        .select('*')
        .eq('experience_id', experienceId)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (slotsError) throw slotsError;

      return new Response(
        JSON.stringify({ ...experience, slots: slots || [] }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify(experiences || []),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});