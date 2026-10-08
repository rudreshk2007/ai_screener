export interface MilestoneCategory {
  category: "Speech & Communication" | "Eye Contact & Attention" | "Pointing & Gestures" | "Play & Social Interaction";
  milestones: {
    ageMonths: number;
    behavior: string;
    description: string;
    sensoryTip: string;
  }[];
}

export const MILESTONES_DATA: MilestoneCategory[] = [
  {
    category: "Speech & Communication",
    milestones: [
      {
        ageMonths: 12,
        behavior: "Babbles with inflections; responds to name",
        description: "Uses sounds like 'mama', 'dada', and responds when called by familiar caregivers.",
        sensoryTip: "Sing simple rhyming songs with rhythmic hand gestures.",
      },
      {
        ageMonths: 18,
        behavior: "Uses 10+ single words spontaneously",
        description: "Uses words to identify objects, ask for water, or greet family members.",
        sensoryTip: "Name everyday objects slowly while maintaining a calm speaking pitch.",
      },
      {
        ageMonths: 24,
        behavior: "Combines 2 words into phrases",
        description: "Says phrases like 'more milk', 'big dog', or 'go park' independently.",
        sensoryTip: "Read interactive picture books with simple texture elements.",
      },
      {
        ageMonths: 36,
        behavior: "Converses in 3-4 word sentences",
        description: "Understands simple prepositions (in, on, under) and asks 'why' or 'what'.",
        sensoryTip: "Encourage storytelling using felt boards or puppet play.",
      },
      {
        ageMonths: 48,
        behavior: "Tells connected stories and expresses feelings",
        description: "Can recount what happened during the day and identifies emotional states.",
        sensoryTip: "Roleplay daily routines with soft toys to support conversational turns.",
      },
    ],
  },
  {
    category: "Eye Contact & Attention",
    milestones: [
      {
        ageMonths: 12,
        behavior: "Maintains warm eye contact during nursing/feeding",
        description: "Looks directly into caregiver eyes and smiles reciprocally.",
        sensoryTip: "Hold eye contact naturally during feeding without overwhelming lighting.",
      },
      {
        ageMonths: 18,
        behavior: "Follows caregiver's pointing across the room",
        description: "Looks where you point without needing physical touch to redirect gaze.",
        sensoryTip: "Point to large, brightly colored items in uncluttered spaces.",
      },
      {
        ageMonths: 24,
        behavior: "Shares attention during collaborative activities",
        description: "Glances between an exciting toy and caregiver's eyes to share enjoyment.",
        sensoryTip: "Blow bubbles and watch them pop together with gentle applause.",
      },
      {
        ageMonths: 36,
        behavior: "Sustained interactive gaze during games",
        description: "Looks back to check caregiver approval or reaction when trying new challenges.",
        sensoryTip: "Play gentle peek-a-boo variations behind soft scarves.",
      },
      {
        ageMonths: 48,
        behavior: "Understands social referencing in group settings",
        description: "Reads emotional cues from facial expressions to navigate unfamiliar situations.",
        sensoryTip: "Provide calm spaces when sensory inputs become intense.",
      },
    ],
  },
  {
    category: "Pointing & Gestures",
    milestones: [
      {
        ageMonths: 12,
        behavior: "Waves 'bye-bye' and reaches up to be held",
        description: "Uses body gestures to express wants and social greetings.",
        sensoryTip: "Model exaggerated waves with musical chime prompts.",
      },
      {
        ageMonths: 18,
        behavior: "Points to show interest (Protodeclarative pointing)",
        description: "Points to a plane in the sky or a cat solely to share wonder with parents.",
        sensoryTip: "Encourage pointing at garden flowers or birds during evening walks.",
      },
      {
        ageMonths: 24,
        behavior: "Nods head for 'yes' and shakes head for 'no'",
        description: "Uses coordinated head and hand gestures to communicate choices.",
        sensoryTip: "Offer visual choices between two healthy snacks.",
      },
      {
        ageMonths: 36,
        behavior: "Complex gestures (open hands, shrugs, thumbs up)",
        description: "Incorporates gestures into imaginary roleplay and songs like 'Itsy Bitsy Spider'.",
        sensoryTip: "Participate together in action nursery rhymes with gross motor movements.",
      },
    ],
  },
  {
    category: "Play & Social Interaction",
    milestones: [
      {
        ageMonths: 12,
        behavior: "Enjoys reciprocal games (Peek-a-boo, Patty-cake)",
        description: "Takes turns in simple sensory games and giggles at predictable outcomes.",
        sensoryTip: "Keep games predictable and rhythmically soothing.",
      },
      {
        ageMonths: 18,
        behavior: "Simple pretend play (feeding a doll, toy cup)",
        description: "Imitates common home actions with toys or everyday spoons and cups.",
        sensoryTip: "Provide realistic, quiet toys without loud electronic sirens.",
      },
      {
        ageMonths: 24,
        behavior: "Parallel play alongside peers",
        description: "Plays happily beside other toddlers and watches what they are doing.",
        sensoryTip: "Facilitate short playdates in low-noise, familiar environments.",
      },
      {
        ageMonths: 36,
        behavior: "Associative play and sharing toys",
        description: "Begins simple cooperative play with friends, taking turns on slides.",
        sensoryTip: "Introduce gentle turn-taking games with sand or building blocks.",
      },
      {
        ageMonths: 48,
        behavior: "Cooperative imaginative play with rules",
        description: "Plays doctor, storekeeper, or house with friends, assigning imaginary roles.",
        sensoryTip: "Set up calm role-playing stations with dressing-up fabrics and cardboard boxes.",
      },
    ],
  },
];
