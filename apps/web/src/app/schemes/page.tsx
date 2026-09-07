"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  Building2,
  HeartPulse,
  Sprout,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileText
} from "lucide-react";

interface CitizenProfile {
  name: string;
  age: number;
  gender: string;
  occupation: string;
  state: string;
  annualIncome: number;
  rationCard: "BPL / White" | "AAY" | "None / APL";
  puccaHouse: boolean;
  socialCategory: "General" | "EWS" | "OBC" | "SC" | "ST";
  disability: boolean;
}

interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  allowedOccupations?: string[];
  maxIncome?: number; // per annum
  requiredRationCard?: string[];
  puccaHouseAllowed?: boolean;
  allowedGenders?: string[];
  allowedCategories?: string[];
  stateRestriction?: string; // "All India" or specific state
}

interface Scheme {
  id: string;
  name: string;
  ministry: string;
  benefit: string;
  field:
    | "Education & Scholarships"
    | "Housing & Urban"
    | "Health & Medical"
    | "Agriculture & Farmers"
    | "Employment & MSME"
    | "Women & Child"
    | "Social Welfare & Security";
  tags: string[];
  icon: any;
  iconBg: string;
  iconColor: string;
  status: "Active" | "Upcoming";
  officialPortal: string;
  criteria: EligibilityCriteria;
  documents: string[];
  summary: string;
}

