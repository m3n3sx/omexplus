import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedAdvancedSearchData1733649700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed Machine Types
    await queryRunner.query(`
      INSERT INTO machine_types (id, name, name_pl, emoji, popularity_score) VALUES
      ('excavator', 'Excavator', 'Koparka', '🚜', 100),
      ('loader', 'Loader', 'Ładowarka', '🏗️', 90),
      ('crane', 'Crane', 'Dźwig', '🏗️', 70),
      ('bulldozer', 'Bulldozer', 'Spychacz', '🚜', 60),
      ('forklift', 'Forklift', 'Wózek widłowy', '🏭', 85),
      ('compactor', 'Compactor', 'Walec', '🚧', 50),
      ('grader', 'Grader', 'Równiarka', '🚜', 40)
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed Manufacturers
    await queryRunner.query(`
      INSERT INTO manufacturers (id, name, machine_type_id, popularity_score, region) VALUES
      ('cat', 'Caterpillar (CAT)', 'excavator', 100, 'global'),
      ('komatsu', 'Komatsu', 'excavator', 95, 'global'),
      ('hitachi', 'Hitachi', 'excavator', 85, 'asia'),
      ('jcb', 'JCB', 'excavator', 80, 'europe'),
      ('volvo', 'Volvo', 'excavator', 90, 'europe'),
      ('liebherr', 'Liebherr', 'crane', 95, 'europe'),
      ('terex', 'Terex', 'crane', 75, 'global'),
      ('toyota', 'Toyota', 'forklift', 100, 'global'),
      ('linde', 'Linde', 'forklift', 90, 'europe'),
      ('hyster', 'Hyster', 'forklift', 85, 'global')
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed Machine Models
    await queryRunner.query(`
      INSERT INTO machine_models (id, name, manufacturer_id, year_from, year_to, power_hp, weight_kg, specs, popularity_score) VALUES
      ('cat-320d', 'CAT 320D', 'cat', 2005, 2013, 158, 21500, '{"engine": "C6.4 ACERT", "bucket_capacity": "1.2m3"}', 100),
      ('cat-320dl', 'CAT 320DL', 'cat', 2013, 2019, 158, 22000, '{"engine": "C6.4 ACERT", "bucket_capacity": "1.2m3"}', 95),
      ('cat-325d', 'CAT 325D', 'cat', 2011, 2018, 188, 25500, '{"engine": "C7.1 ACERT", "bucket_capacity": "1.5m3"}', 85),
      ('cat-330d', 'CAT 330D', 'cat', 2009, 2016, 268, 33000, '{"engine": "C9 ACERT", "bucket_capacity": "1.9m3"}', 80),
      ('komatsu-pc200', 'Komatsu PC200-8', 'komatsu', 2008, 2015, 155, 20500, '{"engine": "SAA6D107E-1", "bucket_capacity": "1.0m3"}', 90),
      ('jcb-3cx', 'JCB 3CX', 'jcb', 2010, 2023, 109, 8500, '{"engine": "EcoMAX", "bucket_capacity": "0.3m3"}', 95),
      ('volvo-ec210', 'Volvo EC210D', 'volvo', 2014, 2020, 163, 21800, '{"engine": "D5E", "bucket_capacity": "1.1m3"}', 85)
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed Symptom Mappings (AI CORE)
    await queryRunner.query(`
      INSERT INTO symptom_mappings (id, symptom_text, symptom_text_pl, category, subcategory, confidence_score, keywords) VALUES
      ('sym-001', 'Pump not working', 'Pompa nie działa', 'Hydraulics', 'Pumps', 95.00, ARRAY['pump', 'hydraulic', 'pressure', 'not working']),
      ('sym-002', 'Pump is leaking', 'Pompa przecieka', 'Hydraulics', 'Pumps', 98.00, ARRAY['pump', 'leak', 'leaking', 'oil']),
      ('sym-003', 'Low hydraulic pressure', 'Niskie ciśnienie hydrauliczne', 'Hydraulics', 'Pumps', 90.00, ARRAY['pressure', 'low', 'hydraulic', 'weak']),
      ('sym-004', 'Engine won''t start', 'Silnik nie odpala', 'Engine', 'Starters', 95.00, ARRAY['engine', 'start', 'wont start', 'ignition']),
      ('sym-005', 'Engine overheating', 'Silnik się przegrzewa', 'Engine', 'Cooling', 92.00, ARRAY['overheat', 'hot', 'temperature', 'cooling']),
      ('sym-006', 'No power', 'Brak mocy', 'Engine', 'Fuel System', 85.00, ARRAY['power', 'weak', 'slow', 'performance']),
      ('sym-007', 'Lights not working', 'Światła nie działają', 'Electrical', 'Lighting', 98.00, ARRAY['lights', 'bulb', 'lighting', 'dark']),
      ('sym-008', 'Battery dead', 'Akumulator rozładowany', 'Electrical', 'Battery', 95.00, ARRAY['battery', 'dead', 'charge', 'power']),
      ('sym-009', 'Alternator problem', 'Problem z alternatorem', 'Electrical', 'Alternator', 90.00, ARRAY['alternator', 'charging', 'electrical']),
      ('sym-010', 'Cylinder not extending', 'Cylinder się nie wysuwa', 'Hydraulics', 'Cylinders', 92.00, ARRAY['cylinder', 'extend', 'hydraulic', 'arm']),
      ('sym-011', 'Seal leaking', 'Uszczelka przecieka', 'Hydraulics', 'Seals', 95.00, ARRAY['seal', 'leak', 'gasket', 'oil']),
      ('sym-012', 'Brake not working', 'Hamulec nie działa', 'Brakes', 'Brake System', 98.00, ARRAY['brake', 'stop', 'not working', 'safety']),
      ('sym-013', 'Filter clogged', 'Filtr zatkany', 'Filters', 'Oil Filters', 90.00, ARRAY['filter', 'clog', 'dirty', 'maintenance']),
      ('sym-014', 'Hose burst', 'Wąż pękł', 'Hydraulics', 'Hoses', 95.00, ARRAY['hose', 'burst', 'broken', 'leak']),
      ('sym-015', 'Transmission slipping', 'Przekładnia ślizga się', 'Transmission', 'Gearbox', 88.00, ARRAY['transmission', 'slip', 'gear', 'shift'])
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed Part Categories
    await queryRunner.query(`
      INSERT INTO part_categories (id, name, name_pl, parent_id, icon) VALUES
      ('hydraulics', 'Hydraulics', 'Hydraulika', NULL, '💧'),
      ('engine', 'Engine', 'Silnik', NULL, '⚙️'),
      ('electrical', 'Electrical', 'Elektryka', NULL, '⚡'),
      ('brakes', 'Brakes', 'Hamulce', NULL, '🛑'),
      ('filters', 'Filters', 'Filtry', NULL, '🔧'),
      ('transmission', 'Transmission', 'Przekładnia', NULL, '⚙️'),
      ('pumps', 'Pumps', 'Pompy', 'hydraulics', '💧'),
      ('cylinders', 'Cylinders', 'Cylindry', 'hydraulics', '💧'),
      ('seals', 'Seals', 'Uszczelki', 'hydraulics', '🔧'),
      ('hoses', 'Hoses', 'Węże', 'hydraulics', '💧'),
      ('starters', 'Starters', 'Rozruszniki', 'engine', '⚙️'),
      ('cooling', 'Cooling System', 'Układ chłodzenia', 'engine', '❄️'),
      ('fuel', 'Fuel System', 'Układ paliwowy', 'engine', '⛽'),
      ('lighting', 'Lighting', 'Oświetlenie', 'electrical', '💡'),
      ('battery', 'Battery', 'Akumulator', 'electrical', '🔋'),
      ('alternator', 'Alternator', 'Alternator', 'electrical', '⚡')
      ON CONFLICT (id) DO NOTHING;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM part_categories;`)
    await queryRunner.query(`DELETE FROM symptom_mappings;`)
    await queryRunner.query(`DELETE FROM machine_models;`)
    await queryRunner.query(`DELETE FROM manufacturers;`)
    await queryRunner.query(`DELETE FROM machine_types;`)
  }
}
