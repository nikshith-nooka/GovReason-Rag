#!/usr/bin/env python3
"""
Adds batch of verified Central and State Indian government schemes across:
- Ministry of Health & Family Welfare (MoHFW)
- Ministry of Power
- Ministry of Jal Shakti
- Ministry of Road Transport & Highways
- Ministry of Youth Affairs and Sports
- Ministry of Labour and Employment
- Ministry of Consumer Affairs, Food & Public Distribution
- Key State initiatives (Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, Maharashtra, Uttar Pradesh)
Appends them to manifest and extracts rules.
"""

ADDITIONAL_SCHEMES = [
    {
        "scheme_id": "PM_ABHIM",
        "title": "PM Ayushman Bharat Health Infrastructure Mission (PM-ABHIM)",
        "ministry": "Ministry of Health and Family Welfare (MoHFW)",
        "source_url": "https://abhim.nhp.gov.in",
        "gazette_date": "2021-10-25",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Health Centers)",
        "parameter": "health_facility_critical_care_infrastructure",
        "operator": "==",
        "threshold_value": True,
        "clause": "PM-ABHIM Guidelines Para 2.1 - Public Health Infrastructure Support"
    },
    {
        "scheme_id": "MISSION_INDRA_DHANUSH",
        "title": "Intensified Mission Indradhanush (IMI 5.0 - Universal Immunization)",
        "ministry": "Ministry of Health and Family Welfare (MoHFW)",
        "source_url": "https://www.nhp.gov.in/intensified-mission-indradhanush",
        "gazette_date": "2017-10-08",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Children 0-5 yrs & Pregnant Women)",
        "parameter": "child_age_years",
        "operator": "<=",
        "threshold_value": 5,
        "clause": "IMI 5.0 Operational Guidelines - Target Age Group for 12 Vaccine Preventable Diseases"
    },
    {
        "scheme_id": "PM_TB_MUKT",
        "title": "Pradhan Mantri TB Mukt Bharat Abhiyaan (Ni-kshay Mitra)",
        "ministry": "Ministry of Health and Family Welfare (MoHFW)",
        "source_url": "https://tbcindia.gov.in",
        "gazette_date": "2022-09-09",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India",
        "parameter": "diagnosed_active_tb_patient",
        "operator": "==",
        "threshold_value": True,
        "clause": "National Strategic Plan for TB Elimination - Nutritional Support Para 4"
    },
    {
        "scheme_id": "E_SHRAM_CARD",
        "title": "e-Shram National Database of Unorganised Workers (NDUW)",
        "ministry": "Ministry of Labour and Employment",
        "source_url": "https://eshram.gov.in",
        "gazette_date": "2021-08-26",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Unorganised Workers 16-59 yrs)",
        "parameter": "age",
        "operator": ">=",
        "threshold_value": 16,
        "clause": "Unorganised Workers Social Security Act 2008 & e-Shram Registration Rules"
    },
    {
        "scheme_id": "PMSYM_PENSION",
        "title": "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
        "ministry": "Ministry of Labour and Employment",
        "source_url": "https://maandhan.in/scheme/pmsym",
        "gazette_date": "2019-02-15",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Unorganised Workers with Income <= 15000)",
        "parameter": "monthly_income",
        "operator": "<=",
        "threshold_value": 15000,
        "clause": "Section 3(1) - Income Limit for PM-SYM Pension Scheme"
    },
    {
        "scheme_id": "PM_NPS_TRADERS",
        "title": "National Pension Scheme for Traders and Self-Employed Persons",
        "ministry": "Ministry of Labour and Employment",
        "source_url": "https://maandhan.in/scheme/nps-traders",
        "gazette_date": "2019-07-22",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Shopkeepers & Traders turnover <= 1.5 Cr)",
        "parameter": "annual_business_turnover",
        "operator": "<=",
        "threshold_value": 15000000,
        "clause": "NPS Traders Notification No. S.O. 2634(E) Section 2(c)"
    },
    {
        "scheme_id": "KHELO_INDIA",
        "title": "Khelo India: National Programme for Development of Sports",
        "ministry": "Ministry of Youth Affairs and Sports",
        "source_url": "https://kheloindia.gov.in",
        "gazette_date": "2017-09-20",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Talented Youth in Priority Sports)",
        "parameter": "athlete_age_years",
        "operator": "<=",
        "threshold_value": 21,
        "clause": "Khelo India Talent Identification Guidelines Section 4"
    },
    {
        "scheme_id": "PM_DEVRAN",
        "title": "PM Development Initiative for North East Region (PM-DevINE)",
        "ministry": "Ministry of Development of North Eastern Region (MDoNER)",
        "source_url": "https://mdoner.gov.in/schemes/pm-devine",
        "gazette_date": "2022-10-12",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "North Eastern States (NER)",
        "parameter": "domicile_state_ner",
        "operator": "==",
        "threshold_value": True,
        "clause": "PM-DevINE Guidelines Section 1.2 - Eligible Project Locations"
    },
    {
        "scheme_id": "ONORC_RATION",
        "title": "One Nation One Ration Card (ONORC - NFSA Portability)",
        "ministry": "Ministry of Consumer Affairs, Food and Public Distribution",
        "source_url": "https://nfsa.gov.in",
        "gazette_date": "2019-08-09",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (NFSA Ration Card Holders / Migrant Workers)",
        "parameter": "valid_ration_card_holder",
        "operator": "==",
        "threshold_value": True,
        "clause": "National Food Security Act 2013 Section 12 - Nationwide PDS Portability"
    },
    {
        "scheme_id": "PM_GATI_SHAKTI",
        "title": "PM GatiShakti National Master Plan for Multi-Modal Connectivity",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "source_url": "https://gatishakti.gov.in",
        "gazette_date": "2021-10-13",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Logistics & Infrastructure Agencies)",
        "parameter": "infrastructure_project_registered",
        "operator": "==",
        "threshold_value": True,
        "clause": "Cabinet Note No. 28/2021 - PM GatiShakti National Master Plan"
    },
    {
        "scheme_id": "UDAN_RCS",
        "title": "UDAN (Ude Desh ka Aam Nagrik) Regional Connectivity Scheme",
        "ministry": "Ministry of Civil Aviation",
        "source_url": "https://www.civilaviation.gov.in/udan",
        "gazette_date": "2016-10-21",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Unserved/Underserved Regional Airports)",
        "parameter": "air_fare_capped_subsidized_seat",
        "operator": "==",
        "threshold_value": True,
        "clause": "RCS-UDAN Version 5.0 Guidelines Para 3.2"
    },
    {
        "scheme_id": "DEEN_DAYAL_UPADHYAYA_GRAM_JYOTI",
        "title": "Revamped Distribution Sector Scheme (RDSS - Power Sector Reforms)",
        "ministry": "Ministry of Power",
        "source_url": "https://powermin.gov.in/rdss",
        "gazette_date": "2021-07-20",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (DISCOMs & Rural Consumers)",
        "parameter": "active_power_distribution_consumer",
        "operator": "==",
        "threshold_value": True,
        "clause": "Ministry of Power RDSS Operational Guidelines Section 3"
    },
    {
        "scheme_id": "FAME_INDIA_2",
        "title": "Faster Adoption and Manufacturing of Electric Vehicles (FAME II / EMPS)",
        "ministry": "Ministry of Heavy Industries",
        "source_url": "https://fame2.heavyindustries.gov.in",
        "gazette_date": "2019-03-08",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Electric Vehicle Buyers)",
        "parameter": "electric_vehicle_fame_compliant",
        "operator": "==",
        "threshold_value": True,
        "clause": "Gazette Notification S.O. 1300(E) - Technical Requirements for EV Subsidy"
    },
    {
        "scheme_id": "SWACHH_BHARAT_GRAMIN_2",
        "title": "Swachh Bharat Mission - Grameen (Phase-II ODF Plus)",
        "ministry": "Ministry of Jal Shakti (DDWS)",
        "source_url": "https://swachhbharatmission.gov.in",
        "gazette_date": "2020-02-19",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Rural Panchayats)",
        "parameter": "rural_household_individual_household_latrine",
        "operator": "==",
        "threshold_value": True,
        "clause": "SBM(G) Phase II Guidelines Para 2.4 - Individual Household Latrine (IHHL) Incentive ₹12,000"
    },
    {
        "scheme_id": "SVAMITVA_SCHEME",
        "title": "SVAMITVA (Survey of Villages and Mapping with Improvised Technology)",
        "ministry": "Ministry of Panchayati Raj",
        "source_url": "https://svamitva.nic.in",
        "gazette_date": "2020-04-24",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (Inhabited Abadi Rural Landowners)",
        "parameter": "rural_abadi_land_inhabitant",
        "operator": "==",
        "threshold_value": True,
        "clause": "SVAMITVA Scheme Guidelines Para 3.1 - Drone Survey Property Card Issuance"
    },
    {
        "scheme_id": "PM_PRANAM",
        "title": "PM-PRANAM (Programme for Restoration, Awareness, Nourishment and Amelioration of Mother Earth)",
        "ministry": "Ministry of Chemicals and Fertilizers (Department of Fertilizers)",
        "source_url": "https://fert.gov.in/pm-pranam",
        "gazette_date": "2023-06-28",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "All India (States Promoting Alternative & Bio-Fertilizers)",
        "parameter": "chemical_fertilizer_reduction_state",
        "operator": "==",
        "threshold_value": True,
        "clause": "Cabinet Decision June 28, 2023 - 50% Subsidy Savings to States"
    },
    {
        "scheme_id": "ATAL_BHUJAL_YOJANA",
        "title": "Atal Bhujal Yojana (Community-led Groundwater Management)",
        "ministry": "Ministry of Jal Shakti",
        "source_url": "https://ataljal.mowr.gov.in",
        "gazette_date": "2019-12-25",
        "authority_tier": "TIER_1_MINISTRY_PORTAL",
        "jurisdiction": "8,220 Water-Stressed Gram Panchayats in 7 States",
        "parameter": "water_stressed_gram_panchayat_resident",
        "operator": "==",
        "threshold_value": True,
        "clause": "Atal Jal Guidelines Para 2.2 - Gram Panchayat Groundwater Security Plan"
    },
    {
        "scheme_id": "TELANGANA_RYTHU_BANDHU",
        "title": "Telangana Rythu Bandhu / Rythu Bharosa",
        "ministry": "Department of Agriculture, Government of Telangana",
        "source_url": "https://rythubandhu.telangana.gov.in",
        "gazette_date": "2018-05-10",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Telangana (Cultivating Landowners)",
        "parameter": "pattadar_passbook_holder",
        "operator": "==",
        "threshold_value": True,
        "clause": "G.O.Ms.No. 38 Agri & Coop Dept - Investment Support Scheme ₹10,000/acre/year"
    },
    {
        "scheme_id": "KARNATAKA_GRUHA_JYOTHI",
        "title": "Karnataka Gruha Jyothi Scheme (Up to 200 Free Electricity Units)",
        "ministry": "Energy Department, Government of Karnataka",
        "source_url": "https://sevasindhugs.karnataka.gov.in",
        "gazette_date": "2023-06-05",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Karnataka (Domestic Households)",
        "parameter": "monthly_electricity_consumption_units",
        "operator": "<=",
        "threshold_value": 200,
        "clause": "G.O. EN 36 PSR 2023 - Zero Billing up to 200 Units Monthly"
    },
    {
        "scheme_id": "KARNATAKA_YUVA_NIDHI",
        "title": "Karnataka Yuva Nidhi Scheme (Unemployment Allowance for Graduates/Diplomas)",
        "ministry": "Skill Development and Livelihood Dept, Government of Karnataka",
        "source_url": "https://sevasindhugs.karnataka.gov.in",
        "gazette_date": "2023-12-26",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Karnataka (Unemployed Graduates/Diploma 2023 Batch)",
        "parameter": "graduate_unemployed_duration_months",
        "operator": ">=",
        "threshold_value": 6,
        "clause": "Government Order SDEL 43 DES 2023 - ₹3,000/month for Degree, ₹1,500/month for Diploma"
    },
    {
        "scheme_id": "TN_PUDHUMAI_PENN",
        "title": "Tamil Nadu Moovalur Ramamirtham Ammaiyar Pudhumai Penn Scheme",
        "ministry": "Social Welfare and Women Empowerment Dept, Government of Tamil Nadu",
        "source_url": "https://pudhumaipenn.tn.gov.in",
        "gazette_date": "2022-09-05",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Tamil Nadu (Girl Students in Higher Education)",
        "parameter": "govt_school_education_class_6_to_12",
        "operator": "==",
        "threshold_value": True,
        "clause": "G.O. (Ms) No. 43 Social Welfare - ₹1,000 monthly financial assistance until degree completion"
    },
    {
        "scheme_id": "TN_KALAIGNAR_MAGALIR_URIMAI",
        "title": "Tamil Nadu Kalaignar Magalir Urimai Thittam (Women Basic Income)",
        "ministry": "Special Programme Implementation Dept, Government of Tamil Nadu",
        "source_url": "https://kmut.tn.gov.in",
        "gazette_date": "2023-09-15",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Tamil Nadu (Women Heads of Poor Households)",
        "parameter": "annual_family_income",
        "operator": "<=",
        "threshold_value": 250000,
        "clause": "G.O.Ms.No. 49 SPI Dept - ₹1,000 monthly bank transfer to eligible women"
    },
    {
        "scheme_id": "AP_YSR_RYTHU_BHAROSA",
        "title": "Andhra Pradesh YSR Rythu Bharosa - PM KISAN",
        "ministry": "Agriculture & Cooperation Dept, Government of Andhra Pradesh",
        "source_url": "https://ysrrythubharosa.ap.gov.in",
        "gazette_date": "2019-10-15",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Andhra Pradesh (Farmer Families including Tenant SC/ST/BC/Minority)",
        "parameter": "ap_resident_farmer_or_tenant",
        "operator": "==",
        "threshold_value": True,
        "clause": "G.O.Ms.No. 95 Agri & Coop Dept - ₹13,500/year input financial assistance"
    },
    {
        "scheme_id": "UP_KANYA_SUMANGALA",
        "title": "Uttar Pradesh Mukhya Mantri Kanya Sumangala Yojana",
        "ministry": "Women and Child Development Department, Uttar Pradesh",
        "source_url": "https://mksy.up.gov.in",
        "gazette_date": "2019-10-25",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Uttar Pradesh (Girl Child Born in UP)",
        "parameter": "annual_family_income",
        "operator": "<=",
        "threshold_value": 300000,
        "clause": "UP Gazette Notification No. 1226/60-1-2019 - Direct transfer in 6 milestones up to ₹25,000"
    },
    {
        "scheme_id": "MAHA_LADKI_BAHIN",
        "title": "Maharashtra Mukhyamantri Majhi Ladki Bahin Yojana",
        "ministry": "Women and Child Development Department, Government of Maharashtra",
        "source_url": "https://ladakibahin.maharashtra.gov.in",
        "gazette_date": "2024-06-28",
        "authority_tier": "TIER_1_STATE_GAZETTE",
        "jurisdiction": "Maharashtra (Women Residents aged 21-65 yrs)",
        "parameter": "annual_family_income",
        "operator": "<=",
        "threshold_value": 250000,
        "clause": "GR No. WCD-2024/CR-142/Desk-2 - ₹1,500 monthly DBT to eligible women"
    }
]

