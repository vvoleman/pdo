# Návod pro správu API serveru PHR aplikace
## 0. Popis aplikace
API server slouží pro mobilní aplikace PHR jako zdroj dat pro diagnózy a léky. Server je napsán v jazyce PHP 8 a frameworku Symfony. Pro ukládání dat je využívána databáze MySQL
## 1. Externí datové zdroje
### 1.1 SÚKL
Státní ústav pro kontrolu léčiv (SÚKL) poskytuje data o léčivech a jejich interakcích. Data jsou poskytována ve formátu CSV v archivu ZIP. Tento zip obsahuje 10 souborů. Data jsou aktualizována 1x měsíčně
### 1.2 ÚZIS
Ústav zdravotnických informací a statistiky (ÚZIS) poskytuje data o diagnózách a jejich interakcích. Data jsou poskytována ve formátu CSV v archivu ZIP. Tento zip obsahuje 2 soubory. Data jsou aktualizována 1x ročně
## 2. Popis struktury
### 2.1 Entity
#### 2.1.1 Addiction
Třída Addiction reprezentuje závislosti mezi léky a diagnózami.
#### 2.1.2 AdministrationMethod
Třída AdministrationMethod reprezentuje způsoby podání léků. Například orální, nitrožilní, atd.
#### 2.1.3 Country
Třída Country reprezentuje státy, ve kterých jsou léky registrovány. Například Česká republika, Slovenská republika, atd.
#### 2.1.4 Dispensing
Třída Dispensing reprezentuje způsoby výdeje léků. Například na lékařský předpis, volně prodejné, atd.
#### 2.1.5 Doping
Třída Doping reprezentuje závislosti mezi léky a dopinkovými látkami.
#### 2.1.6 IndicationGroup
Třída IndicationGroup reprezentuje skupiny diagnóz. Například skupina diagnóz pro kardiovaskulární onemocnění.
#### 2.1.7 MedicalProduct
Třída MedicalProduct reprezentuje léky. Obsahuje název, účinnou látku, atd.
#### 2.1.8 ProductDocument
Třída ProductDocument reprezentuje dokumenty k lékům. Obsahuje název, typ, atd.
#### 2.1.9 ProductForm
Třída ProductForm reprezentuje formy léků. Například tablety, injekce, atd.
#### 2.1.10 RegistrationStatus
Třída RegistrationStatus reprezentuje stavy registrace léků. Například registrovaný, povolený, atd.
#### 2.1.11 Substance
Třída Substance reprezentuje účinné látky léků. Obsahuje název, typ, atd..
### 2.3 API endpointy
#### 2.3.1 GET /api/medical-products/list
Vrátí všechny léky. Lze použít parametr `search` pro vyhledání léků podle názvu nebo kódu. Dále lze použít parametr `page` pro stránkování.
#### 2.3.2 GET /api/diagnoses
Vrátí všechny diagnózy. Lze použít parametr `search` pro vyhledání diagnóz podle názvu nebo kódu. Dále lze použít parametr `page` pro stránkování.
## 3. Procesy
#### 3.2.1 Získání dat ze serverů
Oba zdroje nabízejí zdroje z jejich webových stránek přes odkaz. Pro získání tohoto odkazu je potřeba použít web scraping.
#### 3.2.2 Stažení dat
Data jsou stažena pomocí knihovny Guzzle. Data jsou rozbalena a uložena do složky `data/temp`. Je možné nastavit, aby se archiv nemazal a zůstal uložen pro případný rollback.
#### 3.2.3 Zpracování dat
Aplikace používá tzv. Syncery. Ty se starají o synchronizaci konkrétní oblastni s databází. Mezi syncery existují závislosti.
## 4. Nasazení
Deployment je rozdělen do několika kroků:
1. Stáhnutí poslední verze kódu z Githubu
2. Případné spuštění Docker kontejneru s API serverem
3. Update knihoven pomocí Composeru
4. Spuštění migrací
### 4.1 Automatický deployment
Na Githubu projektu je nastavený Github Actions workflow, který se spustí při každém pushnutí do větve `main`. Workflow se stará o automatický deployment na server.
### 4.2 Manuální deployment
Pro manuální deployment je potřeba spustit příkaz `php deploy.php` v kořenové složce projektu. Deployment je možné spustit s parametrem `--rollback`, který způsobí, že se neprovede aktualizace kódu, ale pouze se vrátí databáze do předchozího stavu.
## 5. Časté problémy
### 5.1 Chyba při spuštění migrací
Příčinou této chyby může být chyba v kódu migrace nebo chyba v kódu entity. V obou případech je potřeba opravit chybu a spustit migrace znovu.
### 5.2 Neaktualizují se externí datové zdroje
Toto může způsobovat jak chybné internetové připojení, oprávnění uložiště nebo výpadek externího datového zdroje. Všechny tyto případy je potřeba řešit individuálně. Pro více informací je možné se podívat do logů.
### 5.3 Chyba při spuštění deploymentu
Pokud se vyskytne chyba při spuštění deploymentu, je potřeba se podívat do logů. Většinou se jedná o chybu v kódu, která je potřeba opravit. V případě, že se jedná o chybu v kódu migrace nebo entity, je potřeba provést rollback a opravit chybu.
