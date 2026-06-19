## Wysokopoziomowa Specyfikacja Produktu: Analityka Webowa Privacy-First

**Cel produktu:** Dostarczenie właścicielom stron internetowych dogłębnej analityki behawioralnej i technicznej, przy jednoczesnym całkowitym wyeliminowaniu konieczności stosowania plików cookies i banerów zgód (Privacy by Design).

### 1. Architektura Prywatności i Zgodność z Prawem (RODO / ePrivacy)

Narzędzie jest projektowane tak, aby z definicji nie przetwarzać trwałych danych osobowych ani nie ingerować w urządzenia końcowe.

* **Brak plików Cookies i Local Storage:** Skrypt śledzący nie zapisuje ani nie odczytuje żadnych danych z przeglądarki użytkownika, całkowicie omijając restrykcje dyrektywy ePrivacy (tzw. Prawa Ciasteczkowego).
* **Dynamiczna Anonimizacja (Daily Salted Hashing):** Adres IP oraz ciąg User-Agent są szyfrowane jednostronnie za pomocą algorytmu (np. SHA-256) z wykorzystaniem unikalnej "soli" (salt), która jest automatycznie resetowana o północy. Uniemożliwia to śledzenie użytkownika pomiędzy różnymi dniami oraz fizyczne odtworzenie jego tożsamości.
* **Pełna Agregacja Danych:** System nie buduje profili pojedynczych użytkowników. Zdarzenia (np. kliknięcia, ruchy myszy) są przypisywane do konkretnych podstron i elementów interfejsu, a nie do wyizolowanych jednostek.
* **Szacunek dla ustawień prywatności:** Skrypt natywnie nasłuchuje i respektuje nagłówki żądań `Do Not Track` (DNT) oraz `Global Privacy Control` (GPC), automatycznie ignorując ruch z tych przeglądarek.

### 2. Bezpieczeństwo Danych

Wdrożenie najwyższych standardów ochrony informacji w infrastrukturze chmurowej.

* **Retencja Danych Wrażliwych:** Brak logowania w bazach danych surowych adresów IP. Czas życia surowych danych w pamięci podręcznej serwera (RAM) jest ograniczony do milisekund niezbędnych do wygenerowania hasha.
* **Separacja Danych Klientów:** Ruch każdego z klientów (wdrożeniowców) jest izolowany na poziomie bazy danych, co zapobiega wyciekom krzyżowym.
* **Lokalizacja Serwerów:** Hostowanie infrastruktury wyłącznie na terytorium Europejskiego Obszaru Gospodarczego (EOG), co eliminuje prawne problemy związane z transferem danych do państw trzecich (np. USA).

### 3. Główne Funkcjonalności Systemu

| Moduł | Opis Działania |
| --- | --- |
| **Mapy Cieplne (Heatmaps)** | Agregacja współrzędnych kliknięć i ruchów myszy, nakładana na serwerowo generowany zrzut ekranu strony. Pozwala ocenić dystrybucję uwagi. |
| **Analiza Zaangażowania** | Pomiary głębokości przewijania strony (Scroll Depth) oraz czasu aktywnego spędzonego na poszczególnych widokach. |
| **Lejki Sesyjne** | Śledzenie przepływu użytkowników pomiędzy podstronami w ramach jednego 24-godzinnego okna, identyfikujące miejsca największych porzuceń (drop-offs). |
| **Wskaźniki Frustracji UX** | Automatyczna detekcja błędów interfejsu (Dead Clicks) oraz irytacji użytkowników (Rage Clicks - wielokrotne, szybkie klikanie w jeden punkt). |
| **Atrybucja Ruchu** | Zczytywanie parametrów UTM z adresów URL w celu określenia, z jakich kampanii marketingowych pochodzą wizyty na stronie. |
| **Analiza AI i Botów** | Odrębny moduł (wymagający integracji Server-Side), izolujący ruch botów, scraperów i agentów AI od ruchu organicznego ludzi, zliczający zużycie zasobów. |

### 4. Wartość Biznesowa (Business Objectives dla Klientów)

Narzędzie dostarcza wymierne korzyści finansowe i operacyjne dla firm, które je wdrożą.

* **Optymalizacja Współczynnika Konwersji (CRO):** Identyfikacja wąskich gardeł na ścieżkach zakupowych i w formularzach ułatwia wprowadzanie zmian, które bezpośrednio zwiększają sprzedaż bez podnoszenia budżetów reklamowych.
* **Weryfikacja Rentowności Marketingu (ROI):** Ocena jakości ruchu z kampanii z wykorzystaniem parametrów UTM i wskaźników zaangażowania na stronie.
* **Cięcie Kosztów Utrzymania:** Szybkie wyłapywanie błędów interfejsu (UX/UI) zmniejsza obciążenie działu obsługi klienta. Moduł analizy botów pozwala na blokowanie kosztownego, niechcianego scrapowania treści przez AI.

### 5. Przewagi Konkurencyjne (USPs)

Argumenty sprzedażowe pozycjonujące produkt na rynku analitycznym.

* **Narzędzie "Cookieless":** Brak konieczności wieszania psujących estetykę i obniżających konwersję banerów zgody na cookies (cookie banners).
* **Odporność na AdBlocki:** Skrypty Privacy-first są rzadziej blokowane przez wtyczki i przeglądarki (np. Brave, Safari ITP), co zapewnia znacznie wyższą dokładność danych statystycznych w porównaniu do Google Analytics.
* **Dwa wymiary analizy (Ludzie vs. Maszyny):** Rzadko spotykane na rynku połączenie prostej analityki dla ludzi z zaawansowaną analizą zachowań agentów sztucznej inteligencji.

### 6. Wymagania Prawne dla Wdrożeniowców (Klientów)

Pomimo architektury "Privacy by Design", dostawca musi zagwarantować odpowiednie wsparcie dokumentacyjne.

* **Umowa DPA (Data Processing Agreement):** Gotowy załącznik do regulaminu usługi regulujący powierzenie przetwarzania danych technicznych przez ułamek sekundy (zanim zostaną zahashowane).
* **Szablon do Polityki Prywatności:** Krótki, przejrzysty akapit gotowy do skopiowania przez klienta, informujący jego użytkowników końcowych o stosowaniu bezciasteczkowej, całkowicie zanonimizowanej analityki statystycznej w celach usprawnienia serwisu.