export default function ExploreSchemesPage() {
  // Current Citizen Profile
  const [profile, setProfile] = useState<CitizenProfile>({
    name: "StudyUser",
    age: 21,
    gender: "Male",
    occupation: "Student",
    state: "Telangana",
    annualIncome: 240000,
    rationCard: "BPL / White",
    puccaHouse: false,
    socialCategory: "General",
    disability: false,
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("All Fields");
  const [eligibilityFilter, setEligibilityFilter] = useState<"all" | "eligible" | "ineligible">("all");
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'benefit-high' | 'name-asc' | 'name-desc'>('recommended');

  // 8 Main Scheme Fields / Sectors
  const fields = [
    { id: "All Fields", label: "All Fields", icon: SlidersHorizontal },
    { id: "Education & Scholarships", label: "Education & Scholarships", icon: GraduationCap },
    { id: "Housing & Urban", label: "Housing & Urban", icon: Building2 },
    { id: "Health & Medical", label: "Health & Medical", icon: HeartPulse },
    { id: "Agriculture & Farmers", label: "Agriculture & Farmers", icon: Sprout },
    { id: "Employment & MSME", label: "Employment & MSME", icon: Briefcase },
    { id: "Women & Child", label: "Women & Child", icon: Users },
    { id: "Social Welfare & Security", label: "Social Welfare & Security", icon: ShieldCheck },
  ];

  // Comprehensive Catalog of authentic Indian central & state government schemes
  const schemes: Scheme[] = [
    // --- Education & Scholarships ---
    {
      id: "pm-scholarship",
      name: "PM Scholarship Scheme (PMSS)",
      ministry: "Ministry of Defence / Ministry of Education",
      benefit: "₹30,000 to ₹36,000 / year direct scholarship",
      field: "Education & Scholarships",
      tags: ["College Students", "Income < ₹5L", "Higher Education"],
      icon: GraduationCap,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://scholarships.gov.in",
      criteria: {
        minAge: 17,
        maxAge: 25,
        allowedOccupations: ["Student"],
        maxIncome: 500000,
        stateRestriction: "All India",
      },
      documents: ["College ID / Bonafide Certificate", "Marksheet of Class 12th", "Income Certificate", "Aadhaar Card"],
      summary: "Encourages higher technical & professional education with financial grants disbursed directly via DBT into bank accounts.",
    },
    {
      id: "css-scholarship",
      name: "Central Sector Scheme of Scholarship for College and University Students",
      ministry: "Department of Higher Education, Ministry of Education",
      benefit: "₹12,000 to ₹20,000 / year for undergraduate & post-graduate study",
      field: "Education & Scholarships",
      tags: ["Merit-cum-Means", "Students", "Income ≤ ₹4.5L"],
      icon: GraduationCap,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://scholarships.gov.in",
      criteria: {
        minAge: 17,
        maxAge: 26,
        allowedOccupations: ["Student"],
        maxIncome: 450000,
        stateRestriction: "All India",
      },
      documents: ["Class XII Marksheet (above 80th percentile)", "Income Certificate (≤ ₹4.5 Lakh)", "Aadhaar Card", "Bank Account Passbook"],
      summary: "Provides financial aid to meritorious students from economically weaker sections pursuing regular graduate and postgraduate courses.",
    },
    {
      id: "post-matric-sc-obc",
      name: "National Post-Matric Scholarship Scheme",
      ministry: "Ministry of Social Justice and Empowerment",
      benefit: "100% tuition waiver + ₹13,500/yr living allowance",
      field: "Education & Scholarships",
      tags: ["Post-Matric", "Students", "BPL Priority"],
      icon: GraduationCap,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://scholarships.gov.in",
      criteria: {
        minAge: 16,
        maxAge: 30,
        allowedOccupations: ["Student"],
        maxIncome: 250000,
        stateRestriction: "All India",
      },
      documents: ["Bonafide Student Certificate", "Income Certificate", "Caste / Category Proof", "Aadhaar Card"],
      summary: "Comprehensive fee reimbursement and academic maintenance support for post-matric higher education.",
    },
    {
      id: "nmms-scholarship",
      name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
      ministry: "Department of School Education and Literacy",
      benefit: "₹12,000 / year for secondary school education",
      field: "Education & Scholarships",
      tags: ["Secondary School", "Class 9-12", "Income ≤ ₹3.5L"],
      icon: GraduationCap,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://scholarships.gov.in",
      criteria: {
        minAge: 13,
        maxAge: 18,
        allowedOccupations: ["Student"],
        maxIncome: 350000,
        stateRestriction: "All India",
      },
      documents: ["Class 8 Marksheet (min 55%)", "Income Certificate", "Aadhaar Card"],
      summary: "Awarded to meritorious students of economically weaker sections to arrest dropout at Class 8 level.",
    },

    // --- Housing & Urban ---
    {
      id: "pmay-urban",
      name: "Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)",
      ministry: "Ministry of Housing and Urban Affairs",
      benefit: "Interest subsidy up to ₹2.5 Lakh on home construction/loan",
      field: "Housing & Urban",
      tags: ["EWS / LIG", "No Pucca House", "Urban Areas"],
      icon: Building2,
      iconBg: "bg-[#FEF3DC]",
      iconColor: "text-[#C47F0C]",
      status: "Active",
      officialPortal: "https://pmay-urban.gov.in",
      criteria: {
        minAge: 18,
        maxIncome: 300000, // EWS ceiling
        puccaHouseAllowed: false,
        stateRestriction: "All India",
      },
      documents: ["Aadhaar Number of Family Head", "Income Certificate / Salary Slip", "Affidavit declaring no pucca house", "Bank Account Details"],
      summary: "Central government flagship mission ensuring pucca housing for all eligible urban families lacking a permanent concrete home.",
    },
    {
      id: "pmay-clss",
      name: "Credit Linked Subsidy Scheme (CLSS) for EWS/LIG",
      ministry: "Ministry of Housing and Urban Affairs",
      benefit: "Up to 6.5% interest subsidy on housing loans",
      field: "Housing & Urban",
      tags: ["Home Loan", "First-time Buyer", "EWS / LIG"],
      icon: Building2,
      iconBg: "bg-[#FEF3DC]",
      iconColor: "text-[#C47F0C]",
      status: "Active",
      officialPortal: "https://pmaymis.gov.in",
      criteria: {
        minAge: 18,
        maxIncome: 600000,
        puccaHouseAllowed: false,
        stateRestriction: "All India",
      },
      documents: ["Loan Application Sanction Letter", "Income Certificate", "Declaration of zero pucca house ownership"],
      summary: "Upfront interest subsidy credited straight to the beneficiary loan account via housing finance companies.",
    },
    {
      id: "abua-awas",
      name: "Abua Awas Yojana",
      ministry: "Government of Jharkhand Rural Development",
      benefit: "₹2.00 Lakh grant for 3-room pucca house construction",
      field: "Housing & Urban",
      tags: ["State Scheme", "Jharkhand Domicile", "Kutcha House"],
      icon: Building2,
      iconBg: "bg-[#FEF3DC]",
      iconColor: "text-[#C47F0C]",
      status: "Active",
      officialPortal: "https://aay.jharkhand.gov.in",
      criteria: {
        minAge: 18,
        puccaHouseAllowed: false,
        stateRestriction: "Jharkhand",
      },
      documents: ["Jharkhand Residential Domicile Certificate", "Ration Card", "Geotagged Kutcha House Photograph"],
      summary: "State housing assistance program for homeless families and kutcha house dwellers of Jharkhand.",
    },

    // --- Health & Medical ---
    {
      id: "ayushman-bharat",
      name: "Ayushman Bharat PM-JAY",
      ministry: "National Health Authority, Ministry of Health and Family Welfare",
      benefit: "Up to ₹5,00,000 / family / year cashless hospital cover",
      field: "Health & Medical",
      tags: ["BPL / SECC", "Secondary & Tertiary", "Cashless"],
      icon: HeartPulse,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#123C35]",
      status: "Active",
      officialPortal: "https://pmjay.gov.in",
      criteria: {
        minAge: 0,
        requiredRationCard: ["BPL / White", "AAY"],
        stateRestriction: "All India",
      },
      documents: ["Aadhaar Card", "Ration Card (BPL / Priority Household)", "Active Mobile Number"],
      summary: "World's largest government-funded healthcare assurance scheme offering paperless secondary and tertiary hospitalization.",
    },
    {
      id: "pm-dialysis",
      name: "Pradhan Mantri National Dialysis Programme (PMNDP)",
      ministry: "Ministry of Health and Family Welfare",
      benefit: "100% Free Hemodialysis and Peritoneal Dialysis at District Hospitals",
      field: "Health & Medical",
      tags: ["Free Treatment", "BPL Patients", "All District Hospitals"],
      icon: HeartPulse,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#123C35]",
      status: "Active",
      officialPortal: "https://nhm.gov.in",
      criteria: {
        minAge: 0,
        requiredRationCard: ["BPL / White", "AAY"],
        stateRestriction: "All India",
      },
      documents: ["BPL Card / White Ration Card", "Nephrology Referral / Doctor Prescription", "Aadhaar Card"],
      summary: "Provides cashless renal replacement therapy to every BPL patient suffering from End Stage Renal Disease.",
    },
    {
      id: "cghs",
      name: "Central Government Health Scheme (CGHS)",
      ministry: "Ministry of Health and Family Welfare",
      benefit: "Comprehensive healthcare for Central Govt employees & pensioners",
      field: "Health & Medical",
      tags: ["Central Employees", "Pensioners Only", "Government Service"],
      icon: HeartPulse,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#123C35]",
      status: "Active",
      officialPortal: "https://cghs.nic.in",
      criteria: {
        minAge: 18,
        allowedOccupations: ["Central Govt Employee", "Pensioner"],
        stateRestriction: "All India",
      },
      documents: ["CGHS Plastic Card", "PPO / Service Identity Proof", "Salary Slip"],
      summary: "Exclusive medical reimbursement and dispensary coverage restricted strictly to active and retired Central Government personnel.",
    },

    // --- Agriculture & Farmers ---
    {
      id: "pm-kisan",
      name: "PM Kisan Samman Nidhi",
      ministry: "Ministry of Agriculture and Farmers Welfare",
      benefit: "₹6,000 / year in 3 direct installments of ₹2,000",
      field: "Agriculture & Farmers",
      tags: ["Small Farmers", "DBT Transfer", "Landholders"],
      icon: Sprout,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://pmkisan.gov.in",
      criteria: {
        minAge: 18,
        allowedOccupations: ["Farmer", "Cultivator", "Agricultural Worker"],
        stateRestriction: "All India",
      },
      documents: ["Land Record Document (Pattadar Passbook / ROR)", "Aadhaar Card", "Aadhaar Linked Bank Account"],
      summary: "Income support mechanism for landholding farmer families across the country to procure agricultural inputs.",
    },
    {
      id: "pm-fasal-bima",
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      ministry: "Ministry of Agriculture and Farmers Welfare",
      benefit: "Comprehensive crop insurance against non-preventable natural risks",
      field: "Agriculture & Farmers",
      tags: ["Crop Insurance", "Cultivators", "Low Premium 1.5%-2%"],
      icon: Sprout,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://pmfby.gov.in",
      criteria: {
        minAge: 18,
        allowedOccupations: ["Farmer", "Tenant Farmer", "Sharecropper"],
        stateRestriction: "All India",
      },
      documents: ["Land Sowing Certificate", "Land Revenue Receipt (ROR)", "Bank Account Passbook"],
      summary: "Actuarial insurance covering pre-sowing to post-harvest losses caused by cyclones, floods, drought, and pests.",
    },
    {
      id: "kisan-credit-card",
      name: "Kisan Credit Card (KCC) Scheme",
      ministry: "Ministry of Agriculture and Farmers Welfare / RBI",
      benefit: "Short term credit up to ₹3.00 Lakh at subsidized 4% interest",
      field: "Agriculture & Farmers",
      tags: ["Agri Loan", "4% Interest", "Farmers & Animal Husbandry"],
      icon: Sprout,
      iconBg: "bg-[#EBF7F2]",
      iconColor: "text-[#16805A]",
      status: "Active",
      officialPortal: "https://myscheme.gov.in",
      criteria: {
        minAge: 18,
        maxAge: 75,
        allowedOccupations: ["Farmer", "Cultivator", "Dairy Farmer", "Fisherman"],
        stateRestriction: "All India",
      },
      documents: ["Land Possession Certificate", "Identity & Residence Proof", "Crop Cultivation Declaration"],
      summary: "Institutional credit enabling farmers to meet short-term financial requirements for crop cultivation and equipment.",
    },

    // --- Employment & MSME ---
    {
      id: "pm-mudra",
      name: "Pradhan Mantri MUDRA Yojana (PMMY)",
      ministry: "Ministry of Finance",
      benefit: "Collateral-free business loans up to ₹10 Lakh (Shishu, Kishore, Tarun)",
      field: "Employment & MSME",
      tags: ["Micro Enterprise", "Youth & Students", "No Collateral"],
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      status: "Active",
      officialPortal: "https://mudra.org.in",
      criteria: {
        minAge: 18,
        maxAge: 65,
        stateRestriction: "All India",
      },
      documents: ["Business Plan / Proposal", "Identity Proof (Aadhaar/PAN)", "Proof of Residence", "Quotation of Machinery"],
      summary: "Empowers young aspiring entrepreneurs, graduates, and shop owners to establish micro-business activities.",
    },
    {
      id: "pmegp",
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      ministry: "Ministry of Micro, Small and Medium Enterprises (MSME)",
      benefit: "Up to 35% government capital subsidy on projects up to ₹50 Lakh",
      field: "Employment & MSME",
      tags: ["Credit Linked Subsidy", "Unemployed Youth", "Self Employment"],
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      status: "Active",
      officialPortal: "https://kviconline.gov.in/pmegpep",
      criteria: {
        minAge: 18,
        stateRestriction: "All India",
      },
      documents: ["Detailed Project Report (DPR)", "Educational Qualification Certificate (8th Pass+)", "Aadhaar Card", "Special Category Certificate if applicable"],
      summary: "Credit-linked subsidy program administered by KVIC to establish micro-enterprises in manufacturing and services.",
    },
    {
      id: "pmkvy",
      name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
      ministry: "Ministry of Skill Development and Entrepreneurship",
      benefit: "Free industry-aligned skill certification + ₹8,000 stipend & placement",
      field: "Employment & MSME",
      tags: ["Free Skill Training", "College Dropouts/Students", "Industry Placement"],
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      status: "Active",
      officialPortal: "https://pmkvyofficial.org",
      criteria: {
        minAge: 15,
        maxAge: 45,
        stateRestriction: "All India",
      },
      documents: ["Aadhaar Card", "Bank Account Details", "Educational Certificate"],
      summary: "Enables youth to take up industry-relevant skill training for lucrative livelihoods and corporate placements.",
    },
    {
      id: "standup-india",
      name: "Stand-Up India Scheme",
      ministry: "Department of Financial Services, Ministry of Finance",
      benefit: "Bank loans between ₹10 Lakh and ₹1 Crore for greenfield projects",
      field: "Employment & MSME",
      tags: ["SC / ST / Women", "Greenfield Enterprise", "Bank Loan"],
      icon: Briefcase,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      status: "Active",
      officialPortal: "https://standupmitra.in",
      criteria: {
        minAge: 18,
        allowedCategories: ["SC", "ST"],
        allowedGenders: ["Female"], // or SC/ST any gender
        stateRestriction: "All India",
      },
      documents: ["Caste Certificate (for SC/ST) or Proof of Woman Entrepreneurship", "Project Report", "PAN Card", "Aadhaar Card"],
      summary: "Facilitates bank loans for setting up greenfield manufacturing, services, or trading enterprises by SC, ST, or women entrepreneurs.",
    },

    // --- Women & Child ---
    {
      id: "sukanya-samriddhi",
      name: "Sukanya Samriddhi Yojana (SSY)",
      ministry: "Ministry of Finance",
      benefit: "Highest sovereign interest (8.2%) with complete Section 80C tax exemption",
      field: "Women & Child",
      tags: ["Girl Child < 10 yrs", "High Interest 8.2%", "Tax-Free"],
      icon: Users,
      iconBg: "bg-[#FDF0F0]",
      iconColor: "text-[#C94A4A]",
      status: "Active",
      officialPortal: "https://myscheme.gov.in",
      criteria: {
        maxAge: 10,
        allowedGenders: ["Female"],
        stateRestriction: "All India",
      },
      documents: ["Birth Certificate of Girl Child", "Identity & Address Proof of Parents", "Passport size photograph"],
      summary: "Small deposit scheme for the girl child launched under the Beti Bachao Beti Padhao campaign.",
    },
    {
      id: "pmmvy",
      name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
      ministry: "Ministry of Women and Child Development",
      benefit: "₹5,000 cash incentive in direct bank installments for first child",
      field: "Women & Child",
      tags: ["Pregnant Women", "Lactating Mothers", "Maternity Benefit"],
      icon: Users,
      iconBg: "bg-[#FDF0F0]",
      iconColor: "text-[#C94A4A]",
      status: "Active",
      officialPortal: "https://pmmvy.wcd.gov.in",
      criteria: {
        minAge: 19,
        allowedGenders: ["Female"],
        allowedOccupations: ["Pregnant Woman", "Lactating Mother", "Homemaker"],
        stateRestriction: "All India",
      },
      documents: ["Mother & Child Protection (MCP) Card", "Identity Proof (Aadhaar)", "Bank Account Passbook"],
      summary: "Direct cash transfer providing wage loss compensation and encouraging health-seeking behavior during pregnancy.",
    },

    // --- Social Welfare & Security ---
    {
      id: "pmjjby",
      name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
      ministry: "Ministry of Finance",
      benefit: "₹2,00,000 life insurance cover for just ₹436 / year",
      field: "Social Welfare & Security",
      tags: ["Life Insurance", "Age 18-50", "₹436/yr Premium"],
      icon: ShieldCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-700",
      status: "Active",
      officialPortal: "https://jansuraksha.gov.in",
      criteria: {
        minAge: 18,
        maxAge: 50,
        stateRestriction: "All India",
      },
      documents: ["Savings Bank Account", "Aadhaar Card", "Auto-debit authorization mandate"],
      summary: "Renewable one-year term life cover providing ₹2 Lakh financial protection to families in case of death.",
    },
    {
      id: "pmsby",
      name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      ministry: "Ministry of Finance",
      benefit: "₹2,00,000 accidental death & full disability cover for ₹20 / year",
      field: "Social Welfare & Security",
      tags: ["Accident Insurance", "Age 18-70", "₹20/yr Premium"],
      icon: ShieldCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-700",
      status: "Active",
      officialPortal: "https://jansuraksha.gov.in",
      criteria: {
        minAge: 18,
        maxAge: 70,
        stateRestriction: "All India",
      },
      documents: ["Savings Bank Account with Auto Debit", "Aadhaar Card"],
      summary: "Most affordable accident insurance policy covering accidental death and permanent total disability.",
    },
    {
      id: "atal-pension",
      name: "Atal Pension Yojana (APY)",
      ministry: "PFRDA / Ministry of Finance",
      benefit: "Guaranteed monthly pension of ₹1,000 to ₹5,000 from age 60 onwards",
      field: "Social Welfare & Security",
      tags: ["Monthly Pension", "Age 18-40", "Unorganized Sector"],
      icon: ShieldCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-700",
      status: "Active",
      officialPortal: "https://npscra.nsdl.co.in",
      criteria: {
        minAge: 18,
        maxAge: 40,
        stateRestriction: "All India",
      },
      documents: ["Savings Bank Account", "Aadhaar Number", "Nominee Details"],
      summary: "Guaranteed minimum monthly pension designed specifically to build a retirement corpus for Indian citizens.",
    },
    {
      id: "nsap-ignops",
      name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
      ministry: "Ministry of Rural Development",
      benefit: "Monthly pension of ₹500 to ₹1,000 directly deposited",
      field: "Social Welfare & Security",
      tags: ["Senior Citizens (60+)", "BPL Households", "Monthly Pension"],
      icon: ShieldCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-700",
      status: "Active",
      officialPortal: "https://nsap.nic.in",
      criteria: {
        minAge: 60,
        requiredRationCard: ["BPL / White", "AAY"],
        stateRestriction: "All India",
      },
      documents: ["Age Verification Proof (60+ yrs)", "BPL Ration Card", "Bank Account Passbook"],
      summary: "Statutory monthly social assistance grant for destitute senior citizens living below the official poverty line.",
    },
  ];

  // Helper function to extract benefit monetary value for sorting
  const getBenefitValue = (s: Scheme): number => {
    const text = s.benefit.toLowerCase();
    if (text.includes('crore')) return 10000000;
    if (text.includes('50 lakh')) return 5000000;
    if (text.includes('10 lakh')) return 1000000;
    if (text.includes('5,00,000') || text.includes('5 lakh')) return 500000;
    if (text.includes('3.00 lakh') || text.includes('3 lakh')) return 300000;
    if (text.includes('2.5 lakh')) return 250000;
    if (text.includes('2.00 lakh') || text.includes('2 lakh') || text.includes('2,00,000')) return 200000;
    if (text.includes('36,000')) return 36000;
    if (text.includes('20,000')) return 20000;
    if (text.includes('13,500')) return 13500;
    if (text.includes('12,000')) return 12000;
    if (text.includes('8,000')) return 8000;
    if (text.includes('6,000')) return 6000;
    if (text.includes('5,000')) return 5000;
    if (text.includes('1,000')) return 12000;
    if (text.includes('500')) return 6000;
    return 10000;
  };

  // Helper function to evaluate eligibility against citizen profile
  const evaluateSchemeEligibility = (scheme: Scheme) => {
    const { criteria } = scheme;
    const satisfiedReasons: string[] = [];
    const disqualifiedReasons: string[] = [];

    // Age check
    if (criteria.minAge !== undefined && profile.age < criteria.minAge) {
      disqualifiedReasons.push(`Age must be at least ${criteria.minAge} (Profile age is ${profile.age})`);
    } else if (criteria.minAge !== undefined) {
      satisfiedReasons.push(`Age ≥ ${criteria.minAge} satisfied`);
    }

    if (criteria.maxAge !== undefined && profile.age > criteria.maxAge) {
      disqualifiedReasons.push(`Age exceeds maximum limit of ${criteria.maxAge} (Profile age is ${profile.age})`);
    } else if (criteria.maxAge !== undefined) {
      satisfiedReasons.push(`Age ≤ ${criteria.maxAge} satisfied`);
    }

    // Occupation check
    if (criteria.allowedOccupations && criteria.allowedOccupations.length > 0) {
      const match = criteria.allowedOccupations.some(
        (occ) => occ.toLowerCase() === profile.occupation.toLowerCase()
      );
      if (!match) {
        disqualifiedReasons.push(
          `Requires occupation: ${criteria.allowedOccupations.join(" or ")} (Profile occupation is ${profile.occupation})`
        );
      } else {
        satisfiedReasons.push(`Occupation matches (${profile.occupation})`);
      }
    }

    // Income ceiling check
    if (criteria.maxIncome !== undefined) {
      if (profile.annualIncome > criteria.maxIncome) {
        disqualifiedReasons.push(
          `Annual family income ₹${profile.annualIncome.toLocaleString()} exceeds ceiling of ₹${criteria.maxIncome.toLocaleString()}`
        );
      } else {
        satisfiedReasons.push(`Annual income ₹${profile.annualIncome.toLocaleString()} ≤ ceiling ₹${criteria.maxIncome.toLocaleString()}`);
      }
    }

    // Ration card / BPL check
    if (criteria.requiredRationCard && criteria.requiredRationCard.length > 0) {
      if (!criteria.requiredRationCard.includes(profile.rationCard)) {
        disqualifiedReasons.push(`Requires ${criteria.requiredRationCard.join(" or ")} ration card`);
      } else {
        satisfiedReasons.push(`Ration card (${profile.rationCard}) accepted`);
      }
    }

    // Pucca house check
    if (criteria.puccaHouseAllowed === false) {
      if (profile.puccaHouse) {
        disqualifiedReasons.push("Already owns a concrete pucca house");
      } else {
        satisfiedReasons.push("No pucca house owned (Homeless / Kutcha / Rented)");
      }
    }

    // State restriction check
    if (criteria.stateRestriction && criteria.stateRestriction !== "All India") {
      if (profile.state.toLowerCase() !== criteria.stateRestriction.toLowerCase()) {
        disqualifiedReasons.push(`Restricted to residents of ${criteria.stateRestriction} (Profile is in ${profile.state})`);
      } else {
        satisfiedReasons.push(`Domicile of ${criteria.stateRestriction} satisfied`);
      }
    }

    // Gender check
    if (criteria.allowedGenders && criteria.allowedGenders.length > 0) {
      if (!criteria.allowedGenders.includes(profile.gender)) {
        // Check if SC/ST exception exists for Stand-up India
        if (criteria.allowedCategories && criteria.allowedCategories.includes(profile.socialCategory)) {
          satisfiedReasons.push(`Category exception (${profile.socialCategory}) satisfied`);
        } else {
          disqualifiedReasons.push(`Restricted to ${criteria.allowedGenders.join(" or ")} beneficiaries`);
        }
      } else {
        satisfiedReasons.push(`Gender criterion satisfied`);
      }
    }

    const isEligible = disqualifiedReasons.length === 0;

    return {
      isEligible,
      satisfiedReasons,
      disqualifiedReasons,
    };
  };

  // Filter schemes based on search, field, and eligibility
  const evaluatedSchemes = useMemo(() => {
    return schemes.map((s) => ({
      ...s,
      evaluation: evaluateSchemeEligibility(s),
    }));
  }, [schemes, profile]);

  const filteredSchemes = useMemo(() => {
    const list = [...evaluatedSchemes].filter((scheme) => {
      // Field filter
      const matchesField = selectedField === "All Fields" || scheme.field === selectedField;

      // Eligibility filter
      const matchesEligibility =
        eligibilityFilter === "all" ||
        (eligibilityFilter === "eligible" && scheme.evaluation.isEligible) ||
        (eligibilityFilter === "ineligible" && !scheme.evaluation.isEligible);

      // Search term
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        scheme.name.toLowerCase().includes(search) ||
        scheme.ministry.toLowerCase().includes(search) ||
        scheme.field.toLowerCase().includes(search) ||
        scheme.benefit.toLowerCase().includes(search) ||
        scheme.tags.some((t) => t.toLowerCase().includes(search));

      return matchesField && matchesEligibility && matchesSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === 'recommended') {
        if (a.evaluation.isEligible !== b.evaluation.isEligible) {
          return a.evaluation.isEligible ? -1 : 1;
        }
        return b.evaluation.satisfiedReasons.length - a.evaluation.satisfiedReasons.length;
      }
      if (sortBy === 'benefit-high') {
        return getBenefitValue(b) - getBenefitValue(a);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [evaluatedSchemes, selectedField, eligibilityFilter, searchTerm, sortBy]);

  // Overall counts for badges
  const totalEligibleCount = useMemo(() => {
    return evaluatedSchemes.filter((s) => s.evaluation.isEligible).length;
  }, [evaluatedSchemes]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17211F] tracking-tight">
            Explore Schemes
          </h1>
          <p className="text-sm text-[#71807B] mt-0.5">
            Browse and discover government schemes across all fields with live eligibility checking.
          </p>
        </div>

        {/* Quick Citizen Context Pill & Profile Switcher */}
        <button
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E9E6] hover:border-[#123C35] hover:shadow-sm transition-all text-left group shrink-0"
          title="Click to adjust your profile parameters"
        >
          <div className="w-8 h-8 rounded-full bg-[#123C35] text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {profile.name[0]}
          </div>
          <div>
            <div className="text-xs font-bold text-[#17211F] group-hover:text-[#123C35] flex items-center gap-1.5">
              <span>{profile.name}</span>
              <span className="text-[10px] text-[#16805A] bg-[#EBF7F2] px-1.5 py-0.2 rounded border border-[#B2E2CE]">
                {profile.occupation}
              </span>
            </div>
            <div className="text-[11px] text-[#71807B]">
              Age {profile.age} • ₹{(profile.annualIncome / 100000).toFixed(1)}L/yr • {profile.state}
            </div>
          </div>
          <SlidersHorizontal className="w-4 h-4 text-[#71807B] group-hover:text-[#123C35] ml-1" />
        </button>
      </div>

      {/* Citizen Profile Status Summary Card */}
      <div className="bg-[#FAFAF7] border border-[#B2E2CE] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D8F3EA] text-[#123C35] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-[#2F6B5F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17211F]">
                Active Profile: {profile.name} ({profile.occupation})
              </span>
              <span className="text-[11px] font-semibold text-[#16805A] bg-[#D8F3EA] px-2 py-0.5 rounded-full border border-[#B2E2CE]">
                {totalEligibleCount} Schemes Eligible
              </span>
            </div>
            <div className="text-xs text-[#71807B] mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span><strong>State:</strong> {profile.state}</span>
              <span>•</span>
              <span><strong>Income:</strong> ₹{profile.annualIncome.toLocaleString()}/yr</span>
              <span>•</span>
              <span><strong>Ration:</strong> {profile.rationCard}</span>
              <span>•</span>
              <span><strong>Pucca House:</strong> {profile.puccaHouse ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setEligibilityFilter(eligibilityFilter === "eligible" ? "all" : "eligible")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              eligibilityFilter === "eligible"
                ? "bg-[#123C35] text-white shadow-sm"
                : "bg-white border border-[#E5E9E6] text-[#123C35] hover:bg-[#EBF7F2]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Show Only Eligible ({totalEligibleCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="text-xs text-[#71807B] hover:text-[#17211F] font-semibold underline px-2"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Search Bar, Sort Order & Status Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71807B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scheme name, ministry, target beneficiary, or keywords..."
              className="w-full bg-white border border-[#E5E9E6] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#17211F] placeholder-gray-400 focus:outline-none focus:border-[#123C35] focus:ring-2 focus:ring-[#123C35]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Sort Order Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-[#E5E9E6] rounded-xl px-3 py-2 text-xs text-[#17211F] shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#2F6B5F] shrink-0" />
              <span className="font-semibold text-[#71807B] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort schemes by"
                className="bg-transparent font-semibold text-[#17211F] focus:outline-none cursor-pointer pr-1"
              >
                <option value="recommended">Recommended (Eligible First)</option>
                <option value="benefit-high">Benefit: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Eligibility Filter Select */}
            <div className="flex items-center bg-white border border-[#E5E9E6] rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setEligibilityFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                eligibilityFilter === "all"
                  ? "bg-[#123C35] text-white shadow-sm"
                  : "text-[#71807B] hover:text-[#17211F]"
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => setEligibilityFilter("eligible")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                eligibilityFilter === "eligible"
                  ? "bg-[#16805A] text-white shadow-sm"
                  : "text-[#16805A] hover:bg-[#EBF7F2]"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Eligible ({totalEligibleCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setEligibilityFilter("ineligible")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                eligibilityFilter === "ineligible"
                  ? "bg-[#C94A4A] text-white shadow-sm"
                  : "text-[#C94A4A] hover:bg-[#FDF0F0]"
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Ineligible ({schemes.length - totalEligibleCount})</span>
            </button>
          </div>
          </div>
        </div>

        {/* All 8 Scheme Fields / Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {fields.map((f) => {
            const Icon = f.icon;
            const isActive = selectedField === f.id;
            const countInField =
              f.id === "All Fields"
                ? evaluatedSchemes.length
                : evaluatedSchemes.filter((s) => s.field === f.id).length;
            const eligibleInField =
              f.id === "All Fields"
                ? totalEligibleCount
                : evaluatedSchemes.filter((s) => s.field === f.id && s.evaluation.isEligible).length;

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedField(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#123C35] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-[#71807B] hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-[#71807B]"
                  }`}
                >
                  {countInField}
                  {eligibleInField > 0 && f.id !== "All Fields" && ` (${eligibleInField} eligible)`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schemes Results Counter */}
      <div className="flex items-center justify-between text-xs text-[#71807B] px-1">
        <div>
          Showing <strong>{filteredSchemes.length}</strong> scheme{filteredSchemes.length === 1 ? "" : "s"} in{" "}
          <span className="font-semibold text-[#17211F]">{selectedField}</span>
          {eligibilityFilter !== "all" && (
            <span> • Filtered by <strong>{eligibilityFilter}</strong></span>
          )}
        </div>
        {filteredSchemes.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#16805A] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#EBF7F2]0" />
              Eligible
            </span>
            <span className="flex items-center gap-1 text-[#C94A4A] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FDF0F0]0" />
              Ineligible
            </span>
          </div>
        )}
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.length === 0 ? (
          <div className="bg-white border border-[#E5E9E6] rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-[#71807B] flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#17211F] text-base">No schemes found</h3>
            <p className="text-xs text-[#71807B] max-w-sm mx-auto">
              No government schemes match the selected filters for your current profile.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedField("All Fields");
                  setEligibilityFilter("all");
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-[#123C35] text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-[#1E5249]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          filteredSchemes.map((scheme) => {
            const Icon = scheme.icon;
            const { isEligible, satisfiedReasons, disqualifiedReasons } = scheme.evaluation;
            const isExpanded = expandedSchemeId === scheme.id;

            return (
              <div
                key={scheme.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                  isEligible
                    ? "border-[#B2E2CE] hover:border-emerald-300 hover:shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Icon + Scheme Information */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-11 h-11 rounded-full ${scheme.iconBg} ${scheme.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Field Tag & Title + Quick Portal Link */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#71807B] bg-gray-100 px-2 py-0.5 rounded shrink-0">
                              {scheme.field}
                            </span>
                            <span className="text-xs text-[#71807B] shrink-0">•</span>
                            <span className="text-xs text-[#71807B] truncate">{scheme.ministry}</span>
                          </div>
                          <a
                            href={scheme.officialPortal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#123C35] hover:text-[#0A2621] bg-[#FAFAF7] hover:bg-[#D8F3EA] border border-[#B2E2CE] px-2 py-0.5 rounded-md transition-colors shrink-0 shadow-2xs group"
                            title={`Open official portal for ${scheme.name}`}
                          >
                            <span>Apply / Portal</span>
                            <ExternalLink className="w-3 h-3 text-[#2F6B5F] group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                        <h2 className="font-bold text-base text-[#17211F] leading-snug">
                          {scheme.name}
                        </h2>
                      </div>

                      {/* Benefit */}
                      <div className="inline-block font-bold text-xs text-[#123C35] bg-[#FAFAF7] border border-[#B2E2CE] px-2.5 py-1 rounded-lg">
                        {scheme.benefit}
                      </div>

                      {/* Scheme Summary */}
                      <p className="text-xs text-[#71807B] leading-relaxed max-w-3xl">
                        {scheme.summary}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {scheme.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F5F7F5] border border-[#E5E9E6] text-[#71807B] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Key Eligibility Criteria Fields Grid */}
                      <div className="pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                          <span className="text-[#71807B] block font-medium">Income Ceiling</span>
                          <span className="font-bold text-[#17211F]">
                            {scheme.criteria.maxIncome ? `≤ ₹${(scheme.criteria.maxIncome / 100000).toFixed(1)} Lakh/yr` : "No limit"}
                          </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                          <span className="text-[#71807B] block font-medium">Age Eligibility</span>
                          <span className="font-bold text-[#17211F]">
                            {scheme.criteria.minAge || scheme.criteria.maxAge
                              ? `${scheme.criteria.minAge || 0} - ${scheme.criteria.maxAge || "No limit"} yrs`
                              : "All ages"}
                          </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                          <span className="text-[#71807B] block font-medium">Target Group</span>
                          <span className="font-bold text-[#17211F] truncate block">
                            {scheme.criteria.allowedOccupations ? scheme.criteria.allowedOccupations.join(", ") : "All Citizens"}
                          </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                          <span className="text-[#71807B] block font-medium">Jurisdiction</span>
                          <span className="font-bold text-[#17211F]">
                            {scheme.criteria.stateRestriction || "All India"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Eligibility Verdict & Action Buttons */}
                  <div className="flex flex-col lg:items-end justify-between gap-3 shrink-0 lg:w-64 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    {/* Live Eligibility Badge */}
                    <div>
                      {isEligible ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16805A] bg-[#D8F3EA] border border-emerald-300 px-3 py-1 rounded-full shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#16805A]" />
                          <span>Eligible for {profile.name}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C94A4A] bg-rose-100 border border-rose-300 px-3 py-1 rounded-full shadow-sm">
                          <XCircle className="w-4 h-4 text-[#C94A4A]" />
                          <span>Not Eligible</span>
                        </div>
                      )}
                    </div>

                    {/* Eligibility Reason Summary Snippet */}
                    <div className="text-[11px] text-left lg:text-right">
                      {isEligible ? (
                        <p className="text-[#16805A] font-medium">
                          ✔ Satisfies {satisfiedReasons.length} criteria for {profile.occupation}
                        </p>
                      ) : (
                        <p className="text-[#C94A4A] font-medium">
                          ✖ {disqualifiedReasons[0] || "Disqualified by policy rule"}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full pt-1">
                      <Link
                        href={`/assistant?q=Check my eligibility for ${encodeURIComponent(scheme.name)}`}
                        className="px-3.5 py-2 rounded-lg bg-[#123C35] hover:bg-[#1E5249] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                      >
                        <span>Check Reasoned Trace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-[#17211F] text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? "Hide Criteria Details" : "View Rules & Documents"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Details Drawer: Evaluated Conditions & Required Documents */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
                    {/* Evaluated Conditions for User */}
                    <div className="bg-[#F8FAF8] border border-[#CFDFD5] rounded-xl p-3.5 space-y-2">
                      <h4 className="text-xs font-bold text-[#17211F] flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#2F6B5F]" />
                        <span>Rule Matching for {profile.name}:</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {satisfiedReasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-2 text-[#16805A]">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                        {disqualifiedReasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-2 text-[#C94A4A]">
                            <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Statutory Documents */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#17211F] flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#71807B]" />
                          <span>Mandatory Documents ({scheme.documents.length}):</span>
                        </h4>
                        <a
                          href={scheme.officialPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#123C35] hover:underline flex items-center gap-1"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <ul className="space-y-1 text-xs text-[#17211F]">
                        {scheme.documents.map((doc, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#123C35]" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Profile Editor Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-fade-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-[#17211F] text-base">Adjust Citizen Profile</h3>
                <p className="text-xs text-[#71807B]">Change parameters to test eligibility across all schemes instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#71807B] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Occupation</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F] cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Farmer">Farmer / Cultivator</option>
                  <option value="Daily Wage Laborer">Daily Wage Laborer</option>
                  <option value="Private Employee">Private Employee</option>
                  <option value="Central Govt Employee">Central Govt Employee</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Unemployed Youth">Unemployed Youth</option>
                  <option value="Homemaker">Homemaker</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) || 18 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">State Domicile</label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F] cursor-pointer"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Annual Income (₹)</label>
                <input
                  type="number"
                  value={profile.annualIncome}
                  onChange={(e) => setProfile({ ...profile, annualIncome: Number(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Ration Card</label>
                <select
                  value={profile.rationCard}
                  onChange={(e) => setProfile({ ...profile, rationCard: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F] cursor-pointer"
                >
                  <option value="BPL / White">BPL / White Card (Priority)</option>
                  <option value="AAY">Antyodaya Anna Yojana (AAY)</option>
                  <option value="None / APL">APL / Non-Priority</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Owns a Pucca House?</label>
                <select
                  value={profile.puccaHouse ? "Yes" : "No"}
                  onChange={(e) => setProfile({ ...profile, puccaHouse: e.target.value === "Yes" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F] cursor-pointer"
                >
                  <option value="No">No (Living in rent / kutcha dwelling)</option>
                  <option value="Yes">Yes (Owns concrete pucca house)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17211F] mb-1">Social Category</label>
                <select
                  value={profile.socialCategory}
                  onChange={(e) => setProfile({ ...profile, socialCategory: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#17211F] cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="EWS">EWS</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() =>
                  setProfile({
                    name: "StudyUser",
                    age: 21,
                    gender: "Male",
                    occupation: "Student",
                    state: "Telangana",
                    annualIncome: 240000,
                    rationCard: "BPL / White",
                    puccaHouse: false,
                    socialCategory: "General",
                    disability: false,
                  })
                }
                className="text-xs text-[#71807B] hover:text-[#17211F] font-semibold"
              >
                Reset to StudyUser (Student)
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-[#123C35] hover:bg-[#1E5249] text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Apply Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
