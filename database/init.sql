CREATE TABLE IF NOT EXISTS breed_summary (
    id SERIAL PRIMARY KEY,
    breed_name VARCHAR(100) UNIQUE NOT NULL,
    origin TEXT,
    also_known_as TEXT,
    physical_description TEXT,
    body_weight_male_kg VARCHAR(50),
    body_weight_female_kg VARCHAR(50),
    height_cm VARCHAR(50),
    special_traits TEXT,
    conservation_status VARCHAR(100),
    population_estimate VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS breed_diet (
    id SERIAL PRIMARY KEY,
    breed_name VARCHAR(100) UNIQUE NOT NULL,
    dry_fodder_kg VARCHAR(50),
    green_fodder_kg VARCHAR(50),
    concentrate_kg VARCHAR(50),
    water_liters VARCHAR(50),
    recommended_fodder TEXT,
    recommended_concentrate TEXT,
    minerals_supplements TEXT,
    feeding_schedule TEXT,
    foods_to_avoid TEXT,
    special_notes TEXT
);

CREATE TABLE IF NOT EXISTS breed_diseases (
    id SERIAL PRIMARY KEY,
    breed_name VARCHAR(100) NOT NULL,
    disease_name VARCHAR(200) NOT NULL,
    disease_type VARCHAR(50),
    symptoms TEXT,
    prevention TEXT,
    remedy TEXT,
    severity VARCHAR(20),
    is_contagious BOOLEAN,
    emergency_note TEXT
);

-- Insert accurate data for 26 breeds
INSERT INTO breed_summary (breed_name, origin, also_known_as, physical_description, body_weight_male_kg, body_weight_female_kg, height_cm, special_traits, conservation_status, population_estimate) VALUES
('Gir', 'Gujarat, India', 'Bhodali, Desan, Gujarati, Kathiawari, Sorthi, Surati', 'Red or speckled, prominent forehead, long pendulous ears.', '544', '386', '135', 'High milk yield, resistant to tropical diseases, heat tolerant.', 'Not at risk', 'Large'),
('Sahiwal', 'Punjab, Pakistan', 'Lola, Montgomery, Multani, Teli', 'Reddish brown or pale red, occasionally with white patches, loose skin.', '500', '400', '136', 'Tick resistant, heat tolerant, high milk production.', 'Not at risk', 'Large'),
('Tharparkar', 'Sindh, Pakistan', 'White Sindhi, Cutchi, Thari', 'White or light grey coat, medium size, strong build.', '450', '400', '130', 'Dual-purpose, highly heat and disease resistant.', 'Not at risk', 'Moderate'),
('Rathi', 'Rajasthan, India', 'None', 'Brown with white patches or solid brown, medium size.', '400', '350', '125', 'Good milch breed, adapted to harsh desert conditions.', 'Not at risk', 'Moderate'),
('Kankrej', 'Gujarat, India and Sindh, Pakistan', 'Bannai, Nagar, Talabda, Vagadia, Waged, Wadial', 'Silver-grey, iron-grey or steel black, large crescent-shaped horns.', '590', '430', '158', 'Fast, powerful draft animals, very heat tolerant.', 'Not at risk', 'Large'),
('Deoni', 'Maharashtra, India', 'Surti, Dongari, Dongarpati', 'White with black patches or spots, prominent forehead.', '590', '430', '150', 'Dual-purpose, good draft capacity and milk yield.', 'Not at risk', 'Moderate'),
('Hallikar', 'Karnataka, India', 'None', 'Grey or dark grey, long horns emerging near each other.', '340', '227', '135', 'Excellent draft breed, known for speed and endurance.', 'Not at risk', 'Moderate'),
('Amritmahal', 'Karnataka, India', 'None', 'Grey to black, slender build, sharp horns.', '500', '315', '130', 'Famous draft breed, historically used in warfare for transport.', 'Vulnerable', 'Small'),
('Kangayam', 'Tamil Nadu, India', 'Kanganad, Kongu', 'Grey or white coat, dark points on males, strong build.', '500', '350', '135', 'Excellent draft breed, sturdy and resilient.', 'Not at risk', 'Moderate'),
('Alambadi', 'Tamil Nadu, India', 'None', 'Grey or dark grey, backward curving horns.', '350', '300', '130', 'Good draft breed, suited for hilly terrain.', 'Not at risk', 'Moderate'),
('Bargur', 'Tamil Nadu, India', 'None', 'Brown with white markings, medium size, compact body.', '350', '250', '120', 'Draft breed, very aggressive, native to Bargur hills.', 'Not at risk', 'Moderate'),
('Pulikulam', 'Tamil Nadu, India', 'Palingu maadu, Mani maadu, Jallikattu maadu', 'Dark grey or black, compact build, sharp horns.', '400', '250', '125', 'Bred primarily for the traditional Jallikattu bull-taming sport.', 'Not at risk', 'Moderate'),
('Dangi', 'Maharashtra, India', 'Khandesi, Ghauti, Shikari', 'White with red or black spots, short thick horns.', '350', '250', '120', 'Excellent draft power in heavy rainfall areas.', 'Not at risk', 'Moderate'),
('Nimari', 'Madhya Pradesh, India', 'Khargoni, Khargaon', 'Red coat with large white splashes, convex forehead.', '400', '300', '130', 'Draft breed, cross between Gir and Khillari.', 'Not at risk', 'Moderate'),
('Nagori', 'Rajasthan, India', 'None', 'Fine, large, upstanding, white or light grey, long face.', '400', '300', '140', 'Famous trotting draft breed of India.', 'Not at risk', 'Moderate'),
('Kherigarh', 'Uttar Pradesh, India', 'Kheri', 'White coat, small face, upright horns.', '400', '300', '120', 'Draft breed, active and suited for light plowing.', 'Not at risk', 'Moderate'),
('Kenkatha', 'Uttar Pradesh and Madhya Pradesh, India', 'Kenwariya', 'Small, compact body, red, brown or black coat.', '350', '250', '110', 'Hardy draft breed, thrives on poor grazing.', 'Not at risk', 'Moderate'),
('Kasaragod', 'Kerala, India', 'Kasaragod Dwarf', 'Very small size, mostly black or brown, compact.', '150', '100', '90', 'Dwarf breed, highly resistant to diseases, minimal feed requirement.', 'Vulnerable', 'Small'),
('Malnad Gidda', 'Karnataka, India', 'Gidda, Uradana', 'Small body, varying coat colors (black, brown, white).', '160', '120', '90', 'Dwarf breed, thrives in heavy rainfall Western Ghats, highly disease resistant.', 'Not at risk', 'Moderate'),
('Umblachery', 'Tamil Nadu, India', 'Jathi madu, Mottai madu, Tanjore', 'Grey with white points on face, limbs and tail, dehorned in calves.', '350', '250', '110', 'Draft breed suitable for wet ploughing in paddy fields.', 'Not at risk', 'Moderate'),
('Banni', 'Gujarat, India', 'Kutchi', 'Medium size, generally black, sometimes brown or red.', '450', '350', '130', 'Buffalo breed (often listed in cattle/bovine datasets due to region), highly adapted to arid conditions.', 'Not at risk', 'Large'),
('Jaffrabadi', 'Gujarat, India', 'Bhavnagri, Gir, Khar', 'Very large, heavy head, massive horns drooping downwards.', '600', '500', '140', 'Buffalo breed, extremely high milk fat content.', 'Not at risk', 'Moderate'),
('Mehsana', 'Gujarat, India', 'None', 'Medium to large, black, horns curled upwards.', '500', '400', '135', 'Buffalo breed, good milk yield, cross of Murrah and Surti.', 'Not at risk', 'Moderate'),
('Nagpuri', 'Maharashtra, India', 'Berari, Gaolao, Purnathadi', 'Black, long flat sword-shaped horns.', '400', '300', '130', 'Buffalo breed, used for milk and draft.', 'Not at risk', 'Moderate'),
('Nili Ravi', 'Punjab, Pakistan and India', 'None', 'Black with white markings on face, legs, and tail.', '600', '450', '135', 'Buffalo breed, excellent milk producer.', 'Not at risk', 'Moderate'),
('Shurti', 'Gujarat, India', 'Surati, Charotari, Nadiadi, Gujarati', 'Medium size, black or brown, sickle-shaped horns.', '450', '350', '125', 'Buffalo breed, economical milk producer on limited feed.', 'Not at risk', 'Moderate');

INSERT INTO breed_diet (breed_name, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, recommended_fodder, recommended_concentrate, minerals_supplements, feeding_schedule, foods_to_avoid, special_notes) VALUES
('Gir', '5-7', '15-20', '2-4', '40-60', 'Sorghum, Maize, Napier grass', 'Cottonseed cake, Groundnut cake', 'Salt lick, Mineral mixture (50g/day)', 'Twice daily (morning and evening)', 'Moldy feed, toxic weeds', 'Increase green fodder during lactation.'),
('Sahiwal', '5-6', '20-25', '3-5', '45-65', 'Berseem, Lucerne, Oat grass', 'Wheat bran, Mustard cake', 'Calcium, Phosphorus supplement', 'Three times daily for lactating cows', 'Spoiled silage', 'Requires abundant clean water.'),
('Tharparkar', '4-6', '10-15', '2-3', '30-50', 'Bajra, Jowar, dry grasses', 'Crushed grains, minimal oil cakes', 'Common salt', 'Morning and late afternoon', 'Excessive rich concentrates', 'Can survive on sparse vegetation.'),
('Rathi', '4-5', '8-12', '1-2', '30-40', 'Dry desert grasses, Sewan grass', 'Guar meal, local grains', 'Salt', 'Twice daily', 'Overfeeding concentrates', 'Highly adapted to low-water environments.'),
('Kankrej', '6-8', '15-20', '2-3', '40-50', 'Jowar, Bajra stover', 'Cottonseed, pulse husks', 'Mineral mixture', 'Morning and evening', 'Excessively wet fodder', 'Working bullocks need extra concentrate.'),
('Deoni', '5-7', '15-20', '2-3', '40-50', 'Jowar, local grasses', 'Groundnut cake, wheat bran', 'Salt and mineral block', 'Twice daily', 'Moldy hay', 'Provide shade near feeding area.'),
('Hallikar', '4-5', '10-15', '1-2', '30-40', 'Finger millet (Ragi) straw', 'Horse gram, groundnut cake', 'Common salt', 'Morning and evening', 'Excessive green fodder during work', 'Working animals need soaked horse gram.'),
('Amritmahal', '4-5', '10-15', '1-2', '30-40', 'Local grazing grasses', 'Horse gram, oil cakes', 'Salt', 'Mainly grazing, supplemented evening', 'Overfeeding when not working', 'Thrives on extensive grazing.'),
('Kangayam', '4-5', '10-15', '1-2', '30-40', 'Cumbu (Bajra) straw, local grasses', 'Cotton seed, bran', 'Salt lick', 'Twice daily', 'Sudden changes in diet', 'Requires hard grazing to maintain fitness.'),
('Alambadi', '4-5', '10-15', '1-2', '30-40', 'Forest grasses, dry straw', 'Local grains', 'Salt', 'Mainly grazing', 'Spoiled feed', 'Adapted to forest grazing.'),
('Bargur', '3-4', '8-12', '1', '20-30', 'Hill grasses, shrubs', 'Minimal concentrate needed', 'Salt', 'Grazing', 'Rich concentrates', 'Maintains condition on poor forage.'),
('Pulikulam', '4-5', '10-15', '1-2', '30-40', 'Local pasture, straw', 'Cottonseed, local grains', 'Salt', 'Grazing, supplemented during events', 'Overfeeding prior to work', 'Requires specialized diet before Jallikattu.'),
('Dangi', '4-5', '15-20', '1-2', '30-40', 'Rice straw, local lush grasses', 'Rice bran, local cakes', 'Salt', 'Twice daily', 'Moldy feed', 'Adapted to heavy rainfall grazing.'),
('Nimari', '4-6', '12-18', '1-2', '30-40', 'Jowar stalks, local pasture', 'Cottonseed, bran', 'Salt', 'Morning and evening', 'Excessive wet fodder', 'Needs good roughage for energy.'),
('Nagori', '4-6', '10-15', '1-2', '30-40', 'Bajra straw, dry grasses', 'Crushed grains', 'Salt', 'Twice daily', 'Overfeeding when resting', 'Working animals need quality concentrate.'),
('Kherigarh', '4-5', '10-15', '1-2', '30-40', 'Local grazing, straw', 'Rice bran, local grains', 'Salt', 'Mainly grazing', 'Spoiled feed', 'Thrives on local pasture.'),
('Kenkatha', '3-4', '8-12', '1', '20-30', 'Poor quality roughage, local shrubs', 'Minimal', 'Salt', 'Grazing', 'Rich feed', 'Can survive on very poor grazing.'),
('Kasaragod', '2-3', '5-8', '0.5-1', '10-20', 'Local grasses, kitchen waste', 'Rice bran', 'Salt', 'Grazing, household scraps', 'Excessive concentrates', 'Extremely low feed requirements.'),
('Malnad Gidda', '2-3', '5-10', '0.5-1', '10-20', 'Forest grazing, local weeds', 'Rice bran, coconut cake', 'Salt', 'Grazing, minimal supplementation', 'Spoiled feed', 'Adapted to wet forest grazing.'),
('Umblachery', '3-4', '10-15', '1-2', '20-30', 'Paddy straw, local pasture', 'Rice bran, groundnut cake', 'Salt', 'Morning and evening', 'Overfeeding green fodder during work', 'Calves are fed specially for dehorning process.'),
('Banni', '6-8', '15-20', '2-3', '40-60', 'Banni grassland grasses', 'Local grains, cottonseed', 'Salt', 'Night grazing (typical for Banni)', 'Toxic desert plants', 'Unique night-grazing behavior.'),
('Jaffrabadi', '8-10', '25-30', '4-6', '60-80', 'Maize, Sorghum, Napier', 'Cottonseed cake, groundnut cake', 'Mineral mixture (100g/day)', 'Three times daily', 'Moldy feed', 'Heavy eaters, require large volume of water.'),
('Mehsana', '6-8', '20-25', '3-5', '50-70', 'Lucerne, Berseem, Jowar', 'Cottonseed cake, mustard cake', 'Mineral mixture', 'Twice daily', 'Spoiled silage', 'Efficient converters of roughage to milk.'),
('Nagpuri', '5-7', '15-20', '2-3', '40-50', 'Local grasses, Jowar stalks', 'Cottonseed, bran', 'Salt, basic minerals', 'Morning and evening', 'Moldy feed', 'Can manage on lower quality roughage.'),
('Nili Ravi', '8-10', '25-30', '4-6', '60-80', 'Berseem, Maize, Napier', 'Wheat bran, mustard cake', 'Mineral mixture', 'Three times daily', 'Poor quality straw without supplement', 'Needs access to wallowing water.'),
('Shurti', '5-7', '15-20', '2-4', '40-60', 'Jowar, local grasses', 'Cottonseed, groundnut cake', 'Mineral mixture', 'Twice daily', 'Spoiled feed', 'Very economical feeders.');

INSERT INTO breed_diseases (breed_name, disease_name, disease_type, symptoms, prevention, remedy, severity, is_contagious, emergency_note) VALUES
('Gir', 'Foot and Mouth Disease (FMD)', 'Viral', 'Blisters in mouth and hooves, high fever, drooling, lameness.', 'Biannual vaccination, strict biosecurity.', 'Symptomatic treatment, wound washing with mild antiseptic.', 'High', true, 'Highly contagious, isolate immediately.'),
('Sahiwal', 'Mastitis', 'Bacterial', 'Swollen, painful udder, clotted milk, fever.', 'Proper hygiene during milking, dry cow therapy.', 'Antibiotics (intramammary and systemic) as prescribed by vet.', 'Medium', false, 'Treat promptly to prevent permanent udder damage.'),
('Tharparkar', 'Tick-borne Diseases (Babesiosis/Theileriosis)', 'Parasitic', 'High fever, anemia, red urine, swollen lymph nodes.', 'Tick control (acaricides), pasture management.', 'Specific antiprotozoal drugs, supportive therapy.', 'High', false, 'Can be fatal if untreated, seek veterinary care.'),
('Rathi', 'Black Quarter (BQ)', 'Bacterial', 'Fever, swelling in heavy muscles (hindquarters), crepitating sound on pressing.', 'Annual vaccination before monsoon.', 'Penicillin in early stages, often fatal once advanced.', 'High', false, 'Spores survive in soil, burn or deeply bury carcasses.'),
('Kankrej', 'Hemorrhagic Septicemia (HS)', 'Bacterial', 'High fever, swelling of throat, respiratory distress, sudden death.', 'Annual vaccination before monsoon.', 'Broad-spectrum antibiotics if caught very early.', 'High', true, 'Extremely fast-acting, high mortality rate.'),
('Deoni', 'Lumpy Skin Disease (LSD)', 'Viral', 'Fever, skin nodules, enlarged lymph nodes, drop in milk yield.', 'Vaccination, control of biting insects (mosquitoes, flies).', 'Supportive care, antibiotics for secondary infections.', 'Medium', true, 'Isolate infected animals, control vector insects.'),
('Hallikar', 'Anthrax', 'Bacterial', 'Sudden death, bleeding from natural orifices, unclotted dark blood.', 'Annual vaccination in endemic areas.', 'Usually fatal before treatment. Antibiotics in very early stages.', 'High', true, 'DO NOT OPEN CARCASS. Zoonotic (can infect humans).'),
('Amritmahal', 'Fascioliasis (Liver Fluke)', 'Parasitic', 'Weight loss, anemia, bottle jaw, diarrhea.', 'Avoid grazing near snail-infested water, regular deworming.', 'Anthelmintics (flukicides).', 'Medium', false, 'Control snail intermediate hosts in pastures.'),
('Kangayam', 'Trypanosomiasis (Surra)', 'Parasitic', 'Intermittent fever, anemia, circling movements, wasting.', 'Control of biting flies (Tabanus).', 'Trypanocidal drugs.', 'Medium', false, 'Blood smear examination required for diagnosis.'),
('Alambadi', 'Brucellosis', 'Bacterial', 'Abortion in late pregnancy, retained placenta, infertility.', 'Vaccination of female calves, test and cull.', 'No effective cure. Cull infected animals.', 'High', true, 'Zoonotic. Handle aborted materials with extreme care.'),
('Bargur', 'Foot and Mouth Disease (FMD)', 'Viral', 'Blisters in mouth/hooves, fever.', 'Vaccination.', 'Antiseptic washes, soft food.', 'High', true, 'Notify local veterinary authorities.'),
('Pulikulam', 'Hemorrhagic Septicemia (HS)', 'Bacterial', 'Swollen throat, severe pneumonia.', 'Pre-monsoon vaccination.', 'Immediate antibiotics.', 'High', true, 'High mortality in stressed animals.'),
('Dangi', 'Black Quarter (BQ)', 'Bacterial', 'Muscle swelling, fever.', 'Vaccination.', 'Antibiotics if early.', 'High', false, 'Endemic in many regions.'),
('Nimari', 'Mastitis', 'Bacterial', 'Swollen udder, abnormal milk.', 'Hygiene.', 'Antibiotics.', 'Medium', false, 'Common in dairy setups.'),
('Nagori', 'Tick-borne Diseases', 'Parasitic', 'Fever, anemia.', 'Tick control.', 'Antiprotozoal drugs.', 'High', false, 'Monitor animals for ticks regularly.'),
('Kherigarh', 'Fascioliasis', 'Parasitic', 'Weight loss, bottle jaw.', 'Deworming.', 'Flukicides.', 'Medium', false, 'Common in wet grazing areas.'),
('Kenkatha', 'Foot and Mouth Disease (FMD)', 'Viral', 'Blisters, lameness.', 'Vaccination.', 'Supportive care.', 'High', true, 'Isolate affected animals.'),
('Kasaragod', 'Generally highly disease resistant', 'N/A', 'N/A', 'N/A', 'N/A', 'Low', false, 'Maintains health with minimal intervention.'),
('Malnad Gidda', 'Generally highly disease resistant', 'N/A', 'N/A', 'N/A', 'N/A', 'Low', false, 'Adapted to wet environments, resistant to local diseases.'),
('Umblachery', 'Foot and Mouth Disease (FMD)', 'Viral', 'Blisters, fever.', 'Vaccination.', 'Supportive care.', 'High', true, 'Vaccinate regularly.'),
('Banni', 'Hemorrhagic Septicemia (HS)', 'Bacterial', 'Fever, throat swelling.', 'Vaccination.', 'Antibiotics.', 'High', true, 'Common in buffalo.'),
('Jaffrabadi', 'Mastitis', 'Bacterial', 'Swollen udder, painful.', 'Milking hygiene.', 'Antibiotics.', 'Medium', false, 'High yielders are more susceptible.'),
('Mehsana', 'Brucellosis', 'Bacterial', 'Abortion.', 'Vaccination.', 'Cull.', 'High', true, 'Zoonotic risk.'),
('Nagpuri', 'Fascioliasis', 'Parasitic', 'Weight loss.', 'Deworming.', 'Flukicides.', 'Medium', false, 'Control snails.'),
('Nili Ravi', 'Hemorrhagic Septicemia (HS)', 'Bacterial', 'Swollen throat, fever.', 'Vaccination.', 'Antibiotics.', 'High', true, 'High mortality.'),
('Shurti', 'Foot and Mouth Disease (FMD)', 'Viral', 'Blisters, lameness.', 'Vaccination.', 'Supportive care.', 'High', true, 'Isolate and report.');

CREATE TABLE IF NOT EXISTS symptoms_lookup (
    id SERIAL PRIMARY KEY,
    symptom VARCHAR(200) NOT NULL,
    disease_name VARCHAR(200) NOT NULL,
    breed_type VARCHAR(50) DEFAULT 'both',
    severity VARCHAR(20),
    remedy TEXT,
    prevention TEXT
);

INSERT INTO symptoms_lookup
(symptom, disease_name, severity, remedy, prevention) VALUES
('High fever', 'Foot and Mouth Disease', 'High',
 'Symptomatic treatment, consult vet', 'Biannual vaccination'),
('Blisters on mouth', 'Foot and Mouth Disease', 'High',
 'Wash with antiseptic, consult vet', 'Biannual vaccination'),
('Lameness', 'Foot and Mouth Disease', 'High',
 'Rest, antiseptic wash, consult vet', 'Vaccination'),
('Swollen udder', 'Mastitis', 'Medium',
 'Antibiotic infusion, consult vet', 'Clean milking practices'),
('Reduced milk', 'Mastitis', 'Medium',
 'Antibiotic treatment, consult vet', 'Teat dipping after milking'),
('Abortion', 'Brucellosis', 'High',
 'No cure, cull positive animals', 'Brucella vaccine'),
('Swollen neck', 'Hemorrhagic Septicemia', 'Critical',
 'Antibiotic immediately, consult vet', 'Annual HS vaccination'),
('Bloating', 'Bloat', 'High',
 'Trocar puncture, consult vet urgently', 'Avoid wet legume grazing'),
('Diarrhea', 'Salmonellosis', 'Medium',
 'ORS, antibiotics, consult vet', 'Hygiene, clean water'),
('Weight loss', 'Tuberculosis', 'High',
 'Test and cull, consult vet', 'Regular TB testing'),
('Nasal discharge', 'Pneumonia', 'Medium',
 'Antibiotics, consult vet', 'Avoid drafts, vaccination'),
('Tick infestation', 'Theileriosis', 'High',
 'Buparvaquone injection, consult vet', 'Regular tick control'),
('Loss of appetite', 'Ketosis', 'Medium',
 'Glucose drip, consult vet', 'Balanced diet'),
('Rough coat', 'Nutritional deficiency', 'Low',
 'Mineral supplements, balanced diet',
 'Regular mineral supplementation'),
('Pale mucous membranes', 'Anaemia', 'Medium',
 'Iron supplements, deworm, consult vet', 'Regular deworming'),
('High fever', 'Black Quarter', 'Critical',
 'Penicillin immediately, consult vet', 'Annual BQ vaccination'),
('Swelling of hindquarters', 'Black Quarter', 'Critical',
 'Penicillin immediately, consult vet', 'Annual BQ vaccination'),
('Drooling', 'Foot and Mouth Disease', 'High',
 'Symptomatic treatment, consult vet', 'Biannual vaccination'),
('Retained placenta', 'Brucellosis', 'High',
 'Manual removal, antibiotics, consult vet', 'Brucella vaccine'),
('Difficulty breathing', 'Hemorrhagic Septicemia', 'Critical',
 'Emergency vet care immediately', 'Annual HS vaccination');

CREATE TABLE IF NOT EXISTS seasonal_diet (
    id SERIAL PRIMARY KEY,
    breed_name VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL,
    dry_fodder_kg VARCHAR(50),
    green_fodder_kg VARCHAR(50),
    concentrate_kg VARCHAR(50),
    water_liters VARCHAR(50),
    special_fodder TEXT,
    management_tips TEXT,
    health_alerts TEXT
);


INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Amritmahal', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Amritmahal', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Amritmahal', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Bachaur', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Bachaur', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Bachaur', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Bargur', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Bargur', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Bargur', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Bhadawari', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Bhadawari', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Bhadawari', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Dangi', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Dangi', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Dangi', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Deoni', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Deoni', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Deoni', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Gaolao', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Gaolao', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Gaolao', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Gir', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Gir', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Gir', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Hallikar', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Hallikar', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Hallikar', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Hariana', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Hariana', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Hariana', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Kangayam', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Kangayam', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Kangayam', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Kankrej', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Kankrej', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Kankrej', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Kenkattha', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Kenkattha', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Kenkattha', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Khillari', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Khillari', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Khillari', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Krishna Valley', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Krishna Valley', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Krishna Valley', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Malvi', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Malvi', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Malvi', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Mewati', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Mewati', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Mewati', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Murrah', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Murrah', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Murrah', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Nagori', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Nagori', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Nagori', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Nimari', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Nimari', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Nimari', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Ongole', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Ongole', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Ongole', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Ponwar', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Ponwar', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Ponwar', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Red Sindhi', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Red Sindhi', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Red Sindhi', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Sahiwal', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Sahiwal', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Sahiwal', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Siri', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Siri', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Siri', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');

INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('Tharparkar', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('Tharparkar', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('Tharparkar', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');
