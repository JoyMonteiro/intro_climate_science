---
layout: default
title: "O2 · How much of the surface feels the weather?"
subtitle: "Lecture notes · EC2113 Ocean module · Lecture 2 · Thursday 5 November 2026"
footer: "[← All lectures and tutorials](../../../)"
---
*These notes follow the lecture as it was taught. Two things were promised in class and are here: the answer to the question about blue light (§1), and the argument for why the air over the ocean stays humid (§3). The part of the plan we didn't reach is at the end, under "Read this part". The readings are extracts in the course's shared readings folder, under O2.*

## The question

Earth's ocean takes in about half of all the sunlight the planet absorbs. What does it do with that energy, and what difference does it make to a planet's climate that this energy lands on water rather than on land?

How the ocean moves is a question for oceanography. Here we ask a climate question: what does having an ocean do to the climate of a place, and of a planet? We start at a single point and work outwards.

## 1. Down the column

Seen from space, the ocean is nearly black. Water reflects little sunlight unless the sun is low. With the sun overhead only about 2% is reflected (Stewart §6.10), so almost everything that arrives goes into the water.

Inside the water, sunlight is absorbed **colour by colour**. Red light is gone within about 10 m. Blue reaches 100–200 m in clear open-ocean water. If you count the infrared, which is absorbed within centimetres, more than half of the sunlight is absorbed in the top metre, and only about 5% is left at 50 m. The absorbed light becomes **heat**: the ocean is heated from the top.

**What this means for life.** Phytoplankton, the ocean's microscopic algae, carry out about half of all the photosynthesis on Earth ([Wikipedia](https://en.wikipedia.org/wiki/Phytoplankton)). Photosynthesis needs light, so they live in the sunlit top layer, the top 100 m or so, at most about 200 m in the clearest water (the [euphotic zone](https://en.wikipedia.org/wiki/Euphotic_depth)). Below that, life exists but can't photosynthesise. Light isn't all that life needs. It also needs suitable temperatures, oxygen and nutrients. Explaining where life is in the ocean from the distribution of light, heat and nutrients is the central problem of biological oceanography.

