#!/usr/bin/env python3
"""
Seed Supabase with data extracted from the two credit card PDFs:
  1. Cal Mastercard Gold Business - card 1703 (April 2026)
  2. Isracard Mastercard Gold    - card 6530 (May 2026)

Confirmed schema via REST probing:
  merchants:     name, normalized_name, logo_url, default_category_id
  transactions:  account_id, merchant_id, category_id, amount, direction (debit/credit),
                 date, description, is_excluded, status (default "Completed")
  alerts/chart_data_points: RLS blocks user INSERT — populated by DB triggers
"""
import re, requests

SUPABASE_URL = "https://ttiytumzoukpvcqyqeat.supabase.co"
ANON_KEY     = "sb_publishable_61ArEpLxMzSmGd075ocZRw_NWesgBvZ"

def get_token():
    r = requests.post(f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers={"apikey": ANON_KEY, "Content-Type": "application/json"},
        json={"email": "test@compass.app", "password": "Compass2026!"})
    r.raise_for_status()
    d = r.json()
    return d["access_token"], d["user"]["id"]

TOKEN, USER_ID = get_token()
HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

def post(table, payload):
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", headers=HEADERS, json=payload)
    if r.status_code not in (200, 201):
        print(f"  ✗ {table}: {r.status_code} {r.text[:250]}")
        return None
    data = r.json()
    return data[0] if isinstance(data, list) and data else data

def post_many(table, rows):
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", headers=HEADERS, json=rows)
    if r.status_code not in (200, 201):
        print(f"  ✗ {table} batch: {r.status_code} {r.text[:300]}")
        return []
    return r.json()

def normalize(name):
    return re.sub(r'\s+', ' ', name.strip().lower())

print(f"✓ Signed in as {USER_ID}")

# ── Known category IDs (already seeded, publicly readable) ──────────────────
CAT = {
    "food":       "ce5a64cd-720a-44f1-8c72-433d9c844cb0",
    "shopping":   "e14e7053-b184-4344-9545-7ad494998c29",
    "bills":      "390f9d15-6474-4ba4-8946-12267a2212c5",
    "entertain":  "44fa790b-ba52-43c9-b349-8eee3fe889a4",
    "health":     "da8044dd-b308-4865-be48-36cecfe62148",
    "transport":  "f1f06bda-b8a5-4222-b1ee-62c6ad95e160",
    "tech":       "f84270d3-b6de-4415-9e06-97edbda21eda",
    "other":      "0ee181b8-cd7e-4954-8d2c-66022bf18068",
}

# ── 1. Accounts (institutions proxied to existing IDs) ───────────────────────
print("\n[1] Creating accounts…")
ACC_CAL = post("accounts", {
    "user_id":        USER_ID,
    "institution_id": "96d08243-7492-4cfd-887d-af56b797bfe2",  # Bank Hapoalim → proxy for Cal
    "name":           "כאל מסטרקארד זהב עסקי ●●●● 1703",
    "type":           "Credit",
    "currency":       "ILS",
    "balance":        -6469.93,
})
ACC_ISR = post("accounts", {
    "user_id":        USER_ID,
    "institution_id": "dcdeaed4-9ff6-4471-84db-4c6cbd329a98",  # Bank Leumi → proxy for Isracard
    "name":           "ישראכרט גולד מסטרקארד ●●●● 6530",
    "type":           "Credit",
    "currency":       "ILS",
    "balance":        -1845.57,
})
if not ACC_CAL or not ACC_ISR:
    print("  ✗ Failed to create accounts — stopping.")
    exit(1)
ACC_CAL_ID = ACC_CAL["account_id"]
ACC_ISR_ID = ACC_ISR["account_id"]
print(f"  ✓ Cal account:      {ACC_CAL_ID}")
print(f"  ✓ Isracard account: {ACC_ISR_ID}")

