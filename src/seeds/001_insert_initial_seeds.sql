INSERT INTO users (id, username, email, password, role, facebook_authentication_id)
VALUES
  ('user_1', 'john_doe', 'john.doe@example.com', 'hashed_password_1', 'Admin', 'fb_auth_1'),
  ('user_2', 'jane_smith', 'jane.smith@example.com', 'hashed_password_2', 'Agency', 'fb_auth_2');


INSERT INTO templates (
    id, 
    name, 
    type, 
    frame_svg, 
    default_primary, 
    default_secondary_color,  
    created_at,
    project_id
)
VALUES
  ('template_1', '', 'Default', 
  '<svg width="1080" height="1080" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1087.6 252.442C1087.6 254.446 1086.51 256.292 1084.75 257.259C1083 258.226 1080.85 258.162 1079.16 257.091C1064.84 248.036 1042.26 242.569 1013.89 240.551C985.678 238.544 952.402 239.988 917.221 244.22C846.833 252.687 769.448 272.236 710.737 297.009C681.625 309.292 655.557 320.82 631.083 331.644C545.1 369.669 478.781 398.998 369.22 421.826C229.885 450.858 97.3873 413.263 4.30442 386.852C2.3857 386.307 0.483692 385.768 -1.40124 385.233C-3.76798 384.563 -5.40153 382.402 -5.40146 379.942L-5.40152 189.942L-5.40157 -11.5578C-5.40167 -13.0165 -4.82209 -14.4154 -3.79068 -15.4469C-2.75926 -16.4783 -1.36025 -17.0578 0.0984138 -17.0578L1082.1 -17.0578C1083.56 -17.0578 1084.96 -16.4783 1085.99 -15.4469C1087.02 -14.4154 1087.6 -13.0165 1087.6 -11.5578L1087.6 18.4421L1087.6 18.4422L1087.6 252.442Z" hasPrimary="true" fill="#EB6E40" stroke="#F3F4E0" stroke-width="11" stroke-linejoin="round"/></svg>', 
  '#EB6E40', 
  '#133272', 
  CURRENT_TIMESTAMP, '73c264f0-45ee-4df6-866f-3b5c5211574b'),

  ('template_2', '', 'Default', 
  "<svg width='1080' height='1080' viewBox='0 0 1080 1080' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0 566L1080 338.5V0H0V566Z' hasPrimary='true' fill='#2196f3'/><path d='M616 433L1080 333.5V379.5L616 433Z' fill='#B9512A'/><path d='M607 437L1080 334V536L607 437Z' hasSecondary='true' fill='#EB6E40'/></svg>", 
  '#074A76', 
  '#EB6E40', 
  CURRENT_TIMESTAMP, '73c264f0-45ee-4df6-866f-3b5c5211574b'),

  ('template_3', '', 'Default', 
  "<svg width='1080' height='1080' viewBox='0 0 1080 1080' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M32 37.5H872C963.127 37.5 1037 111.373 1037 202.5V1042.5H197C105.873 1042.5 32 968.627 32 877.5V37.5Z' stroke='white' stroke-width='3'/><path d='M428 574H884C939.228 574 984 618.772 984 674V1001H528C472.772 1001 428 956.228 428 901V574Z' fill='#D9D9D9' fill-opacity='0.84'/></svg>", 
  '#e96c3f', 
  '#133272', 
  CURRENT_TIMESTAMP, '73c264f0-45ee-4df6-866f-3b5c5211574b'),

  ('template_4', '', 'Default', 
  "<svg width='1080' height='1080' viewBox='0 0 1080 1080' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='90.5' y='771.5' width='898' height='220' fill='black' fill-opacity='0.5' stroke='white' stroke-width='3'/></svg>", 
  '#e96c3f', 
  '', 
  CURRENT_TIMESTAMP, '73c264f0-45ee-4df6-866f-3b5c5211574b'),

  ('template_5', '', 'Default', 
  "<svg width='1080' height='1080' viewBox='0 0 1080 1080' fill='none' xmlns='http://www.w3.org/2000/svg'>n<rect x='97.5' y='263.5' width='885' height='553' rx='15.5' fill='black' fill-opacity='0.45' stroke='white' stroke-width='3'/>n</svg>", 
  '#e96c3f', 
  '', 
  CURRENT_TIMESTAMP, '73c264f0-45ee-4df6-866f-3b5c5211574b'),

  ('template_6', '', 'Default', 
  "<svg width='1080' height='1080' viewBox='0 0 1080 1080' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='33.5' y='33.5' width='1013' height='1013' fill='url(#paint0_linear_162_94)' style='mix-blend-mode:multiply'/><rect x='33.5' y='33.5' width='1013' height='1013' stroke='white' stroke-width='3'/><defs><linearGradient id='paint0_linear_162_94' x1='540' y1='32' x2='540' y2='1048' gradientUnits='userSpaceOnUse'><stop stop-color='#737373'/><stop offset='1' stop-color='#D9D9D9' stop-opacity='0'/></linearGradient></defs></svg>", 
  '#e96c3f', 
  '', 
  CURRENT_TIMESTAMP, '73c264f0-45ee-4df6-866f-3b5c5211574b');



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
