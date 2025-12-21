import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLang, sourceLang = 'en' } = await req.json();

    if (!text || !targetLang) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text and targetLang' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If source and target are the same, return original text
    if (sourceLang === targetLang) {
      return new Response(
        JSON.stringify({ translatedText: text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    let translatedText = '';

    // Try DeepL first
    if (DEEPL_API_KEY) {
      try {
        console.log('Attempting translation with DeepL...');
        
        // DeepL language codes mapping
        const deeplTargetLang = targetLang === 'ar' ? 'AR' : targetLang.toUpperCase();
        const deeplSourceLang = sourceLang === 'ar' ? 'AR' : sourceLang.toUpperCase();
        
        // DeepL supports AR (Arabic) only as target, not source. Use Gemini for Arabic source.
        if (sourceLang === 'ar') {
          throw new Error('DeepL does not support Arabic as source language, falling back to Gemini');
        }

        const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: [text],
            target_lang: deeplTargetLang,
            source_lang: deeplSourceLang,
          }),
        });

        if (deeplResponse.ok) {
          const deeplData = await deeplResponse.json();
          translatedText = deeplData.translations[0].text;
          console.log('DeepL translation successful');
        } else {
          const errorText = await deeplResponse.text();
          console.error('DeepL API error:', deeplResponse.status, errorText);
          throw new Error('DeepL translation failed');
        }
      } catch (deeplError) {
        console.log('DeepL failed, trying Gemini...', deeplError);
      }
    }

    // Fallback to Gemini if DeepL failed or unavailable
    if (!translatedText && GEMINI_API_KEY) {
      console.log('Attempting translation with Gemini...');
      
      const languageNames: Record<string, string> = {
        'en': 'English',
        'fr': 'French',
        'ar': 'Arabic'
      };

      const prompt = `Translate the following text from ${languageNames[sourceLang] || sourceLang} to ${languageNames[targetLang] || targetLang}. Only return the translated text, nothing else. Do not add any explanations or notes.

Text to translate:
${text}`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2048,
            }
          }),
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        translatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('Gemini translation successful');
      } else {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', geminiResponse.status, errorText);
      }
    }

    if (!translatedText) {
      return new Response(
        JSON.stringify({ error: 'Translation failed. Please check API keys configuration.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