# ── 2. Merchants ─────────────────────────────────────────────────────────────
print("\n[2] Adding merchants…")
MERCHANT_DEFS = [
    ("שופרסל",                    CAT["food"]),
    ("סופר פארם",                 CAT["health"]),
    ("NANIT",                     CAT["health"]),
    ("Claude.ai",                 CAT["tech"]),
    ("Netflix",                   CAT["entertain"]),
    ("דור אלון",                  CAT["transport"]),
    ("חברת החשמל",               CAT["bills"]),
    ("ארומה",                     CAT["food"]),
    ("קופי סטאר",                CAT["food"]),
    ("WOLT",                      CAT["food"]),
    ("YES",                       CAT["bills"]),
    ("נספרסו",                   CAT["food"]),
    ("פרחי זהר",                 CAT["entertain"]),
    ("מרפאט",                    CAT["entertain"]),
    ("פיצה רונה קלאב",          CAT["food"]),
    ("בוגבו ישראל",              CAT["shopping"]),
    ("PAYPAL",                    CAT["other"]),
    ("PAYBOX",                    CAT["other"]),
    ("the creator barber studio", CAT["health"]),
    ("דרך ארץ",                  CAT["transport"]),
    ("ARCAFFE",                   CAT["food"]),
    ("תן ביס",                   CAT["food"]),
    ("זוזוברה",                  CAT["food"]),
    ("בינו בורגר",               CAT["food"]),
    ("מי רעננה",                 CAT["bills"]),
    ("איתוראן",                  CAT["bills"]),
    ("סאן קפה",                  CAT["food"]),
    ("פנגו",                     CAT["transport"]),
    ("דלק",                      CAT["transport"]),
    ("הראל ביטוח",              CAT["health"]),
    ("מגדל ביטוח",              CAT["health"]),
    ("פז YELLOW",                CAT["transport"]),
    ("צומת ספרים",               CAT["entertain"]),
    ("שטראוס מים",               CAT["bills"]),
    ("לחמים",                    CAT["food"]),
    ("ציקן הרצליה",              CAT["food"]),
    ("LOCCITANE",                 CAT["shopping"]),
    ("הסטוק רננים",              CAT["shopping"]),
    ("דרך היין",                 CAT["food"]),
    ("קבוצת וליו",               CAT["bills"]),
    ("J.M BARBER",               CAT["shopping"]),
    ("נאייקס ישראל",             CAT["food"]),
    ("בדקה ה90",                CAT["food"]),
]
merchant_rows = [{"name": n, "normalized_name": normalize(n), "default_category_id": c} for n, c in MERCHANT_DEFS]
inserted = post_many("merchants", merchant_rows)
M = {r["name"]: (r["merchant_id"], r.get("default_category_id")) for r in inserted}
print(f"  ✓ {len(M)} merchants inserted")

def mid(name): return M.get(name, (None, None))[0]

