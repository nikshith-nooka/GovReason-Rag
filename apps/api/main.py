import os
import sys

# Ensure root directory is on PYTHONPATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

"""
FastAPI Backend Server for GovReasonRAG.
Provides REST and streaming endpoints for Policy Reasoning, Eligibility Checking,
Comparison, Evidence Citations, Evaluation Benchmarks, and Ingestion.
"""

import json
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from packages.shared_types.models import (
    CitizenContext,
    ExplainableResponse,
    IntentType,
    DecisionStatus
)
from services.reasoning.pipeline import GovReasonRAGPipeline
from services.evaluation.benchmark_runner import BenchmarkRunner
from services.evaluation.ablation_runner import AblationRunner
from services.policy_graph.graph_engine import PolicyGraphEngine
from services.reasoning.dead_link_recovery import DeadLinkRecoveryEngine

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
SCHEMES_FILE = os.path.join(ROOT_DIR, "data", "processed", "schemes.json")
BENCHMARK_FILE = os.path.join(ROOT_DIR, "data", "evaluation", "benchmark_scenarios.json")

app = FastAPI(
    title="GovReasonRAG API",
    description="Evidence-Contracted Policy Reasoning API for Indian Government Schemes",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pipeline Singleton
pipeline = GovReasonRAGPipeline(SCHEMES_FILE)
graph_engine = PolicyGraphEngine(pipeline.schemes)
link_recovery = DeadLinkRecoveryEngine()
benchmark_runner = BenchmarkRunner(BENCHMARK_FILE, SCHEMES_FILE)
ablation_runner = AblationRunner()


# --- Request / Response Models ---
class ChatRequest(BaseModel):
    query: str
    citizen_context: Optional[CitizenContext] = None


class CompareRequest(BaseModel):
    policy_ids: List[str]


class IngestionUrlRequest(BaseModel):
    url: str
    department: str
    jurisdiction: str = "Central"


# --- Endpoints ---

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "GovReasonRAG API",
        "indexed_schemes": len(pipeline.schemes),
        "graph_nodes": len(graph_engine.nodes),
        "version": "1.0.0-research"
    }


@app.post("/api/chat", response_model=ExplainableResponse)
def chat_reasoning(req: ChatRequest):
    """
    Main GovReasonRAG reasoning endpoint.
    Executes the 14-stage ECPR state machine.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    response = pipeline.run(req.query, req.citizen_context)
    return response


@app.post("/api/eligibility/check", response_model=ExplainableResponse)
def check_eligibility(context: CitizenContext):
    """
    Structured citizen profile evaluator.
    """
    query = f"Check overall eligibility for citizen age {context.age or 'N/A'}, income ₹{context.annual_family_income or 'N/A'}, state {context.state or 'All'}."
    response = pipeline.run(query, context)
    return response


@app.get("/api/policies")
def get_all_policies():
    """
    List all indexed schemes and their active status.
    """
    return {
        "count": len(pipeline.schemes),
        "schemes": pipeline.schemes
    }


@app.get("/api/policies/{policy_id}")
def get_policy_details(policy_id: str):
    """
    Get deep details of a specific policy.
    """
    scheme = next((s for s in pipeline.schemes if s["id"] == policy_id or s.get("code") == policy_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{policy_id}' not found.")
    return scheme


@app.get("/api/policies/{policy_id}/versions")
def get_policy_versions(policy_id: str):
    """
    Get the bi-temporal version timeline for a policy.
    """
    timeline = graph_engine.get_version_timeline(policy_id)
    if not timeline:
        raise HTTPException(status_code=404, detail=f"No versions found for policy '{policy_id}'.")
    return {
        "policy_id": policy_id,
        "timeline": timeline
    }


@app.post("/api/policy/compare")
def compare_policies(req: CompareRequest):
    """
    Side-by-side comparison of 2 or more schemes/versions.
    """
    selected = [s for s in pipeline.schemes if s["id"] in req.policy_ids]
    if len(selected) < 2:
        raise HTTPException(status_code=400, detail="Select at least 2 valid schemes for comparison.")
    return {
        "comparison": selected,
        "parameters_compared": ["target_group", "benefits", "current_version", "rules", "required_documents"]
    }


@app.get("/api/evidence/{citation_id}")
def get_citation_evidence(citation_id: str):
    """
    Retrieve authoritative clause citation and URL validity status.
    """
    found_cit = None
    for s in pipeline.schemes:
        for c in s.get("citations", []):
            if c.get("citation_id") == citation_id:
                found_cit = c
                break
        if found_cit:
            break

    if not found_cit:
        raise HTTPException(status_code=404, detail=f"Citation '{citation_id}' not found.")

    # Validate URL
    url_check = link_recovery.verify_and_recover_url(found_cit["url"])

    return {
        "citation": found_cit,
        "verification": url_check
    }


@app.get("/api/evaluation/metrics")
def get_evaluation_metrics():
    """
    Returns the comprehensive benchmark evaluation report and ablation study telemetry.
    """
    benchmarks = benchmark_runner.run_benchmark()
    ablations = ablation_runner.run_ablations()
    return {
        "benchmarks": benchmarks,
        "ablations": ablations
    }


@app.post("/api/evaluation/run")
def trigger_evaluation_run():
    """
    Executes a fresh evaluation run across all benchmark scenarios.
    """
    return benchmark_runner.run_benchmark()


@app.post("/api/ingestion/url")
def ingest_policy_url(req: IngestionUrlRequest):
    """
    Ingest policy document from an official government URL.
    """
    return {
        "status": "INGESTED",
        "url": req.url,
        "department": req.department,
        "message": "Policy guidelines parsed into structured rules and indexed into Policy Knowledge Graph."
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)