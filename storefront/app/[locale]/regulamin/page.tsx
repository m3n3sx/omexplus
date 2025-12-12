export default function RegulaminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Regulamin Sklepu</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§1 Postanowienia ogólne</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Sklep internetowy OMEX, działający pod adresem omex.pl, prowadzony jest przez OMEX Sp. z o.o.</li>
              <li>Niniejszy Regulamin określa zasady korzystania ze Sklepu internetowego.</li>
              <li>Regulamin jest dostępny nieodpłatnie na stronie internetowej Sklepu.</li>
              <li>Warunkiem złożenia Zamówienia jest akceptacja Regulaminu.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§2 Definicje</h2>
            <dl className="space-y-3 text-neutral-700">
              <div>
                <dt className="font-semibold">Sklep</dt>
                <dd className="ml-4">Sklep internetowy prowadzony przez Sprzedawcę pod adresem omex.pl</dd>
              </div>
              <div>
                <dt className="font-semibold">Sprzedawca</dt>
                <dd className="ml-4">OMEX Sp. z o.o., ul. Przykładowa 1, 40-000 Katowice, NIP: 1234567890</dd>
              </div>
              <div>
                <dt className="font-semibold">Klient</dt>
                <dd className="ml-4">Osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która dokonuje zakupów w Sklepie</dd>
              </div>
              <div>
                <dt className="font-semibold">Towar</dt>
                <dd className="ml-4">Produkt prezentowany w Sklepie internetowym</dd>
              </div>
              <div>
                <dt className="font-semibold">Zamówienie</dt>
                <dd className="ml-4">Oświadczenie woli Klienta zmierzające do zawarcia Umowy sprzedaży</dd>
              </div>
            </dl>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§3 Warunki zawarcia umowy</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Zawarcie Umowy sprzedaży następuje po złożeniu Zamówienia przez Klienta i jego przyjęciu przez Sprzedawcę.</li>
              <li>Warunkiem złożenia Zamówienia jest rejestracja w Sklepie lub podanie danych niezbędnych do realizacji Zamówienia.</li>
              <li>Ceny podane w Sklepie są cenami brutto (zawierają podatek VAT).</li>
              <li>Klient zobowiązany jest do podania prawdziwych danych osobowych.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§4 Realizacja zamówienia</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Zamówienia są realizowane w dni robocze od poniedziałku do piątku w godzinach 8:00-16:00.</li>
              <li>Czas realizacji Zamówienia wynosi od 1 do 7 dni roboczych, w zależności od dostępności Towaru.</li>
              <li>Sprzedawca zastrzega sobie prawo do przedłużenia czasu realizacji w przypadku braku Towaru.</li>
              <li>O wydłużeniu czasu realizacji Klient zostanie poinformowany drogą mailową lub telefoniczną.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§5 Płatności</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Klient może dokonać płatności za Zamówienie w następujący sposób:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Przelewem bankowym na rachunek Sprzedawcy</li>
                  <li>Płatnością online (karta płatnicza, BLIK, przelew)</li>
                  <li>Płatnością przy odbiorze (gotówka lub karta)</li>
                  <li>Płatnością odroczoną (dla firm)</li>
                </ul>
              </li>
              <li>Zamówienie jest realizowane po zaksięgowaniu płatności na koncie Sprzedawcy.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§6 Dostawa</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Dostawa Towaru odbywa się na terenie Polski.</li>
              <li>Koszty dostawy są określone w zakładce "Dostawa i płatność".</li>
              <li>Dostawa jest darmowa dla zamówień powyżej 500 PLN.</li>
              <li>Czas dostawy wynosi od 1 do 3 dni roboczych od momentu wysłania przesyłki.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§7 Prawo odstąpienia od umowy</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Klient będący konsumentem ma prawo odstąpić od Umowy w terminie 14 dni bez podania przyczyny.</li>
              <li>Termin do odstąpienia od Umowy wygasa po upływie 14 dni od dnia objęcia Towaru w posiadanie.</li>
              <li>Aby skorzystać z prawa odstąpienia, Klient musi poinformować Sprzedawcę o swojej decyzji.</li>
              <li>Zwracany Towar nie może nosić śladów użytkowania.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§8 Reklamacje</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Sprzedawca odpowiada za wady fizyczne i prawne Towaru.</li>
              <li>Reklamację należy zgłosić na adres: reklamacje@omex.pl</li>
              <li>Sprzedawca ustosunkuje się do reklamacji w terminie 14 dni.</li>
              <li>Szczegółowe informacje o reklamacjach znajdują się w zakładce "Zwroty i reklamacje".</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§9 Ochrona danych osobowych</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Administratorem danych osobowych jest OMEX Sp. z o.o.</li>
              <li>Dane osobowe są przetwarzane zgodnie z RODO.</li>
              <li>Szczegółowe informacje znajdują się w Polityce Prywatności.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">§10 Postanowienia końcowe</h2>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Sprzedawca zastrzega sobie prawo do zmiany Regulaminu.</li>
              <li>W sprawach nieuregulowanych w Regulaminie mają zastosowanie przepisy prawa polskiego.</li>
              <li>Ewentualne spory będą rozstrzygane przez sąd właściwy dla siedziby Sprzedawcy.</li>
            </ol>
          </section>

          <div className="bg-neutral-50 rounded-xl p-6 mt-8">
            <p className="text-sm text-neutral-600">
              <strong>Data wejścia w życie:</strong> 01.01.2024<br />
              <strong>Ostatnia aktualizacja:</strong> 01.01.2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
