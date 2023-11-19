#!/usr/bin/env python
import sys
sys.path.append('.')
#! Make sure to run this file from one directory up, or move the file up one directory or else it wont work !#
from main import app
from models import db
with app.app_context():
    try:
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
        print("Successfully cleared the database")
    except Exception as e:
        print(f"Error: {e.args}")
        db.session.rollback()