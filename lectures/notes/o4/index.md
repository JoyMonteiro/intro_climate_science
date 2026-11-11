---
layout: default
title: "O4 · Nansen's answer: what the wind does to a rotating ocean"
subtitle: "Lecture notes · EC2113 Ocean module · Lecture 4 · Wednesday 11 November 2026"
footer: "[← All lectures and tutorials](../../../)"
---
*These notes follow the lecture as it was taught. Section 3 is new: it covers what the lecture assumed and didn't have time to build, the equations of fluid motion and what a shear stress is. Read it before the rest if the force balance in class felt like it came from nowhere. The parts of the plan we didn't reach are at the end, under "Read this part". The readings are extracts in the course's shared readings folder, under O4.*

## The question

The wind pushes along the sea surface. Why doesn't the water go where it is pushed? And what does that do to the whole upper ocean?

## 1. Where we were: a heat budget a slab can't explain

The ocean has a large effective heat capacity for two reasons. Water holds a lot of heat, and, unlike land, it is a fluid, so the wind can stir it, the way a spoon stirs tea (though the mechanism is different: the wind stirs by shear, not by a spoon pushing water around). So the top 50–100 m or so of the ocean warms and cools together.

Then the map from last lecture, of where the ocean gains and loses heat over a year, made two observations that look contradictory:

- In the eastern equatorial Pacific the ocean **gains** heat faster than almost anywhere, yet the water there is cold for the equator.
- Over the western boundary currents, such as the Gulf Stream and the Kuroshio, it **loses** heat fastest, yet the water there is warm for its latitude.

A slab that only stores heat can't do this for decades on end. Something has to keep bringing cold water to the first place and warm water to the second. **The heat budget alone can't answer the question, so we turn to the momentum budget.**