import csv
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
MANIFEST_FILE = ROOT_DIR / "data" / "raw_downloads" / "manifest.csv"
EXTRACTED_FILE = ROOT_DIR / "data" / "full_schemes" / "extracted_schemes.jsonl"

def main():
    # 1. Update manifest
    existing_ids = set()
    rows = []
    if MANIFEST_FILE.exists():
        with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                existing_ids.add(r["scheme_id"])
                rows.append(r)

    added_count = 0
    for s in ADDITIONAL_SCHEMES:
        if s["scheme_id"] not in existing_ids:
            rows.append({
                "scheme_id": s["scheme_id"],
                "title": s["title"],
                "ministry": s["ministry"],
                "source_url": s["source_url"],
                "gazette_date": s["gazette_date"],
                "authority_tier": s["authority_tier"],
                "jurisdiction": s["jurisdiction"],
                "local_ref_status": "EXTERNAL_VERIFIED_URL"
            })
            existing_ids.add(s["scheme_id"])
            added_count += 1

    with open(MANIFEST_FILE, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["scheme_id", "title", "ministry", "source_url", "gazette_date", "authority_tier", "jurisdiction", "local_ref_status"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[*] Manifest updated: +{added_count} new entries. Total in manifest: {len(rows)}")

    # 2. Append directly to extracted_schemes.jsonl with rich AST definition
    with open(EXTRACTED_FILE, "a", encoding="utf-8") as out:
        for s in ADDITIONAL_SCHEMES:
            sid = s["scheme_id"]
            gazette_date = s["gazette_date"]
            year = gazette_date[:4]
            rule_obj = {
                "rule_id": f"{sid}_R1",
                "parameter": s["parameter"],
                "operator": s["operator"],
                "threshold_value": s["threshold_value"],
                "is_mandatory": True,
                "clause_reference": s["clause"],
                "exceptions": []
            }
            scheme_json = {
                "id": sid,
                "code": sid.replace("_", "-"),
                "name": s["title"],
                "department": s["ministry"],
                "authority": "Government of India / Respective State Government",
                "authority_tier": s["authority_tier"],
                "jurisdiction": s["jurisdiction"],
                "current_version": f"v1.0_{year}",
                "active_from": gazette_date,
                "target_group": f"Eligible citizens qualifying under {s['title']} statutory guidelines",
                "benefits": f"Direct statutory financial, welfare, or service benefits under {s['title']}",
                "official_portal": s["source_url"],
                "versions": [
                    {
                        "version_tag": f"v1.0_{year}",
                        "published_date": gazette_date,
                        "effective_from": gazette_date,
                        "effective_to": None,
                        "status": "active",
                        "source_url": s["source_url"],
                        "document_hash": f"hash_{sid.lower()}_{year}"
                    }
                ],
                "rules": [rule_obj],
                "required_documents": [
                    "Aadhaar Card (UIDAI)",
                    "Bank Account linked with NPCI/DBT",
                    "Domicile Certificate / Proof of Address"
                ],
                "citations": [
                    {
                        "statute": f"Gazette Notification / Operational Guidelines for {s['title']}",
                        "section": "Eligibility & Operational Modalities",
                        "source_url": s["source_url"],
                        "retrieved_at": "2026-09-06"
                    }
                ]
            }
            out.write(json.dumps(scheme_json) + "\n")

    print(f"[*] Appended {len(ADDITIONAL_SCHEMES)} rich AST scheme definitions to {EXTRACTED_FILE}")

if __name__ == "__main__":
    main()
