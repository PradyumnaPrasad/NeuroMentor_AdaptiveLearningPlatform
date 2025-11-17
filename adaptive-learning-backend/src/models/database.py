from pymongo import MongoClient
from bson.objectid import ObjectId
import os

class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGODB_URI"))
        self.db = self.client[os.getenv("DB_NAME")]

    def get_collection(self, collection_name):
        return self.db[collection_name]

    def insert_document(self, collection_name, document):
        collection = self.get_collection(collection_name)
        result = collection.insert_one(document)
        return str(result.inserted_id)

    def find_document(self, collection_name, query):
        collection = self.get_collection(collection_name)
        return collection.find_one(query)

    def update_document(self, collection_name, query, update):
        collection = self.get_collection(collection_name)
        result = collection.update_one(query, {"$set": update})
        return result.modified_count

    def delete_document(self, collection_name, query):
        collection = self.get_collection(collection_name)
        result = collection.delete_one(query)
        return result.deleted_count

    def close(self):
        self.client.close()