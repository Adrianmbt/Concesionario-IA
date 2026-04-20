"""
Scoring simple basado en keywords.
Score 0-10. >= 7 = lead caliente -> alerta a vendedor.
Swappeable por un modelo ML más adelante.
"""

HOT_KEYWORDS = [
    "financiamiento", "crédito", "cuotas", "precio final",
    "prueba de manejo", "test drive", "cuándo puedo", "disponible",
    "lo quiero", "me interesa", "cómo compro", "formas de pago",
    "enganche", "down payment", "entrega",
]

WARM_KEYWORDS = [
    "precio", "costo", "cuánto vale", "especificaciones",
    "consumo", "rendimiento", "garantía", "colores",
]

def score_lead(message: str) -> int:
    msg = message.lower()
    score = 0
    for kw in HOT_KEYWORDS:
        if kw in msg:
            score += 3
    for kw in WARM_KEYWORDS:
        if kw in msg:
            score += 1
    return min(score, 10)
