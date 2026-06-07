from app.rag.loader import get_vectorstore

def get_retriever(k: int = 4):
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(search_kwargs={"k": k})