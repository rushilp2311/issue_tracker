# SQL Queries

This file has all the queries require to refer for the database operations.

Database Name: issue_tacker List of Tables (Relations)

1. attachment
2. comment
3. company
4. issue
5. issue_epic
6. member
7. member_access
8. priority
9. project
10. project_issues
11. role
12. sprint
13. status
14. sprint

## Users

- **To Get all members**
  - `SELECT * from member`
- **To Get specific limit of members**
  - <code> SELECT \* from member **LIMIT** 5</code>
- **To add a member to database**
  - <code> INSERT INTO member(name, email, password, company_id, joining_date, last_login) VALUES ('demo','demouser@demo.com','alkjdsf2##)@SDl',1,'08/01/2021','08/01/2021')</code>