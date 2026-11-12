---
layout: default
title: "O5 · The salt ledger: what makes seawater heavy"
subtitle: "Lecture notes · EC2113 Ocean module · Lecture 5 · Thursday 12 November 2026"
footer: "[← All lectures and tutorials](../../../)"
---
*These notes follow the lecture as it was taught. Section 8, on water masses, goes well beyond what we had time for in class, because several of you asked for more. Read it with the Atlantic section from the slides open beside you. The parts of the plan we didn't reach are at the end, under "Read this part". The readings are extracts in the course's shared readings folder, under O5.*

## The question

Why is the sea salty in some places and fresh in others? And what makes a cubic metre of seawater heavy enough to sink?

## 1. From momentum to salt

The ledgers so far have come in a chain. To explain the heat budget (why the ocean gains heat where it is cold) we needed the momentum budget (what the wind does to a rotating ocean). Momentum is mass times velocity, and for a fluid the mass in each cubic metre is its **density**. So the next question is what sets density.

For pure water that is easy: density depends on temperature, so if you know the heat budget you know the density budget. Seawater also depends on how much salt is dissolved in it. Temperature and salinity together set the density of seawater, almost completely. Pressure matters too: water is very slightly compressible. We'll mostly set that aside.

## 2. The salt ledger: the accountant's hat

Start the way we started for heat: treat the whole ocean as one box and ask what comes in and what goes out.

**Water** comes and goes in several ways:

- **Rivers** and **rain** only add water.
- **Land ice** (glaciers and ice sheets) only adds water when it melts into the sea.
- **Sea ice** can do either. Freezing takes water out of the sea, and melting puts it back.
- **Evaporation** is essentially the only way water leaves.

