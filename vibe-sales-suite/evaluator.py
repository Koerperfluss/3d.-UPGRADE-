import json

def run_evaluation_pipeline(asset_name, description):
    """
    4-Stage Analysis Logic
    1. Technical Audit (Maturity/GPL)
    2. Web Scanner (Competitors)
    3. Market Analyst (Demand)
    4. Sales Strategist (Pricing/Platform)
    """
    print(f"--- Starting Pipeline for: {asset_name} ---")

    # Phase 1: Technical
    audit = "Checking license compliance and code maturity..."

    # Phase 2: Web
    competitors = "Searching for existing solutions in DACH region..."

    # Phase 3: Market
    demand = "Analyzing target group volume and pain points..."

    # Phase 4: Strategy
    strategy = "Generating action plan (No tax/legal advice)..."

    report = {
        "asset": asset_name,
        "technical_audit": audit,
        "competitor_data": competitors,
        "market_demand": demand,
        "sales_strategy": strategy
    }

    return report

if __name__ == "__main__":
    # Example usage
    res = run_evaluation_pipeline("Körperfluss PILOT", "B2B SaaS for therapists")
    print(json.dumps(res, indent=2))
