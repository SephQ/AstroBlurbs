# Astrology text scraper

1. Assume each page only describes a single astrological placement/aspect.
2. Treat different domains differently to correctly scrape the relevant content.
3. Scrape either full placement/aspect descriptions or just 'keywords'.
4. Save scraped data into bulk text files in a formatted way, to make retrieval easy.

## Keyword scraping
Scraping 'keywords' from astrology aspect or placement descriptions online.

e.g. https://astromatrix.org/Horoscopes/Synastry-Aspects/Ascendant-Conjunct-Ascendant [Unity, Shared Identity, Mutual Understanding, Personal Growth, Immediate Connection, Joint Evolution, Energizing Presence, Empathy, Harmonious Vibes, Reflective Dynamics.]
From the html:
<div class="col-lg-12">
                                    <h2>Ascendant Conjunct Ascendant Keywords</h2>
                                    <div class="itemKeywords">
                                            <div class="itemKeyword">Unity</div>
                                            <div class="itemKeyword">Shared Identity</div>
                                            <div class="itemKeyword">Mutual Understanding</div>
                                            <div class="itemKeyword">Personal Growth</div>
                                            <div class="itemKeyword">Immediate Connection</div>
                                            <div class="itemKeyword">Joint Evolution</div>
                                            <div class="itemKeyword">Energizing Presence</div>
                                            <div class="itemKeyword">Empathy</div>
                                            <div class="itemKeyword">Harmonious Vibes</div>
                                            <div class="itemKeyword">Reflective Dynamics.</div>
                                    </div>
                                </div>

## Issues

Unfortunately, all sites will need different approaches for scraping.

Copyright. Most of AstroMatrix's content is from Robert Pelletier and Robert Hand's (astrologer and psychologist) books, so I think with attribution it should be ok under fair use, as AstroMatrix is also redistributing his words. Could also ask the authors' permission once I have the site working.

## Alpha version

Stick to just AstroMatrix.com and for Alpha we will just stick to Synastry aspects.

### Alpha Plan

I've scraped all the required synastry aspects from AstroMatrix.org, so scraping isn't needed.

What is needed:

1. Ability to compare two profiles, based on the positions of their 'planets'.
2. Ability to recognise aspects between planets, based on the angles between their positions in the zodiac.
3. A list of angles and orbs to define when an aspect is valid.
4. Ability to retrieve text for valid aspects from 'synastry_aspects.csv', possibly using RegEx (or something more elegant).
5. Ability to make a 'synastry report' output page with all valid aspects as headings, and the text as textcontent in a div element that follows.
6. UI to create synastry reports from two user profiles.

#### Angles and Orbs

Angles:
Conjunction: 0°
Opposition: 180°
Trine: 120° or 240°
Square: 90° or 270°
Sextile: 60° or 300°
Inconjunct: 150° or 210°

Orbs (from https://www.astrotheme.com/astrology_aspects.php):

Conjunction: 10.5°
Opposition: 10.0°
Trine: 8.3°
Square: 7.8°
Sextile: 6.1°
Inconjunct: 2.7°

## Future plans

Keyword scraping aspects and positions to describe a person in incredible detail based solely on their chart data. Taking the 'blurb' concept and creating intimate character profiles using that structure.

Use this scraped data to 