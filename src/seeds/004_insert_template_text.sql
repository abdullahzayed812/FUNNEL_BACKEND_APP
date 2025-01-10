
  -- Inserting first set of template texts (template_1)
INSERT INTO template_text 
(id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, template_id, text) 
VALUES
  ('1', 'headline', 55, '', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.1, 0.1, '#831843', 'template_1', 'Heart of downtown'),
  
  ('2', 'punchline', 70, '', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.04, 0.2, '#FFFFFF', 'template_1', 'WALK TO EVERYTHING'),
  
  ('3', 'cta', 36, 'PlayfairDisplay-Bold', 'normal', 'none', 'normal', 20, 0, 'solid', 'transparent', 'secondary', 'en', 0.05, 0.3, '#FFFFFF', 'template_1', 'Book now'),

-- Inserting second set of template texts (template_2)
  ('4', 'headline', 48, 'RobotoCondensed-Black', 'bold', 'none', 'italic', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.06, 0.09, '#FFFFFF', 'template_2', 'Prime locations, strong rentals'),
  
  ('5', 'punchline', 64, 'the-bold-font', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.06, 0.16, '#FFFFFF', 'template_2', 'WATCH YOUR INVESTMENT GROW'),
  
  ('6', 'cta', 36, 'the-bold-font', 'bold', 'none', 'normal', 0, 3, 'solid', '#fff', 'transparent', 'en', 0.08, 0.3, '#FFFFFF', 'template_2', 'Book Now'),

-- Inserting third set of template texts (template_3)
  ('7', 'headline', 64, 'Caveat-Bold', 'normal', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.43, 0.6, 'secondary', 'template_3', 'Income Knocks!'),
  
  ('8', 'punchline', 55, 'the-bold-font', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.43, 0.7, '#1e1e1e', 'template_3', 'INVEST YOUR FUTURE'),
  
  ('9', 'cta', 36, 'RobotoCondensed-Black', 'bold', 'none', 'normal', 10, 0, 'solid', 'transparent', 'primary', 'en', 0.73, 0.82, '#FFFFFF', 'template_3', 'Book Now'),

  ('10', 'headline', 48, 'the-bold-font', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.08, 0.63, '#ffffff', 'template_4', 'INCOME KNOCKS!'),

  ('11', 'punchline', 96, 'Caveat-Bold', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.18, 0.71, '#ffffff', 'template_4', 'Invest in your future'),

  ('12', 'cta', 36, 'RobotoCondensed-Black', 'bold', 'none', 'normal', 10, 0, 'solid', 'transparent', 'primary', 'en', 0.43, 0.86, '#ffffff', 'template_4', 'Book Now'),

-- Inserting text data for template_5
  ('13', 'headline', 64, 'Caveat-Bold', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.18, 0.38, '#ffffff', 'template_5', 'Prime locations, strong rentals'),

  ('14', 'punchline', 64, 'the-bold-font', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.14, 0.5, '#ffffff', 'template_5', 'WATCH YOUR INVESTMENT GROW'),

  ('15', 'cta', 36, 'RobotoCondensed-Black', 'bold', 'none', 'normal', 10, 0, 'solid', 'transparent', 'primary', 'en', 0.43, 0.73, '#ffffff', 'template_5', 'Book Now'),

-- Inserting text data for template_6
  ('16', 'headline', 48, 'RobotoCondensed-Black', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.12, 0.12, '#ffffff', 'template_6', 'Prime locations, strong rentals'),

  ('17', 'punchline', 64, 'the-bold-font', 'bold', 'none', 'normal', 0, 0, 'solid', 'transparent', 'transparent', 'en', 0.12, 0.19, '#ffffff', 'template_6', 'WATCH YOUR INVESTMENT GROW'),

  ('18', 'cta', 36, 'RobotoCondensed-Black', 'bold', 'none', 'normal', 10, 1, 'solid', '#fff', 'primary', 'en', 0.16, 0.87, '#ffffff', 'template_6', 'Book Now');