# ── 3. Cal Transactions — April 2026 ─────────────────────────────────────────
print("\n[3] Adding Cal card transactions (April 2026)…")
cal_txns = [
    ("2026-04-05", 895.37, "NANIT",                     "health",   "NANIT SP — חיוב בחו\"ל $280.10"),
    ("2026-04-06", 63.47,  "Claude.ai",                  "tech",     "Claude.ai Subscription — $20.00"),
    ("2026-04-01", 71.70,  "שופרסל",                    "food",     "שופרסל שלי הוד השרון"),
    ("2026-04-01", 141.50, "שופרסל",                    "food",     "שופרסל אקספרס בר אילן"),
    ("2026-04-01", 606.45, "סופר פארם",                 "health",   "סופר פארם ק.רננים 68"),
    ("2026-04-01", 60.00,  "פרחי זהר",                 "entertain","פרחי זהר"),
    ("2026-04-01", 45.00,  "LOCCITANE",                  "shopping", "LOCCITANE טיפוח"),
    ("2026-04-01", 8.00,   "הסטוק רננים",               "shopping", "הסטוק רננים רעננה"),
    ("2026-04-01", 349.80, "דרך היין",                  "food",     "דרך היין בעמ"),
    ("2026-04-05", 120.00, "the creator barber studio",  "health",   "תספורת"),
    ("2026-04-06", 69.90,  "Netflix",                    "entertain","Netflix.com — מנוי חודשי"),
    ("2026-04-07", 186.90, "דור אלון",                  "transport","דור אלון מעלה אדומים — דלק"),
    ("2026-04-08", 53.00,  "פיצה רונה קלאב",           "food",     "פיצה רונה קלאב מסעדה"),
    ("2026-04-09", 217.60, "נספרסו",                   "food",     "נספרסו פ\"ת — קפה"),
    ("2026-04-10", 809.63, "חברת החשמל",               "bills",    "חברת החשמל לישראל — חיוב דו-חודשי"),
    ("2026-04-10", 126.07, "מרפאט",                    "entertain","מרפאט הוראת קבע"),
    ("2026-04-12", 19.00,  "קופי סטאר",               "food",     "קופי סטאר"),
    ("2026-04-14", 61.28,  "שופרסל",                   "food",     "שופרסל אקספרס בר אילן"),
    ("2026-04-14", 130.00, "זוזוברה",                  "food",     "זוזוברה הרצליה — מסעדה"),
    ("2026-04-15", 113.00, "ארומה",                    "food",     "ארומה הדסה עין כרם"),
    ("2026-04-16", 263.00, "PAYPAL",                    "shopping", "RETAIL NEXT *PAYPAL — בריטניה"),
    ("2026-04-17", 95.92,  "PAYPAL",                    "food",     "ECOSUPP *PAYPAL — תוספי תזונה"),
    ("2026-04-17", 36.00,  "ארומה",                    "food",     "ארומה רננים"),
    ("2026-04-17", 40.00,  "פרחי זהר",                "entertain","פרחי זהר"),
    ("2026-04-17", 53.60,  "שופרסל",                  "food",     "שופרסל אקספרס בר אילן"),
    ("2026-04-17", 71.00,  "לחמים",                   "food",     "לחמים אינטרנט"),
    ("2026-04-18", 308.00, "PAYPAL",                   "bills",    "MAH HASHMAL *PAYPAL — חשבון חשמל"),
    ("2026-04-19", 20.00,  "PAYBOX",                   "other",    "PAYBOX — העברה מתנת פרידה"),
    ("2026-04-19", 20.00,  "קופי סטאר",               "food",     "קופי סטאר"),
    ("2026-04-19", 90.00,  "בינו בורגר",              "food",     "בינו בורגר — מזון מהיר"),
    ("2026-04-20", 58.76,  "דרך ארץ",                 "transport","דרך ארץ הוראת קבע — כביש"),
    ("2026-04-20", 33.00,  "ARCAFFE",                  "food",     "ARCAFFE GAV-YAM HERZLIYA"),
    ("2026-04-21", 69.75,  "WOLT",                     "food",     "WOLT — משלוח"),
    ("2026-04-21", 100.80, "WOLT",                     "food",     "WOLT — משלוח"),
    ("2026-04-23", 81.01,  "שופרסל",                  "food",     "שופרסל אקספרס בר אילן"),
    ("2026-04-23", 45.00,  "בדקה ה90",               "food",     "בדקה ה90"),
    ("2026-04-26", 29.00,  "קופי סטאר",              "food",     "קופי סטאר"),
    ("2026-04-26", 45.00,  "תן ביס",                 "food",     "תן ביס — משלוח"),
    ("2026-04-27", 63.00,  "ציקן הרצליה",            "food",     "ציקן הרצליה"),
    ("2026-04-27", 3.50,   "נאייקס ישראל",           "food",     "נאייקס ישראל — מכונת שתייה"),
    ("2026-04-27", 3.50,   "נאייקס ישראל",           "food",     "נאייקס ישראל — מכונת שתייה"),
    ("2026-04-27", 240.99, "מי רעננה",               "bills",    "מי רעננה בעמ — חיוב מים"),
    ("2026-04-27", 56.60,  "שופרסל",                 "food",     "שופרסל אקספרס בר אילן"),
    ("2026-04-28", 44.93,  "איתוראן",                "bills",    "איתוראן הוראת קבע — מעקב רכב"),
    ("2026-04-28", 120.00, "the creator barber studio","health",  "תספורת"),
    ("2026-04-29", 600.00, "בוגבו ישראל",            "shopping", "בוגבו ישראל — ביגוד"),
    ("2026-04-29", 130.00, "קבוצת וליו",             "bills",    "קבוצת וליו — מוסדות"),
    ("2026-04-29", 58.00,  "סאן קפה",               "food",     "סאן קפה בצרה"),
    ("2026-04-29", 397.24, "YES",                     "bills",    "YES הוראת קבע — טלוויזיה"),
    ("2026-04-29", 100.00, "J.M BARBER",             "shopping", "J.M BARBER BOUCAREMASH — ריהוט"),
    ("2026-04-30", 3.50,   "נאייקס ישראל",           "food",     "נאייקס ישראל — מכונת שתייה"),
]
cal_rows = [{
    "account_id":  ACC_CAL_ID,
    "merchant_id": mid(t[2]),
    "category_id": CAT[t[3]],
    "date":        t[0],
    "amount":      t[1],
    "direction":   "debit",
    "description": t[4],
} for t in cal_txns]
res1 = post_many("transactions", cal_rows)
print(f"  ✓ {len(res1)} Cal transactions inserted")

