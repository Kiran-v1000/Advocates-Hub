# ============================================================
#  bot.py  —  AdvocateHub Smart Chatbot Logic (Production Ready)
#  Handles:
#    • Standalone City Search & Trigger-based City Search (with Court & Place)
#    • Advocate search by name, speciality, court, & place
#    • Multi-parameter filtering (e.g., "Criminal lawyers in Gokak")
#    • Navigation commands & Comprehensive Legal Q&A
# ============================================================

import json
import os
import re
import logging

# Configure logging for production tracing
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AdvocateHubBot")

# ── Load advocates from JSON ──────────────────────────────────
BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
DATA_PATH     = os.path.join(
BASE_DIR, "..", "backend", "data", "advocates.json"
)

def load_advocates():
    try:
        if not os.path.exists(DATA_PATH):
            logger.warning(f"Advocates data file not found at {DATA_PATH}. Returning empty list.")
            return []
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            return data.get("advocates", [])
        return data
    except Exception as e:
        logger.error(f"Error loading advocates JSON: {e}")
        return []

ADVOCATES = load_advocates()

# ── Navigation map ────────────────────────────────────────────
NAV_MAP = {
    "home": "/",
    "main page": "/",
    "landing": "/",
    "advocates": "/find-lawyer",
    "advocate list": "/find-lawyer",
    "find lawyer": "/find-lawyer",
    "find advocate": "/find-lawyer",
    "lawyers": "/find-lawyer",
    "talk to advocate": "/talk-to-advocate",
    "talk": "/talk-to-advocate",
    "consult": "/talk-to-advocate",
    "ask question": "/legal-advice/ask-question",
    "legal advice": "/legal-advice/ask-question",
    "ask": "/legal-advice/ask-question",
    "legal documents": "/legal-advice/documents",
    "documents": "/legal-advice/documents",
    "templates": "/legal-advice/documents",
    "bare acts": "/legal-advice/bare-acts",
    "laws": "/legal-advice/bare-acts",
    "acts": "/legal-advice/bare-acts",
    "ipc": "/legal-advice/bare-acts",
    "bns": "/legal-advice/bare-acts",
    "legal news": "/legal-advice/news",
    "news": "/legal-advice/news",
    "login": "/login",
    "sign in": "/login",
    "signup": "/signup",
    "register": "/signup",
    "privacy": "/privacy",
    "privacy policy": "/privacy",
    "terms": "/terms",
    "terms of use": "/terms",
    "contact": "/Contact",
    "about": "/aboutus",
    "partners": "/Partners",
}

# ── Keyword → speciality mapping ──────────────────────────────
SPECIALITY_KEYWORDS = {
    "criminal": ["criminal", "crime", "fir", "bail", "arrest", "ipc", "bns", "murder", "theft"],
    "family": ["family", "divorce", "custody", "marriage", "matrimonial", "maintenance", "adoption"],
    "property": ["property", "land", "title", "rera", "real estate", "plot", "builder"],
    "civil": ["civil", "cheque bounce", "recovery", "ni act", "suit", "injunction"],
    "corporate": ["corporate", "company", "gst", "tax", "business", "startup", "compliance"],
    "labour": ["labour", "labor", "employee", "termination", "pf", "esic", "salary"],
    "consumer": ["consumer", "refund", "product", "e-commerce", "amazon", "flipkart"],
    "cyber": ["cyber", "cybercrime", "hacking", "online fraud", "defamation", "it act"],
    "immigration": ["immigration", "visa", "oci", "citizenship", "nri", "passport"],
    "banking": ["banking", "bank", "sarfaesi", "loan", "npa", "drt"],
}

