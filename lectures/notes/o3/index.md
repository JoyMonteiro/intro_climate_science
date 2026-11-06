---
layout: default
title: "O3 · A slow ocean that has to move"
subtitle: "Lecture notes · EC2113 Ocean module · Lecture 3 · Friday 6 November 2026"
footer: "[← All lectures and tutorials](../../../)"
---
*These notes follow the lecture as it was taught. We stopped at Nansen's question. The rest of the plan, on how the wind moves the ocean and why the ocean gains heat where it is cold, is at the end, under "Read this part": read it before the next lecture. The readings are extracts in the course's shared readings folder, under O3.*

## The question

Last lecture asked how much of the surface feels the weather. This one asks what that does to the climate, and then turns sideways. The ocean doesn't only store heat: it gains heat in some places and loses it in others, so its water must move. What moves it?

## 1. Recap: transport, and the storms that do it

A planet's energy balance, radiation in equals radiation out, says little about whether it is habitable. That depends on what happens at the surface: how much energy is absorbed, released and carried away. A tidally locked planet can have a comfortable average temperature while neither its day side nor its night side can support life. So **transport** is central. Moving energy means moving mass, and moving mass means moving momentum. Put the three together and you get the general circulation of the atmosphere and the ocean.

In the atmosphere, the Hadley cell carries energy out of the tropics, but it ends at about 30°, while the biggest energy deficit is near the poles. Beyond 30°, in the mid-latitudes, where rotation dominates, the energy is carried by **storms**: extratropical cyclones. Each is less violent than a tropical cyclone, but there are far more of them, and together they carry a large share of the energy poleward. Tropical cyclones, however destructive, carry only a small part of it. Extratropical storms form and travel along preferred paths, the [storm tracks](https://en.wikipedia.org/wiki/Storm_track).

The same question for the ocean starts at a single point. How much energy does the surface capture, and how much does its temperature vary? For that, what matters is the **effective heat capacity** (O2).

## 2. What sets the mixed layer's depth

**How can a wind that blows *along* the surface mix the water *downwards*?** Through shear stress. The wind drags the top layer of water, and the layer below is dragged less. That shear makes the flow turbulent, and the turbulent eddies move water up and down. Arjun's lectures on fluids go into this.

**The Arabian Sea's mixed layer is deepest in June–July.** Why should the winds be strongest then? Think about energy. In the monsoon the Indian subcontinent receives strong sunlight, and its heavy rain releases a great deal of latent heat. Something has to carry that energy away. The rain belt moves north over the subcontinent, where air rises in deep clouds and flows out aloft. To replace that air, air must flow in at the surface, and that inflow is the monsoon's southwesterly wind across the Arabian Sea. The Arabian Sea lies right in the path of the strongest monsoon winds, so its mixed layer deepens.

**Near Bermuda, in the western North Atlantic, the cycle is the other way round:** about 90 m in January and only about 6 m in July. There the winds, and the storms, are strongest in winter, and winter cooling makes surface water sink. In summer, a thin warm lid sits on top.

**The world's mixed layer.** The typical depth is about 50 m (the median in the 2011 reanalysis is about 44 m). The deepest mixed layers are in the northern winter, in two places: off Japan, and off the east coast of the United States and Canada, deepest of all in the North Atlantic, where it averages about 300 m and exceeds a kilometre in places. Those are exactly the starts of the two northern **storm tracks**, which lie off the east coasts of Asia and North America, over the western sides of the ocean basins. Storms deepen the mixed layer, and storms need fuel: water vapour, which warm water off those coasts supplies.

In the Southern Ocean, in its winter, the mixed layer is deep (about 170 m averaged over 45–60°S) and **much more uniform**. There the winds blow strongly all the way round, in the band sailors call the [Roaring Forties](https://en.wikipedia.org/wiki/Roaring_Forties), and both the storms and the mean winds stir the sea. Why uniform in the south and patchy in the north? **Continents.** Land is rough, like sandpaper to the wind, while the sea gives little friction. Stand on the shore in Mumbai, then walk 20 m inland, and feel the breeze drop. The same thing happens at the scale of the planet: the winds are strong over the ocean and slow as soon as they meet land. The Southern Ocean has no land in the way.

**Get into the habit:** when you see a plot, look for the pattern and ask *why*. You can even hand an LLM a set of plots and ask it why. That is an efficient way to pick up concepts, though not, on its own, to understand them.

**Why doesn't the stirring go all the way down?** Because the water is stratified: warmer, lighter water sits on colder, denser water. Mixing them means lifting dense water and pushing light water down, which raises the column's potential energy, and the wind has to supply that energy. So the stirring stops at a depth set by how strong the wind is against how strong the stratification is. Below that, heat leaks down only slowly (see the O2 notes). For the fast climate, seasons to a few years, the top 50 m or so is all that matters.

## 3. A slab that the weather kicks

Treat the surface, land or mixed layer, as a slab with heat capacity C, and look at departures T′ from its average temperature:

> C dT′/dt = F′(t) − λT′

F′ is the weather kicking the slab: it changes the sunlight, it changes the winds, and the day and the seasons push it too. The term −λT′ pulls the slab back towards its usual temperature, because a warmer surface loses more heat.

**Without the kicks, how does it behave?** It decays exponentially back to its average. The timescale comes from the units alone: λT′ and C dT′/dt are both in W/m², so C/λ must be a time,

> τ = C/λ.

With Argha's Planck value λ = 3.8 W m⁻² K⁻¹:

| | Heat capacity, as metres of water | τ |
|---|---|---|
| Land, for a year's swing | about 1 | about 12 days |
| Whole atmosphere | 2.4 | about a month |
| Mixed layer | 50 | about 1.7 years |
| Full ocean | 4,000 | about 140 years (longer in practice, because mixing to depth is slow) |

But F′ never lets the slab rest. The day, the seasons and the winds keep kicking it.

**This is why Mumbai varies less than Pune.** Land like Pune's responds to a strong push within a couple of weeks. The mixed layer of the sea off Mumbai takes more than a year, and Mumbai's air comes off that sea. The seasonal range of surface temperature, warmest month minus coldest, shows it: Delhi 23 K, Pune 9 K, Mumbai 5 K, the Arabian Sea 5 K. (Treat the tropical numbers with care. The tropics have small seasons anyway, so a 2 K range there can't be compared directly with 23 K in Delhi. But Delhi and Mumbai, under not very different suns, can be compared: Delhi is land, land and more land, while Mumbai sits by the sea. Hence a **continental** climate against a coastal one.)

## 4. Same weather, two slabs

Solve the slab equation with a daily cycle, a seasonal cycle and random weather, first for land and then for a mixed layer. These are the tutorial app's own runs.

**Land.** Over a few days, the day-and-night cycle doesn't change, but the weather pushes the land warmer and cooler on top of it. Over a few years the seasons come through, with a **lag**: the land is warmest some time after the sun is strongest, as in the cos(ωt − z/d) of the conduction solution. Over decades, with the seasons taken out, the land only jitters with the weather.

**Ocean.** At the same zooms, the mixed layer seems hardly to respond at all.

**An applied question: does a weather forecast need a moving ocean?** A forecast looks 5–10 days ahead. Over that time the sea's temperature barely changes, so a forecast can start from today's observed sea surface temperature and hold it fixed, and lose little. A **seasonal** forecast is different: the mean summer temperature, or the total monsoon rainfall over the next four months. A small change in sea temperature over a season means a large amount of heat taken in or given out, because the heat capacity is so large. Over a season the model has to have an ocean that responds to the energy going in and out of it.

**Variability by timescale.** Take the runs, do a Fourier transform, and plot how much variation there is at each timescale: a **power spectrum**. Any question in climate science has to name its scale. For questions about the next couple of months, most of the variation comes from the land, and you can leave the ocean out. For questions about a decade, the truly climatic scales, you can't. And all of this comes from **heat capacity alone**: we haven't yet let the ocean move. Ocean currents change the spectrum in many interesting ways, but that is beyond this course.

## 5. Inertia today

Rising greenhouse gases have put Earth out of balance by about **+1 W/m²** (CERES, 2010–2020). That is a lot of energy. More than 91% of the extra heat goes into the ocean, and because the ocean's heat capacity is so large, its surface temperature changes by much less than a degree.

There is no free lunch. Over decades to centuries, part of that heat is carried into the deep ocean, and the slow deep circulation (the overturning, often called the [thermohaline circulation](https://en.wikipedia.org/wiki/Thermohaline_circulation)) brings deep water back to the surface only after centuries. For the whole system, deep ocean included, to come back into balance takes of the order of a thousand years. Until the deep ocean has warmed, it keeps drawing heat away from the surface, which slows the surface warming now. As the deep ocean warms, that brake weakens. So the emissions of the past 150 years will go on shaping the climate for centuries to come.

## 6. The ocean gains heat where it is cold

Just as for the top of the atmosphere, we can map where the ocean surface **gains** energy and where it **loses** it, averaged over a year (the ocean reanalysis, 2011). If the ocean stood still, every point would have to balance its own budget over a year, and the map would be zero everywhere. It isn't, so the ocean moves. Like the atmosphere with its Hadley cell and storm tracks, it can keep up an imbalance at a place by carrying heat in or out.

**Start with the Pacific.** Along the equator the sunlight is about the same everywhere. But the ocean gains almost no heat in the west and gains among the most anywhere on Earth in the east, far from land. Recall that the ocean's budget is roughly sunlight in, evaporation out. If the sunlight is the same, the evaporation must differ. The winds are roughly the same, so what differs is the **temperature**. The eastern equatorial Pacific is the **cold tongue**, a tongue of cold water. Cold water evaporates little, so most of the sunlight stays in the ocean.

**The western boundary currents do the opposite.** The [Gulf Stream](https://en.wikipedia.org/wiki/Gulf_Stream) in the Atlantic and the [Kuroshio](https://en.wikipedia.org/wiki/Kuroshio_Current) in the Pacific carry warm water poleward along the west sides of the basins. In winter they run under cold, dry air, so they evaporate enormously. They move energy in two ways at once: from the equator towards the poles, and from the ocean into the atmosphere.

**Off Somalia and Oman**, in the western Arabian Sea, the ocean also gains heat, again because the water there is colder than its surroundings.

**Why is the water cold in those places?** That is the lecture's puzzle, and its answer, upwelling, is in "Read this part" below.

## 7. Who carries the heat?

From O1, about **5.7 PW** must cross 35° latitude in each hemisphere to keep the books balanced. Compare the three curves on the slide: the total transport required (black), the ocean's share (dashed) and the atmosphere's (the rest). Despite the ocean's enormous heat capacity, **the atmosphere carries most of the energy** over most latitudes. The ocean's share matters most in the deep tropics, close to the equator, where the total transport is small and the ocean carries as much as, or more than, the atmosphere. Away from the equator, the Hadley cell and then the storm tracks take over.

How sure are we? Observational estimates put the ocean's share at about 2 PW near 20°N (Stewart Fig. 5.11). The reanalysis's own surface fluxes imply only about 1.2 PW. Different lines of evidence still disagree.

**A back-of-envelope sum for one current.** Oceanographers measure the volume of water a current moves in **sverdrups** (Sv), named after the oceanographer [Harald Sverdrup](https://en.wikipedia.org/wiki/Sverdrup): 1 Sv = 10⁶ m³/s, a million cubic metres every second. No smaller unit makes sense in the ocean. The Gulf Stream is roughly 100 km wide, 600 m deep and moves at 0.5 m/s: about **30 Sv**. Multiply the mass of water moved by the temperature contrast it carries (about 6 °C) and its heat capacity. The Gulf Stream and the Kuroshio together carry about **1.6 PW** (Hartmann §7.8). The accountant's rule: **transport = mass moved × energy contrast.**

## 8. Who pushes the ocean?

To move water, something has to push it: the ocean has a **momentum budget**. We met the answer indirectly in week 1. The atmosphere's winds exchange momentum with the surface below them, and over 70% of that surface is ocean.

The map of wind stress on the ocean shows the push. Wherever the wind and the water move at different speeds there is friction, and momentum passes from one to the other. Where the winds blow towards the east (the westerlies), they give the ocean eastward momentum. Where they blow towards the west (the easterly trade winds), they give it westward momentum. (Meteorologists name winds by where they come *from*, so a westerly blows towards the east.) Over the whole globe and over long times, the eastward and westward pushes must nearly cancel, but at any one place they don't. The pattern simply follows the winds: the strongest push is where the winds are strongest, in the Southern Ocean.

The ocean doesn't simply follow the push, because of its huge **mechanical** inertia: not thermal inertia this time, but the inertia of all that mass.

**Nansen's question.** On the *Fram*, drifting across the Arctic in 1893–96, [Fridtjof Nansen](https://en.wikipedia.org/wiki/Fridtjof_Nansen) recorded the winds and watched the sea ice. The ice never drifted straight downwind, however strong the wind. It went consistently 20–40° to the **right** of it. Why should that be? Suhas has already given you the tool: the Coriolis effect. That is where we stopped. The answer is below.

## Read this part: what we didn't cover in class

The first three items matter most: they answer Nansen's question and the puzzle of §6.

### Ponderous: air against water

| | Air | Water |
|---|---|---|
| Density | 1.2 kg/m³ | 1,025 kg/m³ (about 850 times more) |
| Typical speed | 10 m/s | 0.1 m/s; boundary currents 1–2 m/s |
| Heat carried per m² of cross-section per degree (ρc × speed) | 1.2 × 10⁴ W m⁻² K⁻¹ | 4 × 10⁵ W m⁻² K⁻¹ (about 34 times more) |

A typical wind stress of 0.1 N/m², spread over a 50 m mixed layer, accelerates it at τ/(ρH) ≈ **2 × 10⁻⁶ m/s²**. Unopposed, it would take about two months to reach the speed of the wind. It never gets there, because the Earth is turning. And even a slow current carries far more heat through a square metre than a fast wind: water holds about 3,400 times more heat per cubic metre than air.

### Nansen's answer: Ekman transport

Vagn Walfrid Ekman worked out the reason in 1905. Take the whole stirred layer, in a steady state. Two forces act on it: the wind's stress, along the wind, and the Coriolis force, at 90° to the layer's motion. They can cancel only if the layer as a whole moves **90° to the right of the wind** in the northern hemisphere (to the left in the southern). Water at the very surface moves at a smaller angle, which is why Nansen's ice went 20–40° to the right, and the direction turns further with depth. Only the total over the layer is at exactly a right angle.

The [Ekman transport](https://en.wikipedia.org/wiki/Ekman_transport) per metre of width is τ/(ρf). With τ = 0.1 N/m² and f = 10⁻⁴ s⁻¹, that is about **1 m²/s**: a strip one metre wide carries about a cubic metre of water each second. Spread over 50 m, it is only about 2 cm/s. But over a whole basin it adds up, and where it spreads apart or piles together, water has to go up or down.

### Upwelling solves the puzzle

**Along coasts.** Let the wind blow along a coast with the land on its left, in the northern hemisphere. The Ekman transport is to the right of the wind, offshore. Water can't come out of the coast, so it comes up from below, cold and rich in nutrients. This is [upwelling](https://en.wikipedia.org/wiki/Upwelling).

- Somalia and Oman in the summer monsoon, when the southwesterly wind runs along the coast. This is why the western Arabian Sea is cold and productive in July, and why it gains heat in §6.
- California, where the wind blows south.
- Peru, in the southern hemisphere, where the wind blows north and the transport goes to its left, again offshore.

These are among the world's great fisheries.

**At the equator.** The Coriolis effect changes sign at the equator. Under the westward trade winds, water just north of the equator is pushed to the right (north), and water just south of it to the left (south): away from the equator on both sides. Cold water rises to replace it, and that is the **cold tongue**. **The ocean gains heat where it is cold because cold water keeps arriving from below.**

**Happening now.** A strong El Niño is under way. In its 8 October 2026 discussion, NOAA's [Climate Prediction Center](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml) reported Niño-3.4 at +2.1 °C, with parts of the eastern equatorial Pacific more than 4 °C warmer than normal, and a strong-to-very-strong event likely through January–March 2027. Weaker trade winds mean weaker upwelling and a warmer cold tongue. We return to this later in the module.

### Hills of water and the western boundary currents

Where Ekman transport converges, water piles up. Under the trades it goes poleward, and under the westerlies equatorward, so the two meet near 30°. There the sea surface stands about **1 m** higher than in the subpolar ocean, across thousands of kilometres (in the 2011 reanalysis: North Pacific 0.9 m, North Atlantic 0.9 m, South Pacific 1.1 m).

A hill of water has a pressure gradient, but on a turning Earth the flow doesn't run down it. It runs **along** the height contours, with the high side on its right in the northern hemisphere. This is geostrophic flow, as for Suhas's winds. So water circles the hills in great **gyres**: clockwise in the north, anticlockwise in the south. The flow isn't symmetric. Fast, narrow currents hug the **west** side of each basin: the Gulf Stream, the Kuroshio, the Agulhas. Stommel showed in 1948 that the change of the Coriolis effect with latitude is enough to squeeze the return flow against the western side (Stewart Ch. 11).

### Where does the momentum finally go?

The wind keeps adding momentum, so something must take it out. Mostly that is friction against coasts and the sea floor: in most oceans the continents hold up the flow. At the latitudes of Drake Passage no continent blocks the way, so the **Antarctic Circumpolar Current** runs all the way round the globe. It hands its momentum to the sea floor over undersea ridges. That same current is where deep water comes back up, which is where we go next: salt, density and the overturning.

### Depth sets the timescale, not the size of the slow swings

Sort the slab runs of §4 by timescale and compare land with the mixed layer:

- **Fast swings:** the mixed layer has hundreds of times less power than land. On these timescales the kicks have no time to be balanced by heat loss, so C alone sets the response, and the power falls as (C_land/C_ocean)².
- **Slow swings:** the *same* power, within a couple of per cent. On these timescales the surface has time to come into balance, F′ ≈ λT′, and C drops out.
- **The switch-over** comes near a period of 2π × τ.

So fast, random weather produces slow climate variations with nothing slow driving them. The ocean's depth sets how slow they are, not how big. This idea is due to Hasselmann (1976). A deep ocean adds a second, slower stage and extra damping at centennial scales. In the tutorial app it cuts the power at 100–1,000 years by about a third: the deep water calms the slowest swings rather than adding to them.

## Readings

All extracts are in the shared readings folder, under O3. The core readings add up to **29 pages**. Page numbers are the books' printed pages.

**Core: covered in class (13 pages)**

- Hartmann, *Global Physical Climatology* (2nd ed., 2016), §7.3 "The Mixed Layer", pp. 200–206 (7 pages). What sets the mixed layer's depth, and its seasons. Stop at §7.4.
- Stewart, *Introduction to Physical Oceanography* (2008), §5.6 "Geographic Distribution of Terms" and §5.7 "Meridional Heat Transport", pp. 65–70 (6 pages). The map of net heating, and who carries the heat. Stop at §5.8.

**Core: not covered in class (16 pages)**

- Stewart §9.3 "Ekman Mass Transport" and §9.4 "Application of Ekman Theory", pp. 143–147 (5 pages). Ekman transport and upwelling. Stop at §9.5.
- Hartmann §7.4 "The Wind-Driven Circulation", pp. 206–216 (11 pages). Start at the heading on p. 206. Wind stress, the gyres, and western and eastern boundary currents, with the maps. Stop at §7.5.

**Optional**

- Hartmann §7.7 "Transport of Energy in the Ocean" and §7.8 "Mechanisms of Transport in the Ocean", pp. 227–231 (5 pages, in the folder): the Gulf Stream sum and how the ocean carries heat.
- For the curious (research papers, not in the folder): Hasselmann (1976), "Stochastic climate models. Part I: Theory", *Tellus* 28, 473–485; Czaja & Marshall (2006), "The partitioning of poleward heat transport between the atmosphere and ocean", *Journal of the Atmospheric Sciences* 63, 1498–1511.

## Questions to think about

1. Why are the deepest northern mixed layers off Japan and off North America, and not off Europe?
2. A 1 K warm anomaly appears in a 50 m mixed layer. Roughly how long until only a third is left, if only the Planck response acts? Why might the real answer be longer?
3. Winds blow from the south along the coast of a northern-hemisphere continent that lies to the east of the ocean. Is there upwelling or downwelling at the coast?
4. Near the equator f → 0, so τ/(ρf) grows very large. What do you think really happens there?
5. Why might weaker trade winds warm the eastern equatorial Pacific far more than the western?
