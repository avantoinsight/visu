Visu
====

Avoin selainpohjainen tilastovisualisaatio.

Rakenne
-------

* data -- Mm. aluerajojen lähdetiedostot
* doc -- Ohjeet ja dokumentaatio
  * ohjeet_yllapitajalle...pdf -- Ohjeet tilaston lisäämiseen ja poistoon. 
* example -- Standalone esimerkki asennuksesta pirkanmaa.fi-sivustolle
  * original -- Pirkanmaa.fi:n tiedostoja
  * visu -- Aputiedostot
  * index.html -- Pirkanmaa.fi:n etusivu
  * tilastoja.html -- Pirkanmaa.fi:n alasivu, johon lisätty Visun HTML. Ks. rivit 250-350
* img -- Grafiikan lähdetiedostot
* src -- Asennettavat tiedostot
  * visu -- Aputiedostot kuten JS-kirjastot, kuvat ja tyylit
    * css -- Tyylit
    * data -- Tilastot JSON-muodossa
    * img -- Kuvat
    * js -- JavaScript-luokat ja apukirjastot
      * main.js -- aloittaa visualisaation
    * snippet.html -- Kohdesivulle liitettävä HTML
* README.md -- Nämä asennusohjeet

Vaatimukset
-----------
* jQuery 1.4.4 tai uudempi tulee olla ladattuna

Asennus
-------

### Vaiheet
1. Kopioi src/visu/-hakemisto kohdesivustolle
2. Kopioi src/snippet.html-tiedoston sisältämä HTML kohdesivulle.
3. Jos tarvetta, päivitä kopioidun HTML:n link ja script -tagien osoitteet vastaamaan src/visu/-hakemiston asennussijaintia.

### Huomioi
* Visu on suunniteltu 650px leveyteen.
* Visualisaatio on toteutettu ainoastaan suomeksi.

### Muuta
* Hakemiston src/visu rakenne tulee pitää samana, sillä sekä src/visu/css/layout.css että src/visu/js/visucontroller.js sisältävät suhteellisia viittauksia muihin src/visu-hakemiston alaisiin tiedostoihin.

Käytössä sivustoilla
--------------------

* http://www.pirkanmaa.fi/fi/pirkanmaa/avoin-tilastopalvelu

Alkuperäinen suunnittelu ja toteutus
------------------------------------
Avanto Insight ([avanto.in](http://www.avanto.in))

Akseli Palén ([akselipalen.com](http://www.akselipalen.com))