# ── Comprehensive City List Setup (Includes Gokak) ─────────────
CITIES_LIST = [
    "Afzalpur", "Alur", "Aland", "Ankola", "Arakalgud", "Arasikere", "Athani", "Aurad", "Anekal",
    "Bagepalli", "Bagalkot", "Bailhongal", "Baindur", "Banahatti", "Bangarapet", "Bantwal", 
    "Basavana Bagewadi", "Basavakalyan", "Belagavi", "Belthangady", "Belur", "Bhadravati", 
    "Bhalki", "Bhatkal", "Bilagi", "Byadgi", "Bengaluru", "Bengaluru Rural", "Challakere", 
    "Chamarajanagar", "Channagiri", "Channapatna", "Channarayapatna", "Chikkaballapur", 
    "Chikkamagaluru", "Chikkodi", "Chiknayakanhalli", "Chincholi", "Chintamani", "Chitapur", 
    "Chitradurga", "Dandeli", "Davangere", "Devanahalli", "Devadurga", "Dharwad", "Doddaballapur", 
    "Gadag", "Gangavathi", "Gauribidanur", "Gokak", "Gudibande", "Gubbi", "Gundlupet", "Hassan", 
    "Haveri", "Hospete", "Hubballi", "Kalaburagi", "Mangaluru", "Mysuru", "Shivamogga", "Tumakuru", 
    "Udupi", "Vijayapura", "Yadgir", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Kochi", "Ahmedabad"
]

# ── Helpers ───────────────────────────────────────────────────
def clean(text):
    return re.sub(r"[^\w\s]", "", text.lower().strip())

def find_advocate_by_name(query):
    q = clean(query)
    results = []
    for adv in ADVOCATES:
        name = clean(adv.get("name", ""))
        name_plain = re.sub(r"^adv\s*\.?\s*", "", name)
        if q in name or q in name_plain or name_plain in q:
            results.append(adv)
    return results

def find_advocates_by_city(city):
    c = city.lower().strip()
    return [a for a in ADVOCATES if c in a.get("city", "").lower() or c in a.get("place", "").lower()]

def find_advocates_by_speciality(spec):
    s = spec.lower().strip()
    return [
        a for a in ADVOCATES
        if s in a.get("speciality", "").lower()
        or s in a.get("practiceArea", "").lower()
    ]

def detect_speciality(query):
    q = clean(query)
    for spec, keywords in SPECIALITY_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return spec
    return None

def detect_city(query):
    q = clean(query)
    for city in CITIES_LIST:
        # Check if city name exists cleanly as a word or substring inside query
        if city.lower() in q:
            return city.capitalize()
    return None

def detect_navigation(query):
    q = query.lower().strip()
    for keyword, path in NAV_MAP.items():
        if keyword in q:
            return path, keyword
    return None, None

def format_advocate_card(adv):
    name   = adv.get("name", "Unknown")
    spec   = adv.get("speciality") or adv.get("practiceArea", "")
    city   = adv.get("city", "")
    court  = adv.get("court") or adv.get("courtName", "District & Sessions Court")
    place  = adv.get("place") or adv.get("location", city)
    rating = adv.get("rating", "—")
    fee    = adv.get("fee", "—")
    exp    = adv.get("experience", "—")
    phone  = adv.get("phone", "")
    avail  = adv.get("availability", "")
    adv_id = adv.get("id", "")
    
    return {
        "id": adv_id,
        "name": name,
        "speciality": spec,
        "city": city,
        "court": court,
        "place": place,
        "rating": rating,
        "fee": fee,
        "experience": exp,
        "phone": phone,
        "availability": avail,
        "profileUrl": f"/profile/{adv_id}",
    }

