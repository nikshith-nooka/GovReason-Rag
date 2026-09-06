"""
Integration test for full end-to-end GovReasonRAG pipeline.
"""

import os
from services.reasoning.pipeline import GovReasonRAGPipeline
from packages.shared_types.models import CitizenContext, DecisionStatus

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCHEMES_FILE = os.path.join(BASE_DIR, "data", "processed", "schemes.json")


def test_full_pipeline_student_query():
    pipeline = GovReasonRAGPipeline(SCHEMES_FILE)
    query = "I'm a 21-year-old engineering student from Telangana. My annual family income is ₹2.7 lakh. Which government scholarships or schemes may I qualify for?"
    
    response = pipeline.run(query)
    
    assert response is not None
    assert len(response.results) > 0
    assert response.research_trace["contract_id"] is not None
    assert len(response.citations) > 0
    assert len(response.required_documents) > 0