# ── 4. Isracard Transactions — May 2026 ──────────────────────────────────────
print("\n[4] Adding Isracard card transactions (May 2026)…")
isr_txns = [
    ("2026-05-31", 50.00,   "סופר פארם",    "health",   "סופר פארם אונו פארק"),
    ("2026-05-29", 59.85,   "פנגו",          "transport","פנגו-חניונים הוראת קבע"),
    ("2026-05-28", 293.24,  "דלק",           "transport","דלק קמעונאות דורון כ"),
    ("2026-05-27", 34.94,   "פנגו",          "transport","פנגו חשבונית חודשית הוראת קבע"),
    ("2026-05-26", 101.00,  "פנגו",          "transport","פנגו-חניונים הוראת קבע"),
    ("2026-05-26", 13.00,   "פנגו",          "transport","פנגו-חניונים הוראת קבע"),
    ("2026-05-26", 146.58,  "הראל ביטוח",   "health",   "הראל ביטוח בריאות הוראת קבע"),
    ("2026-05-26", 96.54,   "הראל ביטוח",   "health",   "הראל ביטוח בריאות הוראת קבע"),
    ("2026-05-20", 66.40,   "מגדל ביטוח",   "health",   "מגדל חיים/בריאות הוראת קבע"),
    ("2026-05-17", 268.81,  "פז YELLOW",     "transport","פז YELLOW אורלי גהה — דלק"),
    ("2026-05-13", 38.00,   "ארומה",         "food",     "ארומה רננים"),
    ("2026-05-10", 16.00,   "קופי סטאר",    "food",     "קופי סטאר"),
    ("2026-05-10", 56.45,   "הראל ביטוח",   "health",   "הראל ביטוח בריאות הוראת קבע"),
    ("2026-05-10", 120.83,  "הראל ביטוח",   "health",   "הראל ביטוח בריאות הוראת קבע"),
    ("2026-05-09", 248.47,  "דור אלון",      "transport","דור אלון מעלה אדומים — דלק"),
    ("2026-05-03", 29.00,   "קופי סטאר",    "food",     "קופי סטאר"),
    ("2026-05-01", 139.01,  "צומת ספרים",   "entertain","צומת ספרים קניון רננ — תשלום 31/36"),
    ("2026-05-01", 67.45,   "שטראוס מים",   "bills",    "שטראוס מים — תשלום 31 מתוך 36 (₪2,565 מקורי)"),
]
isr_rows = [{
    "account_id":  ACC_ISR_ID,
    "merchant_id": mid(t[2]),
    "category_id": CAT[t[3]],
    "date":        t[0],
    "amount":      t[1],
    "direction":   "debit",
    "description": t[4],
} for t in isr_txns]
res2 = post_many("transactions", isr_rows)
print(f"  ✓ {len(res2)} Isracard transactions inserted")

total_txns = len(res1) + len(res2)

print(f"""
╔══════════════════════════════════════════════════════════════╗
║  ✅  Phase 1 Seed Complete                                    ║
╠══════════════════════════════════════════════════════════════╣
║  Accounts:     2  (Cal 1703, Isracard 6530)                  ║
║  Merchants:    {len(M):<3}                                         ║
║  Transactions: {total_txns:<3} (51 Cal/Apr + 18 Isracard/May)         ║
║                                                               ║
║  ⚠  alerts & chart_data_points are RLS-blocked on INSERT     ║
║     → populated by DB triggers when transactions are added    ║
║                                                               ║
║  Login: test@compass.app  /  Compass2026!                    ║
╚══════════════════════════════════════════════════════════════╝
""")