**A student's question: why does blue go deepest, when violet, which is close to it, doesn't?** Pure water absorbs red and infrared strongly, because those wavelengths set water molecules vibrating. Its absorption is weakest in the blue and rises again towards the ultraviolet (Stewart Fig. 6.17). So blue is the colour water itself lets through best, which is also why [deep, clear water looks blue](https://en.wikipedia.org/wiki/Color_of_water) from inside. Real seawater adds more absorbers. The chlorophyll in phytoplankton absorbs blue and red light. Near coasts, dissolved coloured material from land ("yellow stuff") and mud absorb the short wavelengths strongly, and "very little light penetrates more than a few meters into these waters" (Stewart §6.10).

**And a lake?** We'd expect most lakes to behave like coastal water rather than open ocean. They usually carry more dissolved material from the land, more plankton and more sediment, so violet and blue are absorbed sooner and the light that penetrates deepest shifts towards green or yellow. That's why many lakes look green or brown rather than blue. A very clear, nutrient-poor lake can still look blue.

## 2. Last week's question: why does the habitable zone lean?

Last week a student noticed that on the habitable-zone diagram, the zone moves towards *less* starlight as the star gets cooler. If only the total energy mattered, the zone would sit at the same starlight for every star.

The answer is about **colour**, not quantity. A hot star puts out much of its light in the visible and ultraviolet, which passes through an atmosphere of CO₂ and water vapour almost untouched. A cool star puts out most of its light in the near-infrared, where water vapour and CO₂ absorb. So around a cool star, the atmosphere absorbs starlight directly, not just the infrared the planet emits, and the planet is warmer for the same total starlight. There is also less Rayleigh scattering of red light back to space, and ice and snow are darker in the near-infrared. All three let a planet stay warm with less starlight, so the zone shifts that way. The O1 notes have the numbers.

**A habit worth building.** Many of the deepest questions in planetary climate start from someone looking at a simple plot and asking *why*. Half the time, the question turns out to be at the edge of what is known.

## 3. The ocean's surface budget

Sunlight comes in. The ocean loses energy in three ways:

- **Infrared:** like anything with a temperature, the sea surface radiates.
- **Conduction** to the air (sensible heat): small enough over the ocean that, for most purposes, you can leave it out.
- **Evaporation** (latent heat): the biggest loss.

So to a first approximation, **the ocean's budget is sunlight in, evaporation out**. Hartmann's numbers for the tropical ocean: about 200 W/m² of sunlight, balanced by about 120 W/m² of evaporation, 50 W/m² of net infrared, 10 W/m² of conduction, and about 20 W/m² carried away by currents (Hartmann §10.6, p. 315).

### Why the air over the ocean stays humid

*We promised in class to work this out in the notes.* Evaporation over the sea goes roughly as

> LE ≈ ρ L C U q\*(T_s) (1 − RH)

where ρ is the air's density, L the latent heat of vaporisation, C a transfer coefficient (about 10⁻³), U the wind speed, q\*(T_s) the amount of water vapour air can hold at the sea's temperature, and RH the relative humidity of the air just above. This is the bulk formula; see Hartmann eq. (10.36) and Stewart §5.4. It assumes the air and sea are at nearly the same temperature, which is roughly true over the open ocean.

Put in typical tropical numbers: ρ = 1.2 kg/m³, L = 2.5 × 10⁶ J/kg, C = 1.2 × 10⁻³, U = 7 m/s, and q\* ≈ 0.022 kg/kg at 27 °C. Then

> LE ≈ 550 W/m² × (1 − RH).

At the observed relative humidity of about 80%, that is about 110 W/m², close to Hartmann's 120. Now look at how sensitive it is. **Each percentage point of relative humidity is worth about 5.5 W/m² of evaporation.** Drying the air from 80% to 70% would raise evaporation by about 55 W/m², half as much again. The sunlight can't pay for that: it doesn't change by tens of W/m² from one year to the next. The ocean would cool, the extra vapour would moisten the air, and the humidity would be pushed back up. Moistening the air towards 100% would shut evaporation off, and the unspent sunlight would warm the sea until evaporation resumed.

So the surface energy budget alone pins the relative humidity over the ocean near the value at which evaporation uses up the energy available: 1 − RH ≈ 110/550 ≈ 0.2. No fancy physics is needed. This is our back-of-envelope argument with typical numbers, not a full theory. Winds, the air's temperature and the dry air mixed down from above all shift it by a few per cent. But it explains why the near-surface air over the oceans sits at a fairly steady 75–80% relative humidity.

### The budget, latitude by latitude

The lecture showed each term averaged around latitude circles over the ocean. Before asking *why*, ask what you see.

- **Sunlight** goes from nearly zero near the poles to more than 200 W/m² in the tropics. But it **dips just north of the equator**. That dip is the cloud of the [ITCZ](https://en.wikipedia.org/wiki/Intertropical_Convergence_Zone), the band of rising air and rain where the trade winds meet. A further question is why the ITCZ sits north of the equator rather than on it. Researchers have worked on that for a long time. The leading explanation is that the ocean's circulation carries heat northwards across the equator, warming the northern hemisphere a little more than the southern, and the rain band follows the warmth. We'll come back to this in the third year, with ocean circulation.
- **Net infrared** (upward from the sea minus downward from the air) is much flatter. Surface temperature does vary, from about −2 °C at the sea-ice edge to about 30 °C in the tropics, so the sea's own emission varies quite a lot. But the air above warms and moistens along with the surface, and its downward infrared rises with it, so the *net* loss changes little (Hartmann §10.6).
- **Evaporation** peaks between about 15° and 30° in both hemispheres. It falls off towards the poles, where cold air sits over cold water and holds little vapour. It dips at the ITCZ.

**Why the subtropics?** Evaporation goes as wind × (how much vapour the air could hold at the sea's temperature − how much it actually holds). The subtropics are where the **descending branch of the Hadley cell** reaches the surface. That air rose in the deep tropics and lost almost all its water as rain on the way up. Coming down, it is compressed and warmed, so its relative humidity is very low. Very dry air over a warm sea, with steady trade winds, gives strong evaporation. At the ITCZ the reason is the opposite: the air near the surface is already very humid, and the winds are weak. (It isn't about the clouds. Evaporation depends on conditions at the surface.)

### Weather is a fluctuating push

So the atmosphere **modulates** the ocean's energy budget. A passing cloud can cut the sunlight from 200 W/m² to almost nothing. A gust or a dry spell changes the evaporation. The infrared depends mostly on the sea's own temperature, so the weather changes it less. Take the ocean's budget at any point, and it is a steady mean with fluctuations on top: **weather is a fluctuating push, F′(t)**. The rest of the lecture asks what that push does.

## 4. Continental and coastal climates

A continental climate has large swings, between day and night and between summer and winter. A coastal one has small swings. Why?

It isn't that water "retains heat" better. Anything can store heat. The question is **how much the temperature changes for each joule absorbed**. Absorb a megajoule: does your temperature change by 0.1 K or by 10 K? That is the **heat capacity**, and it is what separates a continental climate from a coastal one.

But which heat capacity? The ocean is about 4 km deep on average, and the land under your feet is kilometres of rock. If the whole ocean, or a kilometre of rock, took part in every exchange, no temperature would ever change. Even a petajoule (10¹⁵ J) put into a few kilometres of rock would barely change its temperature. So what matters is an **effective heat capacity**: the heat capacity of the part that actually takes part. That depends on how deep the weather's push reaches.

## 5. Land: heat has to conduct

**First, the intuition.** Put thermometers in the ground at different depths. At 6 am the sun comes on and the surface starts absorbing energy. That heat spreads down, molecule knocking against molecule. In the first hour it reaches a little way down, and in the next hour a little further. At about 7 pm the sun goes off, and the heat now flows back up and out. If in a day's sunshine the heat reached only some depth, nothing below that depth ever felt the day. The surface thermometer swings fast and far, one a little lower swings less and later, and a deep one barely moves.

**Then the physics.** Fourier's law says heat flows down the temperature gradient: q = −k ∂T/∂z. What flows in and stays warms the soil: ρc ∂T/∂t = −∂q/∂z. Together they give the heat equation,

> ∂T/∂t = κ ∂²T/∂z², with diffusivity κ = k/ρc.

For a surface temperature that swings with angular frequency ω, the solution is

> T′(z, t) = A e^(−z/d) cos(ωt − z/d), with d = √(2κ/ω).

It has two parts. The swing **fades with depth** as e^(−z/d), and it **lags**: the phase shifts by z/d, so deeper soil peaks later.

Fast forcing (large ω, the day) gives a small d and fades quickly. Slow forcing (small ω, the year) gives a larger d and reaches deeper. For soil, κ ≈ 0.3–1 × 10⁻⁶ m²/s depending on how wet it is:

| Swing | Depth d | As a slab, in metres of water |
|---|---|---|
| A day | 9–17 cm | 3–6 cm |
| A year | 1.7–3.2 m | 0.6–1.1 m |

(The last column is the thickness of water that would need the same surface heat flux to give the same swing. Hartmann's eq. 4.10 leaves out the factor 2 in d, so he quotes about 10 cm and 1.5 m: the same physics, with a depth smaller by √2.)

So even though the rock is kilometres thick, **only the top ten centimetres or so take part in the day, and a couple of metres in the year.** For climate, the rest of the land might as well not be there. Land isn't a fixed slab: slower forcing reaches deeper. But it is always a thin one.

That is why a planet made only of land has trouble keeping its temperature steady. So little material takes part that the energy coming in immediately becomes a large change in temperature. The Moon, with no ocean or air, goes from about 100 K at night to about 390 K by day at its equator ([Wikipedia](https://en.wikipedia.org/wiki/Moon)).

Try it: start the soil cold, switch the sun on, and sketch the profiles hour by hour as the heat works its way down. You should be able to reproduce the envelopes on the slide.

## 6. The ocean: it can stir itself

Water is a fluid, and that changes everything. Wind blowing over the sea, breaking waves, and surface water cooling and sinking at night and in winter all **stir** the top of the ocean. As the water column warms, it isn't just heated passively from above: warm water is carried down and cooler water brought up. So the ocean's effective heat capacity is not the metre or so that conduction alone would give. It is the depth that the stirring reaches, typically **10 to 100 m**, and more in places. That is the **mixed layer**, and this difference in effective heat capacity is what makes land and ocean respond so differently.

**The Arabian Sea.** At a point off the Indian coast, the reanalysis's mixed layer is about **20 m deep in April and about 60 m in July**. Faced with a plot like this, ask *why*. Why is it shallow in spring and deep in the monsoon? And what would the same curve look like somewhere else in the ocean? That is where we stopped. The answers are in the O3 notes.

## Read this part: what we didn't cover in class

**If water only conducted.** Water holds about twice as much heat per cubic metre as soil, so is that why the ocean is sluggish? Not on its own. Water's molecular diffusivity is only κ ≈ 1.4 × 10⁻⁷ m²/s, smaller than soil's, so by conduction alone a day would reach about 6 cm and a year about 1.2 m. As a slab that is about 0.8 m of water, no better than soil. Water's large heat capacity per cubic metre only makes up for its short reach. **The ocean's inertia comes from stirring.** Turbulent eddies mix heat 10⁴–10⁶ times faster than molecules do.

**Below the mixed layer.** Under the mixed layer, warm water sits on cold, and that stratification resists stirring. In this thermocline the mixing coefficient is only about 10⁻⁵–10⁻⁴ m²/s, so with the same d = √(2K/ω), heat leaks down only about 10–30 m in a year, 30–100 m in a decade, and 100–300 m in a century. **The deep ocean joins in only at long timescales.**

**No water has gone anywhere yet.** Everything in this lecture is vertical: the ocean changes a place's climate even with no sideways movement of water at all. Mixing up and down is what sets its active thermal inertia. Sideways movement comes in the next lecture.

The slab equation, the timescales and what inertia does to weather noise were taught in the next lecture: see the O3 notes.

## Readings

All extracts are in the shared readings folder, under O2. The core readings add up to **19 pages**. Page numbers are the books' printed pages.

**Core: covered in class (14 pages)**

- Stewart, *Introduction to Physical Oceanography* (2008), §6.10 "Light in the Ocean and Absorption of Light", pp. 97–100 (4 pages). Start at the heading on p. 97. Absorption by colour, and why coastal water is murkier.
- Hartmann, *Global Physical Climatology* (2nd ed., 2016), §4.2 "The Surface Energy Budget" and §4.3 "Storage of Heat in the Surface", pp. 96–101 (6 pages). The four terms, and soil conduction with the penetration depth. Stop at §4.4.
- Hartmann §4.9 "Geographic Variation of the Surface Energy Balance", pp. 126–129 (4 pages): the maps and latitude curves of each term.

**Core: not covered in class (5 pages)**

- Hartmann §10.6 "Longwave and Evaporation Feedbacks in the Surface Energy Balance", pp. 313–317 (5 pages). Start at the heading on p. 313 and stop at §10.7. Why net infrared over the ocean is flat, and how sensitive evaporation is. The background to §3's box.

**Optional**

- Stewart §5.2–5.4, pp. 53–61 (9 pages, in the folder): the heat-budget terms and the bulk formulas.
- For the curious (a research paper, not in the folder): Ledwell, Watson & Law (1993), "Evidence for slow mixing across the pycnocline from an open-ocean tracer-release experiment", *Nature* 364, 701–703.

## Questions to think about

1. A soil has twice the diffusivity of another. How much deeper does the annual swing reach? How much more heat does it hold as a slab?
2. If the Moon's surface were covered with 1 m of still water, would its day–night contrast change much? What if the water were stirred?
3. Using the box in §3, how much would evaporation change if the wind over the tropical ocean rose from 7 to 8 m/s? What would have to happen to the relative humidity to bring it back?
4. Why might the mixed layer be deep in winter at one place and in summer at another?
