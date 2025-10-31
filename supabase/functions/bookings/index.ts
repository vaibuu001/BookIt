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
    const body = await req.json();
    const {
      experienceId,
      slotId,
      customerName,
      customerEmail,
      customerPhone,
      numGuests,
      promoCode,
      discountAmount,
      totalAmount,
    } = body;

    if (!experienceId || !slotId || !customerName || !customerEmail || !numGuests) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        db: { schema: 'public' },
        auth: { persistSession: false },
      }
    );

    const { data: slot, error: slotError } = await supabase
      .from('slots')
      .select('*')
      .eq('id', slotId)
      .maybeSingle();

    if (slotError) throw slotError;
    if (!slot) {
      return new Response(
        JSON.stringify({ error: 'Slot not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (slot.available_spots < numGuests) {
      return new Response(
        JSON.stringify({ error: 'Not enough available spots' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        experience_id: experienceId,
        slot_id: slotId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || '',
        num_guests: numGuests,
        promo_code: promoCode || null,
        discount_amount: discountAmount || 0,
        total_amount: totalAmount,
        status: 'confirmed',
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    const { error: updateError } = await supabase
      .from('slots')
      .update({ available_spots: slot.available_spots - numGuests })
      .eq('id', slotId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, booking }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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