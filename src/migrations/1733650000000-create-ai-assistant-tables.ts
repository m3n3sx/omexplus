import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAIAssistantTables1733650000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Conversations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR,
        session_id VARCHAR NOT NULL,
        status VARCHAR CHECK (status IN ('active', 'closed', 'escalated')) DEFAULT 'active',
        language VARCHAR DEFAULT 'en',
        started_at TIMESTAMP DEFAULT NOW(),
        last_message_at TIMESTAMP DEFAULT NOW(),
        escalated_at TIMESTAMP,
        escalated_to VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Messages table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id VARCHAR PRIMARY KEY,
        conversation_id VARCHAR REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
        content TEXT NOT NULL,
        intent VARCHAR,
        confidence DECIMAL(5,2),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Customer machines table (remember their equipment)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer_machines (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR NOT NULL,
        machine_type_id VARCHAR REFERENCES machine_types(id),
        manufacturer_id VARCHAR REFERENCES manufacturers(id),
        machine_model_id VARCHAR REFERENCES machine_models(id),
        year INTEGER,
        nickname VARCHAR,
        is_primary BOOLEAN DEFAULT false,
        last_mentioned_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Knowledge base table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id VARCHAR PRIMARY KEY,
        category VARCHAR NOT NULL,
        question TEXT NOT NULL,
        question_pl TEXT,
        answer TEXT NOT NULL,
        answer_pl TEXT,
        keywords TEXT[],
        priority INTEGER DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        helpful_count INTEGER DEFAULT 0,
        not_helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Intent mappings table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS intent_mappings (
        id VARCHAR PRIMARY KEY,
        intent_name VARCHAR NOT NULL,
        patterns TEXT[],
        keywords TEXT[],
        confidence_threshold DECIMAL(5,2) DEFAULT 70.00,
        action VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Assistant context table (remember conversation context)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS assistant_context (
        id VARCHAR PRIMARY KEY,
        conversation_id VARCHAR REFERENCES conversations(id) ON DELETE CASCADE,
        context_type VARCHAR NOT NULL,
        context_data JSONB NOT NULL,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Quick replies table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS quick_replies (
        id VARCHAR PRIMARY KEY,
        intent VARCHAR NOT NULL,
        reply_text VARCHAR NOT NULL,
        reply_text_pl VARCHAR,
        action VARCHAR,
        action_data JSONB,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Assistant analytics table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS assistant_analytics (
        id VARCHAR PRIMARY KEY,
        conversation_id VARCHAR REFERENCES conversations(id),
        event_type VARCHAR NOT NULL,
        event_data JSONB,
        customer_id VARCHAR,
        session_id VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Escalation queue table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS escalation_queue (
        id VARCHAR PRIMARY KEY,
        conversation_id VARCHAR REFERENCES conversations(id),
        customer_id VARCHAR,
        priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
        reason TEXT,
        status VARCHAR CHECK (status IN ('pending', 'assigned', 'resolved')) DEFAULT 'pending',
        assigned_to VARCHAR,
        assigned_at TIMESTAMP,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Create indexes
    await queryRunner.query(`CREATE INDEX idx_conversations_customer ON conversations(customer_id);`)
    await queryRunner.query(`CREATE INDEX idx_conversations_session ON conversations(session_id);`)
    await queryRunner.query(`CREATE INDEX idx_conversations_status ON conversations(status);`)
    await queryRunner.query(`CREATE INDEX idx_messages_conversation ON conversation_messages(conversation_id);`)
    await queryRunner.query(`CREATE INDEX idx_messages_created ON conversation_messages(created_at);`)
    await queryRunner.query(`CREATE INDEX idx_customer_machines_customer ON customer_machines(customer_id);`)
    await queryRunner.query(`CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);`)
    await queryRunner.query(`CREATE INDEX idx_intent_mappings_name ON intent_mappings(intent_name);`)
    await queryRunner.query(`CREATE INDEX idx_assistant_context_conversation ON assistant_context(conversation_id);`)
    await queryRunner.query(`CREATE INDEX idx_escalation_queue_status ON escalation_queue(status);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS escalation_queue CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS assistant_analytics CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS quick_replies CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS assistant_context CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS intent_mappings CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS knowledge_base CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS customer_machines CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS conversation_messages CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS conversations CASCADE;`)
  }
}