# ── Legal FAQ answers ──────────────────────────────────────────
LEGAL_FAQ = {
    "bail": "Bail is the temporary release of an accused person awaiting trial. There are three types: regular bail, anticipatory bail (before arrest), and interim bail. You can apply through a criminal lawyer in the relevant court.",
    "fir": "An FIR (First Information Report) is filed at a police station to report a cognizable offence. You can file it in person or online. If police refuses, you can approach a magistrate.",
    "divorce": "In India, divorce can be filed under the Hindu Marriage Act, Special Marriage Act, or personal laws. Grounds include cruelty, desertion, adultery, and mutual consent.",
    "rera": "RERA (Real Estate Regulatory Authority) protects homebuyers. If a builder delays possession, you can file a complaint with your state RERA authority and claim compensation.",
    "cheque bounce": "Cheque bounce (Section 138 NI Act) is a criminal offence. The payee must send a legal notice within 30 days of bounce before filing a complaint in a magistrate court.",
    "power of attorney": "A Power of Attorney (PoA) authorises another person to act on your behalf for legal, financial, or property matters. It must be notarised.",
    "will": "A Will is a legal document stating asset distribution after death. It should be written, signed by the testator, and witnessed by two persons.",
    "consumer complaint": "Consumer complaints can be filed at the District Consumer Forum, State Commission, or National Commission under the Consumer Protection Act, 2019.",
    "gst": "GST is a unified indirect tax on supply of goods and services. Businesses with turnover above specified limits must register.",
    "property registration": "Property must be registered under the Registration Act, 1908 within 4 months of execution of the sale deed.",
}

def answer_legal_faq(query):
    q = clean(query)
    for topic, answer in LEGAL_FAQ.items():
        if topic in q:
            return answer
    return None

