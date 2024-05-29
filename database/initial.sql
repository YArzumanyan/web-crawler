CREATE TABLE web_pages (
  identifier SERIAL PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  regexp TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE nodes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  crawl_time TIMESTAMP,
  links INT[] REFERENCES nodes(id),
  owner_id INT REFERENCES web_pages(identifier)
);

INSERT INTO web_pages (label, url, regexp, tags, active) VALUES
('Example Label 1', 'https://example1.com', '.*', ARRAY['tag1', 'tag2'], TRUE),
('Example Label 2', 'https://example2.com', '.*', ARRAY['tag3', 'tag4'], FALSE);

INSERT INTO nodes (title, url, crawl_time, links, owner_id) VALUES
('Example Title 1', 'https://example1.com/page1', '2024-05-29 10:00:00', ARRAY[2], 1),
('Example Title 2', 'https://example2.com/page2', '2024-05-29 11:00:00', NULL, 2);
