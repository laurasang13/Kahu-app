from app.rag.loader import load_and_index_docs

if __name__ == "__main__":
    print("🔄 Indexando documentos RAG en ChromaDB...")
    load_and_index_docs()
    print("✅ Indexación completada.")