# ── Main response function ────────────────────────────────────
def get_response(message):
    """
    Returns a structured dict for the frontend client handler.
    """
    if not message or not isinstance(message, str):
        return {"text": "Please provide a valid query.", "type": "text"}

    raw   = message.strip()
    query = clean(raw)

    # 1. Greetings
    greet_words = ["hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening", "hii", "helo"]
    if any(g == query or query.startswith(g + " ") for g in greet_words):
        return {
            "text": "👋 Hello! I'm the AdvocateHub assistant. I can help you:\n• Find advocates by name, city, court, & speciality\n• Navigate to any page quickly\n• Answer common legal questions\n• Open detailed advocate profiles\n\nWhat can I help you with today?",
            "type": "text",
        }

    # 2. Navigation commands
    nav_triggers = ["go to", "navigate to", "open page", "take me to", "show me page", "visit"]
    if any(t in query for t in nav_triggers):
        path, keyword = detect_navigation(query)
        if path:
            label = keyword.replace("-", " ").title()
            return {
                "text": f"Sure! Taking you to the {label} page...",
                "type": "navigate",
                "navigate": path,
            }

    # 3. Open specific advocate profile
    open_triggers = ["open profile", "show profile", "profile of", "details of", "view profile"]
    if any(t in query for t in open_triggers):
        for trigger in open_triggers:
            if trigger in query:
                after = raw[raw.lower().find(trigger) + len(trigger):].strip()
                if after:
                    matches = find_advocate_by_name(after)
                    if len(matches) == 1:
                        adv = matches[0]
                        card = format_advocate_card(adv)
                        return {
                            "text": f"Opening profile for **{card['name']} practicing at {card['court']}, {card['place']}...",
                            "type": "profile",
                            "profileId": adv.get("id"),
                            "navigate": f"/profile/{adv.get('id')}",
                            "advocates": [card],
                        }
                    elif len(matches) > 1:
                        return {
                            "text": f"I found {len(matches)} advocates matching that name. Which one do you mean?",
                            "type": "advocates",
                            "advocates": [format_advocate_card(a) for a in matches[:5]],
                        }

    # 4. Multi-parameter / Combined Search (Speciality + City)
    detected_spec = detect_speciality(query)
    detected_city = detect_city(query)
    
    if detected_spec and detected_city:
        spec_matched = find_advocates_by_speciality(detected_spec)
        combined_results = [a for a in spec_matched if detected_city.lower() in a.get("city", "").lower() or detected_city.lower() in a.get("place", "").lower()]
        
        if combined_results:
            summary_lines = []
            for a in combined_results[:6]:
                card = format_advocate_card(a)
                summary_lines.append(f"• ** | Court: *{card['court']}* | Location: **{card['place']}**")
            
            return {
                "text": f"Found {len(combined_results)} {detected_spec} advocate(s) in **{detected_city}:\n" + "\n".join(summary_lines),
                "type": "advocates",
                "advocates": [format_advocate_card(a) for a in combined_results[:6]],
            }

    # 5. Filter explicitly by City (TRIGGERS OR STANDALONE CITY NAMES LIKE "Gokak")
    if detected_city:
        results = find_advocates_by_city(detected_city)
        if results:
            summary_lines = []
            for a in results[:6]:
                card = format_advocate_card(a)
                summary_lines.append(f"• ** ({card['speciality']})\n  🏛️ Court: *{card['court']}* | 📍 Place: **{card['place']}**")
            
            return {
                "text": f"Found {len(results)} advocate(s) in **{detected_city}**:\n\n" + "\n".join(summary_lines),
                "type": "advocates",
                "advocates": [format_advocate_card(a) for a in results[:6]],
            }
        else:
            return {
                "text": f"No advocates found listed under **{detected_city} currently. Try searching all advocates.",
                "type": "text",
                "navigate": "/find-lawyer"
            }

    # 6. Filter by Speciality alone
    if detected_spec and ("lawyer" in query or "advocate" in query or "specialist" in query or len(query.split()) <= 3):
        results = find_advocates_by_speciality(detected_spec)
        if results:
            summary_lines = []
            for a in results[:6]:
                card = format_advocate_card(a)
                summary_lines.append(f"• ** — 🏛️ *{card['court']}*, {card['place']}")
            
            return {
                "text": f"Here are top advocates specialising in **{detected_spec.title()} Law**:\n" + "\n".join(summary_lines),
                "type": "advocates",
                "advocates": [format_advocate_card(a) for a in results[:6]],
            }

    # 7. List all advocates
    list_triggers = ["all advocates", "all lawyers", "list advocates", "show all", "advocates list"]
    if any(t in query for t in list_triggers):
        results = ADVOCATES[:8]
        return {
            "text": f"Here are our top listed advocates ({len(ADVOCATES)} total available):",
            "type": "advocates",
            "advocates": [format_advocate_card(a) for a in results],
            "navigate": "/find-lawyer",
        }

    # 8. Legal FAQ lookup
    faq_answer = answer_legal_faq(query)
    if faq_answer:
        return {
            "text": f"⚖️ **Legal Information:**\n{faq_answer}\n\n*Note: This information is educational and not formal legal advice. Please consult a qualified advocate for your specific matter.*",
            "type": "text",
        }

    # 9. General navigation fallback lookup
    path, keyword = detect_navigation(query)
    if path:
        label = keyword.replace("-", " ").title()
        return {
            "text": f"Taking you to {label}...",
            "type": "navigate",
            "navigate": path,
        }

    # 10. Direct name lookup fallback
    if len(raw.split()) <= 4:
        matches = find_advocate_by_name(raw)
        if matches:
            if len(matches) == 1:
                adv = matches[0]
                card = format_advocate_card(adv)
                return {
                    "text": f"Found **{card['name']}**! Practicing at {card['court']}, {card['place']}:",
                    "type": "advocates",
                    "advocates": [card],
                    "profileId": adv.get("id"),
                }
            return {
                "text": f"Found {len(matches)} matching advocate profiles:",
                "type": "advocates",
                "advocates": [format_advocate_card(a) for a in matches[:5]],
            }

    # 11. Help command menu
    help_words = ["help", "what can you do", "commands", "options", "assist"]
    if any(h in query for h in help_words):
        return {
            "text": "🤖 **AdvocateHub Bot Commands:**\n\n🔍 **Find Advocates & Courts**\n→ Type any city name (e.g., 'Gokak', 'Bengaluru')\n→ 'Criminal lawyers in Gokak'\n→ 'Find Priya Sharma'\n\n🧭 **Platform Navigation**\n→ 'Go to Bare Acts'\n→ 'Open Legal Documents'\n\n⚖️ **Legal Queries**\n→ 'What is bail?'\n→ 'How to file an FIR?'",
            "type": "text",
        }

    # 12. Final default fallback
    return {
        "text": "I'm not quite sure I caught that. You can try searching by city name (e.g. **'Gokak'**), typing a legal question, or typing 'help' to see all commands.",
        "type": "text",
    }