import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedAIAssistantData1733650100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed Intent Mappings
    await queryRunner.query(`
      INSERT INTO intent_mappings (id, intent_name, patterns, keywords, confidence_threshold, action, metadata) VALUES
      ('intent-001', 'SEARCH_GUIDE', 
        ARRAY['need parts', 'looking for', 'find part', 'search for', 'where can i find'],
        ARRAY['search', 'find', 'need', 'looking', 'part'],
        70.00, 'launch_search', '{"auto_fill": true}'::jsonb),
      
      ('intent-002', 'TECHNICAL_ISSUE',
        ARRAY['not working', 'broken', 'problem with', 'issue with', 'malfunction'],
        ARRAY['broken', 'problem', 'issue', 'not working', 'malfunction', 'error'],
        75.00, 'diagnose_issue', '{"suggest_parts": true}'::jsonb),
      
      ('intent-003', 'COMPATIBILITY_CHECK',
        ARRAY['does this fit', 'is this compatible', 'will this work', 'can i use'],
        ARRAY['fit', 'compatible', 'work with', 'match', 'suitable'],
        80.00, 'check_compatibility', '{"validate": true}'::jsonb),
      
      ('intent-004', 'PRODUCT_INQUIRY',
        ARRAY['tell me about', 'what is', 'specs for', 'details about', 'information on'],
        ARRAY['specs', 'details', 'information', 'about', 'what'],
        70.00, 'show_product_info', '{}'::jsonb),
      
      ('intent-005', 'PRICE_INQUIRY',
        ARRAY['how much', 'what price', 'cost of', 'price for'],
        ARRAY['price', 'cost', 'how much', 'expensive'],
        85.00, 'show_pricing', '{"show_alternatives": true}'::jsonb),
      
      ('intent-006', 'REORDER',
        ARRAY['order again', 'same as last time', 'reorder', 'buy again'],
        ARRAY['reorder', 'again', 'same', 'previous order'],
        80.00, 'show_order_history', '{"quick_reorder": true}'::jsonb),
      
      ('intent-007', 'RECOMMENDATION',
        ARRAY['what do you recommend', 'suggest', 'advice', 'should i buy'],
        ARRAY['recommend', 'suggest', 'advice', 'opinion', 'should'],
        75.00, 'provide_recommendations', '{"personalized": true}'::jsonb),
      
      ('intent-008', 'MAINTENANCE_ADVICE',
        ARRAY['when to replace', 'maintenance schedule', 'how often', 'service interval'],
        ARRAY['maintenance', 'replace', 'service', 'schedule', 'interval'],
        75.00, 'show_maintenance_info', '{}'::jsonb),
      
      ('intent-009', 'SHIPPING_INQUIRY',
        ARRAY['delivery time', 'shipping cost', 'when will it arrive', 'how long'],
        ARRAY['shipping', 'delivery', 'arrive', 'time', 'cost'],
        80.00, 'show_shipping_info', '{}'::jsonb),
      
      ('intent-010', 'GENERAL_HELP',
        ARRAY['help', 'i dont know', 'confused', 'not sure'],
        ARRAY['help', 'confused', 'dont know', 'unsure'],
        70.00, 'provide_guidance', '{"show_options": true}'::jsonb),
      
      ('intent-011', 'ESCALATE',
        ARRAY['speak to human', 'talk to person', 'customer service', 'call me'],
        ARRAY['human', 'person', 'agent', 'call', 'speak'],
        90.00, 'escalate_to_human', '{"priority": "medium"}'::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed Knowledge Base
    await queryRunner.query(`
      INSERT INTO knowledge_base (id, category, question, question_pl, answer, answer_pl, keywords, priority) VALUES
      ('kb-001', 'compatibility', 
        'How do I know if a part fits my machine?',
        'Skąd mam wiedzieć, czy część pasuje do mojej maszyny?',
        'I can help you check compatibility! Just tell me: 1) Your machine model (e.g., CAT 320D), 2) The part you''re interested in. I''ll verify if it''s 100% compatible.',
        'Mogę pomóc sprawdzić kompatybilność! Powiedz mi: 1) Model maszyny (np. CAT 320D), 2) Część, która Cię interesuje. Zweryfikuję, czy jest w 100% kompatybilna.',
        ARRAY['compatibility', 'fit', 'match', 'work'],
        10),
      
      ('kb-002', 'search',
        'How do I find parts for my machine?',
        'Jak znaleźć części do mojej maszyny?',
        'I''ll guide you through our smart search! It''s easy: 1) Tell me your machine type, 2) Select manufacturer, 3) Choose model, 4) Describe the issue. I''ll show you compatible parts.',
        'Poprowadzę Cię przez nasze inteligentne wyszukiwanie! To proste: 1) Powiedz mi typ maszyny, 2) Wybierz producenta, 3) Wybierz model, 4) Opisz problem. Pokażę Ci kompatybilne części.',
        ARRAY['search', 'find', 'parts', 'how'],
        10),
      
      ('kb-003', 'pricing',
        'Why are some parts more expensive than others?',
        'Dlaczego niektóre części są droższe od innych?',
        'Great question! We offer 3 types: 1) Original (OEM) - highest quality, full warranty, 2) Compatible - good quality, lower price, 3) Budget - basic functionality. All are tested for compatibility.',
        'Świetne pytanie! Oferujemy 3 typy: 1) Oryginalne (OEM) - najwyższa jakość, pełna gwarancja, 2) Kompatybilne - dobra jakość, niższa cena, 3) Budżetowe - podstawowa funkcjonalność. Wszystkie są testowane pod kątem kompatybilności.',
        ARRAY['price', 'expensive', 'cost', 'why'],
        8),
      
      ('kb-004', 'shipping',
        'How long does shipping take?',
        'Jak długo trwa dostawa?',
        'Shipping times: Poland 2-3 days, EU 3-5 days, Worldwide 7-14 days. Express shipping available. Free shipping on orders over €500.',
        'Czas dostawy: Polska 2-3 dni, UE 3-5 dni, Świat 7-14 dni. Dostępna ekspresowa wysyłka. Darmowa dostawa przy zamówieniach powyżej 500€.',
        ARRAY['shipping', 'delivery', 'time', 'how long'],
        7),
      
      ('kb-005', 'warranty',
        'What warranty do you offer?',
        'Jaką gwarancję oferujecie?',
        'Warranty: Original parts - 2 years, Compatible parts - 1 year, Budget parts - 6 months. All parts tested before shipping. 30-day return policy if not compatible.',
        'Gwarancja: Części oryginalne - 2 lata, Części kompatybilne - 1 rok, Części budżetowe - 6 miesięcy. Wszystkie części testowane przed wysyłką. 30-dniowa polityka zwrotów, jeśli niekompatybilne.',
        ARRAY['warranty', 'guarantee', 'return'],
        8),
      
      ('kb-006', 'maintenance',
        'When should I replace hydraulic parts?',
        'Kiedy powinienem wymienić części hydrauliczne?',
        'Replace hydraulic parts when: 1) Leaking oil, 2) Loss of pressure, 3) Unusual noises, 4) After 5000 operating hours, 5) Visible wear. Regular maintenance extends life by 40%.',
        'Wymień części hydrauliczne gdy: 1) Przeciek oleju, 2) Utrata ciśnienia, 3) Nietypowe dźwięki, 4) Po 5000 godzinach pracy, 5) Widoczne zużycie. Regularna konserwacja wydłuża żywotność o 40%.',
        ARRAY['maintenance', 'replace', 'when', 'hydraulic'],
        9),
      
      ('kb-007', 'payment',
        'What payment methods do you accept?',
        'Jakie metody płatności akceptujecie?',
        'We accept: Credit cards (Visa, Mastercard), Bank transfer, PayPal, Company invoice (for registered businesses). Secure payment processing.',
        'Akceptujemy: Karty kredytowe (Visa, Mastercard), Przelew bankowy, PayPal, Faktura firmowa (dla zarejestrowanych firm). Bezpieczne przetwarzanie płatności.',
        ARRAY['payment', 'pay', 'method', 'invoice'],
        6),
      
      ('kb-008', 'installation',
        'Do you provide installation services?',
        'Czy oferujecie usługi instalacji?',
        'We provide: 1) Installation guides (PDF/video), 2) Technical support hotline, 3) Partner mechanic network (available in major cities). Installation not included in price.',
        'Oferujemy: 1) Instrukcje instalacji (PDF/wideo), 2) Infolinia wsparcia technicznego, 3) Sieć partnerskich mechaników (dostępna w większych miastach). Instalacja nie jest wliczona w cenę.',
        ARRAY['installation', 'install', 'service', 'mechanic'],
        7)
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed Quick Replies
    await queryRunner.query(`
      INSERT INTO quick_replies (id, intent, reply_text, reply_text_pl, action, action_data, display_order) VALUES
      ('qr-001', 'greeting', 'Find parts for my machine', 'Znajdź części do mojej maszyny', 'launch_search', '{}'::jsonb, 1),
      ('qr-002', 'greeting', 'Check compatibility', 'Sprawdź kompatybilność', 'check_compatibility', '{}'::jsonb, 2),
      ('qr-003', 'greeting', 'Reorder previous parts', 'Zamów ponownie poprzednie części', 'show_orders', '{}'::jsonb, 3),
      ('qr-004', 'greeting', 'Talk to expert', 'Porozmawiaj z ekspertem', 'escalate', '{}'::jsonb, 4),
      ('qr-005', 'search_started', 'I know my machine model', 'Znam model mojej maszyny', 'skip_to_model', '{}'::jsonb, 1),
      ('qr-006', 'search_started', 'I need help choosing', 'Potrzebuję pomocy w wyborze', 'guided_search', '{}'::jsonb, 2),
      ('qr-007', 'part_found', 'Add to cart', 'Dodaj do koszyka', 'add_to_cart', '{}'::jsonb, 1),
      ('qr-008', 'part_found', 'Show alternatives', 'Pokaż alternatywy', 'show_alternatives', '{}'::jsonb, 2),
      ('qr-009', 'part_found', 'Check compatibility', 'Sprawdź kompatybilność', 'validate_part', '{}'::jsonb, 3)
      ON CONFLICT (id) DO NOTHING;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM quick_replies;`)
    await queryRunner.query(`DELETE FROM knowledge_base;`)
    await queryRunner.query(`DELETE FROM intent_mappings;`)
  }
}
