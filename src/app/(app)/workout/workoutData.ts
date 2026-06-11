export interface Exercise {
  name: string;
  reps: string; // e.g., "x 16", "00:30"
  duration?: string;
  image: string; // GIF URL
  video?: string; // MP4 URL
  instruction?: string;
  benefit?: string;
}

export interface WorkoutDay {
  day: number;
  isRestDay: boolean;
  exercises: Exercise[];
}

export interface WorkoutLevel {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  days: WorkoutDay[];
}

const exercisesPool: Record<string, Exercise> = {
  jumpingJacks: {
    name: "Jumping Jacks", reps: "x 20", duration: "30 sec",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Jumping-jack.gif",
    instruction: "Stand with your legs together and your arms to your sides. Jump up, spread your legs.",
    benefit: "Rapidly depletes glycogen stores in the muscles, immediately increasing cellular demand for glucose from the bloodstream."
  },
  crunches: {
    name: "Crunches", reps: "x 16",
    image: "https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif",
    instruction: "Lie on your back with knees bent. Put hands behind your head and lift shoulder blades.",
    benefit: "Core engagement forces deep stabilizer muscles to burn circulating glucose without requiring insulin spikes."
  },
  plank: {
    name: "Plank Hold", reps: "x 30", duration: "30 sec",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/plank.gif",
    instruction: "Face down with forearms and toes on the floor. Keep your body perfectly straight.",
    benefit: "Isometric contractions (static holds) improve vascular health and lower resting blood pressure, critical for diabetes prevention."
  },
  squats: {
    name: "Squats", reps: "x 15",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/05/bodyweight-squat-full-version.gif",
    video: "https://www.youtube.com/embed/X0qC1k0Zi6k",
    instruction: "Stand with feet shoulder-width apart. Descend your hips backward as if sitting into a chair.",
    benefit: "Activates the largest muscle groups in the body (glutes, quads), acting as a massive glucose sink that clears blood sugar for hours post-workout."
  },
  lunges: {
    name: "Lunges", reps: "x 10",
    image: "https://fitnessprogramer.com/wp-content/uploads/2023/07/bodyweight-lunges.gif",
    instruction: "Step forward with one leg until it reaches a 90-degree angle. Push back up and alternate.",
    benefit: "Unilateral leg movements build mitochondrial density, enhancing the cell's ability to process fuel efficiently and combat insulin resistance."
  },
  pushups: {
    name: "Push-ups", reps: "x 12",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    video: "https://www.youtube.com/embed/IODxDxX7oi4",
    instruction: "Hands slightly wider than shoulders. Lower body until chest nearly touches floor, then push up.",
    benefit: "Upper body resistance training directly stimulates exactly the GLUT4 glucose transporters that become sluggish in early pre-diabetes."
  },
  mountainClimbers: {
    name: "Mountain Climbers", reps: "x 20",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-climber.gif",
    instruction: "Start in a push-up position. Drive one knee toward your chest alternately at a quick pace.",
    benefit: "Combines cardiovascular load with core stability, creating an intense metabolic environment that burns visceral fat around the liver."
  },
  highKnees: {
    name: "High Knees", reps: "x 30",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/08/High-Knee-Run.gif",
    instruction: "Run in place, lifting your knees as high as possible with each step.",
    benefit: "Spikes heart rate rapidly, forcing the body to transition from burning fat to aggressively clearing excess blood glucose for immediate energy."
  },
  gluteBridge: {
    name: "Glute Bridge", reps: "x 15",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge-.gif",
    instruction: "Lie on your back with knees bent. Push your hips up, squeezing your glutes at the top.",
    benefit: "Strengthening the posterior chain improves postural stability, reducing the cortisol (stress hormone) response associated with chronic pain that drives up blood sugar."
  },
  sidePlank: {
    name: "Side Bridge", reps: "x 20", duration: "20 sec",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Side-Bridge.gif",
    instruction: "Lie on your side and lift your body onto one forearm, keeping your body straight.",
    benefit: "Engages the obliques, tightening the core muscles that physically surround and support healthy metabolic organ function like the pancreas."
  },
  legRaises: {
    name: "Leg Raises", reps: "x 12",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif",
    instruction: "Lying flat, keep your legs straight and raise them to 90 degrees, then slowly lower.",
    benefit: "Intense lower abdominal activation pulls glucose rapidly from the blood stream and improves overall muscular endurance."
  },
  superman: {
    name: "Superman", reps: "x 12",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-exercise.gif",
    instruction: "Lie face down, lift both arms and legs simultaneously off the ground, hold for a second.",
    benefit: "Builds lower back strength, a crucial component of overall muscle mass which dictates your body's baseline metabolic rate (BMR)."
  },
  burpees: {
    name: "Burpees", reps: "x 10",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Burpee.gif",
    instruction: "Start in a standing position, drop into a squat, kick feet back to a plank, return to squat, and jump up.",
    benefit: "The ultimate full-body metabolic finisher. Maximizes post-exercise oxygen consumption (EPOC), meaning you continue to burn glucose and fat for up to 24 hours after this movement."
  },
  russianTwists: {
    name: "Russian Twists", reps: "x 20",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif",
    instruction: "Sit with knees bent, lean back slightly, and rotate your torso from side to side, touching the floor.",
    benefit: "Rotational movements improve spinal mobility and dynamically engage the core, utilizing blood sugar efficiently during the twisting phase."
  },
  birdDog: {
    name: "Bird-Dog", reps: "x 12",
    image: "https://fitnessprogramer.com/wp-content/uploads/2022/07/Bird-Dog.gif",
    instruction: "On all fours, extend your opposite arm and leg simultaneously while keeping your back flat.",
    benefit: "Cross-lateral movements improve neuromuscular efficiency, training the brain and body to coordinate efficiently and reducing metabolic strain."
  },
  cobraStretch: {
    name: "Cobra Stretch", reps: "30 sec", duration: "30 sec",
    image: "https://fitnessprogramer.com/wp-content/uploads/2021/06/abdominal-stretch.gif",
    instruction: "Lie face down, push your upper body up with your hands while keeping your hips on the floor.",
    benefit: "Deep stretching lowers cortisol and adrenaline. Chronic high levels of these stress hormones keep blood sugar artificially elevated."
  },
  childsPose: {
    name: "Child's Pose", reps: "30 sec", duration: "30 sec",
    image: "https://fitnessprogramer.com/wp-content/uploads/2022/05/Balasana-Child-Pose.gif",
    instruction: "Kneel on the floor, sit on your heels, and lean forward with arms extended, resting your forehead on the floor.",
    benefit: "Activates the parasympathetic nervous system ('rest and digest'), instantly improving insulin sensitivity and stopping stress-induced glucose spikes."
  }
};

