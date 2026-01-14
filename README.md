# GraphRAG: Structured Retrieval-Augmented Generation from PDFs using Knowledge Graphs

> **A Berkeley-style systems + ML project** exploring how structured knowledge graphs can outperform flat vector retrieval for multi-hop reasoning over documents.

This repository implements a **Graph-based RAG (GraphRAG)** pipeline that ingests PDF documents, extracts entities and relationships using LLMs, stores them in **Neo4j**, and serves **grounded, interpretable answers** via **FastAPI**.

The project emphasizes **system design, modularity, and reasoning transparency**, aligning closely with coursework and research themes in **Berkeley CS / EECS** (e.g. CS 182, CS 189, CS 286, INFO 290).

---

## 🎯 Motivation (Recruiter-Oriented)

Most RAG systems rely purely on vector similarity, which:

* struggles with **multi-hop questions**
* provides **opaque reasoning paths**
* ignores **explicit structure** present in technical documents

This project investigates an alternative:

> **Can we recover and reason over the latent structure of documents using knowledge graphs, and use that structure to guide generation?**

GraphRAG enables:

* relational reasoning (entity → relationship → entity)
* explainable retrieval ("why this context?")
* stronger performance on analytical questions

---

## 🧠 System Architecture

```
PDF Documents
      ↓
Text Extraction & Chunking
      ↓
LLM-based Entity & Relation Extraction
      ↓
Neo4j Knowledge Graph
      ↓
Graph Retrieval (k-hop subgraph expansion)
      ↓
LLM Answer Generation (grounded)
      ↓
FastAPI Interface
```

This mirrors how real-world ML systems decompose **unstructured data → structured representations → reasoning layers**.

---

## 📁 Codebase Structure (Designed for Readability)

```
.
├── app/                     # FastAPI application layer
│   ├── main.py
│   ├── api.py
│   ├── schemas.py
│   └── config.py
│
├── ingestion/               # Offline document processing
│   ├── pdf_loader.py
│   ├── chunker.py
│   ├── extractor.py         # LLM-based entity/relation extraction
│   └── ingest.py
│
├── graph/                   # Knowledge graph abstraction
│   ├── neo4j.py
│   ├── writer.py
│   └── queries.py
│
├── rag/                     # Retrieval + generation logic
│   ├── retriever.py
│   ├── prompt.py
│   └── generator.py
│
├── scripts/                 # CLI utilities
│   └── ingest_pdfs.py
│
├── data/pdfs/               # Input documents
├── requirements.txt
├── .env.example
└── README.md
```

The separation mirrors **research codebases** and production ML stacks.

---

## ⚙️ Setup

```bash
git clone https://github.com/your-username/graph-rag-pdf-neo4j.git
cd graph-rag-pdf-neo4j
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

```
OPENAI_API_KEY=your_key
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

---

## 🕸️ Neo4j (Local)

```bash
docker run \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:5
```

---

## 📄 Ingesting Documents

```bash
python scripts/ingest_pdfs.py
```

Pipeline stages:

1. PDF text extraction
2. Semantic chunking
3. Entity + relationship extraction
4. Graph population with typed nodes and edges

---

## 💬 Query API

```bash
uvicorn app.main:app --reload
```

**POST /query**

```json
{
  "question": "How do the main concepts relate to each other?"
}
```

**Response includes:**

* generated answer
* entities used
* relationships traversed

This exposes the *reasoning substrate*, not just the final output.

---

## 🔍 Why This Matters

| Vector RAG      | GraphRAG           |
| --------------- | ------------------ |
| Similarity-only | Structure-aware    |
| Weak multi-hop  | Strong multi-hop   |
| Opaque          | Interpretable      |
| Flat context    | Relational context |

This approach is particularly relevant for:

* technical documentation
* research papers
* policy / legal text
* enterprise knowledge bases

---

## 📈 Extensions (Planned / Natural Next Steps)

* Hybrid **Graph + Vector** retrieval
* Learned entity extraction models
* Graph-based reranking
* UI visualization of reasoning paths
* Evaluation on multi-hop QA benchmarks

---

## 🛠️ Tech Stack

* Python
* FastAPI
* Neo4j
* LLMs (OpenAI-compatible)
* Pydantic
* Docker

---

## 📌 Author Notes

This project was built to explore **agentic retrieval, system design, and structured reasoning**, and reflects interests in **ML systems, applied NLP, and knowledge representation**.

---

## 📜 License

MIT License