Notice the order of the three hats from O1. First the accountant (heat in, heat out: true of this table, this blackboard, anything), then the data scientist (what does the ocean's heat budget look like?), then the physicist (*why* does that pattern last?). Answering the physicist's question opens a new ledger, momentum, with its own three hats. The atmosphere has a great deal of momentum, and it hands some to the surface below, which is mostly ocean.

## 2. Nansen's question, and a free-body diagram

On the *Fram* (1893–96), [Fridtjof Nansen](https://en.wikipedia.org/wiki/Fridtjof_Nansen) saw that the Arctic sea ice never drifted straight downwind. It went 20–40° to the **right** of the wind. Seeing *that* it happens is the data scientist's job. The physicist asks *why*.

**The natural first move, and Nansen's own, is a free-body diagram for the ice.** If the ice drifts at a steady velocity, the forces on it must add to zero. Which forces?

- **The wind's push, W**, along the wind.
- **Coriolis, C** (Suhas's lectures), at right angles to the ice's motion: to the right of it in the northern hemisphere, to the left in the southern.

Can those two alone balance? Only if they point in exactly opposite directions. If the ice moved downwind, Coriolis would be at right angles to the wind, and two forces at right angles can't cancel. So there must be a third force: **drag, F**, from the water the ice sits in, acting opposite to the ice's motion (otherwise the ice would soon move as fast as the wind). With three forces, W + F + C = 0, and the only way to close the triangle is for the ice to drift to one side of the wind, to the right in the north (Stewart §9.2, p. 136, Fig. 9.2).

**Why the diagram isn't the end of the story.** The drag on the ice comes from the water under it, and what that water is doing is exactly what we don't know. The diagram hands the problem on to the water. And the ice is a thin lid: a floe a few metres thick, riding on tens of metres of water that the wind is stirring, across thousands of kilometres of ocean.

So change the question. Think of the ice the way you think of pollen grains in [Brownian motion](https://en.wikipedia.org/wiki/Brownian_motion): the pollen does nothing itself; it shows you what the water is doing. **Nansen wasn't seeing the ice move. He was seeing the ocean move, and the ice marked it.** The wind does push on the ice directly, and sea-ice models keep a force balance for it, but the turning comes from the water. Treating the ice as a marker, a **passive tracer**, is the right first picture.

**What does Earth's rotation need?** Coriolis matters when a motion lasts long enough for the Earth's turning to bend it. At mid-latitudes that takes a few hours (1/f ≈ 3 hours; f is defined in §3). A ball thrown across a room, or water draining from a sink, is over long before rotation can act on it. Nansen's ice drifted for weeks over hundreds of kilometres, so rotation acts on it fully, and on the water around it. It is the size and duration of the *motion* that count, not the size of the object.

To understand the water, we need the equations that describe it.

## 3. The equations of fluid motion, in words

*In class we wrote down the force balance for the ocean without building it. This section builds it, qualitatively. You won't be examined on the full equations; what you need is the idea of each term, and how we dropped all but two of them.*

### Newton's second law, for a parcel of water

Take a small parcel of water and follow it. Newton's second law says its mass times its acceleration equals the sum of the forces on it. Divide by the mass and you have accelerations, forces per unit mass. In vector form (Stewart eq. 7.10, p. 108):

> Dv/Dt = −(1/ρ)∇p − 2Ω × v + g + F

Here **v** is the water's velocity, ρ its density, p the pressure, **Ω** the Earth's rotation and **g** gravity. In words: **acceleration = pressure-gradient force + Coriolis + gravity + friction.** The momentum equation with the friction term included is called the [Navier–Stokes equation](https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations): Euler wrote it without friction, and Navier added the friction terms (Stewart p. 109).

Take the terms one at a time.

**The acceleration, Dv/Dt.** "Follow the parcel" hides two effects. Standing at a fixed point, the velocity can change with time (∂v/∂t). And the parcel moves to places where the velocity is different, so it speeds up or slows down even if nothing changes in time at any one point (this is *advection*: think of a car taking a curve on a road whose shape never changes). The second effect is written v·∇v. It multiplies the velocity by itself, so the equation is **nonlinear**, and that nonlinearity is where turbulence comes from (Stewart §7.5, §8.2).

**The pressure-gradient force, −(1/ρ)∇p.** Water is pushed from high pressure towards low. A hill in the sea surface means more water above, so higher pressure, under the hill than beside it: a push outwards and downhill.

**Coriolis, −2Ω × v.** We measure velocities from a turning Earth, so a parcel moving in a straight line in space seems to us to curve. We account for that with an apparent force at right angles to the motion: to the right in the northern hemisphere, to the left in the southern. Its strength for horizontal motion is f × (speed), where

> f = 2Ω sin(latitude), the **Coriolis parameter**.

Ω = 7.3 × 10⁻⁵ per second, so f is about 10⁻⁴ s⁻¹ at mid-latitudes, positive in the north, zero at the equator and negative in the south. (This f is the f in every equation from here on.)

**Gravity, g.** It acts vertically. In the vertical, gravity is almost exactly balanced by the pressure increasing with depth, so for horizontal motion we can set it aside.

**Friction, F.** This is the term that confused us in class, and it needs its own subsection.

### Stress: a force spread over a surface

A **stress** is a force per unit area, in N/m². It comes in two kinds. Pressure pushes *perpendicular* to a surface. A **shear stress** drags *along* it. The wind blowing over the sea exerts a shear stress on the surface: the **wind stress**, τ (tau), typically about 0.1 N/m².

How does that drag reach water below the surface? Picture a deck of cards on a table and slide the top card with your palm. It drags the card below, which drags the next, and so on down: each card is dragged forward by the one above and held back by the one below. Now look at one thin layer of water in the same way:

- the layer above drags its top forward, with stress τ(top);
- the layer below holds its bottom back, with stress τ(bottom).

**The net force on the layer is the difference between the two.** If the stress is the same at its top and its bottom, the layer feels no net force: it simply passes the push on downwards. It feels a net force only if the stress *changes* across it. For a layer of thickness Δz and area A, the net force is [τ(top) − τ(bottom)] × A. Divide by the layer's mass, ρAΔz, and in the limit of a thin layer the friction force per unit mass is

> F = (1/ρ) ∂τ/∂z.

Check the units: N/m² per metre is N/m³; divided by kg/m³ that is N/kg, or m/s², an acceleration, as it should be.

### Which friction? Molecules or eddies

In a fluid flowing smoothly, the drag between layers comes from **molecules** moving between them and colliding, carrying momentum with them: [viscosity](https://en.wikipedia.org/wiki/Viscosity). But molecules move only tiny distances between collisions, so molecular viscosity can carry momentum only a few millimetres (Stewart §8.1, p. 116). It can't explain how the wind's push reaches 50 m down.

Turbulence does. How turbulent a flow is depends on the [Reynolds number](https://en.wikipedia.org/wiki/Reynolds_number), Re = UL/ν, which compares the nonlinear term with the molecular friction (U is a typical speed, L a typical length, and ν = 10⁻⁶ m²/s is water's molecular viscosity). The nonlinear terms, and with them turbulence, matter once Re is above about 10–1000. For the open ocean, with U = 0.1 m/s and L = 1,000 km, Re ≈ 10¹¹ (Stewart §8.2, pp. 116–117). The ocean is turbulent. Swirling eddies carry fast-moving water down and slow water up, and they move momentum much as molecules do, only over metres instead of micrometres. Averaged over the eddies, this mixing acts like a much stronger friction, a turbulent stress (the **Reynolds stress**, Stewart pp. 117–119). It has the same form, a stress whose change with depth pushes on each layer, so we still write it as τ.

So the "friction" in the ocean's force balance isn't the molecular friction you meet in mechanics. It is turbulence, the same stirring that makes the mixed layer (O3). For the Ekman force balance below we never need to know *how* the turbulence carries the stress down. That will turn out to be the strength of the argument.

### Which terms matter depends on the scale

The equation always holds, but in a given problem some terms are far bigger than others. A force balance is a statement about which forces are big enough to balance each other, so the first job is to compare the sizes of the terms at the scale you care about. (Derivatives make the scale matter: ∂u/∂x is about U/L, so the same speed differences over 1 km and over 1,000 km give terms a thousand times apart.) This is done systematically in a fluid dynamics course.

- **Molecular friction** matters only within millimetres of a boundary.
- **The acceleration** compared with Coriolis is about U/(fL) (the [Rossby number](https://en.wikipedia.org/wiki/Rossby_number)). For a current of 0.1 m/s over 1,000 km it is 0.1/(10⁻⁴ × 10⁶) = 10⁻³. Over large distances, and for anything that lasts longer than a day or so, the water's acceleration is tiny next to Coriolis.
- What's left in the ocean's interior is **Coriolis against the pressure gradient**: geostrophy, §5 below. Near the surface, where the wind's stress is passed down, **turbulent stress** joins them.

### From the full equation to the one we used in class

Take the horizontal components, with x east, y north and z up, and u and v the eastward and northward velocities (the components are Stewart eq. 7.12, p. 109). Then make three assumptions:

1. **Steady:** the wind has been blowing long enough that nothing changes in time. Drop ∂/∂t.
2. **Large and smooth:** the acceleration is small next to Coriolis (Rossby number ≪ 1). Drop advection.
3. **A flat sea surface, for now:** no horizontal pressure gradient. (We put it back in §5.)

Each thin layer of water then has only two things acting on it: Coriolis, and the difference between the stress on its top and its bottom.

> −f v = (1/ρ) ∂τˣ/∂z  (east–west)
>
> f u = (1/ρ) ∂τʸ/∂z  (north–south)

These are the equations from class.

### Back to the free-body diagram: from the ice to a block of water

This is the same free-body diagram as Nansen's, drawn for water instead of ice.

**One thin layer of water.** Three forces: the drag of the water above on its top (or of the wind, for the topmost layer), the drag of the water below on its bottom, and Coriolis. The drag from below plays the role of the friction on the ice. The trouble is the same as before: the drag from below depends on what the layer below is doing, which depends on the layer below *that*, and so on. Each layer hands the problem down to the next, like the cards.

**Stack all the layers into one block**, from the surface down to below the stirred layer, roughly the mixed layer. Now the internal drags cancel in pairs: whatever the upper layer exerts on the lower one at their shared boundary, the lower exerts back on the upper, equal and opposite (Newton's third law). In the equations, adding up ∂τ/∂z through the block leaves only the two ends, τ(top) − τ(bottom). At the top, τ is the wind stress. At the bottom of the stirred layer the turbulence has died out, so τ is close to zero.

**The block's free-body diagram has only two forces: the wind's stress and Coriolis.** For the ice, two forces weren't enough. For the block they are, because the block can move sideways. Two forces balance only if they point in opposite directions, so Coriolis must point *upwind*. Coriolis acts at right angles to the motion, to the right in the north, so the block must move **at 90° to the right of the wind** in the northern hemisphere (90° to the left in the southern). That is Ekman's result, §4. It is the same argument as for the ice, applied to an object of the right size.

## 4. The whole layer moves at right angles to the wind

Adding up the equations over the stirred layer, as above, and writing the transport (the flow added up over the layer's depth) as

> Mₓ = ∫ u dz, M_y = ∫ v dz

gives

> M_y = −τˣ/(ρf), Mₓ = τʸ/(ρf)

(Stewart §9.3; Hartmann §7.5.1). M is a volume of water per second through a strip one metre wide, in m²/s: think of the mixed layer as a block, and M as how much water the whole block carries. Notice that the north–south transport depends on the **east–west** wind, and the other way round. Wind towards the east (τˣ > 0, f > 0) gives M_y < 0: the water goes south, 90° to the right of the wind. This is **[Ekman transport](https://en.wikipedia.org/wiki/Ekman_transport)**, after Vagn Walfrid Ekman, who worked it out for Nansen in a study published in 1905.

The answer needs only the wind stress at the top, the fact that the stress dies out below, and f. It doesn't depend on *how* the turbulence passes the push downwards. That is why Ekman transport is robust, while the details of the current inside the layer are not (more in "Read this part").

## 5. Where the transport spreads apart or piles up: Ekman pumping

**This is the key idea of the lecture.**

Suppose the wind changes from one latitude to the next. Take a band where winds towards the west blow on one side and winds towards the east on the other. The Ekman transport under each points in opposite directions, so in the northern hemisphere water is carried *away* from the band on both sides. Is that sustainable? A 50 m layer can't keep losing water for years. Since the sea surface doesn't drop away, water must be **replaced from below**: cold water rises from beneath the mixed layer. Reverse the winds and the transports **converge**: water piles up, and since it can't pile up forever, it is **pushed down**.

The winds don't have to blow in opposite directions. Strong winds on one side and weaker winds in the same direction on the other do the same thing: more water leaves than arrives. All that matters is that the wind's push **changes** from place to place. In general, the vertical speed at the bottom of the stirred layer is set by how the wind stress varies across the map: w = curl(τ/ρf), counting upwards as positive (Hartmann p. 218). This is **Ekman pumping**.

**How fast?** Our order-of-magnitude sum: the stress changes by about 0.1 N/m² across 1,500 km, from the trades to the westerlies. Then w ≈ 0.1/(1025 × 10⁻⁴ × 1.5 × 10⁶) ≈ 6.5 × 10⁻⁷ m/s, or about **20 m a year**. Tiny as a speed, but it goes on all year, every year, across whole ocean basins: 20 m of water a year is not trivial.

**The map of Ekman pumping** (2011 ocean reanalysis winds) shows where water is pulled up (teal) and pushed down (orange). Look for the places where the wind changes strongly from north to south or from east to west. Off Japan, for example, westerlies to the north and easterly trades to the south meet near 30°N and push water down.

**At a coast.** Let the wind blow along a coast so that the Ekman transport points out to sea. Water can't come out of the coast, so it comes up from below. That water is cold, and it is rich in nutrients. In the sunlit top layer, plankton use up the nutrients quickly. Below the reach of light, nothing uses them, so they build up. Bring that water up into the light and plankton bloom, then the fish that eat them, then the fisheries. [Coastal upwelling](https://en.wikipedia.org/wiki/Upwelling) happens mostly on the **eastern sides of ocean basins**: the west coasts of North and South America (California, Peru, Chile) and the Atlantic coasts of Portugal and northwest Africa. Off peninsular India it is more complicated, because the monsoon winds reverse with the season, but the principle doesn't change: where the wind carries water offshore, cold water comes up.

**At the equator.** Under the easterly trades, the transport is to the right of the wind just north of the equator (northward) and to the left just south of it (southward), because **f changes sign at the equator**. The same wind carries water away from the equator on both sides, and cold water rises in between. This is the **cold tongue** of the eastern equatorial Pacific, and it **resolves the puzzle of §1**. Cold water keeps arriving from below, takes up heat, and is carried away before it can warm much, and more cold water takes its place. So the ocean can take up heat fast and still stay cold, year after year.

**In the subtropics.** Around 30°, westerlies lie poleward and easterly trades equatorward. Under the trades the transport goes poleward; under the westerlies it goes equatorward. They meet, water piles up, and it is pushed down.

## 6. A hill of water stays up: geostrophy

Imagine making a bump in the surface of a still lake. Intuition says the water runs downhill, away from the bump, and the lake goes flat. On a small lake that's right.

But at scales large enough for rotation to matter, in the ocean and in the atmosphere, the water doesn't run down the slope. The bump means higher pressure under it than beside it, so a pressure-gradient force pushes the water outwards. As soon as the water moves, Coriolis turns it to the right (in the north). It keeps turning until Coriolis exactly opposes the pressure force, and that happens only when the water runs **along** the height contours, at right angles to the push, with the high side on its right in the northern hemisphere. This is **[geostrophic flow](https://en.wikipedia.org/wiki/Geostrophic_current)**, the same balance as Suhas's winds around a high (§3: Coriolis against the pressure gradient). Nothing runs downhill, so **the hill stays up**, for as long as nothing else, like friction, wears it down. It has the same form as Ekman's balance: the motion is at right angles to the push.

**The hills are real.** The map of sea-surface height shows hills about **1 m** high in the subtropics, thousands of kilometres across, right where Ekman transport converges. One metre doesn't sound like much, but it is an enormous volume of extra water held in the middle of the ocean, going nowhere. The wind keeps building the hill by Ekman convergence, and the flow goes around it. These are the great [ocean gyres](https://en.wikipedia.org/wiki/Ocean_gyre): clockwise in the northern hemisphere, anticlockwise in the southern.

**Garbage patches.** Floating plastic collects near the middle of the subtropical gyres, in the [Great Pacific garbage patch](https://en.wikipedia.org/wiki/Great_Pacific_garbage_patch) and its counterparts. The surface Ekman transport carries floating things in towards the centre of the hill, and the geostrophic currents only carry them around it, never out. So the debris stays, breaking slowly into smaller pieces.

**Where is the friction, then?** Mostly at the edges: along coasts, where the currents run against land, and at the sea floor. In the middle of the ocean, far from any boundary, the flow hardly feels friction, and its balance is set by rotation and by the wind adding momentum at the top.

## 7. Next: from momentum to salt

We have now opened two ledgers: heat, and, to explain the heat, momentum. To go further with momentum we can't talk about velocity alone; that is kinematics. Momentum is mass times velocity, and for the ocean, mass per unit volume is **density**. You can't talk about the ocean's density without salt. Heat and salt together set the density of seawater. We've done heat; next is salt.

## Read this part: what we didn't cover in class

The Ekman spiral matters most: it explains why Nansen saw 20–40° rather than 90°. Then the numbers, which show how much water Ekman transport moves.

### Inside the layer: Ekman's spiral, and Nansen's 20–40°

What happens *inside* the stirred layer depends on how the turbulence works, and that we haven't specified. Ekman (1905) made the simplest assumption: the turbulent stress is proportional to how fast the velocity changes with depth, with a constant "eddy viscosity". With that assumption he could solve for the current at each depth (Stewart §9.2, pp. 137–139):

- At the surface, the current is **45° to the right** of the wind (northern hemisphere).
- Going down, it gets **weaker** and turns **further to the right**, tracing a spiral: the [Ekman spiral](https://en.wikipedia.org/wiki/Ekman_spiral).
- It dies out over the **Ekman depth**, typically **45–300 m**, deeper for stronger winds and nearer the equator (Stewart Table 9.3). At that depth the current is about 4% of the surface's and points the opposite way.
- **Add up the arrows** over the depth of the spiral and the total points exactly **90° to the right** of the wind, whatever value the viscosity has. The spiral depends on the turbulence; the total doesn't.

**So why 20–40°?** The ice sits at the very top of the layer, so it marks the *surface* current's angle, not the 90° of the whole layer. It isn't exactly Ekman's 45°, because real turbulence isn't a constant viscosity, and because the wind pushes on the ice directly as well. Clean spirals are hard to see in measurements; the transport is easy to see (Stewart §9.2–9.3).

### How much water?

With τ = 0.1 N/m², ρ = 1025 kg/m³ and f = 10⁻⁴ s⁻¹ (about 43° latitude), the Ekman transport is τ/(ρf) ≈ **1 m²/s**: about a cubic metre of water each second through every metre of width. Spread over a 50 m mixed layer, that is a speed of only about **2 cm/s**. Small, but over the width of a basin it adds up to millions of cubic metres a second.

**Does the ocean agree?** Across 11°N in the Atlantic, the Ekman transport measured directly with a ship's current profiler and the transport computed from the winds as τ/(ρf) agree within their uncertainties (Chereskin & Roemmich 1991, as summarised in Stewart §9.3, p. 144).

### How fast does water go round the hill?

The geostrophic speed at the surface is (g/f) × (the slope of the sea surface) (Stewart eq. 10.10). Our sums: a 1 m hill across 1,500 km gives about **6.5 cm/s**, the slow drift around the middle of a gyre. A 1 m drop across 100 km gives about **1 m/s**, the speed of a western boundary current like the Gulf Stream. That is why the fast currents are narrow and sit where the slope is steep, on the west side of each basin. Why the west, and not the east, is beyond this course (Stommel 1948; see Stewart Ch. 11, and the O3 notes).

### Where the momentum finally goes

The wind keeps adding momentum, so something must take it out: coasts and the sea floor. At the latitudes of Drake Passage no continent blocks the way, so the **Antarctic Circumpolar Current** runs all the way round Antarctica, about 125 million m³/s (Hartmann p. 225), and hands its momentum to the sea floor over undersea ridges. The Southern Ocean is teal on the pumping map: under that current, deep water comes up. Why was it down there? That needs salt and density, which come next.

### The take-home question, answered

*Why does the Arabian Sea cool down in the middle of summer?* Off Somalia and Oman (10–20°N, 60–70°E) the surface is about 29.9 °C in May and 26.7 °C in August (CERES), even though August's sun is still strong. Every piece comes from the last two lectures:

- **The monsoon winds** (O3): the strong southwesterly winds across the Arabian Sea in June–September.
- **A deeper mixed layer** (O3): those winds stir the sea deeper, mixing cooler water from below into the surface layer.
- **Upwelling** (today): the southwesterlies blow along the coasts of Somalia and Oman, the Ekman transport goes offshore, and cold water comes up from below.
- **Clouds**: the monsoon's clouds cut the sunlight reaching the surface.

## Key terms

**Navier–Stokes equation:** Newton's second law for a fluid, with friction. **Advection:** a change in a parcel's velocity because it moves to where the flow is different. **Coriolis parameter, f** = 2Ω sin(latitude), about 10⁻⁴ s⁻¹ at mid-latitudes, changing sign at the equator. **Stress:** force per unit area; **shear stress** drags along a surface. **Wind stress, τ:** the wind's drag on the sea surface, about 0.1 N/m². **Turbulent (Reynolds) stress:** momentum carried by eddies, acting like a much stronger friction. **Reynolds number:** how turbulent a flow is. **Rossby number:** acceleration compared with Coriolis; small for large, slow motions. **Ekman transport:** the stirred layer's total flow, 90° to the right of the wind in the north. **Ekman spiral** and **Ekman depth.** **Ekman pumping:** vertical motion where Ekman transport spreads apart (upwelling) or converges (downwelling). **Upwelling**, **cold tongue.** **Geostrophic flow:** Coriolis balancing the pressure gradient, so that flow runs along the height contours. **Gyre.**

## Readings

All extracts are in the shared readings folder, under O4. The core readings add up to **25 pages**. Page numbers are the books' printed pages.

**Core: covered in class (17 pages)**

- Stewart, *Introduction to Physical Oceanography* (2008), §9.2 "Ekman Layer at the Sea Surface", pp. 135–142 (8 pages). Start at the heading §9.2 on p. 135 (the figure above it is about inertial currents). Nansen's force balance, Ekman's solution and the spiral. Skim the algebra; read the words and figures.
- Stewart §9.3 "Ekman Mass Transport" and §9.4 "Application of Ekman Theory", pp. 143–147 (5 pages). Integrating over the layer, the measurements, and upwelling. Stop at §9.5. This was in the O3 folder as "not covered"; it is now covered.
- Hartmann, *Global Physical Climatology* (2nd ed., 2016), §7.5.1 "The Ekman Layer, Wind-Driven Transport, and Upwelling", pp. 216–219 (4 pages). Start at the heading §7.5 on p. 216 and stop at §7.5.2. The same result, more briefly, with coastal and equatorial upwelling.

**Core: not covered in class (8 pages): the equations behind §3**

- Stewart §7.6 "Momentum Equation", pp. 108–110 (3 pages). Start at "7.6 Momentum Equation" on p. 108 (the top of the page finishes §7.5, on following a parcel, which is worth reading too). The terms of the momentum equation, one at a time. The derivation of the Coriolis term isn't given; don't worry about it.
- Stewart §8.1 "The Influence of Viscosity" and §8.2 "Turbulence", pp. 115–119 (5 pages). Molecular viscosity, the Reynolds number, and turbulent (Reynolds) stresses. Read the words; skim the averaging in eqs. 8.5–8.11. Stop at §8.3, on p. 119.

**Optional**

- Stewart §10.3 "Surface Geostrophic Currents from Altimetry", pp. 155–158: how the hills are measured from satellites.
- Stewart §11.1–11.2, pp. 183–190: Sverdrup's theory and the western boundary currents.
- Hartmann §7.5.2, pp. 219–221.

## Questions to think about

1. Two forces can balance only if they are equal and opposite. Use that to explain, without equations, why the *whole* stirred layer moves at exactly 90° to the wind, while the ice moved at only 20–40°.
2. In §3, adding up the stress across every thin layer left only the top and the bottom. Why did all the stresses in between cancel? What would change if the stirred layer reached all the way to the sea floor?
3. Near the equator f → 0, so τ/(ρf) grows very large. Which of the assumptions in §3 breaks down there?
4. Winds blow from the north along the coast of a southern-hemisphere continent that lies to the east of the ocean. Is there upwelling or downwelling at the coast?
5. If the trade winds weakened, what would happen to the cold tongue, and to the ocean's heat uptake there?
6. A hill of water 1 m high sits in the middle of the North Pacific. Which way does the water flow around it, and what keeps the hill from being worn away?