export interface WorkoutCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  exercises: Exercise[];
  color: string;
}

export const workoutCategories: WorkoutCategory[] = [
  {
    id: "cardio",
    name: "Cardio Kickstart",
    icon: "Activity",
    description: "High-intensity full body sweat session.",
    color: "from-orange-400 to-red-500",
    exercises: [
      exercisesPool.jumpingJacks,
      exercisesPool.mountainClimbers,
      exercisesPool.highKnees,
      exercisesPool.burpees,
      exercisesPool.mountainClimbers,
      exercisesPool.jumpingJacks
    ]
  },
  {
    id: "strength",
    name: "Pure Strength",
    icon: "Dumbbell",
    description: "Build foundational muscle to clear glucose.",
    color: "from-blue-500 to-indigo-600",
    exercises: [
      exercisesPool.pushups,
      exercisesPool.squats,
      exercisesPool.lunges,
      exercisesPool.gluteBridge,
      exercisesPool.plank,
      exercisesPool.birdDog
    ]
  },
  {
    id: "core",
    name: "Core Stability",
    icon: "Target",
    description: "Strengthen midsection and lower visceral fat.",
    color: "from-emerald-400 to-teal-600",
    exercises: [
      exercisesPool.crunches,
      exercisesPool.legRaises,
      exercisesPool.russianTwists,
      exercisesPool.sidePlank,
      exercisesPool.superman,
      exercisesPool.plank
    ]
  },
  {
    id: "flexibility",
    name: "Mobility & Flow",
    icon: "Zap",
    description: "Decrease cortisol and systemic inflammation.",
    color: "from-purple-400 to-pink-500",
    exercises: [
      exercisesPool.birdDog,
      exercisesPool.cobraStretch,
      exercisesPool.childsPose,
      exercisesPool.gluteBridge,
      exercisesPool.cobraStretch,
      exercisesPool.childsPose
    ]
  }
];

const generateDays = (levelInt: number): WorkoutDay[] => {
  const days: WorkoutDay[] = [];
  const exercisesList = Object.values(exercisesPool);
  
  for (let i = 1; i <= 30; i++) {
    const isRest = i % 7 === 0;
    
    const numExercises = 4 + levelInt + (i % 3);
    const dailyExercises: Exercise[] = [];
    
    if (!isRest) {
      for(let j=0; j<numExercises; j++) {
        const baseEx = exercisesList[(i + j) % exercisesList.length];
        dailyExercises.push({
          ...baseEx,
          reps: baseEx.reps.includes('sec') ? baseEx.reps : `x ${parseInt(baseEx.reps.replace('x ', '')) + Math.floor(i/3) + levelInt}`
        });
      }
    }

    days.push({ day: i, isRestDay: isRest, exercises: isRest ? [] : dailyExercises });
  }
  return days;
};

export const workoutLevels: WorkoutLevel[] = [
  {
    id: "beginner",
    title: "Start Active",
    subtitle: "Beginner",
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&fit=crop", 
    days: generateDays(0)
  },
  {
    id: "intermediate",
    title: "Build Endurance",
    subtitle: "Intermediate",
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&fit=crop",
    days: generateDays(2)
  },
  {
    id: "advanced",
    title: "Fitness for Pre-Diabetes",
    subtitle: "Advanced",
    coverImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&fit=crop",
    days: generateDays(4)
  }
];