**Salt** is a different story. Rain, evaporation and ice carry almost no salt: evaporation and freezing take the water and leave the salt behind. Rivers do bring a little dissolved salt, from the [weathering](https://en.wikipedia.org/wiki/Weathering) of rocks, but that matters only over geological time, vastly longer than anything in this course. (How the ocean balances its salt budget over that time, and whether the sea has always been this salty, is a good question in its own right: see the two optional readings at the end.) On the timescales we care about, **the ocean holds a fixed amount of salt.**

So the total amount of salt doesn't change; what changes is how concentrated it is. [Salinity](https://en.wikipedia.org/wiki/Salinity) is grams of salt per kilogram of seawater, about 35 on average. You can't change the grams of salt, so the only way to change salinity at a place is to change the water: take water away (evaporation, freezing) and it gets saltier; add water (rain, rivers, melting ice) and it gets fresher. Ocean currents also carry salty water in and fresh water out, and we'll come back to that. But to a first approximation, **the salinity of the surface ocean is a record of evaporation minus precipitation, E − P.**

**An aside on why climate is a complex system.** Notice what just happened. The salt budget can't be separated from the water budget. The water budget depends on rain and evaporation, which carry latent heat, so it is tied to the heat budget. And the heat budget, as we saw on Wednesday, is tied to momentum. A physicist can write a conservation law for each one: physics is largely a list of conservation laws (of mass, of momentum, of energy). Each law on its own is simple. What makes climate a [complex system](https://en.wikipedia.org/wiki/Complex_system) is that the budgets are coupled, and the coupled system does things that no single budget would lead you to expect.

## 3. Where the sea is salty: the data scientist's hat

Compared with temperature, which ranges over 30 °C, salinity is remarkably uniform. Half of all the water in the ocean lies between 34.6 and 34.8 (Stewart p. 80), and even at the surface the range is only a few grams per kilogram, a few per cent. But those small differences are what matter for density and circulation.

If E − P sets the pattern, where should the sea be saltiest? We need evaporation high and rain low.

**Rain** is heaviest under the [Intertropical Convergence Zone](https://en.wikipedia.org/wiki/Intertropical_Convergence_Zone) (ITCZ), the rising branch of the [Hadley cell](https://en.wikipedia.org/wiki/Hadley_cell), and lightest in the subtropics under its sinking branch.

**Evaporation** needs two things: energy to evaporate the water, which over the ocean comes mostly from sunlight, and air dry enough to take up the vapour (the wind helps too, by carrying moist air away). Sunlight at the top of the atmosphere is greatest at the equator, but clouds cut much of it off before it reaches the surface. So:

- **The subtropics win twice.** Clear skies let the sunlight through, and the sinking air is very dry. Evaporation is high and rain is low.
- **The ITCZ loses twice.** Clouds block much of the sunlight, and the air is already humid. Evaporation is lower and rain is high.

So the saltiest water should be in the subtropics, around 20–30° from the equator, and the freshest under the ITCZ. That is what the map shows (WOCE climatology; Stewart Figs 6.4–6.5). The atmosphere's own water budget closes the same way: the air picks up water over the subtropics and the Hadley cell's low-level return flow carries it to the ITCZ, where it rains out.

**High latitudes are fresh.** Water vapour carried poleward from the subtropics rains out there, while cold air can hold very little water vapour (the [Clausius–Clapeyron relation](https://en.wikipedia.org/wiki/Clausius%E2%80%93Clapeyron_relation)), so evaporation is small. Rivers and melting ice add more fresh water.

Some numbers from the maps, as box means of E − P for 2010–2020, in mm of water per day:

| Place | E − P (mm/day) | Surface salinity (g/kg) |
|---|---|---|
| North Atlantic subtropics, 20–30°N, 50–30°W | +2.8 | 37.2 |
| South Pacific subtropics, 25–15°S, 130–100°W | +3.3 | 36.2 |
| East Pacific under the ITCZ, 5–10°N, 130–90°W | −3.9 | 33.8 |
| West Pacific warm pool, 5°S–5°N, 140–170°E | −3.6 | 34.5 |

**Seas with little river water.** The Mediterranean sits in the subtropics, loses a great deal to evaporation, and gets little river water in return, so it is very salty. The Red Sea is the same. Among rivers, the largest sources of fresh water to the sea are the Amazon and the Ganga–Brahmaputra; the Nile, for all its length, carries far less.

## 4. Why the Atlantic is saltier than the Pacific

At every latitude the Atlantic is saltier: between 30°S and 60°N its surface averages 35.6 against the Pacific's 34.6 (WOCE). The reason is in the atmosphere. The trade winds blow from the Atlantic towards the Pacific, and the only thing in the way is the narrow [Isthmus of Panama](https://en.wikipedia.org/wiki/Isthmus_of_Panama). Water evaporated from the Atlantic is carried west and rains out over the Pacific. About 0.32 million m³ a second leaves the Atlantic this way, roughly the flow of the Amazon (Stewart pp. 78–81, Fig. 6.6, after Broecker). Our E − P maps agree: between 30°S and 60°N the Atlantic loses about 1.0 mm a day more than it gains, and the Pacific is close to balance.

(Someone asked about the Panama Canal. It plays no part: it is a narrow waterway with locks, and the transfer happens in the air, carried by the wind.)

This depends on where the continents are today. When the continents were arranged differently, so was this ledger. **Keep this result in mind: tomorrow's lecture depends on it.**

## 5. Close to home: the Arabian Sea and the Bay of Bengal

At the same latitude, under the same monsoon, the two seas on either side of India have very different ledgers. Box means over 10–20°N (WOCE and our E − P):

| | Arabian Sea (60–70°E) | Bay of Bengal (83–93°E) |
|---|---|---|
| Surface salinity | 36.2 g/kg | 32.9 g/kg |
| E − P | +2.6 mm/day | −1.1 mm/day, plus the rivers |
| Surface density, σ | 23.4 kg/m³ | 20.7 kg/m³ |

A difference of about 3 g/kg between two seas side by side is rare anywhere in the world ocean.

**The Bay of Bengal is fresh** because many of South Asia's great rivers drain into it: the Ganga–Brahmaputra, and others such as the Mahanadi. During and after the monsoon the Bay's surface becomes very fresh and stays that way for months. The rivers bring sediment as well as water, which has built the [Bengal Fan](https://en.wikipedia.org/wiki/Bengal_Fan), the largest submarine fan on Earth.

**The Arabian Sea is salty** because little river water reaches it, and evaporation is high. After crossing the equator the strong monsoon winds blow mostly over the Arabian Sea, picking up water vapour as they go. And air sinking over the Arabian Sea during the monsoon suppresses rain there. That is the subtropical recipe again: something suppresses rain while strong winds drive evaporation.

The difference isn't only at the surface. The two seas' salinities differ down to at least 500 m. But below about 200 m their **densities** are the same (σ 26.15 and 26.14 at 200 m), because temperature makes up the difference. Above that, the Bay's water is much lighter.

**A freshwater lid.** You may have seen the experiment where salt water goes into a beaker and fresh water is poured gently on top: the two stay separate, with a sharp boundary. The Bay of Bengal does this all the time. Light, fresh water sits on top of dense, salty water. From O3: the wind stirs the upper ocean, and how deep it can stir depends on how strongly the density increases with depth. A strong density step is hard to stir through, so **the Bay's mixed layer stays shallow**. The sunlight's heat is then spread over a thin layer, so the surface stays warm. In WOCE's annual mean the Bay's surface is 28.3 °C against the Arabian Sea's 27.5 °C, though both receive comparable sunlight.

**Why it matters for India.** Warm surface water feeds the atmosphere with heat and water vapour, which favours rain and storms. Most of the North Indian Ocean's [tropical cyclones](https://en.wikipedia.org/wiki/North_Indian_Ocean_tropical_cyclone) form over the Bay of Bengal, and only a few over the Arabian Sea. The freshwater lid is part of the reason. The India Meteorological Department also points to the Arabian Sea's stronger wind shear, and some of the Bay's storms are the remains of Pacific typhoons. Next time a cyclone is in the news, check where it formed.

One of you asked which comes first: does the rain freshen the Bay, or does the warm, fresh Bay make the rain? Both, and that is the point of the aside in §2. Rain and rivers make the lid; the lid keeps the surface warm; a warm surface favours more rain. A loop like this is a feedback, and it is one more way that budgets are coupled.

## 6. What makes seawater heavy: the physicist's hat

Density depends on temperature and salinity. The slides showed this as a **T–S diagram**: salinity along the bottom, temperature up the side, and curved lines of equal density across it. Seawater is always within a few per cent of 1,000 kg/m³ (surface water is typically about 1,027), so oceanographers quote only the difference, **σ = ρ − 1000 kg/m³** (Stewart eq. 6.7). Moving down the diagram (colder) or to the right (saltier) makes water denser.

**Look at the slope of the density lines.**

- **In warm water** the lines lie fairly flat, so a small change of temperature crosses many of them. **Temperature controls density**, for two reasons. Warm water's density is very sensitive to temperature, and at the surface temperatures range over tens of degrees while salinities change by only a few grams per kilogram. Most of the ocean's warm water is near the surface, so near the surface temperature does most of the work.
- **In cold water** the lines stand almost upright. Cooling it changes the density very little; adding salt changes it a lot. **Salinity controls density.** The coldest water is also where sea ice forms, and that matters a great deal.

**Brine rejection.** When seawater freezes, the ice that forms is almost fresh. The salt is pushed out of the ice crystals into the water below, as brine ([brine rejection](https://en.wikipedia.org/wiki/Brine_rejection)). Now picture salty water reaching a polar sea in winter and getting cold enough to freeze. Freezing makes the water left behind saltier, as evaporation does elsewhere. That water is **cold and salty**, and in cold water salt is what counts: it becomes so dense that it can no longer stay at the surface. Its density matches the deep ocean's, and it sinks.

**This is how the surface ocean talks to the deep ocean.** Everything in the past few lectures (the mixed layer, Ekman transport, the gyres) has been about the upper few hundred metres. The link to the deep ocean is density, and at high latitudes that means salt. Only a few per cent of the surface ocean (about 4%, Hartmann p. 225) is ever dense enough to sink. The circulation it drives has been called the [thermohaline circulation](https://en.wikipedia.org/wiki/Thermohaline_circulation), *thermo* for heat and *haline* for salt. We take it up tomorrow.

## 7. Where the surface is heavy enough

On the map of surface density, the water as dense as the deep ocean is in only a few patches:

- **The Mediterranean and the Red Sea**, for the reason in §3: subtropical evaporation with little river water to replace it, so they become extremely salty. Their water sinks within those seas and flows out into the open ocean at middle depths.
- **The far North Atlantic, near Greenland**, and **a few patches close to Antarctica**, through the cold-and-salty mechanism of §6.

**Katabatic winds.** If you have walked up to a glacier, you will have felt a cold wind blowing down it. The ice cools the air in contact with it; cold air is dense, and on a slope dense air flows downhill. This is a [katabatic wind](https://en.wikipedia.org/wiki/Katabatic_wind). You can make the same thing in a lab by pouring salty, coloured water down a ramp in a tank of fresh water. Now replace the glacier with the Antarctic ice sheet, a dome of ice the size of a continent. Very cold, dense air pours off it and out over the sea. Look at the map: the densest surface water around Antarctica is right against the coast. These winds do two things. They chill the water. And they blow the newly formed sea ice offshore, leaving open water ([polynyas](https://en.wikipedia.org/wiki/Polynya)) where more ice forms quickly, rejecting more brine (Hartmann p. 224). The result is the densest water in the ocean.

## 8. Water masses: fingerprints of where water has been

*This section is longer than the time it got in class.*

### One place, top to bottom

Take one place in the South Atlantic, 30°S 25°W (WOCE climatology), and go down:

| Depth | Temperature | Salinity | |
|---|---|---|---|
| surface | 22.1 °C | 36.0 | warm and salty: the subtropics |
| 200 m | 15.2 °C | 35.5 | cooler, still salty |
| ~900 m | 4.2 °C | **34.3** | a salinity *minimum* |
| ~3,000 m | 2.4 °C | **34.9** | a salinity *maximum* |
| 4,750 m (bottom) | 0.8 °C | 34.8 | the coldest water |

Temperature falls all the way down, but salinity goes down, then up, then slightly down again. Water that simply got colder with depth would not do that. These are **layers of water that came from different places.**

Why does water keep a record of where it came from? Temperature and salinity are set only at the surface, in the mixed layer, by heating, cooling, rain, evaporation and freezing. Once water sinks below the mixed layer, nothing in the interior adds or removes heat or salt. Its temperature and salinity can change only by mixing with the water around it, and in the deep ocean that mixing is very weak (Stewart pp. 223–224; Hartmann p. 221). So a parcel carries the temperature and salinity it had when it last touched the surface, for decades to centuries. Properties that behave like this are called **conservative**. Oxygen, by contrast, is used up by living things, so it changes as the water ages.

This is why oceanographers often plot temperature against salinity rather than against depth. Depth tells you where the water is now; its temperature and salinity tell you where it came from.

### What a water mass is

A [water mass](https://en.wikipedia.org/wiki/Water_mass) is a body of water with a common origin: it formed in one region of the surface ocean, so it has a characteristic temperature and salinity. In its formation region it fills the ocean on its own. Elsewhere it shares the ocean with other water masses and slowly mixes with them (Stewart p. 223, after Tomczak). The idea was borrowed from meteorology. Vilhelm Bjerknes described the air masses that form over the poles and collide with warm air at **fronts**, and ocean water masses are also separated by fronts (Stewart p. 222).

Three things to know for reading a [T–S diagram](https://en.wikipedia.org/wiki/Temperature%E2%80%93salinity_diagram) (Stewart p. 224, Figs 13.7–13.8):

- **Mixing two water masses gives a straight line** between their points on the diagram. A 50–50 mix sits halfway along it.
- **Mixing three gives two lines meeting at a corner**, and further mixing rounds the corner off. The kinks in the 30°S profile are rounded corners of this kind.
- **Mixing makes water denser.** The lines of equal density are curved, so a mix of two waters with the *same* density lands on the dense side of that line. Mixing alone can make water sink a little.

### Reading the Atlantic section

The salinity section along 30°W in the slides shows these layers stretched out from Antarctica to Greenland. Oceanographers trace a water mass by following its **core**, the depth where a property such as salinity reaches its maximum or minimum, back to where it is strongest. That is usually near where it formed (Stewart pp. 225–227, the "core method"). Salinity works well for this; temperature doesn't, because it changes density too much. Two cautions from Stewart. A slow drift and sideways mixing leave the same pattern, so the method can't tell them apart. And the water moves mostly **along surfaces of constant density**, not literally along the arrows on a diagram.

From the top down, here are the water masses in the section.

**North Atlantic Deep Water (NADW)**: the salty tongue at 2–3 km.
- *Where and how it forms:* in the far North Atlantic, in the Norwegian and Greenland Seas and the Labrador Sea. The Gulf Stream and its extension carry warm, salty water far north, where very cold winter air cools it until it is dense enough to sink (Hartmann p. 224; Stewart pp. 211, 213; the Labrador Sea also contributes). It forms mainly by **cooling salty water**, not by brine rejection.
- *Its fingerprint:* about 4 °C and 35.0 between 33°S and 11°N (Stewart Table 13.1). In our 30°W section the salinity maximum is 34.8–35.0, between about 1,750 m and 3,000 m, from 20°N to 40°S.
- *Where it goes:* south, at 2–3 km, the length of the Atlantic, and on into the Southern Ocean. There, mixed with deep water from the other oceans, it becomes **Circumpolar Deep Water**, which the Antarctic Circumpolar Current carries round all three oceans (Stewart p. 226; [Circumpolar Deep Water](https://en.wikipedia.org/wiki/Circumpolar_deep_water)).

**Antarctic Intermediate Water (AAIW; Stewart writes AIW)**: the fresh tongue at about 1 km.
- *Where and how it forms:* in the Southern Ocean around 50–55°S, near the Antarctic Polar Front (Stewart p. 226). There rain exceeds evaporation and melting sea ice adds more fresh water, so the surface is cold and fresh (Hartmann p. 222). In winter it is pushed down on the northern edge of the Antarctic Circumpolar Current (Hartmann p. 222). This is Wednesday's physics: equatorward of the westerly winds, Ekman transport converges and pushes water down (Hartmann pp. 225–227).
- *Its fingerprint:* about 3.3 °C and 34.15 (Stewart Table 13.1). In our section the salinity minimum is 34.2–34.5, at 700–900 m, from 40°S to the equator, fading between 10°N and 20°N as it mixes away.
- *Where it goes:* north at about 1 km, into the North Atlantic.

**Antarctic Bottom Water (AABW)**: on the floor.
- *Where and how it forms:* on the continental shelves around Antarctica in winter, mostly in the Weddell and Ross Seas. Katabatic winds, polynyas and brine rejection make water that is extremely cold and salty enough to be the densest in the ocean (Hartmann p. 224; Stewart p. 226). It flows down the continental slope, mixing with Circumpolar Deep Water on the way.
- *Its fingerprint:* about 0.4 °C and 34.67 (Stewart Table 13.1). It is **the coldest and the densest** water, but **not the saltiest**: NADW is saltier. Cold water's density depends mostly on salt (§6), but AABW is so cold that it is denser anyway. In our section the bottom water is −0.1 °C and 34.67 at 40°S, and near the Weddell Sea at 4,000 m it is −0.7 °C.
- *Where it goes:* north along the sea floor, filling the deepest basins of the Atlantic from about 50°S to about 30°N (Stewart Fig 13.10), and the Indian and Pacific deep basins too.

**And two more, briefly.**
- **Mediterranean Water.** The very salty water formed in the Mediterranean (§7) flows out through the Strait of Gibraltar and spreads into the North Atlantic at middle depths (Stewart p. 227; [Mediterranean outflow](https://en.wikipedia.org/wiki/Mediterranean_outflow)). It is the orange blob near 35°N at about 1 km in the section: 35.95 and 9.8 °C at 1,100 m west of Gibraltar (WOCE). In class we left it out of the activity.
- **Central water.** The warm, salty water of the upper few hundred metres in the subtropics (Stewart Table 13.1 lists one, at 18 °C and 35.9). It gets its salt from the subtropical evaporation of §3, and the downward Ekman pumping in the gyres (O4) pushes it below the surface. It is the top of the 30°S profile.

**The stack.** Lighter water sits on denser water: central water on top, then AAIW, then NADW, then AABW on the floor. Think of syrups of different densities poured carefully into one glass. Each keeps its identity over thousands of kilometres and centuries because the ocean's interior mixes so weakly. Its motion is nearly *adiabatic*, along surfaces of constant density (Hartmann p. 225). The atmosphere has air masses too, but they are stirred and changed within days to weeks. Water masses last far longer.

### The Pacific is different

The Pacific section shows the fresh intermediate water from the south and the bottom water from Antarctica. But **there is no salty tongue from the north**: the North Pacific forms no deep water. Its own northern water is so fresh that it sinks only part of the way down and spreads towards the equator beneath the salty subtropical water (Hartmann pp. 199–200; Stewart Fig 13.11 calls it North Pacific Intermediate Water). Why can't the North Pacific make deep water, when it gets just as cold? That is the question for tomorrow, and §4 holds the answer.

## 9. Next: the overturning

Deep water forms in only a few places: the far North Atlantic and around Antarctica. Something has to bring it back up again, or the deep ocean would fill with cold water and the surface ocean would drain away. Tomorrow: where it comes back up, how long the round trip takes, and whether it could stop.

## Read this part: what we didn't cover in class

### Seawater has no 4 °C maximum

Fresh water is densest at 4 °C. That is why a lake cools until the whole of it reaches 4 °C, then freezes from the top, keeping 4 °C water at the bottom where fish survive the winter. **Seawater saltier than 24.7 g/kg has no such maximum**: it keeps getting denser all the way to its freezing point, about −1.9 °C at a salinity of 35 (Hartmann pp. 196–197; our check with TEOS-10, the international equation of state for seawater, gives −1.92 °C). So in the ocean the coldest water is also the densest.

That raises a puzzle. If cooling always makes seawater denser, cold surface water should sink and be replaced from below, and the whole water column would have to cool to freezing before any ice could form. Sea ice forms anyway because, at high latitudes, the surface is **fresher** than the water beneath it: rain, rivers and melting ice make a fresh layer, a [halocline](https://en.wikipedia.org/wiki/Halocline). The fresh water is light enough to stay on top even when it is colder, and only that thin layer has to reach freezing (Hartmann pp. 197–198). Hartmann mentions a striking consequence: diverting some of the big rivers that flow into the Arctic Ocean could, in principle, upset the Arctic's thin floating ice cover (p. 198).

### The numbers behind the asymmetry

From the TEOS-10 equation of state, at a salinity of 35 and surface pressure:

| | at 25 °C | at 0 °C |
|---|---|---|
| Density change for 1 °C of cooling | +0.30 kg/m³ | +0.054 kg/m³ |
| Density change for 1 g/kg more salt | +0.74 kg/m³ | +0.80 kg/m³ |

In warm water one gram per kilogram of salt is worth about 2.5 °C of cooling. Near freezing, cooling is about 5½ times weaker, so to add 1 kg/m³ you would need about 18 °C of cooling. That's impossible, because the water freezes first. Adding 1.25 g/kg of salt does it instead. Hartmann's summary is that, across the whole ocean, salinity and temperature are about equally important for density differences (p. 196).

### How rare dense surface water is

Three-quarters of the ocean's volume (75%) has a potential density above σ 27.4, but only about 4% of its surface water is ever that dense (Hartmann p. 225). Our check with the WOCE climatology gives 78% of the volume, but only 1.4% of the surface in the *annual mean*. Hartmann's 4% includes the winter months, when the dense patches are largest. So deep water forms in only a few places, and only in winter. Everywhere else the ocean is light water on heavy water: the stratification that stopped the wind's stirring in O3.

### Potential density

Deep in the ocean, water is squeezed by the pressure above it, which makes it a little denser and a little warmer than it would be at the surface. To compare water from different depths, oceanographers imagine bringing each sample up to the surface without letting it exchange heat, and use its density there: the **potential density**, written σθ (Stewart pp. 84–86). All the densities in these notes and the slides are of this kind.

### Two numbers from the accountant

- **How fast evaporation salts the surface.** A 50 m mixed layer at a salinity of 35 that loses 1 m of fresh water a year (E − P of about 2.7 mm a day, as in the subtropics) would get saltier by 35 × 1/50 = 0.7 g/kg every year (our sum). It doesn't keep getting saltier, so currents and mixing must carry the salt away as fast as evaporation concentrates it.
- **Why the Atlantic doesn't keep getting saltier.** Broecker estimated that if the ocean didn't exchange salty Atlantic water for fresher Pacific water, the whole Atlantic would get saltier by about 1 gram per litre every thousand years (Stewart p. 79). That exchange is carried by the ocean circulation, part of tomorrow's story.

## Why this matters for the next lecture

Tomorrow (O6) uses three results from today. The Atlantic is saltier than the Pacific because the atmosphere carries its fresh water away (§4). In cold water, salt decides density (§6). And the deep ocean is a stack of water masses that formed in a few places at the surface (§8). Together they explain why the North Atlantic makes deep water and the North Pacific doesn't. And because the deep circulation depends on a salt ledger, they suggest it might not have only one way of running.

## Key terms

**Salinity:** grams of dissolved salt per kilogram of seawater, about 35 on average. **E − P:** evaporation minus precipitation; positive where the sea loses fresh water. **σ (sigma):** density minus 1,000 kg/m³. **Potential density:** the density water would have if brought to the surface without exchanging heat. **T–S diagram:** temperature against salinity, with lines of equal density. **Brine rejection:** salt left in the water when sea ice forms. **Halocline:** a layer where salinity changes quickly with depth. **Freshwater lid:** a fresh, light surface layer that resists stirring (the Bay of Bengal). **Katabatic wind:** cold, dense air flowing down a slope of ice. **Polynya:** open water in sea ice, where new ice forms fast. **Conservative property:** one that changes only by mixing in the ocean's interior (temperature, salinity). **Water mass:** a body of water with a common origin and a characteristic temperature and salinity. **Core method:** tracing a water mass by following its salinity maximum or minimum. **NADW, AAIW, AABW, Circumpolar Deep Water, Mediterranean Water.** **Thermohaline circulation.**

## Readings

All extracts are in the shared readings folder, under O5. The core readings add up to **22 pages**, all covered in class. Page numbers are the books' printed pages.

**Core: covered in class (22 pages)**

- Stewart, *Introduction to Physical Oceanography* (2008), §6.3 "Geographical Distribution of Surface Temperature and Salinity", pp. 77–81 (5 pages). Start at the heading §6.3 near the bottom of p. 77 and stop at §6.4 on p. 81. The salinity and E − P maps, and Broecker's Atlantic-to-Pacific transfer (Fig. 6.6).
- Hartmann, *Global Physical Climatology* (2nd ed., 2016), §7.2 "Properties of Seawater", pp. 196–200 (5 pages). Start at the heading §7.2 on p. 196 and stop at §7.3 on p. 200. Density, the missing 4 °C maximum, why sea ice can form, and why the North Atlantic is denser than the North Pacific.
- Stewart §6.5 "Density, Potential Temperature, and Neutral Density", pp. 83–86 (4 pages). Start at the heading §6.5 on p. 83 and stop at "The use of σr leads to problems" on p. 87, which isn't in the extract. σ, potential temperature and potential density; Fig. 6.10 is an Atlantic density section like ours.
- Stewart §13.4 "Observations of the Deep Circulation", pp. 222–229 (8 pages). Start at the heading §13.4 on p. 222 (the top of the page finishes §13.3) and stop at §13.5 on p. 229. Water masses, T–S diagrams, mixing, Table 13.1 and the core method: the reading behind §8. The last paragraph, on monitoring the overturning, leads into tomorrow.

**Optional**

- Stewart §6.5 continued, pp. 87–88: neutral density and the equation of state, for the curious.

**Optional: the salt budget over geological time** (web pages, about ten minutes together; the question from §2)

- Richardson, *Essentials of Oceanography*, §3.8 ["Geochemical Residence Time"](https://geo.libretexts.org/Bookshelves/Oceanography/Essentials_of_Oceanography_(Richardson)/03%3A_From_Rock_to_Salt/3.08%3A_Geochemical_Residence_Time) (Penn State, on LibreTexts). Rivers alone would bring the ocean all its salt in about 20 million years, yet the ocean is billions of years old. So salt must also be leaving the ocean. The page doesn't say how: think about where it could go.
- Chamberlin, Shaw and Rich, *Our World Ocean*, §8.5 ["Salinity over Long Timescales"](https://geo.libretexts.org/Bookshelves/Oceanography/Our_World_Ocean%3A_Understanding_the_Most_Important_Ecosystem_on_Earth_Essentials_Edition_(Chamberlin_Shaw_and_Rich)/03%3A_New_Page/08%3A_The_Water_Cycle_and_Ocean_Salinity/8.05%3A_Salinity_over_Long_Timescales) (on LibreTexts). Has the sea always been this salty? Salt buried as evaporites, and estimates that the early ocean may have been saltier, though the evidence disagrees. One slip to read past: it calls the Earth "a billion and a half years old" (it is about 4.5 billion).

## Works cited

- Hartmann, D. L. (2016), *Global Physical Climatology*, 2nd ed., Elsevier.
- Stewart, R. H. (2008), *Introduction to Physical Oceanography*, Texas A&M University (CC BY-NC-SA).
- Salinity, temperature and density maps, profiles and sections: the WOCE global hydrographic climatology, annual mean. Densities computed with TEOS-10 (the Gibbs SeaWater toolbox).
- Evaporation: OAFlux version 3 (Yu, Jin and Weller 2008, Woods Hole Oceanographic Institution). Precipitation: GPCP version 2.3 (Adler et al. 2003, 2018). Both as 2010–2020 means.

## Questions to think about

1. Sea ice forms in winter and melts in summer. Over a full year, does it change the salt ledger of the polar ocean? Where might the answer be different, if the ice is blown away from where it formed?
2. The ITCZ moves north and south with the seasons. What would you expect to happen to surface salinity at 5°N over a year?
3. Using the table in "The numbers behind the asymmetry": which changes the density of 25 °C water more, warming by 2 °C or a rainstorm that freshens the mixed layer by 0.5 g/kg?
4. Why does a freshwater lid make the surface *warmer*, rather than spreading the same heat over a deeper layer and leaving the total unchanged?
5. AABW is less salty than NADW, yet it lies underneath it. Explain this using the slope of the density lines on the T–S diagram.
6. A water sample from 1 km depth at 10°S in the Atlantic has a salinity of 34.4 and a temperature of 5 °C. Which water mass does it mostly belong to, and roughly where did it last touch the surface?
7. Draw a T–S diagram for two water masses that mix in equal parts. Then use the curvature of the density lines to show why the mixture is denser than either.
