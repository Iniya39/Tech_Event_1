/**
 * AVENGERS: Crisis Operations // Resistance Command Grid
 * Mission Alpha: Doom's Incursion - 10-Phase Scenario Data & Scoring Engine
 * Updated Marking Scheme: Best = 100, Second = 50, Third = 25 (Phase 10 Finale = 200 / 100 / 50)
 */

const GAME_DATA = {
    // List of authentic Marvel Tactical Callsigns for random generation
    CALLSIGNS: [
        "STRIKE-FORCE OMEGA",
        "VIBRANIUM VANGUARD",
        "STARK SIEGE UNIT",
        "NIGHT-HAWK PROTOCOL",
        "MJOLNIR DEFENDERS",
        "WAKANDA BASTION",
        "QUANTUM VALKYRIES",
        "AEGIS TALON-07",
        "IRON TEMPEST",
        "INFINITY SENTINEL",
        "PHOENIX COBALT",
        "GHOST PROTOCOL 9",
        "THUNDERBOLT ECHO",
        "NANITE INTERCEPTOR",
        "HELI-CARRIER STRIKE",
        "SHADOW-HAWK SQUAD",
        "DEFENDER ZERO",
        "WAR-MACHINE BATTALION",
        "GAMMA CORE FORCE",
        "ARCHANGEL SQUADRON"
    ],

    // Global Mission Settings
    GLOBAL_TIME_LIMIT_SECONDS: 15 * 60, // 15:00 total mission timer
    MAX_POSSIBLE_SCORE: 1100, // 9 phases * 100 + 1 finale * 200 = 1100 max marks

    // 10 Mission Phases (Sequential)
    PHASES: [
        // =========================================================================
        // Phase 1 — Shield Failure — Power Management
        // =========================================================================
        {
            phaseNumber: 1,
            title: "Phase 1: Shield Failure — Power Management",
            shortTitle: "P1: SHIELD FAILURE",
            phaseTag: "PHASE 1 // POWER MANAGEMENT",
            threatBadge: "DEFCON 1 // CRITICAL BREACH",
            threatLevel: "critical",
            situation: "A dimensional breach is causing unstable power fluctuations. Your shelter shield has 40 seconds of backup power remaining. Diverting power from weapons can extend the shield, but doing so reduces your ability to defend the shelter. Enemy scouts are estimated to arrive in 25 seconds.",
            options: [
                {
                    id: "1A",
                    key: "A",
                    title: "Divert most auxiliary power to the shield, accepting reduced weapons capacity until the civilians are secure.",
                    tier: "best",
                    points: 100,
                    consequence: "The shield remains operational and civilians stay protected while scouts arrive, though low weapon power requires disciplined defensive fighting."
                },
                {
                    id: "1B",
                    key: "B",
                    title: "Maintain the current power distribution and rely on the existing shield until the scouts arrive.",
                    tier: "moderate",
                    points: 50,
                    consequence: "The shield collapses right after 40 seconds, leaving the shelter exposed just as the scouts engage your forces."
                },
                {
                    id: "1C",
                    key: "C",
                    title: "Alternate power between the shield and weapons every few seconds to keep both systems operational.",
                    tier: "poor",
                    points: 25,
                    consequence: "Constant power cycling causes energy surges that damage the emitters and destabilize both weapons and shields."
                }
            ]
        },

        // =========================================================================
        // Phase 2 — Scout Ambush — Battlefield Positioning
        // =========================================================================
        {
            phaseNumber: 2,
            title: "Phase 2: Scout Ambush — Battlefield Positioning",
            shortTitle: "P2: SCOUT AMBUSH",
            phaseTag: "PHASE 2 // BATTLEFIELD POSITIONING",
            threatBadge: "DEFCON 2 // HIGH THREAT",
            threatLevel: "high",
            situation: "Your team detects three enemy groups approaching from different directions. You have limited ammunition, and the evacuation route behind you is narrow. A nearby elevated position provides better visibility but takes 15 seconds to reach.",
            options: [
                {
                    id: "2A",
                    key: "A",
                    title: "Move to the elevated position and force the enemy to approach through the narrow route.",
                    tier: "best",
                    points: 100,
                    consequence: "Taking 15 seconds to reach high ground allows your team to bottleneck all three enemy groups into a single manageable corridor."
                },
                {
                    id: "2B",
                    key: "B",
                    title: "Remain where you are and eliminate the closest group before repositioning.",
                    tier: "moderate",
                    points: 50,
                    consequence: "You defeat the first group, but the remaining two flank your position before you can reach the elevated point."
                },
                {
                    id: "2C",
                    key: "C",
                    title: "Divide the team, sending one unit toward the elevated position while the other engages the approaching scouts.",
                    tier: "poor",
                    points: 25,
                    consequence: "Splitting your limited forces weakens both units, allowing the enemy to overrun the lower team."
                }
            ]
        },

        // =========================================================================
        // Phase 3 — Encrypted Signal — Information Verification
        // =========================================================================
        {
            phaseNumber: 3,
            title: "Phase 3: Encrypted Signal — Information Verification",
            shortTitle: "P3: ENCRYPTED SIGNAL",
            phaseTag: "PHASE 3 // SIGNAL VERIFICATION",
            threatBadge: "DEFCON 2 // INTEL ANOMALY",
            threatLevel: "high",
            situation: "Your communication system intercepts a message containing coordinates of a resistance supply cache. The signal appears authentic, but its encryption pattern is slightly different from previous resistance transmissions. The cache will be destroyed in 90 seconds if nobody reaches it.",
            options: [
                {
                    id: "3A",
                    key: "A",
                    title: "Verify the signal against known transmission patterns before sending anyone to the coordinates.",
                    tier: "moderate",
                    points: 50,
                    consequence: "Verification takes over 90 seconds, causing the supply cache to be destroyed before any team can be dispatched."
                },
                {
                    id: "3B",
                    key: "B",
                    title: "Send a small reconnaissance unit to the coordinates while the main team continues its current mission.",
                    tier: "best",
                    points: 100,
                    consequence: "Sending a small recon team verifies the cache while keeping the main force on objective, minimizing risk if it turns out to be a trap."
                },
                {
                    id: "3C",
                    key: "C",
                    title: "Assume the signal is genuine and redirect the entire team immediately before the cache is lost.",
                    tier: "poor",
                    points: 25,
                    consequence: "Redirecting the entire team abandons your active objective and exposes the main unit to potential ambush."
                }
            ]
        },

        // =========================================================================
        // Phase 4 — Compromised Ally — Identity Verification
        // =========================================================================
        {
            phaseNumber: 4,
            title: "Phase 4: Compromised Ally — Identity Verification",
            shortTitle: "P4: COMPROMISED ALLY",
            phaseTag: "PHASE 4 // FIELD IDENTITY CHECK",
            threatBadge: "DEFCON 2 // IDENTITY CHECK",
            threatLevel: "high",
            situation: "An operative claims to be part of the resistance and provides a route that could bypass an enemy checkpoint. Their identity matches your database, but the database was last synchronized six hours ago. They insist that there is no time for a complete verification.",
            options: [
                {
                    id: "4A",
                    key: "A",
                    title: "Ask for a recently changed operational detail that should be known only to active resistance personnel.",
                    tier: "best",
                    points: 100,
                    consequence: "The operative provides the updated security passphrase, confirming their identity without wasting critical time."
                },
                {
                    id: "4B",
                    key: "B",
                    title: "Follow the operative while keeping the team prepared to retreat if the route becomes suspicious.",
                    tier: "moderate",
                    points: 50,
                    consequence: "You navigate the route safely, but hesitating and watching the operative slows down your deployment window."
                },
                {
                    id: "4C",
                    key: "C",
                    title: "Reject the route and take the known path, even though enemy activity there has recently increased.",
                    tier: "poor",
                    points: 25,
                    consequence: "Taking the heavy enemy route leads to unnecessary combat encounters and delays your team."
                }
            ]
        },

        // =========================================================================
        // Phase 5 — Resource Dilemma — Allocation Under Constraints
        // =========================================================================
        {
            phaseNumber: 5,
            title: "Phase 5: Resource Dilemma — Allocation Under Constraints",
            shortTitle: "P5: RESOURCE ALLOCATION",
            phaseTag: "PHASE 5 // RESOURCE ALLOCATION",
            threatBadge: "DEFCON 1 // CRITICAL SHORTAGE",
            threatLevel: "critical",
            situation: "You have one portable shield generator. Two locations need it: a civilian shelter containing 18 people and a medical station treating three critically injured team members. The medical station has a weak backup generator that can operate for approximately two minutes.",
            options: [
                {
                    id: "5A",
                    key: "A",
                    title: "Protect the civilian shelter and use the backup generator to temporarily keep the medical station operational.",
                    tier: "best",
                    points: 100,
                    consequence: "Both locations survive — 18 civilians stay shielded while the medical backup holds long enough to complete critical treatment."
                },
                {
                    id: "5B",
                    key: "B",
                    title: "Protect the medical station first because losing trained personnel could weaken the entire mission.",
                    tier: "moderate",
                    points: 50,
                    consequence: "The medical station is fully secured, but the unshielded civilian shelter suffers structural damage from stray plasma fire."
                },
                {
                    id: "5C",
                    key: "C",
                    title: "Move the generator between both locations at fixed intervals so neither location remains completely unprotected.",
                    tier: "poor",
                    points: 25,
                    consequence: "Frequently moving the generator leaves both sites repeatedly exposed during transport and damages the power cell."
                }
            ]
        },

        // =========================================================================
        // Phase 6 — False Retreat — Risk Assessment
        // =========================================================================
        {
            phaseNumber: 6,
            title: "Phase 6: False Retreat — Risk Assessment",
            shortTitle: "P6: FALSE RETREAT",
            phaseTag: "PHASE 6 // RISK ASSESSMENT",
            threatBadge: "DEFCON 1 // POTENTIAL TRAP",
            threatLevel: "critical",
            situation: "Enemy forces suddenly withdraw from your position. Drone footage shows them moving toward an abandoned industrial zone. However, your sensors also detect an unidentified energy spike near the same location. Pursuing them could provide an opportunity to eliminate the enemy command unit.",
            options: [
                {
                    id: "6A",
                    key: "A",
                    title: "Hold your position and use reconnaissance assets to determine the source of the energy spike before pursuing.",
                    tier: "moderate",
                    points: 50,
                    consequence: "Holding position avoids the trap, but taking too long to scan allows the enemy command unit to escape."
                },
                {
                    id: "6B",
                    key: "B",
                    title: "Send a small unit to track the retreat while the main team secures the current position.",
                    tier: "best",
                    points: 100,
                    consequence: "The scout unit identifies the energy spike as a concealed trap while the main force maintains defensive readiness."
                },
                {
                    id: "6C",
                    key: "C",
                    title: "Pursue immediately with the full team before the enemy has enough time to establish a defensive position.",
                    tier: "poor",
                    points: 25,
                    consequence: "Charging into the industrial zone triggers the concealed energy trap, catching your main force in a dangerous bottleneck."
                }
            ]
        },

        // =========================================================================
        // Phase 7 — Multiverse Fracture — System Stabilization
        // =========================================================================
        {
            phaseNumber: 7,
            title: "Phase 7: Multiverse Fracture — System Stabilization",
            shortTitle: "P7: SYSTEM STABILIZATION",
            phaseTag: "PHASE 7 // FRACTURE STABILIZATION",
            threatBadge: "DEFCON 1 // FRACTURE ESCALATION",
            threatLevel: "critical",
            situation: "The breach is expanding unevenly. Closing it immediately requires maximum energy output. Previous simulations show that unstable boundaries amplify energy surges. Stabilizing the boundary requires 30 seconds, while the containment field can withstand the current expansion for approximately 45 seconds.",
            options: [
                {
                    id: "7A",
                    key: "A",
                    title: "Stabilize the boundary first, then initiate the closure while the containment field remains within its safe operating window.",
                    tier: "best",
                    points: 100,
                    consequence: "Spending 30 seconds on stabilization leaves 15 seconds to safely close the breach without triggering catastrophic energy surges."
                },
                {
                    id: "7B",
                    key: "B",
                    title: "Begin closing the breach immediately and continuously adjust the containment field during the process.",
                    tier: "moderate",
                    points: 50,
                    consequence: "Simultaneous closure creates volatile feedback loops, forcing emergency dampeners to drain extra power."
                },
                {
                    id: "7C",
                    key: "C",
                    title: "Increase the containment system's energy output and force the breach closed before it expands further.",
                    tier: "poor",
                    points: 25,
                    consequence: "Forcing the breach closed amplifies the boundary surge, damaging containment hardware and destabilizing surrounding reality."
                }
            ]
        },

        // =========================================================================
        // Phase 8 — Doom's Ultimatum — Strategic Deception
        // =========================================================================
        {
            phaseNumber: 8,
            title: "Phase 8: Doom's Ultimatum — Strategic Deception",
            shortTitle: "P8: STRATEGIC DECEPTION",
            phaseTag: "PHASE 8 // STRATEGIC DECEPTION",
            threatBadge: "DEFCON 1 // DOOM'S ULTIMATUM",
            threatLevel: "critical",
            situation: "Doom offers to stop attacking the sector if your team stands down. However, intelligence indicates that his forces are already preparing to move elsewhere. Accepting publicly would give your team time, but openly fighting could reveal your remaining capabilities.",
            options: [
                {
                    id: "8A",
                    key: "A",
                    title: "Accept publicly while secretly transmitting your intelligence to the wider resistance network.",
                    tier: "best",
                    points: 100,
                    consequence: "Public compliance stalls Doom's aggression in your sector while the resistance network prepares to intercept his redeployment."
                },
                {
                    id: "8B",
                    key: "B",
                    title: "Reject the offer and engage Doom immediately before he can reposition his forces.",
                    tier: "moderate",
                    points: 50,
                    consequence: "Engaging immediately forces a brutal fight against Doom's vanguard, revealing your full tactical capabilities."
                },
                {
                    id: "8C",
                    key: "C",
                    title: "Continue negotiating while attempting to determine whether the ceasefire is genuine.",
                    tier: "poor",
                    points: 25,
                    consequence: "Prolonged negotiation allows Doom to finalize his redeployment unnoticed while keeping your team passive."
                }
            ]
        },

        // =========================================================================
        // Phase 9 — Network Failure — Communication Strategy
        // =========================================================================
        {
            phaseNumber: 9,
            title: "Phase 9: Network Failure — Communication Strategy",
            shortTitle: "P9: NETWORK FAILURE",
            phaseTag: "PHASE 9 // COMMUNICATION STRATEGY",
            threatBadge: "DEFCON 1 // NETWORK FAILURE",
            threatLevel: "critical",
            situation: "During the operation, your primary communication network suddenly becomes unreliable. Messages are being delayed by 10–15 seconds, and one earlier message was delivered incorrectly. Your backup radio works reliably but has a much shorter range. Your team is currently divided into two units, and an enemy attack is expected within the next minute.",
            options: [
                {
                    id: "9A",
                    key: "A",
                    title: "Continue using the primary network because its longer range is more important during an emergency.",
                    tier: "poor",
                    points: 25,
                    consequence: "Delayed and distorted orders cause the two units to execute conflicting tactical maneuvers during the attack."
                },
                {
                    id: "9B",
                    key: "B",
                    title: "Switch both units to the backup radio and establish fixed communication checkpoints between them.",
                    tier: "best",
                    points: 100,
                    consequence: "Using the short-range radio ensures 100% reliable real-time communication, keeping both units coordinated despite the shorter range."
                },
                {
                    id: "9C",
                    key: "C",
                    title: "Let each unit operate independently until the primary network becomes stable again.",
                    tier: "moderate",
                    points: 50,
                    consequence: "Independent operation avoids bad orders, but lack of coordination prevents mutual tactical support."
                }
            ]
        },

        // =========================================================================
        // Phase 10 — Evacuation Route — Time vs Safety (Finale — Double Points)
        // =========================================================================
        {
            phaseNumber: 10,
            title: "Phase 10: Evacuation Route — Time vs Safety",
            shortTitle: "P10: EVACUATION ROUTE",
            phaseTag: "PHASE 10 // THE CONVERGENCE [FINALE]",
            threatBadge: "DEFCON 0 // APEX FINALE",
            threatLevel: "apex",
            isFinale: true,
            situation: "You must evacuate civilians from a damaged facility. Route A takes 4 minutes with a 20% probability of structural collapse. Route B takes 7 minutes and is structurally stable, but enemy movement is detected 2 km away. Your transport convoy can remain at the extraction point for 9 minutes. You cannot use both routes because the escort team is too small.",
            options: [
                {
                    id: "10A",
                    key: "A",
                    title: "Use Route A because it reaches extraction faster and leaves more time before the convoy departs.",
                    tier: "poor",
                    points: 50, // Third option finale (50)
                    consequence: "Route A suffers a structural cave-in during transit, trapping the convoy and risking severe civilian casualties despite the faster theoretical speed."
                },
                {
                    id: "10B",
                    key: "B",
                    title: "Use Route B because the route is structurally stable and the convoy has enough time to wait.",
                    tier: "best",
                    points: 200, // Double points for finale (200 / 100 / 50)
                    consequence: "Route B safely evacuates all civilians in 7 minutes with 2 minutes to spare before convoy departure, avoiding the fatal collapse risk entirely."
                },
                {
                    id: "10C",
                    key: "C",
                    title: "Delay the evacuation until additional information about enemy movement becomes available.",
                    tier: "moderate",
                    points: 100, // Second option finale (100)
                    consequence: "Delaying past the 9-minute convoy window forces the transport to depart, leaving civilians stranded at the facility."
                }
            ]
        }
    ],

    // Ending Tiers (Based on final score out of 1100 Max Points)
    EVALUATION_TIERS: [
        {
            tierName: "FULL SUCCESS",
            minScore: 900,
            badgePill: "MISSION SUCCESS // 900-1100 PTS",
            title: "FULL SUCCESS",
            narration: "Mission successful. A hidden transmission has been decoded. One Avenger has answered the call.",
            accentColor: "var(--accent-cyan)",
            evalText: "Exceptional crisis performance across all ten tactical phases. Your strategic discipline preserved vital resistance resources and forged an unshakeable defense."
        },
        {
            tierName: "PARTIAL SUCCESS",
            minScore: 600,
            badgePill: "SECTOR HELD // 600-899 PTS",
            title: "PARTIAL SUCCESS",
            narration: "The sector held, but at a cost. Doom's forces regroup — the resistance grows stronger, but so does the enemy.",
            accentColor: "var(--warning-amber)",
            evalText: "Competent tactical execution under pressure. While several compromises were made, the primary sector was preserved from total collapse."
        },
        {
            tierName: "MISSION SETBACK",
            minScore: 0,
            badgePill: "CRISIS UNRESOLVED // 0-599 PTS",
            title: "MISSION SETBACK",
            narration: "The breach could not be fully contained. No new Avenger answers the call this round — but the fight continues.",
            accentColor: "var(--alert-red)",
            evalText: "Suboptimal choices and accumulated setbacks prevented the containment field from stabilizing. Squad reassessment and tactical debriefing required."
        }
    ]
};
