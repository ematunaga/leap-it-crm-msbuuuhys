import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { apiKey } = await req.json();

    // Validação da API Key fornecida pelo usuário
    if (apiKey !== 'leap_pzpaeiowz9kom1u4jah7nk') {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid API Key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Simulando a busca de usuários da API de precificação
    const externalUsers = [
      {
        name: "Mariana Silva",
        email: "mariana.silva@leappricing.com",
        role: "Analista de Precificação",
        origin: "precificacao"
      },
      {
        name: "Lucas Fernandes",
        email: "lucas.fernandes@leappricing.com",
        role: "Coordenador de Vendas",
        origin: "precificacao"
      },
      {
        name: "Renata Gomes",
        email: "renata.gomes@leappricing.com",
        role: "Diretora de Estratégia",
        origin: "precificacao"
      }
    ];

    return new Response(JSON.stringify({ users: externalUsers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
