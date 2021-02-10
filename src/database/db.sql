CREATE TABLE COMPANY (
    company_id SERIAL PRIMARY KEY NOT NULL,
    company_name VARCHAR(255)
);

CREATE TABLE STATUS(
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(255)
);
CREATE TABLE TYPE (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(255)
);

CREATE TABLE ROLE(
    role_id SERIAL PRIMARY KEY,
    role_title VARCHAR(255)
);

CREATE TABLE MEMBER(
    member_id SERIAL PRIMARY KEY ,
    name VARCHAR(300) NOT NULL,
    email VARCHAR(300) NOT NULL,
    company_id INTEGER,
    is_admin BOOLEAN DEFAULT false,
    password VARCHAR(255) NOT NULL,
    image TEXT,
    login_count INTEGER DEFAULT 0,
    joining_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATE,
    FOREIGN KEY (company_id) REFERENCES company(company_id)
);

CREATE TABLE PROJECT(
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    status_id INTEGER NOT NULL DEFAULT 1,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE
);

CREATE TABLE ISSUES(
    issue_id SERIAL PRIMARY KEY,
    issue_title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee INTEGER,
    status_id  INTEGER NOT NULL DEFAULT 1,
    type_id INTEGER NOT NULL DEFAULT 1,
    priority INTEGER NOT NULL DEFAULT 1,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    sprint_id INTEGER,
    FOREIGN KEY (assignee) REFERENCES MEMBER(member_id),
    FOREIGN KEY (status_id) REFERENCES STATUS(status_id),
    FOREIGN KEY (type_id) REFERENCES TYPE(type_id),
    FOREIGN KEY (priority) REFERENCES PRIORITY(priority_id),
    FOREIGN KEY (sprint_id) REFERENCES SPRINT(sprint_id)
);
CREATE TABLE PRIORITY(
    priority_id SERIAL PRIMARY KEY,
    priority_type VARCHAR(255) NOT NULL
);

CREATE TABLE SPRINT (
    sprint_id SERIAL PRIMARY KEY,
    sprint_name VARCHAR(255) NOT NULL
);

CREATE TABLE USER_ACCESS(
    member_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (member_id) REFERENCES MEMBER(member_id),
    FOREIGN KEY (project_id) REFERENCES PROJECT(project_id),
    FOREIGN KEY (role_id) REFERENCES ROLE(role_id),
    PRIMARY KEY (member_id,project_id,role_id)
);

CREATE TABLE ISSUE_EPIC (
    epic_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    FOREIGN KEY (epic_id) REFERENCES ISSUES(issue_id),
    FOREIGN KEY (story_id) REFERENCES ISSUES(issue_id),
    PRIMARY KEY (epic_id, story_id)
);

CREATE TABLE PROJECT_ISSUES (
    project_id INTEGER NOT NULL,
    issue_id INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES PROJECT (project_id),
    FOREIGN KEY (issue_id) REFERENCES ISSUES(issue_id),
    PRIMARY KEY (project_id, issue_id)
);

CREATE TABLE COMMENT(
    comment_id SERIAL,
    issue_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES ISSUES(issue_id),
    FOREIGN KEY (member_id) REFERENCES MEMBER(member_id),
    PRIMARY KEY (comment_id,issue_id,member_id)
);

CREATE TABLE ATTACHMENT (
    attachment_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    issue_id INTEGER NOT NULL,
    attachment_url TEXT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES MEMBER(member_id),
    FOREIGN KEY (issue_id) REFERENCES ISSUES(issue_id)
);

INSERT INTO ROLE(role_title) VALUES ('CAN_VIEW');
INSERT INTO ROLE(role_title) VALUES ('CAN_EDIT');
INSERT INTO ROLE(role_title) VALUES ('CAN_COMMENT');
INSERT INTO ROLE(role_title) VALUES ('PROJECT_ADMIN');

INSERT INTO STATUS(status_name) VALUES ('OPEN');
INSERT INTO STATUS(status_name) VALUES ('IN-PROGRESS');
INSERT INTO STATUS(status_name) VALUES ('IN-REVIEW');
INSERT INTO STATUS(status_name) VALUES ('BLOCKED');
INSERT INTO STATUS(status_name) VALUES ('DONE');

INSERT INTO TYPE(type_name) VALUES ('BUG');
INSERT INTO TYPE(type_name) VALUES ('EPIC');
INSERT INTO TYPE(type_name) VALUES ('STORY');