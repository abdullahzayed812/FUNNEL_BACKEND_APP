-- Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    id     VARCHAR(255) PRIMARY KEY,
    name   VARCHAR(255) NOT NULL UNIQUE
);

-- Facebook Authentication
CREATE TABLE IF NOT EXISTS facebook_authentication (
    id      VARCHAR(255) PRIMARY KEY,
    token   TEXT NOT NULL
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id                         VARCHAR(255) PRIMARY KEY,
    username                   VARCHAR(255) NOT NULL UNIQUE,
    email                      VARCHAR(255) NOT NULL UNIQUE,
    password                   VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id                    VARCHAR(255) NOT NULL,
    facebook_authentication_id VARCHAR(255),
    FOREIGN KEY (role_id) REFERENCES user_roles(id),
    FOREIGN KEY (facebook_authentication_id) REFERENCES facebook_authentication(id)
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id                  VARCHAR(255) PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    start_date          DATE,
    end_date            DATE,
    budget              DECIMAL(10, 2),
    campaign_manager_id VARCHAR(255) NOT NULL,
    order_id            VARCHAR(255) NOT NULL,
    project_id          VARCHAR(255) NOT NULL,
    FOREIGN KEY (campaign_manager_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Personas Table
CREATE TABLE IF NOT EXISTS personas (
    id   VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Campaign-Personas Many-to-Many Relationship Table
CREATE TABLE IF NOT EXISTS campaign_personas (
    campaign_id     VARCHAR(255) NOT NULL,
    persona_id      VARCHAR(255) NOT NULL,
    PRIMARY KEY (campaign_id, persona_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
);

-- Adsets Table
CREATE TABLE IF NOT EXISTS adsets (
    id                VARCHAR(255) PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    adset_facebook_id VARCHAR(255),             -- Adset id which comes from the facebook.
    persona_id        VARCHAR(255) NOT NULL,    -- Persona id which is selected from available personas in the system.
    budget            INT,                      -- Incase of smart budget allocation is off we will define budget for each adset, if smart budget allocation on the facebook will allocate the total budget on all adsets equally (automatically).
    currency          VARCHAR(5),
    start_date        DATE,
    end_date          DATE,
    duration          VARCHAR(5),
    duration_type     VARCHAR(6),
    campaign_id       VARCHAR(255) NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES personas(id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Ads Table
CREATE TABLE IF NOT EXISTS ads (
    id                  VARCHAR(255) PRIMARY KEY,
    content             TEXT,
    budget              DECIMAL(10, 2),
    duration            INT,  -- in days
    start_date          DATE,
    end_date            DATE,
    ad_facebook_id      VARCHAR(255), 
    adset_id            VARCHAR(255) NOT NULL,
    FOREIGN KEY (adset_id) REFERENCES adsets(id) ON DELETE CASCADE
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id          VARCHAR(255) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    website     VARCHAR(255) NOT NULL
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id                      VARCHAR(255) PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    template_type           ENUM('Default', 'Branded', 'Customized') NOT NULL,
    frame_svg               VARCHAR(800) NOT NULL,
    default_primary         VARCHAR(7) NOT NULL,
    default_secondary_color VARCHAR(7) NOT NULL,
    is_selected             BOOLEAN,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_id              VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Props Table (Properties of Templates)
CREATE TABLE IF NOT EXISTS template_text (
    id              VARCHAR(255) PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    font_size       INT,
    font_family     INT,
    font_weight     INT,
    text_decoration VARCHAR(15),
    font_style      VARCHAR(255),
    border_radius   INT,
    border_width    INT,
    border_style    VARCHAR(8),
    border_color    VARCHAR(7),   
    container_color VARCHAR(7),
    text_color      VARCHAR(7),
    language        VARCHAR(2),
    x_coordinate    INT,
    y_coordinate    INT,
    color           VARCHAR(20),
    project_id      VARCHAR(255) NOT NULL,
    template_id     VARCHAR(255) NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

-- Images Table
CREATE TABLE IF NOT EXISTS images (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    image_type      ENUM('Default', 'Branded', 'Customized') NOT NULL,
    is_selected     BOOLEAN,
    project_id      VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS videos (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    video_type      ENUM('Default', 'Branded', 'Customized') NOT NULL,
    is_selected     BOOLEAN,
    project_id      VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS branding (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) UNIQUE NOT NULL,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    additional_color VARCHAR(7),
    primary_font    VARCHAR(25),
    secondary_font VARCHAR(25),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id                  VARCHAR(255) PRIMARY KEY,  
    order_date          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    campaign_name       VARCHAR(255) NOT NULL,  
    industry            VARCHAR(255),  
    category            VARCHAR(255),  
    status              ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',  
    total_budget        DECIMAL(10, 2) NOT NULL,  
    payment_status      ENUM('Paid', 'Unpaid', 'Pending') DEFAULT 'Unpaid',  
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    campaign_manager_id VARCHAR(255) NOT NULL,  
    end_user_id         VARCHAR(255) NOT NULL,  
    project_id          VARCHAR(255) NOT NULL,
    FOREIGN KEY (campaign_manager_id) REFERENCES users(id),  
    FOREIGN KEY (end_user_id) REFERENCES users(id),  
    FOREIGN KEY (project_id) REFERENCES projects(id)  
);

----------------------------------------------------------

-- Facebook Insights Table
CREATE TABLE facebook_insights (
    cpl VARCHAR(255) NOT NULL,
    cpr VARCHAR(255) NOT NULL,
    ad_id VARCHAR(255) NOT NULL
);

-- Visuals Table
CREATE TABLE visuals (
    ad_id             VARCHAR(255) NOT NULL,
    ad_text_id        VARCHAR(255) NOT NULL,
    facebook_ad_id    VARCHAR(255) NOT NULL,
    is_selected       BOOLEAN NOT NULL,
    visual_image_url  VARCHAR(255) NOT NULL,
    template_id       VARCHAR(255) NOT NULL,
    image_id          VARCHAR(255) NOT NULL,
    video_id          VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Ad Text Table
CREATE TABLE ad_text (
    ad_id               VARCHAR(255) NOT NULL PRIMARY KEY,
    headline            VARCHAR(255) NOT NULL,
    punchline           VARCHAR(255) NOT NULL,
    cat                 VARCHAR(255) NOT NULL,
    primary_text        TEXT NOT NULL,
    arabic_primary_text TEXT NOT NULL,
    rating              INT NOT NULL,
    edited              BOOLEAN NOT NULL,
    is_favorites        BOOLEAN NOT NULL,
    ad_text_id          VARCHAR(255) NOT NULL,
    FOREIGN KEY (ad_text_id) REFERENCES visuals(ad_id)
);

-- -- Add arabic text for (headline, punchline, cta), and also add (text on image [headline, punchline, cta]).
-- -- Add edited in visuals table.

-- INSERT INTO facebook_insights (cpl, cpr, ad_id)
-- VALUES
--     ('CPL1', "CPR1", '1'),
--     ('CPL2', "CPR2", '2'),
--     ('CPL3', "CPR3", '3');

-- INSERT INTO visuals (ad_id, ad_text_id, facebook_ad_id, is_selected, visual_image_url, template_id, image_id, video_id)
-- VALUES
--     ('1', '1', '1', 0, '/visuals/img1.png', 'template_1', 'image_1', null),
--     ('2', '2', '2', 1, '/visuals/img2.png', 'template_2', 'image_2', null);

-- INSERT INTO ad_text (ad_id, ad_text_id, headline, punchline, cta, primary_text, arabic_primary_text, rating, edited)
-- VALUES
--     ('1', '1', 'Headline', 'Punchline', 'Book now', 'Long primary text', "نص عربي مفصل طويل", 3, 0),
--     ('1', '1', 'Headline2', 'Punchline2', 'Call me', 'Very long primary text', "نص عربي مفصل طويل", 4, 1);

-- INSERT INTO user_roles (id, name)
-- VALUES
--   ('role_1', 'Admin'),
--   ('role_2', 'User');

-- INSERT INTO facebook_authentication (id, token)
-- VALUES
--   ('fb_auth_1', 'fb_token_12345'),
--   ('fb_auth_2', 'fb_token_67890');

-- INSERT INTO users (id, username, email, password, role_id, facebook_authentication_id)
-- VALUES
--   ('user_1', 'john_doe', 'john.doe@example.com', 'hashed_password_1', 'role_1', 'fb_auth_1'),
--   ('user_2', 'jane_smith', 'jane.smith@example.com', 'hashed_password_2', 'role_2', 'fb_auth_2');

-- INSERT INTO campaigns (id, name, description, start_date, end_date, budget, campaign_manager_id, order_id)
-- VALUES
--   ('campaign_1', 'Campaign 1', 'Description of campaign 1', '2024-01-01', '2024-12-31', 1000.00, 'user_1', 'order_1'),
--   ('campaign_2', 'Campaign 2', 'Description of campaign 2', '2024-02-01', '2024-12-31', 1500.00, 'user_2', 'order_2');

-- INSERT INTO personas (id, name)
-- VALUES
--   ('persona_1', 'Persona 1'),
--   ('persona_2', 'Persona 2');

-- INSERT INTO campaign_personas (campaign_id, persona_id)
-- VALUES
--   ('campaign_1', 'persona_1'),
--   ('campaign_2', 'persona_2');


-- INSERT INTO adsets (id, name, adset_facebook_id, persona_id, budget, currency, start_date, end_date, duration, duration_type, campaign_id)
-- VALUES
--   ('adset_1', 'Adset 1', 'adset_fb_1', 'persona_1', 500, 'USD', '2024-01-01', '2024-06-30', '30', 'Days', 'campaign_1'),
--   ('adset_2', 'Adset 2', 'adset_fb_2', 'persona_2', 600, 'USD', '2024-02-01', '2024-06-30', '30', 'Days', 'campaign_2');

-- INSERT INTO ads (id, content, budget, duration, start_date, end_date, adset_id)
-- VALUES
--   ('ad_1', 'Ad content for ad 1', 200.00, 10, '2024-01-01', '2024-01-10', 'adset_1'),
--   ('ad_2', 'Ad content for ad 2', 250.00, 10, '2024-02-01', '2024-02-10', 'adset_2');

-- INSERT INTO projects (id, name, description, website)
-- VALUES
--   ('project_1', 'Project 1', 'Description of project 1', 'http://project1.com'),
--   ('project_2', 'Project 2', 'Description of project 2', 'http://project2.com');

-- INSERT INTO templates (id, name, template_type, frame_svg, default_primary, default_secondary_color, is_selected, created_at, project_id)
-- VALUES
--   ('template_1', 'Template 1', 'Default', '<svg>...</svg>', '#FFFFFF', '#000000', true, '2024-01-01 00:00:00', 'project_1'),
--   ('template_2', 'Template 2', 'Branded', '<svg>...</svg>', '#FF0000', '#00FF00', false, '2024-02-01 00:00:00', 'project_2');

-- INSERT INTO template_text (id, name, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_color, border_width, border_style, container_color, text_color, language, x_coordinate, y_coordinate, color, project_id, template_id)
-- VALUES
--   ('text_1', 'Header Text', 14, 1, 600, 'underline', 'italic', 5, '#000000', 2, 'solid', '#FFFFFF', '#000000', 'en', 10, 20, '#FF0000', 'project_1', 'template_1'),
--   ('text_2', 'Body Text', 12, 2, 400, 'none', 'normal', 0, '#FF0000', 1, 'dashed', '#0000FF', '#FFFFFF', 'en', 15, 25, '#00FF00', 'project_2', 'template_2');

-- INSERT INTO images (id, file_path, image_type, is_selected, project_id)
-- VALUES
--   ('image_1', '/images/image1.jpg', 'Branded', true, 'project_1'),
--   ('image_2', '/images/image2.jpg', 'Customized', false, 'project_2');

-- INSERT INTO branding (id, project_id, primary_color, secondary_color, additional_color, primary_font, secondary_font, created_at, updated_at)
-- VALUES
--   ('branding_1', 'project_1', '#FFFFFF', '#000000', '#FF0000', 'Arial', 'Helvetica', '2024-01-01 00:00:00', '2024-01-02 00:00:00'),
--   ('branding_2', 'project_2', '#FF0000', '#00FF00', '#0000FF', 'Verdana', 'Times New Roman', '2024-02-01 00:00:00', '2024-02-02 00:00:00');

-- INSERT INTO orders (id, order_date, campaign_name, industry, category, status, total_budget, payment_status, created_at, updated_at, campaign_manager_id, end_user_id, project_id)
-- VALUES
--   ('order_1', '2024-01-01 00:00:00', 'Campaign 1', 'Retail', 'Clothing', 'Pending', 1000.00, 'Unpaid', '2024-01-01 00:00:00', '2024-01-01 00:00:00', 'user_1', 'user_2', 'project_1'),
--   ('order_2', '2024-02-01 00:00:00', 'Campaign 2', 'Technology', 'Software', 'In Progress', 1500.00, 'Paid', '2024-02-01 00:00:00', '2024-02-01 00:00:00', 'user_2', 'user_1', 'project_2');

-- SELECT * FROM user_roles;
-- SELECT * FROM facebook_authentication;
-- SELECT * FROM users;
-- SELECT * FROM campaigns;
-- SELECT * FROM personas;
-- SELECT * FROM campaign_personas;
-- SELECT * FROM adsets;
-- SELECT * FROM ads;
-- SELECT * FROM projects;
-- SELECT * FROM templates;
-- SELECT * FROM template_text;
-- SELECT * FROM images;
-- SELECT * FROM branding;
-- SELECT * FROM orders;

-- -- Add project id to the campaign table.

-- ALTER TABLE campaigns
-- ADD COLUMN project_id VARCHAR(255);

-- ALTER TABLE campaigns
-- ADD CONSTRAINT fk_project_id
-- FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- DESCRIBE campaigns;

-- UPDATE campaigns
-- SET project_id = 'your_project_id'
-- WHERE id = 'specific_campaign_id';

 -- -- Add ad facebook id in the ads table.
-- ALTER TABLE ads
-- ADD COLUMN ad_facebook_id VARCHAR(255);

